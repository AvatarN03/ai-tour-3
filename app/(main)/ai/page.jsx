"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MessageSquarePlus, MessageSquare, Clock, Edit2, Check, X, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { db } from "@/lib/config/firebase";
import { doc, setDoc, collection, query, where, orderBy, limit, getDocs, updateDoc, serverTimestamp, addDoc, deleteDoc } from "firebase/firestore";


import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { TripCard } from "@/components/chat/TripCard";
import { QuickPrompts } from "@/components/chat/QuickPrompts";
import { ChatInput } from "@/components/chat/ChatInput";


import { useAuth } from "@/providers/useAuth";


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
        const chatsRef = collection(db, "users", user.uid, "chats");
        const q = query(chatsRef);
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
      await updateDoc(doc(db, "users", user.uid, "chats", chatId), {
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
      await deleteDoc(doc(db, "users", user.uid, "chats", chatId));

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
          const chatRef = await addDoc(
            collection(db, "users", user.uid, "chats"),
            {
              title: text.substring(0, 40) + (text.length > 40 ? "..." : ""),
              messages: finalMessages,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              ...(tripData ? { generatedTrip: tripData } : {})
            }
          );
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
        userEmail: user?.email,
        userName: profile?.name || user?.displayName || "User",
        userSelection: {
          title: tripDetails.title || generatedTrip.destination || "AI Generated Trip",
          destination: tripDetails.destination || generatedTrip.destination,
          days: parseInt(tripDetails.duration || generatedTrip.duration) || 1,
          budget: parseFloat(tripDetails.budget || generatedTrip.total_estimated_cost) || 0,
          persons: parseInt(tripDetails.travelers) || 1,
          currency: tripDetails.currency || generatedTrip.currency || 'USD',
          interests: profile?.preferences || []
        },
        GeneratedPlan: { ...generatedTrip },
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: tripDetails.currency || generatedTrip.currency || 'USD'
      };

      await setDoc(
        doc(db, "users", user.uid, "trips", docId),
        tripData
      );

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
              className={`w-full text-left p-3 rounded-xl text-sm flex items-start gap-3 transition-all duration-200 group cursor-pointer ${currentChatId === chat.id
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

