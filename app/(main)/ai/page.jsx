'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect, useMemo, useRef, useState } from 'react'


const STORAGE_KEY = 'ai_chat_messages'

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          type: 'ai',
          content: "Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, and answer travel questions. What would you like to know?",
          timestamp: new Date().toISOString()
        }
      ]
    } catch {
      return []
    }
  })
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const scrollRef = useRef(null)

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send the last few messages for context
          messages: [...messages.slice(-8), userMessage].map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
        })
      })

      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply || 'Sorry, I could not generate a response right now.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (err) {
      const errorResponse = {
        id: Date.now() + 2,
        type: 'ai',
        content: 'There was an error contacting the assistant. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  // Voice input via Web Speech API
  const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined

  const ensureRecognition = () => {
    if (!recognitionRef.current && SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.lang = 'en-US'
      rec.interimResults = false
      rec.maxAlternatives = 1

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(prev => (prev ? prev + ' ' : '') + transcript)
      }
      rec.onstart = () => setIsListening(true)
      rec.onend = () => setIsListening(false)
      rec.onerror = () => setIsListening(false)

      recognitionRef.current = rec
    }
    return recognitionRef.current
  }

  const startVoice = () => {
    if (!SpeechRecognition) return
    const rec = ensureRecognition()
    try { rec && rec.start() } catch {}
  }

  const stopVoice = () => {
    const rec = recognitionRef.current
    try { rec && rec.stop() } catch {}
  }

  const quickQuestions = useMemo(() => [
    'Plan a weekend trip to Paris',
    'Best time to visit Bali?',
    'Budget-friendly destinations in Europe',
    'Create a 7-day itinerary for Japan'
  ], [])

  return (
    <div className="space-y-6 min-h-screen mt-4 p-2">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Travel Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Get personalized travel recommendations and plan your trips with AI
        </p>
      </div>

      <div className="flex justify-between gap-6">
        {/* Chat Interface */}
        <div className="flex-1 flex">
          <div className="h-[600px] rounded-sm dark:bg-gray-900 shadow-2xl flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chat with AI Assistant
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ask me anything about travel planning!
              </p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-gradient p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm ${isListening ? 'border-red-500 text-red-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-800`}
                  onClick={isListening ? stopVoice : startVoice}
                  aria-pressed={isListening}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                  {isListening ? '■ Stop' : '🎤 Voice'}
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about travel planning..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  aria-label="Message input"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()} aria-label="Send message">
                  Send
                </Button>
              </div>
              {!SpeechRecognition && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Voice input is not supported in this browser.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Features */}
        <div className="hidden md:block space-y-6">
          {/* Quick Questions */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Questions
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="w-full text-left p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

