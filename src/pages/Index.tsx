import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import TeddyBear from "@/components/TeddyBear";

// 🔑 Change this to whatever secret word you want
const SECRET = "iloveyou";

const Landing = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const tryEnter = () => {
    if (input.trim().toLowerCase() === SECRET.toLowerCase()) {
      setUnlocked(true);
      setTimeout(() => navigate("/home"), 1200);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen gradient-bg flex flex-col items-center justify-center overflow-hidden px-4">
      <FloatingHearts />
      <Sparkles />

      {/* teddy */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        className="relative mb-6"
      >
        <TeddyBear size={100} />
        <motion.span
          className="absolute -top-2 -right-2 text-4xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💖
        </motion.span>
      </motion.div>

      {/* heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="font-heading text-2xl sm:text-4xl text-center text-foreground glow-text leading-relaxed max-w-2xl mb-3"
      >
        This isn't just a website…
        <br />
        it's something I made for you 💖
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-muted-foreground text-sm sm:text-base mb-8 text-center font-body"
      >
        Enter the secret word to unlock your world 🔐
      </motion.p>

      {/* password box */}
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-4 w-full max-w-xs"
          >
            <motion.div
              animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tryEnter()}
                placeholder="Type the secret word... 🤫"
                className={`w-full text-center bg-white/70 backdrop-blur-sm rounded-full px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all shadow-md ${
                  error
                    ? "ring-2 ring-red-400 bg-red-50/70"
                    : "focus:ring-primary/50"
                }`}
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-body text-red-400"
                >
                  Nahi pata? Thoda sochoo 🥺
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={tryEnter}
              className="glow-button text-base w-full"
            >
              Enter Your World ✨
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: 3 }}
              className="text-6xl block"
            >
              💖
            </motion.span>
            <p className="font-heading text-primary text-lg">Welcome home, baby 🧸</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
