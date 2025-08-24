import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Database, MessageSquare } from 'lucide-react'

const StatusBar = ({ connectionStatus, datasetLoaded, currentView }) => {
  const statusItems = [
    {
      icon: connectionStatus === 'connected' ? Wifi : WifiOff,
      text: connectionStatus === 'connected' ? 'Connected' : 'Disconnected',
      color: connectionStatus === 'connected' ? 'text-primary' : 'text-red-400'
    },
    {
      icon: Database,
      text: datasetLoaded ? 'Dataset Loaded' : 'No Dataset',
      color: datasetLoaded ? 'text-primary' : 'text-gray-400'
    },
    {
      icon: MessageSquare,
      text: `${currentView === 'assistant' ? 'Assistant' : 'Data'} Mode`,
      color: 'text-blue-400'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass rounded-full px-6 py-3 flex items-center space-x-6">
        {statusItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-center space-x-2">
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className={`text-sm ${item.color}`}>{item.text}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default StatusBar
