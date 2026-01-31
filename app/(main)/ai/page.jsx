// // 'use client'

// // import { Button } from '@/components/ui/button'
// // import { useEffect, useMemo, useRef, useState } from 'react'

// // const STORAGE_KEY = 'ai_chat_messages'

// // export default function AIAssistantPage() {
// //   const [messages, setMessages] = useState(() => {
// //     try {
// //       const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
// //       return saved ? JSON.parse(saved) : [
// //         {
// //           id: 1,
// //           type: 'ai',
// //           content: "Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, and answer travel questions. What would you like to know?",
// //           timestamp: new Date().toISOString()
// //         }
// //       ]
// //     } catch {
// //       return []
// //     }
// //   })
  
// //   const [inputMessage, setInputMessage] = useState('')
// //   const [isTyping, setIsTyping] = useState(false)
// //   const [isListening, setIsListening] = useState(false)
// //   const recognitionRef = useRef(null)
// //   const scrollRef = useRef(null)

// //   // Persist messages
// //   useEffect(() => {
// //     try {
// //       localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
// //     } catch {}
// //   }, [messages])

// //   // Auto-scroll on new messages
// //   useEffect(() => {
// //     if (scrollRef.current) {
// //       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
// //     }
// //   }, [messages, isTyping])

// //   const handleSendMessage = async () => {
// //     if (!inputMessage.trim()) return

// //     const userMessage = {
// //       id: Date.now(),
// //       type: 'user',
// //       content: inputMessage,
// //       timestamp: new Date().toISOString()
// //     }

// //     // Optimistic update: Show user message immediately
// //     setMessages(prev => [...prev, userMessage])
// //     setInputMessage('')
// //     setIsTyping(true)

// //     try {
// //       // Call the Next.js API route
// //       const res = await fetch('/api/ai/chat', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           // Send context: map 'type' to 'role' for the backend
// //           messages: [...messages.slice(-8), userMessage].map(m => ({ 
// //             role: m.type === 'user' ? 'user' : 'assistant', 
// //             content: m.content 
// //           })),
// //         })
// //       })
// //       console.log(res)

// //       if (!res.ok) {
// //         let errorMessage = `API error: ${res.status}`
// //         try {
// //           const errorData = await res.json()
// //           errorMessage = errorData.error || errorMessage
// //         } catch (e) {
// //           // Response is not JSON, use status code message
// //         }
// //         throw new Error(errorMessage)
// //       }
      
// //       const data = await res.json()

// //       const aiResponse = {
// //         id: Date.now() + 1,
// //         type: 'ai',
// //         content: data.reply || 'Sorry, I could not generate a response right now.',
// //         timestamp: new Date().toISOString()
// //       }
// //       setMessages(prev => [...prev, aiResponse])
// //     } catch (err) {
// //       console.error('AI Chat Error:', err)
// //       const errorResponse = {
// //         id: Date.now() + 2,
// //         type: 'ai',
// //         content: `Error: ${err.message || 'Failed to get response. Check console for details.'}`,
// //         timestamp: new Date().toISOString()
// //       }
// //       setMessages(prev => [...prev, errorResponse])
// //     } finally {
// //       setIsTyping(false)
// //     }
// //   }

// //   // Voice input via Web Speech API
// //   const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined

// //   const ensureRecognition = () => {
// //     if (!recognitionRef.current && SpeechRecognition) {
// //       const rec = new SpeechRecognition()
// //       rec.lang = 'en-US'
// //       rec.interimResults = false
// //       rec.maxAlternatives = 1

// //       rec.onresult = (event) => {
// //         const transcript = event.results[0][0].transcript
// //         setInputMessage(prev => (prev ? prev + ' ' : '') + transcript)
// //       }
// //       rec.onstart = () => setIsListening(true)
// //       rec.onend = () => setIsListening(false)
// //       rec.onerror = () => setIsListening(false)

// //       recognitionRef.current = rec
// //     }
// //     return recognitionRef.current
// //   }

// //   const startVoice = () => {
// //     if (!SpeechRecognition) return
// //     const rec = ensureRecognition()
// //     try { rec && rec.start() } catch {}
// //   }

// //   const stopVoice = () => {
// //     const rec = recognitionRef.current
// //     try { rec && rec.stop() } catch {}
// //   }

// //   const quickQuestions = useMemo(() => [
// //     'Plan a weekend trip to Paris',
// //     'Best time to visit Bali?',
// //     'Budget-friendly destinations in Europe',
// //     'Create a 7-day itinerary for Japan'
// //   ], [])

// //   return (
// //     <div className="space-y-6 min-h-screen mt-4 p-2">
// //       {/* Page Header */}
// //       <div>
// //         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
// //           AI Travel Assistant
// //         </h1>
// //         <p className="text-gray-600 dark:text-gray-400 mt-1">
// //           Get personalized travel recommendations and plan your trips with AI
// //         </p>
// //       </div>

// //       <div className="flex justify-between gap-6">
// //         {/* Chat Interface */}
// //         <div className="flex-1 flex">
// //           <div className="h-[600px] w-full rounded-sm dark:bg-gray-900 shadow-2xl flex flex-col bg-white border dark:border-gray-800">
// //             {/* Chat Header */}
// //             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
// //               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// //                 Chat with AI Assistant
// //               </h3>
// //               <p className="text-sm text-gray-600 dark:text-gray-400">
// //                 Ask me anything about travel planning!
// //               </p>
// //             </div>

// //             {/* Messages */}
// //             <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-gradient p-4 space-y-4">
// //               {messages.map((message) => (
// //                 <div
// //                   key={message.id}
// //                   className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
// //                 >
// //                   <div
// //                     className={`max-w-[85%] lg:max-w-[75%] px-4 py-2 rounded-lg ${
// //                       message.type === 'user'
// //                         ? 'bg-blue-600 text-white'
// //                         : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
// //                     }`}
// //                   >
// //                     <p className="text-sm whitespace-pre-wrap">{message.content}</p>
// //                     <p className={`text-xs mt-1 ${
// //                       message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
// //                     }`}>
// //                       {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                     </p>
// //                   </div>
// //                 </div>
// //               ))}
              
// //               {isTyping && (
// //                 <div className="flex justify-start">
// //                   <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
// //                     <div className="flex space-x-1">
// //                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
// //                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
// //                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Input */}
// //             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
// //               <div className="flex gap-2">
// //                 <button
// //                   type="button"
// //                   className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 ${
// //                     isListening 
// //                       ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20' 
// //                       : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
// //                   }`}
// //                   onClick={isListening ? stopVoice : startVoice}
// //                 >
// //                   {isListening ? (
// //                     <span className="flex items-center gap-2">
// //                       <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
// //                       Stop
// //                     </span>
// //                   ) : (
// //                     '🎤 Voice'
// //                   )}
// //                 </button>
// //                 <input
// //                   type="text"
// //                   value={inputMessage}
// //                   onChange={(e) => setInputMessage(e.target.value)}
// //                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
// //                   placeholder="Ask me about travel planning..."
// //                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //                 <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
// //                   Send
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Quick Actions & Features (Hidden on mobile) */}
// //         <div className="hidden md:block w-80 space-y-6">
// //           <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
// //             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
// //               Quick Prompts
// //             </h3>
// //             <div className="space-y-2">
// //               {quickQuestions.map((question, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => setInputMessage(question)}
// //                   className="w-full text-left p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
// //                 >
// //                   {question}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }
// 'use client'

