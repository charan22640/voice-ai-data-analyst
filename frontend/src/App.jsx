import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import AssistantUI from './components/AssistantUI'
import DataDashboard from './components/DataDashboard'
import StatusBar from './components/StatusBar'

const App = () => {
  const [currentView, setCurrentView] = useState('assistant') // 'assistant' or 'data'
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [datasetLoaded, setDatasetLoaded] = useState(false)
  const [currentDataset, setCurrentDataset] = useState(null)

  // Check backend connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/status`)
        if (response.ok) {
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('error')
        }
      } catch (error) {
        setConnectionStatus('error')
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main App */}
      <div className="relative z-10">
        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          connectionStatus={connectionStatus}
        />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'assistant' ? (
              <AssistantUI currentDataset={currentDataset} />
            ) : (
              <DataDashboard 
                onDatasetLoaded={(data) => {
                  setDatasetLoaded(true);
                  setCurrentDataset(data);
                }} 
              />
            )}
          </motion.div>
        </main>

        <StatusBar 
          connectionStatus={connectionStatus}
          datasetLoaded={datasetLoaded}
          currentView={currentView}
        />
      </div>
    </div>
  )
}

export default App
