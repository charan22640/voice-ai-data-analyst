import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2, Pause, Play, StopCircle } from 'lucide-react'
import VoiceButton from './VoiceButton'
import ChatHistory from './ChatHistory'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useTextToSpeech } from '../hooks/useTextToSpeech'

const AssistantUI = ({ currentDataset }) => {
  // Simple unique id generator (stable and collision-resistant enough for UI)
  const genId = () => (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const [messages, setMessages] = useState([
    {
      id: genId(),
      type: 'assistant',
      content: "Hello! I'm Nova, your AI data assistant. You can chat with me using voice or text, and I can help you analyze your data. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [assistantStatus, setAssistantStatus] = useState('ready') // ready, listening, processing, speaking, paused
  const [isTTSEnabled, setIsTTSEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const lastAnnouncedDatasetKey = useRef(null)
  
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition()

  const { speak, isSpeaking, stopSpeaking, pauseSpeaking, resumeSpeaking } = useTextToSpeech()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Update assistant message when dataset is loaded (guard against duplicates in StrictMode)
  useEffect(() => {
    if (currentDataset && currentDataset.success) {
      const rows = currentDataset.shape?.[0] || currentDataset.total_rows
      const cols = currentDataset.shape?.[1] || currentDataset.total_columns
      // Build a lightweight key to identify the same dataset
      const key = `${rows}|${cols}|${currentDataset.brief_summary || ''}`

      if (lastAnnouncedDatasetKey.current === key) return

      let content = `I see you've loaded a dataset! `
      if (currentDataset.brief_summary) {
        content += `${currentDataset.brief_summary}. `
      }
      content += `The dataset has ${rows} rows and ${cols} columns.`
      content += "\n\nWhat would you like to know about it? You can ask me about specific columns, statistics, or patterns in the data."

      const datasetInfo = {
        id: genId(),
        type: 'assistant',
        content,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, datasetInfo])
      lastAnnouncedDatasetKey.current = key
    } else if (!currentDataset) {
      // If dataset cleared, reset the guard so new loads will announce
      lastAnnouncedDatasetKey.current = null
    }
  }, [currentDataset])

  // Update input text with speech recognition
  useEffect(() => {
    if (transcript && !isLoading) {
      setInputText(transcript)
    }
  }, [transcript, isLoading])

  // Update assistant status
  // Priority: processing > listening > paused > speaking > ready
  useEffect(() => {
    if (isLoading) {
      setAssistantStatus('processing')
    } else if (isListening) {
      setAssistantStatus('listening')
    } else if (isSpeaking && isPaused) {
      setAssistantStatus('paused')
    } else if (isSpeaking) {
      setAssistantStatus('speaking')
    } else {
      setAssistantStatus('ready')
    }
  }, [isListening, isLoading, isSpeaking, isPaused])

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    // Always stop any ongoing speech/listening before sending a new message
    stopSpeaking()
    if (isListening) {
      stopListening()
    }
    setIsPaused(false)

    const userMessage = {
      id: genId(),
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
          timestamp: userMessage.timestamp,
          dataContext: currentDataset // Include current dataset context
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage = {
          id: genId(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, assistantMessage])

        // Text-to-speech for assistant response
        if (isTTSEnabled && !isMuted) {
          stopSpeaking() // Ensure no overlap
          speak(data.response)
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: genId(),
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

  // Auto-grow textarea height
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    const max = 160 // px
    el.style.height = Math.min(el.scrollHeight, max) + 'px'
  }, [inputText])

  const clearChat = () => {
    setMessages([{
      id: genId(),
      type: 'assistant',
      content: "Chat cleared! How can I help you?",
      timestamp: new Date().toISOString()
    }])
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-0 md:px-2">
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
          animate={assistantStatus !== 'ready' && assistantStatus !== 'paused' ? { 
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
            animate={assistantStatus !== 'ready' && assistantStatus !== 'paused' ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        <span className="ml-3 text-sm text-gray-300 font-medium">
          {assistantStatus === 'ready' && 'Ready to chat'}
          {assistantStatus === 'listening' && 'Listening...'}
          {assistantStatus === 'processing' && 'Processing...'}
          {assistantStatus === 'speaking' && 'Speaking...'}
          {assistantStatus === 'paused' && 'Paused'}
        </span>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-4 md:p-6 mb-4 min-h-[60vh] max-h-[75vh] flex flex-col"
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
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-3 pr-1">
          <ChatHistory messages={messages} isLoading={isLoading} />
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 md:gap-3 sticky bottom-0 pt-2 bg-transparent">
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
              onInput={(e) => {
                // keep height in sync if browser doesn't trigger effect soon enough
                e.currentTarget.style.height = 'auto'
                e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 160) + 'px'
              }}
              placeholder="Type a message or use voice input..."
              className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-3 md:px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all min-h-[44px] max-h-[160px] overflow-auto"
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

          {/* TTS Controls (hidden on very small screens) */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => { setIsMuted(!isMuted); stopSpeaking() }}
              className={`p-3 rounded-lg transition-all ${isMuted ? 'text-gray-400' : 'text-primary'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => { pauseSpeaking(); setIsPaused(true) }}
              className={`p-3 rounded-lg transition-all ${isSpeaking && !isPaused ? 'text-primary' : 'text-gray-400'}`}
              disabled={!isSpeaking || isPaused}
              title="Pause"
            >
              <Pause className="w-5 h-5" />
            </button>
            <button
              onClick={() => { resumeSpeaking(); setIsPaused(false) }}
              className={`p-3 rounded-lg transition-all ${isSpeaking && isPaused ? 'text-primary' : 'text-gray-400'}`}
              disabled={!isSpeaking || !isPaused}
              title="Resume"
            >
              <Play className="w-5 h-5" />
            </button>
            <button
              onClick={() => { stopSpeaking(); setIsPaused(false) }}
              className="p-3 rounded-lg transition-all text-gray-400"
              disabled={!isSpeaking}
              title="Stop"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          </div>
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