// import { Button } from '@/components/ui/button'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { useAuth } from '@/providers/useAuth'
// import { db } from '@/lib/config/firebase'
// import { doc, setDoc } from 'firebase/firestore'
// import { toast } from 'sonner'
// import { Loader2, Save, Map } from 'lucide-react'
// import { useRouter } from 'next/navigation'

// const STORAGE_KEY = 'ai_chat_messages'

// export default function AIAssistantPage() {
//   const { user, profile } = useAuth()
//   const router = useRouter()
  
//   const [messages, setMessages] = useState(() => {
//     try {
//       const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
//       return saved ? JSON.parse(saved) : [
//         {
//           id: 1,
//           type: 'ai',
//           content: "Hello! I can plan your perfect trip. To get started, tell me where you want to go, or just say 'Plan a trip'!",
//           timestamp: new Date().toISOString()
//         }
//       ]
//     } catch {
//       return []
//     }
//   })
  
//   const [inputMessage, setInputMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [generatedTrip, setGeneratedTrip] = useState(null)
//   const [isSaving, setIsSaving] = useState(false)
//   const scrollRef = useRef(null)

//   // Persist messages
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
//     } catch {}
//   }, [messages])

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages, isTyping, generatedTrip])

//   // Extract JSON from AI response if present
//   const parseTripFromResponse = (text) => {
//     const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
//     if (jsonMatch && jsonMatch[1]) {
//       try {
//         const tripData = JSON.parse(jsonMatch[1])
//         return tripData
//       } catch (e) {
//         console.error("Failed to parse AI trip JSON", e)
//       }
//     }
//     return null
//   }

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date().toISOString()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInputMessage('')
//     setIsTyping(true)
//     setGeneratedTrip(null) // Reset previous trip suggestion

//     try {
//       const res = await fetch('/api/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages.slice(-8), userMessage].map(m => ({ 
//             role: m.type === 'user' ? 'user' : 'assistant', 
//             content: m.content 
//           })),
//           // Pass user preferences to the AI
//           userPreferences: profile?.preferences || []
//         })
//       })

//       if (!res.ok) throw new Error('Network response was not ok')
      
//       const data = await res.json()
      
//       // Check if AI returned a JSON plan
//       const tripData = parseTripFromResponse(data.reply)
      
//       // Clean up the reply to remove the raw JSON block for better UX
//       const cleanReply = data.reply.replace(/```json\n[\s\S]*?\n```/, 
//         "\n\n✨ **I've generated a trip plan for you!** Click the button below to save it to your dashboard.")

//       const aiResponse = {
//         id: Date.now() + 1,
//         type: 'ai',
//         content: cleanReply,
//         timestamp: new Date().toISOString()
//       }
      
//       setMessages(prev => [...prev, aiResponse])
      
//       if (tripData) {
//         setGeneratedTrip(tripData)
//       }

//     } catch (err) {
//       console.error(err)
//       setMessages(prev => [...prev, {
//         id: Date.now() + 2,
//         type: 'ai',
//         content: 'Sorry, I encountered an error. Please try again.',
//         timestamp: new Date().toISOString()
//       }])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   const handleSaveTrip = async () => {
//     if (!user) {
//       toast.error("You must be logged in to save trips")
//       return
//     }
//     if (!generatedTrip) return

//     setIsSaving(true)
//     try {
//       const docId = Date.now().toString()
//       const { tripDetails, itinerary, hotel_options } = generatedTrip

//       // Structure matches your Create Trip schema
//       const tripData = {
//         id: docId,
//         userId: user.uid,
//         userEmail: user.email,
//         userName: profile?.name || user.displayName,
        
//         // Map the AI details to your userSelection format
//         userSelection: {
//           title: tripDetails.title,
//           destination: tripDetails.destination,
//           days: parseInt(tripDetails.duration),
//           budget: parseFloat(tripDetails.budget),
//           persons: parseInt(tripDetails.travelers),
//           currency: tripDetails.currency || 'USD',
//           interests: profile?.preferences || []
//         },
        
//         // The full AI plan
//         GeneratedPlan: {
//           ...generatedTrip,
//           tripDetails: generatedTrip.tripDetails // Ensure consistency
//         },
        
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         savedBy: [],
//         currency: tripDetails.currency || 'USD'
//       }

//       await setDoc(doc(db, "trips", docId), tripData)
      
//       toast.success("Trip Saved Successfully! 🎉")
//       router.push(`/saved/${docId}`)
      
//     } catch (error) {
//       console.error("Save Error:", error)
//       toast.error("Failed to save trip")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   return (
//     <div className="space-y-6 min-h-screen mt-4 p-2">
//       <div className="flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             AI Travel Assistant
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Chat with me to plan your next adventure automatically.
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-6 h-[70vh]">
//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 overflow-hidden">
          
//           {/* Messages */}
//           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-gradient">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
//                     message.type === 'user'
//                       ? 'bg-blue-600 text-white rounded-br-none'
//                       : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
//                   }`}
//                 >
//                   {message.content}
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Generated Trip Card */}
//             {generatedTrip && (
//               <div className="flex justify-start w-full">
//                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border border-purple-200 dark:border-purple-900/50 p-4 rounded-xl max-w-sm w-full">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300">
//                       <Map size={20} />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-900 dark:text-white">
//                         {generatedTrip.tripDetails.destination}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {generatedTrip.tripDetails.duration} days • {generatedTrip.tripDetails.budget} {generatedTrip.tripDetails.currency}
//                       </p>
//                     </div>
//                   </div>
//                   <Button 
//                     onClick={handleSaveTrip} 
//                     disabled={isSaving}
//                     className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                   >
//                     {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
//                     Save & View Trip
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Input */}
//           <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//                 placeholder="Where would you like to go?"
//                 className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} className="h-full px-6 rounded-xl">
//                 Send
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }















// 'use client'

// import { Button } from '@/components/ui/button'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { useAuth } from '@/providers/useAuth'
// import { db } from '@/lib/config/firebase'
// import { doc, setDoc } from 'firebase/firestore'
// import { toast } from 'sonner'
// import { Loader2, Save, Map, Mic, MicOff, Send } from 'lucide-react'
// import { useRouter } from 'next/navigation'

// const STORAGE_KEY = 'ai_chat_messages'

// export default function AIAssistantPage() {
//   const { user, profile } = useAuth()
//   const router = useRouter()
  
//   // State
//   const [messages, setMessages] = useState(() => {
//     try {
//       const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
//       return saved ? JSON.parse(saved) : [
//         {
//           id: 1,
//           type: 'ai',
//           content: "Hello! I can plan your perfect trip. To get started, tell me where you want to go, or just say 'Plan a trip'!",
//           timestamp: new Date().toISOString()
//         }
//       ]
//     } catch {
//       return []
//     }
//   })
  
//   const [inputMessage, setInputMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [generatedTrip, setGeneratedTrip] = useState(null)
//   const [isSaving, setIsSaving] = useState(false)
  
//   // Voice Input State
//   const [isListening, setIsListening] = useState(false)
//   const recognitionRef = useRef(null)
  
//   const scrollRef = useRef(null)

//   // Persist messages
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
//     } catch {}
//   }, [messages])

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages, isTyping, generatedTrip])

//   // --- VOICE INPUT LOGIC STARTS HERE ---
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // Check for browser support
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition()
//         recognition.continuous = false // Stop after one sentence
//         recognition.lang = 'en-US'
//         recognition.interimResults = false

