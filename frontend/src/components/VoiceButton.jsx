import React from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'

const VoiceButton = ({ isListening, onClick, disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative p-4 rounded-full transition-all duration-300 ${
        isListening
          ? 'bg-red-500 shadow-lg shadow-red-500/25'
          : disabled
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-primary hover:bg-primary/80 shadow-lg shadow-primary/25'
      }`}
    >
      {/* Pulse animation when listening */}
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full blur-xl ${
        isListening ? 'bg-red-500/30' : 'bg-primary/30'
      }`} />
      
      {/* Icon */}
      <div className="relative z-10">
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </div>
    </motion.button>
  )
}

export default VoiceButton
