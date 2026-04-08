import { useState } from "react";
import { motion } from "framer-motion";

const stickers = ["💖", "✨", "🌹", "🦋", "💎", "🎀", "⭐", "🧸", "🌸", "💗", "🎵", "🍰"];

interface Placed {
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

const DecorateOurLove = () => {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [selected, setSelected] = useState("💖");

  const placeSticker = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setPlaced((prev) => [
      ...prev,
      { emoji: selected, x, y, rotation: Math.random() * 40 - 20, scale: 0.8 + Math.random() * 0.5 },
    ]);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Decorate Our Love 💝</h3>
      <p className="text-sm text-muted-foreground font-body">Pick a sticker, then tap the heart!</p>

      <div className="flex flex-wrap justify-center gap-2">
        {stickers.map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.85 }}
            onClick={() => setSelected(s)}
            className={`text-2xl p-1 rounded-xl transition-all ${
              selected === s ? "bg-primary/20 ring-2 ring-primary scale-110" : "hover:bg-secondary"
            }`}
          >
            {s}
          </motion.button>
        ))}
      </div>

      <div
        className="relative mx-auto w-64 h-64 cursor-pointer"
        onClick={placeSticker}
        onTouchStart={placeSticker}
      >
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 select-none">
          ❤️
        </div>

        {placed.map((p, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: p.scale, opacity: 1 }}
            className="absolute text-xl pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlaced([])}
          className="glass-card px-4 py-2 text-sm font-body text-muted-foreground"
        >
          Clear ✨
        </motion.button>
      </div>

      {placed.length >= 10 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-heading text-primary text-sm">
          So pretty! Our love is the most beautiful thing 💕
        </motion.p>
      )}
    </div>
  );
};

export default DecorateOurLove;
