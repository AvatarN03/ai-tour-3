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

//   // 4. Save Trip Logic (FIXED HERE)
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

//       // Structure needed for View Page:
//       // - userSelection (for edit mode)
//       // - GeneratedPlan (for view mode - needs destination at root)

//       const tripData = {
//         id: docId,
//         userId: user.uid,
//         userEmail: user.email,
//         userName: profile?.name || user.displayName,

//         // 1. Selection Data
//         userSelection: {
//           title: tripDetails.title,
//           destination: tripDetails.destination,
//           days: parseInt(tripDetails.duration),
//           budget: parseFloat(tripDetails.budget),
//           persons: parseInt(tripDetails.travelers),
//           currency: tripDetails.currency || 'USD',
//           interests: profile?.preferences || []
//         },

//         // 2. The Plan Data (FIXED: Spread tripDetails to root so Header works)
//         GeneratedPlan: {
//           ...generatedTrip,
//           destination: tripDetails.destination, // <--- Key fix: Header reads this
//           duration: tripDetails.duration,       // <--- Key fix: Header reads this
//           tripDetails: tripDetails 
//         },

//         createdAt: new Date(),
//         updatedAt: new Date(),
//         savedBy: [],
//         currency: tripDetails.currency || 'USD'
//       }

//       await setDoc(doc(db, "trips", docId), tripData)
//       toast.success("Trip Saved Successfully! 🎉")
//       router.push(`/saved/${docId}`) // Fixed route to match your file structure

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
//     // <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-background">
//       <div className="relative h-[calc(100vh-2rem)] w-full overflow-hidden flex flex-col md:flex-row gap-4 p-2 md:p-4">
//       {/* LEFT: Chat Area */}
//       <Card className="flex-1 flex flex-col h-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl relative">

//         {/* Header */}
//         <div className="p-4 md:p-6 border-b border-border/40 bg-card/80 backdrop-blur-md z-10 flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
//             <Bot size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
//               Travel Assistant
//             </h1>

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

//           {/* Generated Trip Card */}
//           {generatedTrip && (
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="flex justify-start gap-4"
//             >
//               <div className="w-8 shrink-0" />
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

//       {/* RIGHT: Quick Actions */}
//       <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
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
// import { Send, Mic, Sparkles, Map, User, Bot, Plane, MicOff, Save, Loader2, Compass } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useAuth } from '@/providers/useAuth'
// import { db } from '@/lib/config/firebase'
// import { doc, setDoc } from 'firebase/firestore'
// import { toast } from 'sonner'
// import { useRouter } from 'next/navigation'

// export default function AIAssistantPage() {
//   const { user, profile } = useAuth()
//   const router = useRouter()

//   // --- STATE (Cleared on refresh as requested) ---
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'ai',
//       content: `Hello ${profile?.name || user?.displayName || 'Traveler'}! I'm your AI travel assistant. Based on your profile, I can help you plan a trip that fits your style. Where shall we go?`,
//       timestamp: new Date().toISOString()
//     }
//   ])

//   const [inputMessage, setInputMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const [generatedTrip, setGeneratedTrip] = useState(null)
//   const [isSaving, setIsSaving] = useState(false)

//   const recognitionRef = useRef(null)
//   const scrollRef = useRef(null)

//   // --- DYNAMIC QUICK PROMPTS BASED ON PREFERENCES ---
//   const dynamicQuickPrompts = useMemo(() => {
//     const prefs = profile?.preferences || []
//     const promptLibrary = {
//       adventure: { text: 'Plan a hiking trip to the Swiss Alps', icon: Map },
//       food: { text: 'Best food tour in Tokyo for 3 days', icon: Sparkles },
//       beach: { text: 'Plan a relaxing Maldives getaway', icon: Plane },
//       culture: { text: 'Suggest a cultural tour of Rome', icon: Compass },
//       luxury: { text: 'Suggest 5-star luxury stays in Dubai', icon: Sparkles }
//     }

//     // Filter library based on user prefs or show defaults
//     const personalized = prefs
//       .map(p => promptLibrary[p.toLowerCase()])
//       .filter(Boolean)
//       .slice(0, 3)

//     return personalized.length > 0 ? personalized : [
//       { text: 'Plan a weekend trip to Paris', icon: Plane },
//       { text: 'Budget destinations in Europe', icon: Sparkles },
//       { text: 'Best time to visit Bali?', icon: Map },
//     ]
//   }, [profile?.preferences])

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages, isTyping, generatedTrip])