//         recognition.onstart = () => setIsListening(true)
//         recognition.onend = () => setIsListening(false)
        
//         recognition.onresult = (event) => {
//           const transcript = event.results[0][0].transcript
//           setInputMessage((prev) => (prev ? prev + ' ' : '') + transcript)
//         }
        
//         recognitionRef.current = recognition
//       }
//     }
//   }, [])

//   const toggleVoiceInput = () => {
//     if (!recognitionRef.current) {
//       toast.error("Voice input is not supported in this browser.")
//       return
//     }

//     if (isListening) {
//       recognitionRef.current.stop()
//     } else {
//       recognitionRef.current.start()
//     }
//   }
//   // --- VOICE INPUT LOGIC ENDS HERE ---

//   const parseTripFromResponse = (text) => {
//     const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
//     if (jsonMatch && jsonMatch[1]) {
//       try {
//         return JSON.parse(jsonMatch[1])
//       } catch (e) {
//         console.error("Failed to parse AI trip JSON", e)
//       }
//     }
//     return null
//   }

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date().toISOString()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInputMessage('')
//     setIsTyping(true)
//     setGeneratedTrip(null)

//     try {
//       const res = await fetch('/api/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages.slice(-8), userMessage].map(m => ({ 
//             role: m.type === 'user' ? 'user' : 'assistant', 
//             content: m.content 
//           })),
//           userPreferences: profile?.preferences || []
//         })
//       })

//       if (!res.ok) throw new Error('Network response was not ok')
      
//       const data = await res.json()
//       const tripData = parseTripFromResponse(data.reply)
      
//       const cleanReply = data.reply.replace(/```json\n[\s\S]*?\n```/, 
//         "\n\n✨ **I've generated a trip plan for you!** Click the button below to save it.")

//       const aiResponse = {
//         id: Date.now() + 1,
//         type: 'ai',
//         content: cleanReply,
//         timestamp: new Date().toISOString()
//       }
      
//       setMessages(prev => [...prev, aiResponse])
      
//       if (tripData) {
//         setGeneratedTrip(tripData)
//       }

//     } catch (err) {
//       console.error(err)
//       setMessages(prev => [...prev, {
//         id: Date.now() + 2,
//         type: 'ai',
//         content: 'Sorry, I encountered an error. Please try again.',
//         timestamp: new Date().toISOString()
//       }])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   const handleSaveTrip = async () => {
//     if (!user) {
//       toast.error("You must be logged in to save trips")
//       return
//     }
//     if (!generatedTrip) return

//     setIsSaving(true)
//     try {
//       const docId = Date.now().toString()
//       const { tripDetails } = generatedTrip

//       const tripData = {
//         id: docId,
//         userId: user.uid,
//         userEmail: user.email,
//         userName: profile?.name || user.displayName,
//         userSelection: {
//           title: tripDetails.title,
//           destination: tripDetails.destination,
//           days: parseInt(tripDetails.duration),
//           budget: parseFloat(tripDetails.budget),
//           persons: parseInt(tripDetails.travelers),
//           currency: tripDetails.currency || 'USD',
//           interests: profile?.preferences || []
//         },
//         GeneratedPlan: {
//           ...generatedTrip,
//           tripDetails: generatedTrip.tripDetails
//         },
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         savedBy: [],
//         currency: tripDetails.currency || 'USD'
//       }

//       await setDoc(doc(db, "trips", docId), tripData)
//       toast.success("Trip Saved Successfully! 🎉")
//       router.push(`/trips/${docId}`)
      
//     } catch (error) {
//       console.error("Save Error:", error)
//       toast.error("Failed to save trip")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   return (
//     <div className="space-y-6 min-h-screen mt-4 p-2">
//       <div className="flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             AI Travel Assistant
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Chat with me to plan your next adventure automatically.
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-6 h-[70vh]">
//         <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 overflow-hidden">
          
//           {/* Chat Messages */}
//           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-gradient">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
//                     message.type === 'user'
//                       ? 'bg-blue-600 text-white rounded-br-none'
//                       : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
//                   }`}
//                 >
//                   {message.content}
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Generated Trip Card */}
//             {generatedTrip && (
//               <div className="flex justify-start w-full">
//                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border border-purple-200 dark:border-purple-900/50 p-4 rounded-xl max-w-sm w-full">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300">
//                       <Map size={20} />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-900 dark:text-white">
//                         {generatedTrip.tripDetails.destination}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {generatedTrip.tripDetails.duration} days • {generatedTrip.tripDetails.budget} {generatedTrip.tripDetails.currency}
//                       </p>
//                     </div>
//                   </div>
//                   <Button 
//                     onClick={handleSaveTrip} 
//                     disabled={isSaving}
//                     className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                   >
//                     {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
//                     Save & View Trip
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800">
//             <div className="flex gap-2">
              
//               {/* Mic Button */}
//               <button
//                 type="button"
//                 onClick={toggleVoiceInput}
//                 className={`p-3 rounded-xl border transition-all ${
//                   isListening 
//                     ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' 
//                     : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50'
//                 }`}
//                 title="Use Voice Input"
//               >
//                 {isListening ? <MicOff size={20} /> : <Mic size={20} />}
//               </button>

//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//                 placeholder={isListening ? "Listening..." : "Where would you like to go?"}
//                 className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
              
//               <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} className="h-full px-6 rounded-xl">
//                 <Send size={18} />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }













// 'use client'

// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { Send, Mic, Sparkles, Map, User, Bot, Plane, MicOff } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'

// const STORAGE_KEY = 'ai_chat_messages'

// export default function AIAssistantPage() {
//   const [messages, setMessages] = useState(() => {
//     try {
//       const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
//       return saved ? JSON.parse(saved) : [
//         {
//           id: 1,
//           type: 'ai',
//           content: "Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, and answer travel questions. Where are we going today?",
//           timestamp: new Date().toISOString()
//         }
//       ]
//     } catch {
//       return []
//     }
//   })
  
//   const [inputMessage, setInputMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const recognitionRef = useRef(null)
//   const scrollRef = useRef(null)

//   // Persist messages
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
//     } catch {}
//   }, [messages])

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages, isTyping])

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date().toISOString()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInputMessage('')
//     setIsTyping(true)

//     try {
//       const res = await fetch('/api/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages.slice(-8), userMessage].map(m => ({ 
//             role: m.type === 'user' ? 'user' : 'assistant', 
//             content: m.content 
//           })),
//         })
//       })

//       if (!res.ok) throw new Error('Network response was not ok')
//       const data = await res.json()

//       const aiResponse = {
//         id: Date.now() + 1,
//         type: 'ai',
//         content: data.reply || 'Sorry, I could not generate a response right now.',
//         timestamp: new Date().toISOString()
//       }
//       setMessages(prev => [...prev, aiResponse])
//     } catch (err) {
//       const errorResponse = {
//         id: Date.now() + 2,
//         type: 'ai',
//         content: 'There was an error contacting the assistant. Please try again.',
//         timestamp: new Date().toISOString()
//       }
//       setMessages(prev => [...prev, errorResponse])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   // Voice Logic
//   const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined

//   const ensureRecognition = () => {
//     if (!recognitionRef.current && SpeechRecognition) {
//       const rec = new SpeechRecognition()
//       rec.lang = 'en-US'
//       rec.interimResults = false
//       rec.maxAlternatives = 1

