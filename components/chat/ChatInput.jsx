import { useState, useEffect, useRef } from "react";
import { Mic, Send, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

export const ChatInput = ({ onSend, disabled }) => {
  const [val, setVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const valRef = useRef("");
  const isListeningRef = useRef(false);
  const startTimeRef = useRef(null);      // ← when the session began
  const LISTEN_TIMEOUT_MS = 10_000;       // ← 10 seconds
  const textareaRef = useRef(null);

  valRef.current = val;

  const handleChange = (e) => {
    setVal(e.target.value);
    finalTranscriptRef.current = e.target.value;
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    startTimeRef.current = null;
    setIsListening(false);
    try { recognitionRef.current?.stop(); } catch (_) {}
  };

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;   // avoid Chrome's continuous network bug
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        finalTranscriptRef.current +=
          (finalTranscriptRef.current ? " " : "") + final;
      }
      setVal((finalTranscriptRef.current + (interim ? " " + interim : "")).trim());
    };

    rec.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      // Record start time only on the very first start, not restarts
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
    };

    rec.onend = () => {
      if (!isListeningRef.current) {
        setIsListening(false);
        return;
      }

      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());

      if (elapsed < LISTEN_TIMEOUT_MS) {
        // ✅ Still within the 10s window — restart seamlessly
        try { rec.start(); } catch (_) {
          setIsListening(false);
          isListeningRef.current = false;
          startTimeRef.current = null;
        }
      } else {
        // ✅ 10 seconds elapsed — auto-stop
        setIsListening(false);
        isListeningRef.current = false;
        startTimeRef.current = null;
      }
    };

    rec.onerror = (e) => {
      console.error("Speech error:", e.error);
      if (e.error === "no-speech" || e.error === "network") {
        // These are recoverable — onend will handle the restart logic
        return;
      }
      // Non-recoverable errors (e.g. not-allowed, aborted)
      setIsListening(false);
      isListeningRef.current = false;
      startTimeRef.current = null;
    };

    recognitionRef.current = rec;

    return () => {
      isListeningRef.current = false;
      rec.onresult = null;
      rec.onstart = null;
      rec.onend = null;
      rec.onerror = null;
      try { rec.abort(); } catch (_) {}
    };
  }, []);

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      finalTranscriptRef.current = valRef.current;
      startTimeRef.current = null; // reset so onstart sets a fresh timestamp
      isListeningRef.current = true;
      try { recognitionRef.current?.start(); } catch (e) {
        console.error("Speech recognition start error:", e);
      }
    }
  };

  const submit = () => {
    if (!val.trim()) return;
    stopListening();
    onSend(val);
    setVal("");
    finalTranscriptRef.current = "";
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-2 py-2 rounded-full border border-purple-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-purple-400/30 transition-all">
      <Button
        onClick={toggleListen}
        variant="ghost"
        size="icon"
        className={`rounded-full bg-purple-500 hover:bg-gray-100/50 w-11 h-11 shrink-0 transition-all ${
          isListening
            ? "text-red-500 bg-red-100/80 animate-pulse shadow-inner"
            : "text-gray-200 hover:text-purple-600"
        }`}
        type="button"
      >
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </Button>

      <Textarea
        ref={textareaRef}
        value={val}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={
          isListening ? "Listening... (Speak now)" : "Ask me to plan your next adventure..."
        }
        className="flex-1 resize-none dark:bg-gray-100 border-none focus:outline-none focus:ring-0 text-[15.5px] placeholder:text-gray-400 py-2.5 text-gray-800 font-medium overflow-hidden"
        disabled={disabled}
      />

      <Button
        onClick={submit}
        size="icon"
        disabled={!val.trim() || disabled}
        className="rounded-full bg-gradient-to-r flex justify-center items-center from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-md w-11 h-11 shrink-0 transition-all disabled:opacity-50 transform hover:scale-105"
        type="button"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};