//   // Voice logic
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition()
//         recognition.onstart = () => setIsListening(true)
//         recognition.onend = () => setIsListening(false)
//         recognition.onresult = (e) => setInputMessage((prev) => (prev ? prev + ' ' : '') + e.results[0][0].transcript)
//         recognitionRef.current = recognition
//       }
//     }
//   }, [])

//   const handleSendMessage = async (textOverride = null) => {
//     const text = textOverride || inputMessage
//     if (!text.trim()) return

//     const userMsg = { id: Date.now(), type: 'user', content: text, timestamp: new Date().toISOString() }
//     setMessages(prev => [...prev, userMsg])
//     setInputMessage('')
//     setIsTyping(true)
//     setGeneratedTrip(null)

//     try {
//       const res = await fetch('/api/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages.slice(-5), userMsg].map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
//           userPreferences: profile?.preferences || []
//         })
//       })

//       const data = await res.json()

//       const jsonMatch = data.reply.match(/```(?:json)?\n([\s\S]*?)\n```/);
//       let cleanText = data.reply.replace(/```json\n[\s\S]*?\n```/, "").trim()

//       if (jsonMatch) {
//         try {
//           const tripData = JSON.parse(jsonMatch[1])
//           setGeneratedTrip(tripData)
//           cleanText += "\n\n✨ I've prepared your custom itinerary below!"
//         } catch (e) { console.error("Parse error", e) }
//       }