//       rec.onresult = (event) => {
//         const transcript = event.results[0][0].transcript
//         setInputMessage(prev => (prev ? prev + ' ' : '') + transcript)
//       }
//       rec.onstart = () => setIsListening(true)
//       rec.onend = () => setIsListening(false)
//       rec.onerror = () => setIsListening(false)
//       recognitionRef.current = rec
//     }
//     return recognitionRef.current
//   }

//   const startVoice = () => {
//     if (!SpeechRecognition) return
//     const rec = ensureRecognition()
//     try { rec && rec.start() } catch {}
//   }

//   const stopVoice = () => {
//     const rec = recognitionRef.current
//     try { rec && rec.stop() } catch {}
//   }

//   const quickQuestions = useMemo(() => [
//     { text: 'Plan a weekend trip to Paris', icon: Plane },
//     { text: 'Best time to visit Bali?', icon: Map },
//     { text: 'Budget destinations in Europe', icon: Sparkles },
//   ], [])

//   return (
//     <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-background">
      
//       {/* LEFT: Chat Area */}
//       <Card className="flex-1 flex flex-col h-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl relative">
        
//         {/* Header */}
//         <div className="p-4 md:p-6 border-b border-border/40 bg-card/80 backdrop-blur-md z-10 flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
//             <Bot size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
//               Travel Assistant <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Beta</span>
//             </h1>
//             <p className="text-xs text-muted-foreground">Powered by AI • Ask me anything</p>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-gradient bg-gradient-to-b from-transparent to-background/5" ref={scrollRef}>
//           <AnimatePresence>
//             {messages.map((message) => (
//               <motion.div
//                 key={message.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className={`flex w-full gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 {/* Avatar for AI */}
//                 {message.type === 'ai' && (
//                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
//                     <Sparkles size={14} />
//                   </div>
//                 )}

//                 <div
//                   className={`relative max-w-[85%] md:max-w-[70%] px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
//                     message.type === 'user'
//                       ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
//                       : 'bg-white dark:bg-gray-800 border border-border text-foreground rounded-2xl rounded-tl-sm'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{message.content}</p>
//                   <p className={`text-[10px] mt-2 opacity-70 ${
//                     message.type === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
//                   }`}>
//                     {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </p>
//                 </div>

//                 {/* Avatar for User */}
//                 {message.type === 'user' && (
//                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 mt-1 shrink-0">
//                     <User size={14} />
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </AnimatePresence>
          
//           {isTyping && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
//                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
//                  <Sparkles size={14} />
//                </div>
//                <div className="bg-white dark:bg-gray-800 border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
//                   <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
//                   <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
//                   <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
//                </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="p-4 md:p-6 bg-card/80 backdrop-blur-md border-t border-border/40">
//            <div className="flex gap-3 items-end max-w-4xl mx-auto">
//              {/* Voice Button */}
//              <button
//                onClick={isListening ? stopVoice : startVoice}
//                className={`p-3 rounded-full transition-all duration-300 shadow-sm border ${
//                  isListening 
//                   ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' 
//                   : 'bg-background hover:bg-muted border-input text-muted-foreground hover:text-foreground'
//                }`}
//              >
//                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
//              </button>

//              {/* Text Input */}
//              <div className="flex-1 bg-background border border-input rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm flex items-center px-4 py-2">
//                <textarea
//                  value={inputMessage}
//                  onChange={(e) => setInputMessage(e.target.value)}
//                  onKeyDown={(e) => {
//                    if(e.key === 'Enter' && !e.shiftKey) {
//                      e.preventDefault();
//                      handleSendMessage();
//                    }
//                  }}
//                  placeholder="Where do you want to travel?"
//                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none h-[44px] py-2.5 max-h-32 text-sm placeholder:text-muted-foreground/70"
//                  rows={1}
//                />
//              </div>

//              {/* Send Button */}
//              <Button 
//                onClick={handleSendMessage} 
//                disabled={!inputMessage.trim() || isTyping}
//                className="h-[46px] w-[46px] rounded-full p-0 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
//              >
//                <Send size={18} className={inputMessage.trim() ? "translate-x-0.5" : ""} />
//              </Button>
//            </div>
           
//            {!SpeechRecognition && (
//               <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-50">
//                 Voice input not supported in this browser
//               </p>
//            )}
//         </div>
//       </Card>

//       {/* RIGHT: Quick Actions (Sidebar on Desktop, hidden on Mobile if space needed) */}
//       <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
        
//         {/* Suggestion Card */}
//         <Card className="p-5 shadow-lg border-border/60 bg-gradient-to-br from-card to-background/50 backdrop-blur-sm rounded-3xl">
//           <div className="flex items-center gap-2 mb-4">
//              <Sparkles className="text-yellow-500" size={18} />
//              <h3 className="font-semibold text-sm">Quick Prompts</h3>
//           </div>
//           <div className="space-y-3">
//             {quickQuestions.map((q, i) => (
//               <button
//                 key={i}
//                 onClick={() => setInputMessage(q.text)}
//                 className="w-full text-left p-3 rounded-xl bg-background hover:bg-muted border border-border/50 hover:border-primary/30 transition-all duration-200 group flex items-center gap-3"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
//                   <q.icon size={14} />
//                 </div>
//                 <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
//                   {q.text}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </Card>

//         {/* Info Card */}
//         <Card className="p-5 shadow-lg border-border/60 bg-primary text-primary-foreground rounded-3xl relative overflow-hidden">
//           <div className="absolute top-0 right-0 p-4 opacity-10">
//             <Plane size={100} />
//           </div>
//           <div className="relative z-10">
//             <h3 className="font-bold mb-2">Plan your dream trip</h3>
//             <p className="text-xs opacity-90 leading-relaxed mb-4">
//               I can help you build detailed itineraries, estimate budgets, and find hidden gems.
//             </p>
//             <div className="text-xs bg-white/20 backdrop-blur-md rounded-lg p-2 inline-block">
//               ✨ Pro Tip: Be specific with dates!
//             </div>
//           </div>
//         </Card>

//       </div>
//     </div>
//   )
// }







// 'use client'

// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { Send, Mic, Sparkles, Map, User, Bot, Plane, MicOff, Zap, Globe, Camera } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'

// const STORAGE_KEY = 'ai_chat_messages'

// export default function AIAssistantPage() {
//   const [messages, setMessages] = useState(() => {
//     try {
//       const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
//       return saved ? JSON.parse(saved) : [
//         {
//           id: 1,
//           type: 'ai',
//           content: "Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, and answer travel questions. Where are we going today?",
//           timestamp: new Date().toISOString()
//         }
//       ]
//     } catch {
//       return []
//     }
//   })
  
//   const [inputMessage, setInputMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const recognitionRef = useRef(null)
//   const scrollRef = useRef(null)

//   // Persist messages
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
//     } catch {}
//   }, [messages])

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages, isTyping])

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date().toISOString()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInputMessage('')
//     setIsTyping(true)

//     try {
//       const res = await fetch('/api/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages.slice(-8), userMessage].map(m => ({ 
//             role: m.type === 'user' ? 'user' : 'assistant', 
//             content: m.content 
//           })),
//         })
//       })

//       if (!res.ok) throw new Error('Network response was not ok')
//       const data = await res.json()

