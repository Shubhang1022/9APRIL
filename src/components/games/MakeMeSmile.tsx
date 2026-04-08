import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const actions = [
  { emoji: "🤗", label: "Hug", effect: 20, response: "Aww, that hug was so warm! Ruk jaao na 🥰" },
  { emoji: "😘", label: "Kiss", effect: 25, response: "Yeh kiss toh dil mein utar gayi! 💋💖" },
  { emoji: "🎵", label: "Sing", effect: 15, response: "Tumhari awaaz sunke dil khush ho gaya! 🎶" },
  { emoji: "🍫", label: "Chocolate", effect: 18, response: "Mmm chocolate! Tumse zyada sweet nahi kuch 🍫" },
  { emoji: "💌", label: "Love Note", effect: 22, response: "Yeh note toh frame karni chahiye! 💖📝" },
  { emoji: "🧸", label: "Teddy", effect: 30, response: "TEDDY!! Mera sabse favorite gift!! 🧸💕" },
];

const faces = ["😢", "😟", "😕", "🙂", "😊", "🥰"];
const faceMessages = [
  "Bahut udaas hoon... kuch karo na 🥺",
  "Thoda better... par aur chahiye 😟",
  "Theek hoon... par tumse milna chahta hoon 😕",
  "Smile aa rahi hai! Keep going! 🙂",
  "Khush hoon! Tumhari wajah se! 😊",
  "ITNA KHUSH HOON!! Tum ho toh sab theek hai! 🥰💖",
];

const MakeMeSmile = () => {
  const [happiness, setHappiness] = useState(0);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [particleCounter, setParticleCounter] = useState(0);

  const faceIdx = Math.min(Math.floor((happiness / 100) * faces.length), faces.length - 1);

  const doAction = (action: (typeof actions)[0]) => {
    setHappiness((h) => Math.min(100, h + action.effect));
    setLastResponse(action.response);
    // spawn floating particles
    const newParticles = Array.from({ length: 4 }, (_, i) => ({
      id: particleCounter + i,
      emoji: action.emoji,
      x: 30 + Math.random() * 40,
    }));
    setParticles((p) => [...p, ...newParticles]);
    setParticleCounter((c) => c + 4);
    setTimeout(() => setParticles((p) => p.filter((x) => !newParticles.find((n) => n.id === x.id))), 1200);
    setTimeout(() => setLastResponse(null), 3000);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Make Me Smile 😊</h3>

      {/* face with particles */}
      <div className="relative flex justify-center h-24 items-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl"
        >
          {faces[faceIdx]}
        </motion.div>
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, y: 0, x: `${p.x}%`, scale: 1 }}
              animate={{ opacity: 0, y: -70, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute text-2xl pointer-events-none"
              style={{ left: `${p.x}%`, bottom: 0 }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* bar */}
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(346 100% 65%), hsl(280 50% 75%))" }}
          animate={{ width: `${happiness}%` }}
          transition={{ type: "spring", stiffness: 80 }}
        />
      </div>
      <p className="text-sm text-muted-foreground font-body">{faceMessages[faceIdx]}</p>

      {/* response bubble */}
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            key={lastResponse}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-3 text-sm font-body text-foreground"
          >
            {lastResponse}
          </motion.div>
        )}
      </AnimatePresence>

      {/* action buttons */}
      <div className="grid grid-cols-3 gap-2">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => doAction(action)}
            className="glass-card p-3 flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-2xl">{action.emoji}</span>
            <span className="text-xs text-muted-foreground font-body">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {happiness >= 100 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-primary text-sm"
        >
          Tumne mujhe itna khush kar diya! I love you so much! 🥰💖
        </motion.p>
      )}
    </div>
  );
};

export default MakeMeSmile;