//       setMessages(prev => [...prev, {
//         id: Date.now() + 1,
//         type: 'ai',
//         content: cleanText || "I've generated a plan for you!",
//         timestamp: new Date().toISOString()
//       }])
//     } catch (err) {
//       toast.error("Assistant is busy, try again.")
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   const handleSaveTrip = async () => {
//     if (!user || !generatedTrip) return
//     setIsSaving(true)
//     try {
//       const docId = Date.now().toString()
//       const { tripDetails } = generatedTrip
//       const tripData = {
//         id: docId,
//         userId: user.uid,
//         userSelection: {
//           destination: tripDetails.destination,
//           days: tripDetails.duration,
//           budget: tripDetails.budget,
//           currency: tripDetails.currency || 'USD'
//         },
//         GeneratedPlan: { ...generatedTrip, destination: tripDetails.destination },
//         createdAt: new Date()
//       }
//       await setDoc(doc(db, "trips", docId), tripData)
//       toast.success("Trip Saved! ✈️")
//       router.push(`/trips/${docId}`)
//     } catch (e) {
//       toast.error("Save failed")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   return (
//     <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6">

//       {/* LEFT: Chat Area */}
//       <Card className="flex-1 flex flex-col h-full shadow-2xl overflow-hidden rounded-3xl bg-card/50 backdrop-blur-sm">
//         <div className="p-4 border-b flex items-center gap-4 bg-card/80">
//           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Bot size={24} /></div>

//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
//           <AnimatePresence>
//             {messages.map((m) => (
//               <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 {m.type === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0"><Sparkles size={14} /></div>}
//                 <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${m.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white dark:bg-gray-800 border'}`}>
//                   {m.content}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {isTyping && <div className="flex gap-2 ml-10"><Loader2 className="animate-spin h-4 w-4 text-primary" /> <span className="text-xs text-muted-foreground">Thinking...</span></div>}

//           {/* ALWAYS SHOW SAVE BUTTON CARD IF TRIP GENERATED */}
//           {generatedTrip && (
//             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="ml-10">
//               <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-2xl border-2 border-primary/20 max-w-sm shadow-xl">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="font-bold text-lg">{generatedTrip.tripDetails.destination}</h3>
//                     <p className="text-xs opacity-70">{generatedTrip.tripDetails.duration} Days • {generatedTrip.tripDetails.budget} {generatedTrip.tripDetails.currency}</p>
//                   </div>
//                   <div className="p-2 bg-primary/10 rounded-full text-primary"><Map size={20} /></div>
//                 </div>
//                 <Button onClick={handleSaveTrip} disabled={isSaving} className="w-full bg-primary hover:scale-[1.02] transition-transform">
//                   {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
//                   Save Trip to Dashboard
//                 </Button>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Dynamic Quick Prompts (Now inside the chat container for better UX) */}
//         <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-muted/30">
//           {dynamicQuickPrompts.map((q, i) => (
//             <button key={i} onClick={() => handleSendMessage(q.text)} className="flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-full border bg-background hover:bg-primary/5 hover:border-primary/50 text-[11px] font-medium transition-all">
//               <q.icon size={12} className="text-primary" /> {q.text}
//             </button>
//           ))}
//         </div>

//         <div className="p-4 border-t bg-card">
//           <div className="flex gap-2">
//             <button onClick={() => isListening ? recognitionRef.current.stop() : recognitionRef.current.start()} className={`p-3 rounded-full border ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-background'}`}>
//               {isListening ? <MicOff size={18} /> : <Mic size={18} />}
//             </button>
//             <input 
//               value={inputMessage} 
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Ask for a plan..."
//               className="flex-1 bg-background border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary"
//             />
//             <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim() || isTyping} className="rounded-xl"><Send size={18} /></Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }




// import { useEffect, useRef, useState, useCallback } from "react";
// import { Send, Mic, MicOff, Plane } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { ChatMessage } from "@/components/chat/ChatMessage";
// import { TypingIndicator } from "@/components/chat/TypingIndicator";
// import { TripCard } from "@/components/chat/TripCard";
// import { QuickPrompts } from "@/components/chat/QuickPrompts";
// import { getMockResponse } from "@/lib/mockAI";

// interface Message {
//   id: number;
//   type: "user" | "ai";
//   content: string;
//   timestamp: string;
// }

// const quickPrompts = [
//   { text: "Plan a weekend trip to Paris", icon: "Plane" },
//   { text: "Budget destinations in Europe", icon: "Sparkles" },
//   { text: "Best time to visit Bali?", icon: "Map" },
//   { text: "Suggest a cultural tour of Rome", icon: "Compass" },
// ];

// export default function Index() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       type: "ai",
//       content:
//         "Hello, Traveler! ✈️ I'm your AI travel assistant. Tell me where you'd like to go, and I'll craft the perfect itinerary for you.",
//       timestamp: new Date().toISOString(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [generatedTrip, setGeneratedTrip] = useState<any>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const recognitionRef = useRef<any>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
//     }
//   }, [messages, isTyping, generatedTrip]);

//   // Voice setup
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//       if (SR) {
//         const recognition = new SR();
//         recognition.continuous = false;
//         recognition.onstart = () => setIsListening(true);
//         recognition.onend = () => setIsListening(false);
//         recognition.onresult = (e: any) =>
//           setInput((prev) => (prev ? prev + " " : "") + e.results[0][0].transcript);
//         recognitionRef.current = recognition;
//       }
//     }
//   }, []);

//   const handleSend = useCallback(
//     async (textOverride?: string) => {
//       const text = textOverride || input;
//       if (!text.trim()) return;

//       setShowWelcome(false);
//       const userMsg: Message = { id: Date.now(), type: "user", content: text, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, userMsg]);
//       setInput("");
//       setIsTyping(true);
//       setGeneratedTrip(null);

//       // Simulate AI delay
//       await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

//       const response = getMockResponse(text);

//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, type: "ai", content: response.reply, timestamp: new Date().toISOString() },
//       ]);

//       if (response.trip) setGeneratedTrip(response.trip);
//       setIsTyping(false);
//     },
//     [input]
//   );

//   const handleSaveTrip = async () => {
//     setIsSaving(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     toast.success("Trip saved! ✈️ Check your dashboard.");
//     setIsSaving(false);
//   };

//   const toggleVoice = () => {
//     if (!recognitionRef.current) {
//       toast.error("Speech recognition not supported in this browser.");
//       return;
//     }
//     isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
//   };

//   return (
//     <div className="flex flex-col h-screen bg-background">
//       {/* Header */}
//       <header className="flex items-center justify-center gap-3 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
//         <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
//           <Plane className="w-4.5 h-4.5 text-primary-foreground" />
//         </div>
//         <div>
//           <h1 className="font-display text-lg font-semibold text-foreground leading-tight">TravelAI</h1>
//           <p className="text-[11px] text-muted-foreground">Your personal trip planner</p>
//         </div>
//       </header>

//       {/* Chat Area */}
//       <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
//         <div className="max-w-[800px] mx-auto px-4 py-6 space-y-5">
//           {/* Welcome hero */}
//           <AnimatePresence>
//             {showWelcome && messages.length <= 1 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="text-center py-8"
//               >
//                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//                   <Plane className="w-8 h-8 text-primary" />
//                 </div>
//                 <h2 className="font-display text-2xl font-bold text-foreground mb-2">
//                   Where to next?
//                 </h2>
//                 <p className="text-muted-foreground text-sm max-w-md mx-auto">
//                   Tell me your dream destination, budget, and travel style — I'll handle the rest.
//                 </p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {messages.map((m) => (
//             <ChatMessage key={m.id} type={m.type} content={m.content} timestamp={m.timestamp} />
//           ))}

//           <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

//           <AnimatePresence>
//             {generatedTrip && (
//               <TripCard trip={generatedTrip} onSave={handleSaveTrip} isSaving={isSaving} />
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Bottom Input Console */}
//       <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-5 px-4">
//         <div className="max-w-[800px] mx-auto space-y-3">
//           {/* Quick Prompts */}
//           <AnimatePresence>
//             {messages.length <= 2 && (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                 <QuickPrompts prompts={quickPrompts} onSelect={(t) => handleSend(t)} />
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Input */}
//           <div className="flex items-center gap-2 bg-card rounded-2xl border shadow-lg px-2 py-1.5">
//             <button
//               onClick={toggleVoice}
//               className={`p-2.5 rounded-xl transition-all ${
//                 isListening
//                   ? "bg-accent text-accent-foreground voice-pulse"
//                   : "text-muted-foreground hover:text-foreground hover:bg-muted"
//               }`}
//             >
//               {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
//             </button>