//       const aiResponse = {
//         id: Date.now() + 1,
//         type: 'ai',
//         content: data.reply || 'Sorry, I could not generate a response right now.',
//         timestamp: new Date().toISOString()
//       }
//       setMessages(prev => [...prev, aiResponse])
//     } catch (err) {
//       const errorResponse = {
//         id: Date.now() + 2,
//         type: 'ai',
//         content: 'There was an error contacting the assistant. Please try again.',
//         timestamp: new Date().toISOString()
//       }
//       setMessages(prev => [...prev, errorResponse])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   // Voice Logic
//   const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined

//   const ensureRecognition = () => {
//     if (!recognitionRef.current && SpeechRecognition) {
//       const rec = new SpeechRecognition()
//       rec.lang = 'en-US'
//       rec.interimResults = false
//       rec.maxAlternatives = 1

//       rec.onresult = (event) => {
//         const transcript = event.results[0][0].transcript
//         setInputMessage(prev => (prev ? prev + ' ' : '') + transcript)
//       }
//       rec.onstart = () => setIsListening(true)
//       rec.onend = () => setIsListening(false)
//       rec.onerror = () => setIsListening(false)
//       recognitionRef.current = rec
//     }
//     return recognitionRef.current
//   }

//   const startVoice = () => {
//     if (!SpeechRecognition) return
//     const rec = ensureRecognition()
//     try { rec && rec.start() } catch {}
//   }

//   const stopVoice = () => {
//     const rec = recognitionRef.current
//     try { rec && rec.stop() } catch {}
//   }

//   const quickQuestions = useMemo(() => [
//     { text: 'Plan a weekend trip to Paris', icon: Plane, gradient: 'from-blue-500 to-purple-500' },
//     { text: 'Best time to visit Bali?', icon: Map, gradient: 'from-emerald-500 to-teal-500' },
//     { text: 'Budget destinations in Europe', icon: Sparkles, gradient: 'from-orange-500 to-pink-500' },
//     { text: 'Popular photography spots in Japan', icon: Camera, gradient: 'from-rose-500 to-red-500' },
//   ], [])

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
//         <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative flex flex-col md:flex-row gap-6 p-4 md:p-6 h-[calc(100vh-6rem)]">
//         {/* LEFT: Chat Area */}
//         <Card className="flex-1 flex flex-col h-full shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden rounded-[2rem] relative">
          
//           {/* Gradient Border Effect */}
//           <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 p-[1px]">
//             <div className="absolute inset-[1px] rounded-[2rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"></div>
//           </div>

//           {/* Content */}
//           <div className="relative z-10 flex flex-col h-full">
//             {/* Header with gradient */}
//             <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 backdrop-blur-md">
//               <div className="flex items-center gap-4">
//                 <motion.div 
//                   className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
//                   whileHover={{ scale: 1.05, rotate: 5 }}
//                   transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                 >
//                   <Bot size={24} className="text-white" />
//                   <motion.div
//                     className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400"
//                     animate={{ opacity: [0.5, 0.8, 0.5] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                   />
//                 </motion.div>
//                 <div className="flex-1">
//                   <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
//                     Travel Assistant 
//                     <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-md">
//                       Beta
//                     </span>
//                   </h1>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
//                     <Zap size={14} className="text-yellow-500" />
//                     Powered by AI • Ask me anything
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Messages with custom scrollbar */}
//             <div 
//               className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" 
//               ref={scrollRef}
//               style={{
//                 scrollbarWidth: 'thin',
//                 scrollbarColor: '#e5e7eb #f9fafb'
//               }}
//             >
//               <AnimatePresence>
//                 {messages.map((message, index) => (
//                   <motion.div
//                     key={message.id}
//                     initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ 
//                       duration: 0.4,
//                       delay: index * 0.05,
//                       type: "spring",
//                       stiffness: 500,
//                       damping: 30
//                     }}
//                     className={`flex w-full gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     {/* AI Avatar */}
//                     {message.type === 'ai' && (
//                       <motion.div 
//                         className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mt-1 shrink-0"
//                         whileHover={{ scale: 1.1, rotate: 10 }}
//                         transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                       >
//                         <Sparkles size={18} className="text-white" />
//                       </motion.div>
//                     )}

//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className={`relative max-w-[85%] md:max-w-[70%] px-6 py-4 shadow-lg text-sm leading-relaxed ${
//                         message.type === 'user'
//                           ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl rounded-tr-md'
//                           : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-3xl rounded-tl-md'
//                       }`}
//                     >
//                       {/* Shine effect for user messages */}
//                       {message.type === 'user' && (
//                         <div className="absolute inset-0 rounded-3xl rounded-tr-md overflow-hidden">
//                           <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                             animate={{ x: ['-100%', '100%'] }}
//                             transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
//                           />
//                         </div>
//                       )}
                      
//                       <p className="whitespace-pre-wrap relative z-10">{message.content}</p>
//                       <p className={`text-[10px] mt-2 ${
//                         message.type === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
//                       }`}>
//                         {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                     </motion.div>

//                     {/* User Avatar */}
//                     {message.type === 'user' && (
//                       <motion.div 
//                         className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg mt-1 shrink-0"
//                         whileHover={{ scale: 1.1, rotate: -10 }}
//                         transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                       >
//                         <User size={18} className="text-white" />
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
              
//               {/* Enhanced typing indicator */}
//               {isTyping && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }} 
//                   animate={{ opacity: 1, y: 0 }} 
//                   className="flex justify-start gap-3"
//                 >
//                   <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mt-1">
//                     <Sparkles size={18} className="text-white" />
//                   </div>
//                   <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 px-6 py-4 rounded-3xl rounded-tl-md shadow-lg flex items-center gap-2">
//                     <motion.span 
//                       className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
//                       animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
//                       transition={{ duration: 1, repeat: Infinity, delay: 0 }}
//                     />
//                     <motion.span 
//                       className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
//                       animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
//                       transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
//                     />
//                     <motion.span 
//                       className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
//                       animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
//                       transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </div>

//             {/* Enhanced Input Area */}
//             <div className="p-6 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
//               <div className="flex gap-3 items-end max-w-4xl mx-auto">
//                 {/* Voice Button with pulse effect */}
//                 <motion.button
//                   onClick={isListening ? stopVoice : startVoice}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`relative p-4 rounded-2xl transition-all duration-300 shadow-lg ${
//                     isListening 
//                      ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white' 
//                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
//                   }`}
//                 >
//                   {isListening && (
//                     <motion.div
//                       className="absolute inset-0 rounded-2xl bg-red-400"
//                       animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     />
//                   )}
//                   {isListening ? <MicOff size={22} /> : <Mic size={22} />}
//                 </motion.button>

//                 {/* Enhanced Text Input */}
//                 <div className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-500 dark:focus-within:border-purple-400 transition-all shadow-lg flex items-center px-5 py-3">
//                   <textarea
//                     value={inputMessage}
//                     onChange={(e) => setInputMessage(e.target.value)}
//                     onKeyDown={(e) => {
//                       if(e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage();
//                       }
//                     }}
//                     placeholder="Where do you want to travel? ✈️"
//                     className="flex-1 bg-transparent border-none focus:ring-0 resize-none h-[44px] py-2 max-h-32 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-100"
//                     rows={1}
//                   />
//                 </div>

//                 {/* Enhanced Send Button */}
//                 <motion.button
//                   onClick={handleSendMessage} 
//                   disabled={!inputMessage.trim() || isTyping}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="h-[52px] w-[52px] rounded-2xl shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   <Send size={20} className={inputMessage.trim() ? "translate-x-0.5" : ""} />
//                 </motion.button>
//               </div>
              
