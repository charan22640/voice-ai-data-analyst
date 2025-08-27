import React from 'react'
import { motion } from 'framer-motion'
import { Activity, MessageSquare, Database, Wifi, WifiOff, AlertTriangle, BarChart3 } from 'lucide-react'

// Header now hosts the status indicators (connection, dataset, mode)
const Header = ({ currentView, setCurrentView, connectionStatus, datasetLoaded }) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-primary" />
      case 'connecting':
        return <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-400" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return 'Disconnected'
      default:
        return 'Unknown'
    }
  }

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Nova</h1>
              <p className="text-sm text-gray-400">AI Data Assistant</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => setCurrentView('assistant')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                currentView === 'assistant'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Assistant</span>
            </button>
            <button
              onClick={() => setCurrentView('data')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                currentView === 'data'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Data</span>
            </button>
          </motion.div>

          {/* Status group (moved from floating bar) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex items-center"
          >
            <div className="glass rounded-full px-4 py-2 flex items-center gap-5">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={`text-sm ${
                  connectionStatus === 'connected' ? 'text-primary' :
                  connectionStatus === 'connecting' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{getStatusText()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className={`w-4 h-4 ${datasetLoaded ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-sm ${datasetLoaded ? 'text-primary' : 'text-gray-400'}`}>{datasetLoaded ? 'Dataset Loaded' : 'No Dataset'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">{currentView === 'assistant' ? 'Assistant' : 'Data'} Mode</span>
              </div>
            </div>
          </motion.div>

          {/* Compact status (mobile) */}
          <div className="md:hidden flex items-center gap-3">
            {getStatusIcon()}
            <div className={`w-2 h-2 rounded-full ${datasetLoaded ? 'bg-primary' : 'bg-gray-500'}`} title={datasetLoaded ? 'Dataset Loaded' : 'No Dataset'}></div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