//             <input
//               ref={inputRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
//               placeholder="Ask me to plan your next adventure..."
//               className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2 px-1 font-body"
//             />

//             <Button
//               size="icon"
//               onClick={() => handleSend()}
//               disabled={!input.trim() || isTyping}
//               className="rounded-xl h-9 w-9 shrink-0"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client"; // Ensure this is at the top for Next.js App Router

// import { useEffect, useRef, useState, useCallback } from "react";
// import { Send, Mic, MicOff, Plane, Sparkles, Map, Compass } from "lucide-react"; // Added missing icons
// import { AnimatePresence, motion } from "framer-motion";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { ChatMessage } from "@/components/chat/ChatMessage";
// import { TypingIndicator } from "@/components/chat/TypingIndicator";
// import { TripCard } from "@/components/chat/TripCard";
// import { QuickPrompts } from "@/components/chat/QuickPrompts";
// import { getMockResponse } from "@/lib/mockAI";

// const quickPrompts = [
//   { text: "Plan a weekend trip to Paris", icon: "Plane" },
//   { text: "Budget destinations in Europe", icon: "Sparkles" },
//   { text: "Best time to visit Bali?", icon: "Map" },
//   { text: "Suggest a cultural tour of Rome", icon: "Compass" },
// ];

// export default function Index() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "ai",
//       content:
//         "Hello, Traveler! ✈️ I'm your AI travel assistant. Tell me where you'd like to go, and I'll craft the perfect itinerary for you.",
//       timestamp: new Date().toISOString(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [generatedTrip, setGeneratedTrip] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);

//   const scrollRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
//     }
//   }, [messages, isTyping, generatedTrip]);

