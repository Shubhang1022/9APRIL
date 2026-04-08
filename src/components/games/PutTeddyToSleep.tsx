import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const patMessages = [
  "Mmm... that feels nice 🥰",
  "Aur pat karo na... 🥺",
  "So cozy... 💕",
  "Tumhare haath bahut soft hain 🧸",
  "Neend aa rahi hai... 😪",
];

const PutTeddyToSleep = () => {
  const [sleepiness, setSleepiness] = useState(0);
  const [pats, setPats] = useState(0);
  const [lullaby, setLullaby] = useState(false);
  const [asleep, setAsleep] = useState(false);
  const [patMsg, setPatMsg] = useState<string | null>(null);
  const [patCounter, setPatCounter] = useState(0);

  const pat = () => {
    if (asleep) return;
    setPats((p) => p + 1);
    setSleepiness((s) => Math.min(100, s + 8));
    const msg = patMessages[Math.floor(Math.random() * patMessages.length)];
    setPatMsg(msg);
    setPatCounter((c) => c + 1);
    setTimeout(() => setPatMsg(null), 1500);
  };

  const toggleLullaby = () => {
    if (asleep) return;
    setLullaby((l) => !l);
  };

  useEffect(() => {
    if (!lullaby || asleep) return;
    const interval = setInterval(() => {
      setSleepiness((s) => Math.min(100, s + 3));
    }, 500);
    return () => clearInterval(interval);
  }, [lullaby, asleep]);

  useEffect(() => {
    if (sleepiness >= 100 && !asleep) setAsleep(true);
  }, [sleepiness, asleep]);

  const teddyEmoji = asleep ? "😴" : sleepiness > 70 ? "😪" : sleepiness > 40 ? "🥱" : "🧸";

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Put Teddy to Sleep 🌙</h3>

      {/* teddy with pat message */}
      <div className="relative flex justify-center h-28 items-center">
        <motion.div
          animate={
            asleep
              ? { y: [0, -3, 0] }
              : lullaby
              ? { rotate: [-3, 3, -3] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl cursor-pointer select-none"
          onClick={pat}
        >
          {teddyEmoji}
        </motion.div>

        <AnimatePresence>
          {patMsg && (
            <motion.div
              key={patCounter}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -50, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-body text-pink-600 shadow-md whitespace-nowrap"
            >
              {patMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {asleep && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], x: [0, 10, 20], y: [0, -10, -20] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-8 text-lg pointer-events-none"
          >
            💤
          </motion.div>
        )}
      </div>

      {!asleep && (
        <>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(280 50% 75%), hsl(260 60% 65%))" }}
              animate={{ width: `${sleepiness}%` }}
              transition={{ type: "spring", stiffness: 80 }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-body">Sleepiness: {sleepiness}%</p>

          <p className="text-sm text-muted-foreground font-body">
            {sleepiness < 30
              ? "Teddy is wide awake! Tap to pat 🤚"
              : sleepiness < 70
              ? "Teddy is getting sleepy... keep going 💤"
              : "Almost there... shhh... 🌙"}
          </p>

          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              onClick={pat}
              className="glass-card px-5 py-3 font-body text-sm"
            >
              Pat Teddy 🤚
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              onClick={toggleLullaby}
              className={`glass-card px-5 py-3 font-body text-sm transition-all ${
                lullaby ? "ring-2 ring-primary bg-primary/10" : ""
              }`}
            >
              {lullaby ? "♪ Playing..." : "Lullaby 🎵"}
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground font-body">Pats given: {pats} 💕</p>
        </>
      )}

      <AnimatePresence>
        {asleep && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-2xl"
            >
              💤 zzz...
            </motion.div>
            <p className="font-heading text-primary text-sm">
              Teddy is sleeping peacefully... 🧸💖
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Tumhare haath mein jaadu hai... bilkul tumhare pyaar ki tarah 💕
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PutTeddyToSleep;