//               {!SpeechRecognition && (
//                 <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-3">
//                   Voice input not supported in this browser
//                 </p>
//               )}
//             </div>
//           </div>
//         </Card>

//         {/* RIGHT: Enhanced Quick Actions */}
//         <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
          
//           {/* Quick Prompts Card */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <Card className="p-6 shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl relative overflow-hidden">
//               {/* Gradient border */}
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 p-[1px] rounded-3xl">
//                 <div className="absolute inset-[1px] rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"></div>
//               </div>
              
//               <div className="relative z-10">
//                 <div className="flex items-center gap-2 mb-5">
//                   <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
//                     <Sparkles className="text-white" size={18} />
//                   </div>
//                   <h3 className="font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
//                     Quick Prompts
//                   </h3>
//                 </div>
//                 <div className="space-y-3">
//                   {quickQuestions.map((q, i) => (
//                     <motion.button
//                       key={i}
//                       onClick={() => setInputMessage(q.text)}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.3 + i * 0.1 }}
//                       whileHover={{ scale: 1.02, x: 5 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 group shadow-md"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
//                           <q.icon size={18} className="text-white" />
//                         </div>
//                         <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
//                           {q.text}
//                         </span>
//                       </div>
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             </Card>
//           </motion.div>

//           {/* Info Card with 3D effect */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//           >
//             <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white rounded-3xl relative overflow-hidden group">
//               {/* Animated background shapes */}
//               <motion.div 
//                 className="absolute top-0 right-0 p-4 opacity-10"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               >
//                 <Plane size={120} />
//               </motion.div>
//               <motion.div 
//                 className="absolute -bottom-10 -left-10 opacity-10"
//                 animate={{ rotate: -360 }}
//                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//               >
//                 <Globe size={140} />
//               </motion.div>
              
//               <div className="relative z-10">
//                 <h3 className="font-bold text-xl mb-3">Plan your dream trip</h3>
//                 <p className="text-sm opacity-90 leading-relaxed mb-5">
//                   I can help you build detailed itineraries, estimate budgets, and find hidden gems across the globe.
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   <div className="text-xs bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 inline-flex items-center gap-2 shadow-lg">
//                     <Sparkles size={14} />
//                     Pro Tip: Be specific!
//                   </div>
//                   <div className="text-xs bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 inline-flex items-center gap-2 shadow-lg">
//                     <Zap size={14} />
//                     Fast & Accurate
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>

//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(0, 0, 0, 0.05);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #a855f7, #ec4899);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #9333ea, #db2777);
//         }
//       `}</style>
//     </div>
//   )
// }














// 'use client'

// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { Send, Mic, Sparkles, Map, User, Bot, Plane, MicOff, Save, Loader2 } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useAuth } from '@/providers/useAuth'
// import { db } from '@/lib/config/firebase'
// import { doc, setDoc } from 'firebase/firestore'
// import { toast } from 'sonner'
// import { useRouter } from 'next/navigation'

// const STORAGE_KEY = 'ai_chat_messages'

// export default function AIAssistantPage() {
//   const { user, profile } = useAuth()
//   const router = useRouter()

//   // --- STATE ---
//   const [messages, setMessages] = useState(() => {
//     try {
//       const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
//       return saved ? JSON.parse(saved) : [
//         {
//           id: 1,
//           type: 'ai',
//           content: "Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, and answer travel questions. Where are we going today?",
//           timestamp: new Date().toISOString()
//         }
//       ]
//     } catch {
//       return []
//     }
//   })
  
//   const [inputMessage, setInputMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [isListening, setIsListening] = useState(false)
  
//   // Trip Saving State
//   const [generatedTrip, setGeneratedTrip] = useState(null)
//   const [isSaving, setIsSaving] = useState(false)

//   const recognitionRef = useRef(null)
//   const scrollRef = useRef(null)

//   // --- EFFECTS ---
  
//   // Persist messages
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
//     } catch {}
//   }, [messages])

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages, isTyping, generatedTrip])

//   // --- LOGIC ---

//   // 1. Voice Input
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition()
//         recognition.continuous = false
//         recognition.lang = 'en-US'
//         recognition.interimResults = false

//         recognition.onstart = () => setIsListening(true)
//         recognition.onend = () => setIsListening(false)
//         recognition.onresult = (event) => {
//           const transcript = event.results[0][0].transcript
//           setInputMessage((prev) => (prev ? prev + ' ' : '') + transcript)
//         }
//         recognitionRef.current = recognition
//       }
//     }
//   }, [])

//   const toggleVoiceInput = () => {
//     if (!recognitionRef.current) {
//       toast.error("Voice input is not supported in this browser.")
//       return
//     }
//     isListening ? recognitionRef.current.stop() : recognitionRef.current.start()
//   }

//   // 2. Parse JSON Response
//   const parseTripFromResponse = (text) => {
//     const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
//     if (jsonMatch && jsonMatch[1]) {
//       try {
//         return JSON.parse(jsonMatch[1])
//       } catch (e) {
//         console.error("Failed to parse AI trip JSON", e)
//       }
//     }
//     return null
//   }

//   // 3. Send Message
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date().toISOString()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInputMessage('')
//     setIsTyping(true)
//     setGeneratedTrip(null) // Reset previous trip

//     try {
//       const res = await fetch('/api/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages.slice(-8), userMessage].map(m => ({ 
//             role: m.type === 'user' ? 'user' : 'assistant', 
//             content: m.content 
//           })),
//           userPreferences: profile?.preferences || []
//         })
//       })

//       if (!res.ok) throw new Error('Network response was not ok')
//       const data = await res.json()

//       // Check for JSON Trip
//       const tripData = parseTripFromResponse(data.reply)
      
//       // Clean up reply text for display
//       const cleanReply = data.reply.replace(/```json\n[\s\S]*?\n```/, 
//         "\n\n✨ **I've generated a trip plan for you!** Review the details below and save it to your dashboard.")

//       const aiResponse = {
//         id: Date.now() + 1,
//         type: 'ai',
//         content: cleanReply,
//         timestamp: new Date().toISOString()
//       }
//       setMessages(prev => [...prev, aiResponse])
      
//       if (tripData) {
//         setGeneratedTrip(tripData)
//       }

//     } catch (err) {
//       console.error(err)
//       const errorResponse = {
//         id: Date.now() + 2,
//         type: 'ai',
//         content: 'Sorry, I encountered an error. Please try again.',
//         timestamp: new Date().toISOString()
//       }
//       setMessages(prev => [...prev, errorResponse])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   // 4. Save Trip Logic
//   const handleSaveTrip = async () => {
//     if (!user) {
//       toast.error("You must be logged in to save trips")
//       return
//     }
//     if (!generatedTrip) return

//     setIsSaving(true)
//     try {
//       const docId = Date.now().toString()
//       const { tripDetails } = generatedTrip

//       const tripData = {
//         id: docId,
//         userId: user.uid,
//         userEmail: user.email,
//         userName: profile?.name || user.displayName,
//         userSelection: {
//           title: tripDetails.title,
//           destination: tripDetails.destination,
//           days: parseInt(tripDetails.duration),
//           budget: parseFloat(tripDetails.budget),
//           persons: parseInt(tripDetails.travelers),
//           currency: tripDetails.currency || 'USD',
//           interests: profile?.preferences || []
//         },
//         GeneratedPlan: {
//           ...generatedTrip,
//           tripDetails: generatedTrip.tripDetails
//         },
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         savedBy: [],
//         currency: tripDetails.currency || 'USD'
//       }