//   // Voice setup
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SR) {
//         const recognition = new SR();
//         recognition.continuous = false;
//         recognition.onstart = () => setIsListening(true);
//         recognition.onend = () => setIsListening(false);
//         recognition.onresult = (e) =>
//           setInput((prev) => (prev ? prev + " " : "") + e.results[0][0].transcript);
//         recognitionRef.current = recognition;
//       }
//     }
//   }, []);

//   const handleSend = useCallback(
//     async (textOverride) => {
//       const text = textOverride || input;
//       if (!text || !text.trim()) return;

//       setShowWelcome(false);
//       const userMsg = { id: Date.now(), type: "user", content: text, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, userMsg]);
//       setInput("");
//       setIsTyping(true);
//       setGeneratedTrip(null);

//       // Simulate AI delay
//       await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

//       const response = getMockResponse(text);

//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, type: "ai", content: response.reply, timestamp: new Date().toISOString() },
//       ]);

//       if (response.trip) setGeneratedTrip(response.trip);
//       setIsTyping(false);
//     },
//     [input]
//   );

//   const handleSaveTrip = async () => {
//     setIsSaving(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     toast.success("Trip saved! ✈️ Check your dashboard.");
//     setIsSaving(false);
//   };

//   const toggleVoice = () => {
//     if (!recognitionRef.current) {
//       toast.error("Speech recognition not supported in this browser.");
//       return;
//     }
//     isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
//   };

//   return (
//     <div className="flex flex-col h-screen bg-background">
//       {/* Header */}
//       <header className="flex items-center justify-center gap-3 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
//         <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
//           <Plane className="w-4.5 h-4.5 text-primary-foreground" />
//         </div>
//         <div>
//           <h1 className="font-display text-lg font-semibold text-foreground leading-tight">TravelAI</h1>
//           <p className="text-[11px] text-muted-foreground">Your personal trip planner</p>
//         </div>
//       </header>

//       {/* Chat Area */}
//       <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
//         <div className="max-w-[800px] mx-auto px-4 py-6 space-y-5">
//           {/* Welcome hero */}
//           <AnimatePresence>
//             {showWelcome && messages.length <= 1 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="text-center py-8"
//               >
//                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//                   <Plane className="w-8 h-8 text-primary" />
//                 </div>
//                 <h2 className="font-display text-2xl font-bold text-foreground mb-2">
//                   Where to next?
//                 </h2>
//                 <p className="text-muted-foreground text-sm max-w-md mx-auto">
//                   Tell me your dream destination, budget, and travel style — I'll handle the rest.
//                 </p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {messages.map((m) => (
//             <ChatMessage key={m.id} type={m.type} content={m.content} timestamp={m.timestamp} />
//           ))}

//           <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

//           <AnimatePresence>
//             {generatedTrip && (
//               <TripCard trip={generatedTrip} onSave={handleSaveTrip} isSaving={isSaving} />
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Bottom Input Console */}
//       <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-5 px-4">
//         <div className="max-w-[800px] mx-auto space-y-3">
//           {/* Quick Prompts */}
//           <AnimatePresence>
//             {messages.length <= 2 && (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                 <QuickPrompts prompts={quickPrompts} onSelect={(t) => handleSend(t)} />
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Input */}
//           <div className="flex items-center gap-2 bg-card rounded-2xl border shadow-lg px-2 py-1.5">
//             <button
//               type="button"
//               onClick={toggleVoice}
//               className={`p-2.5 rounded-xl transition-all ${
//                 isListening
//                   ? "bg-accent text-accent-foreground voice-pulse"
//                   : "text-muted-foreground hover:text-foreground hover:bg-muted"
//               }`}
//             >
//               {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
//             </button>

//             <input
//               ref={inputRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
//               placeholder="Ask me to plan your next adventure..."
//               className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2 px-1 font-body"
//             />

