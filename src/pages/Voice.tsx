import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, MicOff, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeddyBear from "@/components/TeddyBear";
import Sparkles from "@/components/Sparkles";
import { streamChat } from "@/lib/chat-stream";

type VoiceState = "idle" | "listening" | "thinking" | "speaking";

const stateLabels: Record<VoiceState, string> = {
  idle: "Tap and talk to me 🎤",
  listening: "Hmm… sun raha hoon 👂",
  thinking: "Soch raha hoon... 🤔",
  speaking: "Bol raha hoon... 💕",
};

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const Voice = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fallbackSpeak = useCallback((text: string) => {
    const cleaned = text.replace(/[❤️💖💕🥺😘😔🤔👂🎤💗✨🔊]/gu, "");
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    window.speechSynthesis.speak(utterance);
  }, []);

  const playTTS = useCallback(async (text: string) => {
    setState("speaking");
    setReply(text);
    try {
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || contentType.includes("application/json")) {
        throw new Error("TTS failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setState("idle");
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch {
      console.warn("ElevenLabs TTS failed, using browser fallback");
      fallbackSpeak(text);
    }
  }, [fallbackSpeak]);

  const getAIReply = useCallback(async (userText: string) => {
    setState("thinking");
    let fullReply = "";
    await streamChat({
      messages: [{ role: "user", content: userText }],
      onDelta: (text) => { fullReply += text; },
      onDone: async () => {
        if (fullReply) {
          await playTTS(fullReply);
        } else {
          setState("idle");
        }
      },
      onError: () => {
        setReply("Kuch gadbad ho gayi... phir try karo 🥺");
        setState("idle");
      },
    });
  }, [playTTS]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setReply("Speech recognition not supported in this browser 😔");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const result = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(result);
    };

    recognition.onend = () => {
      const finalTranscript = transcript;
      if (finalTranscript.trim()) {
        getAIReply(finalTranscript);
      } else {
        setState("idle");
      }
    };

    recognition.onerror = () => {
      setState("idle");
    };

    setState("listening");
    setTranscript("");
    setReply("");
    recognition.start();
  }, [getAIReply, transcript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const handleMicClick = () => {
    if (state === "idle") {
      startListening();
    } else if (state === "listening") {
      stopListening();
    } else if (state === "speaking") {
      audioRef.current?.pause();
      setState("idle");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center relative overflow-hidden">
      <Sparkles />

      <div className="w-full p-4 flex items-center gap-3 relative z-10">
        <button onClick={() => navigate("/home")} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-heading text-xl text-foreground">Talk to Me 🎙</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10 px-4">
        <TeddyBear size={80} />

        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-heading text-xl text-foreground text-center"
          >
            {stateLabels[state]}
          </motion.p>
        </AnimatePresence>

        {transcript && state === "listening" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-3 max-w-xs text-center"
          >
            <p className="font-body text-sm text-foreground">{transcript}</p>
          </motion.div>
        )}

        {reply && (state === "speaking" || state === "idle") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 max-w-sm text-center"
          >
            <p className="font-body text-foreground leading-relaxed">{reply}</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMicClick}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
            state === "listening"
              ? "bg-primary animate-pulse-glow"
              : state === "thinking"
              ? "bg-accent animate-pulse-glow"
              : state === "speaking"
              ? "bg-accent"
              : "bg-primary"
          }`}
        >
          {state === "listening" ? (
            <Square size={36} className="text-primary-foreground" />
          ) : state === "speaking" ? (
            <MicOff size={36} className="text-primary-foreground" />
          ) : (
            <Mic size={36} className="text-primary-foreground" />
          )}

          {(state === "listening" || state === "speaking") && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </motion.button>

        <p className="text-muted-foreground text-sm font-body text-center max-w-xs">
          {state === "idle" && "Press the mic and say something... I'm always here for you 💖"}
          {state === "listening" && "Keep talking, I'm listening... tap to stop"}
          {state === "thinking" && "Let me think of something nice..."}
          {state === "speaking" && "🔊 Playing voice... tap to stop"}
        </p>
      </div>
    </div>
  );
};

export default Voice;
