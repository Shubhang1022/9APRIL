import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeddyBear from "@/components/TeddyBear";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const CALL_MESSAGES = [
  "Bas check kar raha tha… miss toh nahi kar rahi mujhe? 🥺",
  "Arey yaar, tumhari awaaz sunni thi bas... that's it 💖",
  "Suno na... I love you. Abhi bhi. Hamesha. 💕",
  "Tum kya kar rahi ho? Main toh bas tumhare baare mein soch raha tha ❤️",
];

const FakeCall = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<"ringing" | "connected" | "ended">("ringing");
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fallbackSpeak = (text: string) => {
    const cleaned = text.replace(/[❤️💖💕🥺😘😔🤔👂🎤💗✨🔊]/gu, "");
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const playVoice = async (text: string) => {
    setIsPlaying(true);
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
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch {
      console.warn("ElevenLabs TTS failed, using browser fallback");
      fallbackSpeak(text);
    }
  };

  const handleAccept = async () => {
    const msg = CALL_MESSAGES[Math.floor(Math.random() * CALL_MESSAGES.length)];
    setMessage(msg);
    setState("connected");
    await playVoice(msg);
  };

  const handleEnd = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setState("ended");
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center relative overflow-hidden px-4">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 text-foreground hover:text-primary transition-colors z-10"
      >
        <ArrowLeft size={24} />
      </button>

      <AnimatePresence mode="wait">
        {state === "ringing" && (
          <motion.div
            key="ringing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TeddyBear size={100} />
            </motion.div>

            <div>
              <h2 className="font-heading text-2xl text-foreground">Shubh ❤️</h2>
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground font-body mt-1"
              >
                Calling...
              </motion.p>
            </div>

            <div className="flex gap-8 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setState("ended")}
                className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
              >
                <PhoneOff className="text-destructive-foreground" size={28} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAccept}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-pulse-glow"
              >
                <Phone className="text-primary-foreground" size={28} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {state === "connected" && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <TeddyBear size={80} />
            <div className="glass-card p-6 max-w-sm">
              <p className="font-body text-foreground text-lg leading-relaxed">
                "{message}"
              </p>
            </div>
            {isPlaying && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground text-sm font-body"
              >
                🔊 Playing voice...
              </motion.p>
            )}
            <button
              onClick={handleEnd}
              className="mt-4 w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
            >
              <PhoneOff className="text-destructive-foreground" size={28} />
            </button>
          </motion.div>
        )}

        {state === "ended" && (
          <motion.div
            key="ended"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <span className="text-5xl">📱</span>
            <p className="font-heading text-xl text-foreground">Call Ended</p>
            <p className="text-muted-foreground font-body text-sm">Miss toh karti hogi... 🥺</p>
            <button onClick={() => setState("ringing")} className="glow-button text-sm mt-4">
              Call Again 📞
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FakeCall;
