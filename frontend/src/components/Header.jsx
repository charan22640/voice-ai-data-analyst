import React from 'react'
import { motion } from 'framer-motion'
import { Activity, MessageSquare, Database, Wifi, WifiOff, AlertTriangle, BarChart3 } from 'lucide-react'

const Header = ({ currentView, setCurrentView, connectionStatus }) => {
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
    <header className="glass border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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

          {/* Connection Status */}
          <motion.div 
            className="flex items-center space-x-2 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {getStatusIcon()}
            <span className={`${
              connectionStatus === 'connected' ? 'text-primary' : 
              connectionStatus === 'connecting' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {getStatusText()}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header