//             <Button
//               size="icon"
//               onClick={() => handleSend()}
//               disabled={!input.trim() || isTyping}
//               className="rounded-xl h-9 w-9 shrink-0"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import { Plane, MessageSquarePlus, MessageSquare, Clock, Edit2, Check, X, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// UI Components
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { TripCard } from "@/components/chat/TripCard";
import { QuickPrompts } from "@/components/chat/QuickPrompts";
import { ChatInput } from "@/components/chat/ChatInput"; // New Component
import { useAuth } from "@/providers/useAuth";
import { db } from "@/lib/config/firebase";
import { doc, setDoc, collection, query, where, orderBy, limit, getDocs, updateDoc, serverTimestamp, addDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Index() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([{
    id: 1, type: "ai",
    content: "Hello, Traveler! ✈️ Where to next?",
    timestamp: new Date().toISOString()
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  
  // State for editing chat title
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatTitle, setEditingChatTitle] = useState("");
  
  const scrollRef = useRef(null);

  // Fetch recent chats
  useEffect(() => {
    const fetchRecentChats = async () => {
      if (!user) return;
      try {
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const chats = [];
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        // Sort client-side to avoid requiring a composite index in Firestore
        chats.sort((a, b) => {
          const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
          const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
          return timeB - timeA;
        });
        setRecentChats(chats.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };
    fetchRecentChats();
  }, [user, currentChatId]);

  const loadChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setGeneratedTrip(chat.generatedTrip || null);
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([{
      id: Date.now(), type: "ai",
      content: "Hello, Traveler! ✈️ Where to next?",
      timestamp: new Date().toISOString()
    }]);
    setGeneratedTrip(null);
  };

  const startEditingChat = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingChatTitle(chat.title);
  };

  const cancelEditingChat = (e) => {
    if (e) e.stopPropagation();
    setEditingChatId(null);
    setEditingChatTitle("");
  };

  const saveEditedChat = async (e, chatId) => {
    e.stopPropagation();
    if (!editingChatTitle.trim()) {
      cancelEditingChat();
      return;
    }
    
    try {
      await updateDoc(doc(db, "chats", chatId), {
        title: editingChatTitle.trim(),
        updatedAt: serverTimestamp()
      });
      
      // Update local state instantly
      setRecentChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, title: editingChatTitle.trim() } : c
      ));
      
      setEditingChatId(null);
      setEditingChatTitle("");
      toast.success("Chat renamed");
    } catch (err) {
      console.error("Error renaming chat", err);
      toast.error("Failed to rename chat");
    }
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    
    // Optional: Add simple confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    
    try {
      await deleteDoc(doc(db, "chats", chatId));
      
      // Update local state instantly
      setRecentChats(prev => prev.filter(c => c.id !== chatId));
      
      // If the currently open chat is deleted, clear the view
      if (currentChatId === chatId) {
        startNewChat();
      }
      
      toast.success("Chat deleted");
    } catch (err) {
      console.error("Error deleting chat:", err);
      toast.error("Failed to delete chat");
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, generatedTrip]);

  const parseTripFromResponse = (text) => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse AI trip JSON", e);
      }
    }
    return null;
  };

  const handleSend = async (text) => {
    if (!text?.trim()) return;

    const userMsg = { id: Date.now(), type: "user", content: text, timestamp: new Date().toISOString() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setIsTyping(true);
    setGeneratedTrip(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...currentMessages.slice(-9)].map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          userPreferences: profile?.preferences || []
        })
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      const tripData = parseTripFromResponse(data.reply);

      // Clean the AI reply so it doesn't dump raw JSON to the user
      const cleanReply = data.reply.replace(/```json\n[\s\S]*?\n```/,
        "\n\n✨ **I've generated a trip plan for you!** Click the button below to save it.");

      const aiMsg = {
        id: Date.now() + 1, type: "ai", content: cleanReply, timestamp: new Date().toISOString()
      };
      const finalMessages = [...currentMessages, aiMsg];
      setMessages(finalMessages);

      if (tripData) {
        setGeneratedTrip(tripData);
      }

      // Save chat history
      if (user) {
        if (currentChatId) {
          await updateDoc(doc(db, "chats", currentChatId), {
            messages: finalMessages,
            updatedAt: serverTimestamp(),
            ...(tripData ? { generatedTrip: tripData } : {})
          });
        } else {
          const chatRef = await addDoc(collection(db, "chats"), {
            userId: user.uid,
            title: text.substring(0, 40) + (text.length > 40 ? "..." : ""),
            messages: finalMessages,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            ...(tripData ? { generatedTrip: tripData } : {})
          });
          setCurrentChatId(chatRef.id);
        }
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 2, type: "ai", content: "Sorry, I encountered an error communicating with my servers. Please try again.", timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("You must be logged in to save trips.");
      return;
    }
    if (!generatedTrip) return;

    setIsSaving(true);
    try {
      const docId = Date.now().toString();
      const tripDetails = generatedTrip.tripDetails || {};

      const tripData = {
        id: docId,
        userId: user.uid,
        userEmail: user.email,
        userName: profile?.name || user.displayName || "User",
        userSelection: {
          title: tripDetails.title || generatedTrip.destination || "AI Generated Trip",
          destination: tripDetails.destination || generatedTrip.destination,
          days: parseInt(tripDetails.duration || generatedTrip.duration) || 1,
          budget: parseFloat(tripDetails.budget || generatedTrip.total_estimated_cost) || 0,
          persons: parseInt(tripDetails.travelers) || 1,
          currency: tripDetails.currency || generatedTrip.currency || 'USD',
          interests: profile?.preferences || []
        },
        GeneratedPlan: {
          ...generatedTrip,
          tripDetails: generatedTrip.tripDetails || {
            title: generatedTrip.destination || "AI Trip",
            destination: generatedTrip.destination,
            duration: generatedTrip.duration,
            budget: generatedTrip.total_estimated_cost,
            currency: generatedTrip.currency || 'USD',
            travelers: 2
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        savedBy: [],
        currency: tripDetails.currency || generatedTrip.currency || 'USD'
      };

      await setDoc(doc(db, "trips", docId), tripData);

      toast.success("Trip Saved Successfully! 🎉");
      router.push(`/trips/${docId}`);

    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save trip.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100lvh-130px)] bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans rounded-sm overflow-hidden">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* 2. Scrollable Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scrollbar-gradient relative z-10 w-full">
          {/* Expanded max-width for chat interface */}
          <div className="max-w-6xl mx-auto space-y-6 w-full">

            {messages.map((m) => (
              <ChatMessage key={m.id} {...m} />
            ))}

            <AnimatePresence>
              {isTyping && <TypingIndicator />}
              {generatedTrip && (
                <TripCard
                  trip={generatedTrip.tripDetails || generatedTrip}
                  onSave={handleSaveTrip}
                  isSaving={isSaving}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Refactored Input Console */}
        <footer className="p-2 md:p-4 bg-gradient-to-t from-indigo-200/80 to-transparent dark:from-gray-900/80 z-20 w-full">
          {/* Expanded max-width for input interface with spread effect */}
          <div className="w-full md:w-[85%] md:focus-within:w-full max-w-4xl focus-within:max-w-5xl transition-all duration-300 ease-in-out mx-auto drop-shadow-2xl origin-bottom">
            {messages.length <= 2 && (
              <QuickPrompts onSelect={handleSend} />
            )}
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
        </footer>
      </div>

      {/* Right Sidebar for Recent Chats */}
      <div className="w-full md:w-80 lg:w-96 border-l border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 flex-col h-full hidden md:flex backdrop-blur-md">
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <Button onClick={startNewChat} className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-none" variant="outline">
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          <div className="px-1 py-2 text-xs font-bold text-gray-500/80 uppercase tracking-wider">
            Recent Chats
          </div>
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                if (editingChatId !== chat.id) loadChat(chat);
              }}
              className={`w-full text-left p-3 rounded-xl text-sm flex items-start gap-3 transition-all duration-200 group cursor-pointer ${
                currentChatId === chat.id
                  ? "bg-white dark:bg-gray-800 shadow-md border-transparent text-foreground relative"
                  : "hover:bg-white/60 dark:hover:bg-gray-800/60 text-muted-foreground hover:text-foreground border border-transparent hover:border-gray-200 dark:hover:border-gray-700 relative"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${currentChatId === chat.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/5 group-hover:text-primary transition-colors'}`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              
              <div className="flex-1 overflow-hidden min-w-0 flex flex-col justify-center">
                {editingChatId === chat.id ? (
                  <div className="flex items-center gap-2 mt-0.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      className="flex-1 bg-background border border-input rounded-md px-2 py-1 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      value={editingChatTitle}
                      onChange={(e) => setEditingChatTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditedChat(e, chat.id);
                        if (e.key === 'Escape') cancelEditingChat(e);
                      }}
                      autoFocus
                    />
                    <button onClick={(e) => saveEditedChat(e, chat.id)} className="text-green-600 hover:text-green-700 p-1 shrink-0 bg-green-50 rounded-md">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={cancelEditingChat} className="text-red-500 hover:text-red-600 p-1 shrink-0 bg-red-50 rounded-md">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="truncate font-medium text-[13px] pr-6">{chat.title}</div>
                    <div className="text-[11px] opacity-60 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {chat.updatedAt?.toMillis ? new Date(chat.updatedAt.toMillis()).toLocaleDateString() : 'Just now'}
                    </div>
                  </>
                )}
              </div>

              {/* Action buttons (only visible on hover and not editing) */}
              {editingChatId !== chat.id && (
                <div className="absolute right-3 top-2 bottom-2 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white via-white dark:from-gray-900/50 dark:via-gray-900/50 to-transparent pl-4 pr-1">
                  <button
                    onClick={(e) => startEditingChat(chat, e)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/10 transition-all shrink-0"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => deleteChat(e, chat.id)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {recentChats.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-sm text-muted-foreground">No recent chats to display.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Start a conversation to save it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

