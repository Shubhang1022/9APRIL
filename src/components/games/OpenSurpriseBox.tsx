import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const surprises = [
  { emoji: "💖", message: "Tum meri life ki sabse best cheez ho! Seriously 💖" },
  { emoji: "🧸", message: "Abhi tumhe hug karna chahta hoon... aa jao na 🧸🥺" },
  { emoji: "🌹", message: "Har gulab mujhe tumhari yaad dilata hai 🌹" },
  { emoji: "💎", message: "Tum kisi diamond se zyada precious ho mere liye 💎" },
  { emoji: "🎵", message: "Mera favorite song sunke tumhara chehra yaad aata hai 🎵" },
  { emoji: "☀️", message: "Tumhara ek message mera poora din bana deta hai ☀️" },
  { emoji: "🦋", message: "Tumse baat karte waqt butterflies aate hain aaj bhi 🦋" },
  { emoji: "🍫", message: "Tumhare saath life chocolate se bhi zyada sweet hai 🍫" },
  { emoji: "🌙", message: "Raat ko neend aane se pehle tumhara hi khayal aata hai 🌙" },
  { emoji: "💌", message: "Agar main letters likhta toh sirf tumhare liye likhta 💌" },
];

const OpenSurpriseBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<(typeof surprises)[0] | null>(null);
  const [count, setCount] = useState(0);
  const [shaking, setShaking] = useState(false);

  const shakeBox = () => {
    if (isOpen) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const openBox = () => {
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    setCurrent(randomSurprise);
    setIsOpen(true);
    setCount((c) => c + 1);
  };

  const closeBox = () => {
    setIsOpen(false);
    setCurrent(null);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Open Surprise Box 🎁</h3>
      <p className="text-sm text-muted-foreground font-body">
        Tap the gift to get a surprise! ({count} opened)
      </p>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div key="box" className="flex flex-col items-center gap-3">
            <motion.button
              animate={
                shaking
                  ? { rotate: [-8, 8, -8, 8, 0], scale: [1, 1.1, 1] }
                  : { rotate: [0, -2, 2, 0], scale: [1, 1.03, 1] }
              }
              transition={{ duration: shaking ? 0.5 : 2, repeat: shaking ? 0 : Infinity }}
              whileTap={{ scale: 0.9 }}
              onClick={openBox}
              onMouseEnter={shakeBox}
              className="text-8xl cursor-pointer block"
            >
              🎁
            </motion.button>
            <p className="text-xs text-muted-foreground font-body">Hover to shake, tap to open!</p>
          </motion.div>
        ) : (
          <motion.div
            key="surprise"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="glass-card p-6 space-y-4"
          >
            {/* sparkle burst */}
            <div className="relative flex justify-center">
              {["✨", "💫", "⭐", "✨"].map((s, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
                    y: [0, -30 - i * 5],
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="absolute text-lg pointer-events-none"
                >
                  {s}
                </motion.span>
              ))}
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-6xl"
              >
                {current?.emoji}
              </motion.span>
            </div>

            <p className="font-body text-foreground text-sm leading-relaxed">{current?.message}</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeBox}
              className="glow-button !px-5 !py-2 text-sm"
            >
              Open another! 🎁
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {count >= 5 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-heading text-primary text-sm">
          Sabse bada surprise toh yeh hai ki main tumse kitna pyaar karta hoon 💖
        </motion.p>
      )}
    </div>
  );
};

export default OpenSurpriseBox;
