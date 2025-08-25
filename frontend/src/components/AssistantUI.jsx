import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2 } from 'lucide-react'
import VoiceButton from './VoiceButton'
import ChatHistory from './ChatHistory'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useTextToSpeech } from '../hooks/useTextToSpeech'

const AssistantUI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm Nova, your AI data assistant. You can chat with me using voice or text, and I can help you analyze your data. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [assistantStatus, setAssistantStatus] = useState('ready') // ready, listening, processing, speaking
  const [isTTSEnabled, setIsTTSEnabled] = useState(true)
  
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition()

  const { speak, isSpeaking, stopSpeaking } = useTextToSpeech()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Update input text with speech recognition
  useEffect(() => {
    if (transcript && !isLoading) {
      setInputText(transcript)
    }
  }, [transcript, isLoading])

  // Update assistant status
  useEffect(() => {
    if (isListening) {
      setAssistantStatus('listening')
    } else if (isLoading) {
      setAssistantStatus('processing')
    } else if (isSpeaking) {
      setAssistantStatus('speaking')
    } else {
      setAssistantStatus('ready')
    }
  }, [isListening, isLoading, isSpeaking])

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)
    resetTranscript()

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10), // Last 10 messages for context
          timestamp: userMessage.timestamp
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, assistantMessage])

        // Text-to-speech for assistant response
        if (isTTSEnabled && !isSpeaking) {
          speak(data.response)
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'assistant',
      content: "Chat cleared! How can I help you?",
      timestamp: new Date().toISOString()
    }])
  }

  return (
    <div className="w-4/5 mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl font-bold text-white mb-2">AI Assistant</h2>
        <p className="text-gray-400">Voice-powered conversations with intelligent AI</p>
      </motion.div>

      {/* Simple Status Visualizer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center mb-4"
      >
        <motion.div
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
            assistantStatus === 'ready' ? 'border-primary text-primary' : 
            assistantStatus === 'listening' ? 'border-red-400 text-red-400' :
            assistantStatus === 'processing' ? 'border-yellow-400 text-yellow-400' :
            'border-blue-400 text-blue-400'
          }`}
          animate={assistantStatus !== 'ready' ? { 
            scale: [1, 1.1, 1],
            borderColor: assistantStatus === 'listening' ? ['#f87171', '#dc2626', '#f87171'] :
                        assistantStatus === 'processing' ? ['#fbbf24', '#d97706', '#fbbf24'] :
                        ['#60a5fa', '#3b82f6', '#60a5fa']
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${
              assistantStatus === 'ready' ? 'bg-primary' : 
              assistantStatus === 'listening' ? 'bg-red-400' :
              assistantStatus === 'processing' ? 'bg-yellow-400' :
              'bg-blue-400'
            }`}
            animate={assistantStatus !== 'ready' ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        <span className="ml-3 text-sm text-gray-300 font-medium">
          {assistantStatus === 'ready' && 'Ready to chat'}
          {assistantStatus === 'listening' && 'Listening...'}
          {assistantStatus === 'processing' && 'Processing...'}
          {assistantStatus === 'speaking' && 'Speaking...'}
        </span>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 mb-4 h-[600px] flex flex-col"
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-gray-300">Nova Assistant</span>
          </div>
          <button
            onClick={clearChat}
            className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/10"
          >
            Clear Chat
          </button>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
          <ChatHistory messages={messages} isLoading={isLoading} />
        </div>

        {/* Input Area */}
        <div className="flex items-center space-x-3">
          <VoiceButton
            isListening={isListening}
            onClick={handleVoiceToggle}
            disabled={isLoading}
          />
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message or use voice input..."
              className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
              rows={1}
              disabled={isLoading}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>

          <button
            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
            className={`p-3 rounded-lg transition-all ${
              isTTSEnabled ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {isTTSEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Voice Status */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-2"
          >
            <span className="text-sm text-primary">Tap to speak</span>
          </motion.div>
        )}
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          {
            title: 'Voice Commands',
            description: 'Speak naturally to interact',
            status: 'Available',
            icon: <Mic className="w-4 h-4" />
          },
          {
            title: 'Text-to-Speech',
            description: 'Listen to AI responses',
            status: 'Available',
            icon: <Volume2 className="w-4 h-4" />
          },
          {
            title: 'Smart Context',
            description: 'Contextual conversations',
            status: 'Active',
            icon: <div className="w-4 h-4 bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass glass-hover rounded-lg p-3 text-center"
          >
            <div className="flex justify-center mb-2 text-primary">
              {feature.icon}
            </div>
            <h3 className="font-medium text-white text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-gray-400 mb-2">{feature.description}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              feature.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'
            }`}>
              {feature.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AssistantUI
