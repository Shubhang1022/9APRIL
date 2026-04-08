import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_KISSES = 8;

const foundMessages = [
  "Mili! 😘💋",
  "Yay! Ek aur! 💕",
  "Found it! 🥰",
  "Muah! 💋",
  "Aww! 😍",
  "Caught! 💖",
  "Heehee! 😘",
  "Last one! 🎉",
];

const FindHiddenKisses = () => {
  const positions = useMemo(
    () =>
      Array.from({ length: TOTAL_KISSES }, () => ({
        x: 8 + Math.random() * 75,
        y: 8 + Math.random() * 75,
        size: 18 + Math.random() * 12,
      })),
    []
  );

  const [found, setFound] = useState<Set<number>>(new Set());
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; msg: string }[]>([]);
  const [popupCounter, setPopupCounter] = useState(0);

  const findKiss = (idx: number) => {
    if (found.has(idx)) return;
    setFound((prev) => new Set(prev).add(idx));
    const msg = foundMessages[found.size] ?? "💋";
    setPopups((p) => [...p, { id: popupCounter, x: positions[idx].x, y: positions[idx].y, msg }]);
    setPopupCounter((c) => c + 1);
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== popupCounter)), 1000);
  };

  const allFound = found.size === TOTAL_KISSES;

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Find Hidden Kisses 💋</h3>
      <p className="text-sm text-muted-foreground font-body">
        Found: {found.size}/{TOTAL_KISSES} kisses 💋
      </p>

      <div className="relative h-64 glass-card overflow-hidden">
        {/* decorative background */}
        {["🧸", "🌸", "⭐", "🎀", "💝", "🌷", "🎵", "✨", "🦋", "🍰", "🌙", "💐"].map((e, i) => (
          <span
            key={`bg-${i}`}
            className="absolute text-lg opacity-25 select-none pointer-events-none"
            style={{ left: `${(i * 23 + 7) % 88}%`, top: `${(i * 31 + 5) % 82}%` }}
          >
            {e}
          </span>
        ))}

        {/* hidden kisses */}
        {positions.map((pos, i) => (
          <AnimatePresence key={i}>
            {!found.has(i) ? (
              <motion.button
                initial={{ opacity: 0.12 }}
                whileHover={{ opacity: 0.6, scale: 1.3 }}
                exit={{ opacity: 0, scale: 2.5 }}
                onClick={() => findKiss(i)}
                className="absolute cursor-pointer"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, fontSize: `${pos.size}px` }}
              >
                💋
              </motion.button>
            ) : (
              <motion.span
                initial={{ scale: 2.5, opacity: 1 }}
                animate={{ scale: 1, opacity: 0.8 }}
                className="absolute pointer-events-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, fontSize: `${pos.size}px` }}
              >
                💋
              </motion.span>
            )}
          </AnimatePresence>
        ))}

        {/* popup messages */}
        <AnimatePresence>
          {popups.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -40, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute pointer-events-none bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-heading text-pink-600 shadow-md"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {p.msg}
            </motion.div>
          ))}
        </AnimatePresence>

        {allFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-pink-50/80 backdrop-blur-sm"
          >
            <p className="font-heading text-lg text-primary">You found all my kisses! 😘💖</p>
          </motion.div>
        )}
      </div>

      {allFound && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-primary text-sm"
        >
          Yeh lo ek aur bonus kiss! 😘💋 Tumhare liye hi toh chhupaye the!
        </motion.p>
      )}
    </div>
  );
};

export default FindHiddenKisses;