//       await setDoc(doc(db, "trips", docId), tripData)
//       toast.success("Trip Saved Successfully! 🎉")
//       router.push(`/trips/${docId}`) // Updated to match your routing
      
//     } catch (error) {
//       console.error("Save Error:", error)
//       toast.error("Failed to save trip")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const quickQuestions = useMemo(() => [
//     { text: 'Plan a weekend trip to Paris', icon: Plane },
//     { text: 'Best time to visit Bali?', icon: Map },
//     { text: 'Budget destinations in Europe', icon: Sparkles },
//   ], [])

//   // --- RENDER ---
//   return (
//     <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-background">
      
//       {/* LEFT: Chat Area */}
//       <Card className="flex-1 flex flex-col h-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl relative">
        
//         {/* Header */}
//         <div className="p-4 md:p-6 border-b border-border/40 bg-card/80 backdrop-blur-md z-10 flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
//             <Bot size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
//               Travel Assistant <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Beta</span>
//             </h1>
//             <p className="text-xs text-muted-foreground">Powered by AI • Ask me anything</p>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-gradient bg-gradient-to-b from-transparent to-background/5" ref={scrollRef}>
//           <AnimatePresence>
//             {messages.map((message) => (
//               <motion.div
//                 key={message.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className={`flex w-full gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 {/* Avatar for AI */}
//                 {message.type === 'ai' && (
//                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
//                     <Sparkles size={14} />
//                   </div>
//                 )}

//                 <div
//                   className={`relative max-w-[85%] md:max-w-[70%] px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
//                     message.type === 'user'
//                       ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
//                       : 'bg-white dark:bg-gray-800 border border-border text-foreground rounded-2xl rounded-tl-sm'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{message.content}</p>
//                   <p className={`text-[10px] mt-2 opacity-70 ${
//                     message.type === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
//                   }`}>
//                     {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </p>
//                 </div>

//                 {/* Avatar for User */}
//                 {message.type === 'user' && (
//                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 mt-1 shrink-0">
//                     <User size={14} />
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </AnimatePresence>
          
//           {/* Typing Indicator */}
//           {isTyping && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
//                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
//                  <Sparkles size={14} />
//                </div>
//                <div className="bg-white dark:bg-gray-800 border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
//                   <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
//                   <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
//                   <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
//                </div>
//             </motion.div>
//           )}

//           {/* Generated Trip Card (The new part) */}
//           {generatedTrip && (
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="flex justify-start gap-4"
//             >
//               <div className="w-8 shrink-0" /> {/* Spacer for alignment */}
//               <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-purple-900/50 p-4 rounded-xl max-w-sm w-full shadow-md">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300">
//                     <Map size={20} />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       {generatedTrip.tripDetails.destination}
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {generatedTrip.tripDetails.duration} days • {generatedTrip.tripDetails.budget} {generatedTrip.tripDetails.currency}
//                     </p>
//                   </div>
//                 </div>
//                 <Button 
//                   onClick={handleSaveTrip} 
//                   disabled={isSaving}
//                   className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
//                 >
//                   {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
//                   Save & View Trip
//                 </Button>
//               </div>
//             </motion.div>
//           )}

//         </div>

//         {/* Input Area */}
//         <div className="p-4 md:p-6 bg-card/80 backdrop-blur-md border-t border-border/40">
//            <div className="flex gap-3 items-end max-w-4xl mx-auto">
//              {/* Voice Button */}
//              <button
//                onClick={toggleVoiceInput}
//                className={`p-3 rounded-full transition-all duration-300 shadow-sm border ${
//                  isListening 
//                   ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' 
//                   : 'bg-background hover:bg-muted border-input text-muted-foreground hover:text-foreground'
//                }`}
//              >
//                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
//              </button>

//              {/* Text Input */}
//              <div className="flex-1 bg-background border border-input rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm flex items-center px-4 py-2">
//                <textarea
//                  value={inputMessage}
//                  onChange={(e) => setInputMessage(e.target.value)}
//                  onKeyDown={(e) => {
//                    if(e.key === 'Enter' && !e.shiftKey) {
//                      e.preventDefault();
//                      handleSendMessage();
//                    }
//                  }}
//                  placeholder={isListening ? "Listening..." : "Where do you want to travel?"}
//                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none h-[44px] py-2.5 max-h-32 text-sm placeholder:text-muted-foreground/70"
//                  rows={1}
//                />
//              </div>

//              {/* Send Button */}
//              <Button 
//                onClick={handleSendMessage} 
//                disabled={!inputMessage.trim() || isTyping}
//                className="h-[46px] w-[46px] rounded-full p-0 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
//              >
//                <Send size={18} className={inputMessage.trim() ? "translate-x-0.5" : ""} />
//              </Button>
//            </div>
           
//            {typeof window !== 'undefined' && !window.webkitSpeechRecognition && !window.SpeechRecognition && (
//               <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-50">
//                 Voice input not supported in this browser
//               </p>
//            )}
//         </div>
//       </Card>

//       {/* RIGHT: Quick Actions (Sidebar) */}
//       <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
        
//         {/* Suggestion Card */}
//         <Card className="p-5 shadow-lg border-border/60 bg-gradient-to-br from-card to-background/50 backdrop-blur-sm rounded-3xl">
//           <div className="flex items-center gap-2 mb-4">
//              <Sparkles className="text-yellow-500" size={18} />
//              <h3 className="font-semibold text-sm">Quick Prompts</h3>
//           </div>
//           <div className="space-y-3">
//             {quickQuestions.map((q, i) => (
//               <button
//                 key={i}
//                 onClick={() => setInputMessage(q.text)}
//                 className="w-full text-left p-3 rounded-xl bg-background hover:bg-muted border border-border/50 hover:border-primary/30 transition-all duration-200 group flex items-center gap-3"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
//                   <q.icon size={14} />
//                 </div>
//                 <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
//                   {q.text}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </Card>

//         {/* Info Card */}
//         <Card className="p-5 shadow-lg border-border/60 bg-primary text-primary-foreground rounded-3xl relative overflow-hidden">
//           <div className="absolute top-0 right-0 p-4 opacity-10">
//             <Plane size={100} />
//           </div>
//           <div className="relative z-10">
//             <h3 className="font-bold mb-2">Plan your dream trip</h3>
//             <p className="text-xs opacity-90 leading-relaxed mb-4">
//               I can help you build detailed itineraries, estimate budgets, and find hidden gems.
//             </p>
//             <div className="text-xs bg-white/20 backdrop-blur-md rounded-lg p-2 inline-block">
//               ✨ Pro Tip: Be specific with dates!
//             </div>
//           </div>
//         </Card>

//       </div>
//     </div>
//   )
// }
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, Mic, Sparkles, Map, User, Bot, Plane, MicOff, Save, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/useAuth'
import { db } from '@/lib/config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'ai_chat_messages'

export default function AIAssistantPage() {
  const { user, profile } = useAuth()
  const router = useRouter()

  // --- STATE ---
  const [messages, setMessages] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          type: 'ai',
          content: "Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, and answer travel questions. Where are we going today?",
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
  
  // Trip Saving State
  const [generatedTrip, setGeneratedTrip] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const recognitionRef = useRef(null)
  const scrollRef = useRef(null)

  // --- EFFECTS ---
  
  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, generatedTrip])

  // --- LOGIC ---

  // 1. Voice Input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        console.log("hi")
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.lang = 'en-US'
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputMessage((prev) => (prev ? prev + ' ' : '') + transcript)
        }
        recognitionRef.current = recognition
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input is not supported in this browser.")
      return
    }
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start()
  }

  // 2. Parse JSON Response
  const parseTripFromResponse = (text) => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1])
      } catch (e) {
        console.error("Failed to parse AI trip JSON", e)
      }
    }
    return null
  }

  // 3. Send Message
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
    setGeneratedTrip(null) // Reset previous trip

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.slice(-8), userMessage].map(m => ({ 
            role: m.type === 'user' ? 'user' : 'assistant', 
            content: m.content 
          })),
          userPreferences: profile?.preferences || []
        })
      })

      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()

      // Check for JSON Trip
      const tripData = parseTripFromResponse(data.reply)
      
      // Clean up reply text for display
      const cleanReply = data.reply.replace(/```json\n[\s\S]*?\n```/, 
        "\n\n✨ **I've generated a trip plan for you!** Review the details below and save it to your dashboard.")

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: cleanReply,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
      
      if (tripData) {
        setGeneratedTrip(tripData)
      }

    } catch (err) {
      console.error(err)
      const errorResponse = {
        id: Date.now() + 2,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  // 4. Save Trip Logic (FIXED HERE)
  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("You must be logged in to save trips")
      return
    }
    if (!generatedTrip) return

    setIsSaving(true)
    try {
      const docId = Date.now().toString()
      const { tripDetails } = generatedTrip

      // Structure needed for View Page:
      // - userSelection (for edit mode)
      // - GeneratedPlan (for view mode - needs destination at root)
      
      const tripData = {
        id: docId,
        userId: user.uid,
        userEmail: user.email,
        userName: profile?.name || user.displayName,
        
        // 1. Selection Data
        userSelection: {
          title: tripDetails.title,
          destination: tripDetails.destination,
          days: parseInt(tripDetails.duration),
          budget: parseFloat(tripDetails.budget),
          persons: parseInt(tripDetails.travelers),
          currency: tripDetails.currency || 'USD',
          interests: profile?.preferences || []
        },
        
        // 2. The Plan Data (FIXED: Spread tripDetails to root so Header works)
        GeneratedPlan: {
          ...generatedTrip,
          destination: tripDetails.destination, // <--- Key fix: Header reads this
          duration: tripDetails.duration,       // <--- Key fix: Header reads this
          tripDetails: tripDetails 
        },
        
        createdAt: new Date(),
        updatedAt: new Date(),
        savedBy: [],
        currency: tripDetails.currency || 'USD'
      }

      await setDoc(doc(db, "trips", docId), tripData)
      toast.success("Trip Saved Successfully! 🎉")
      router.push(`/trips/${docId}`) // Fixed route to match your file structure
      
    } catch (error) {
      console.error("Save Error:", error)
      toast.error("Failed to save trip")
    } finally {
      setIsSaving(false)
    }
  }

  const quickQuestions = useMemo(() => [
    { text: 'Plan a weekend trip to Paris', icon: Plane },
    { text: 'Best time to visit Bali?', icon: Map },
    { text: 'Budget destinations in Europe', icon: Sparkles },
  ], [])

  // --- RENDER ---
  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-background">
      
      {/* LEFT: Chat Area */}
      <Card className="flex-1 flex flex-col h-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl relative">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border/40 bg-card/80 backdrop-blur-md z-10 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Travel Assistant <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Beta</span>
            </h1>
            <p className="text-xs text-muted-foreground">Powered by AI • Ask me anything</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-gradient bg-gradient-to-b from-transparent to-background/5" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar for AI */}
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                    <Sparkles size={14} />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] md:max-w-[70%] px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                      : 'bg-white dark:bg-gray-800 border border-border text-foreground rounded-2xl rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-[10px] mt-2 opacity-70 ${
                    message.type === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Avatar for User */}
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 mt-1 shrink-0">
                    <User size={14} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                 <Sparkles size={14} />
               </div>
               <div className="bg-white dark:bg-gray-800 border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
               </div>
            </motion.div>
          )}

          {/* Generated Trip Card */}
          {generatedTrip && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start gap-4"
            >
              <div className="w-8 shrink-0" />
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-purple-900/50 p-4 rounded-xl max-w-sm w-full shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300">
                    <Map size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {generatedTrip.tripDetails.destination}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {generatedTrip.tripDetails.duration} days • {generatedTrip.tripDetails.budget} {generatedTrip.tripDetails.currency}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSaveTrip} 
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                >
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
                  Save & View Trip
                </Button>
              </div>
            </motion.div>
          )}

        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-card/80 backdrop-blur-md border-t border-border/40">
           <div className="flex gap-3 items-end max-w-4xl mx-auto">
             <button
               onClick={toggleVoiceInput}
               className={`p-3 rounded-full transition-all duration-300 shadow-sm border ${
                 isListening 
                  ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' 
                  : 'bg-background hover:bg-muted border-input text-muted-foreground hover:text-foreground'
               }`}
             >
               {isListening ? <MicOff size={20} /> : <Mic size={20} />}
             </button>

             <div className="flex-1 bg-background border border-input rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm flex items-center px-4 py-2">
               <textarea
                 value={inputMessage}
                 onChange={(e) => setInputMessage(e.target.value)}
                 onKeyDown={(e) => {
                   if(e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSendMessage();
                   }
                 }}
                 placeholder={isListening ? "Listening..." : "Where do you want to travel?"}
                 className="flex-1 bg-transparent border-none focus:ring-0 resize-none h-[44px] py-2.5 max-h-32 text-sm placeholder:text-muted-foreground/70 outline-none"
                 rows={1}
               />
             </div>

             <Button 
               onClick={handleSendMessage} 
               disabled={!inputMessage.trim() || isTyping}
               className="h-[46px] w-[46px] rounded-full p-0 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
             >
               <Send size={18} className={inputMessage.trim() ? "translate-x-0.5" : ""} />
             </Button>
           </div>
           
           {typeof window !== 'undefined' && !window.webkitSpeechRecognition && !window.SpeechRecognition && (
              <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-50">
                Voice input not supported in this browser
              </p>
           )}
        </div>
      </Card>

      {/* RIGHT: Quick Actions */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
        <Card className="p-5 shadow-lg border-border/60 bg-gradient-to-br from-card to-background/50 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
             <Sparkles className="text-yellow-500" size={18} />
             <h3 className="font-semibold text-sm">Quick Prompts</h3>
          </div>
          <div className="space-y-3">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(q.text)}
                className="w-full text-left p-3 rounded-xl bg-background hover:bg-muted border border-border/50 hover:border-primary/30 transition-all duration-200 group flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
                  <q.icon size={14} />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {q.text}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-lg border-border/60 bg-primary text-primary-foreground rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Plane size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold mb-2">Plan your dream trip</h3>
            <p className="text-xs opacity-90 leading-relaxed mb-4">
              I can help you build detailed itineraries, estimate budgets, and find hidden gems.
            </p>
            <div className="text-xs bg-white/20 backdrop-blur-md rounded-lg p-2 inline-block">
              ✨ Pro Tip: Be specific with dates!
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}