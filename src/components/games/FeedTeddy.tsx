import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const goodItems = [
  { emoji: "🍰", name: "Cake", points: 15, msg: "Yummy! Teddy loves cake! 🍰" },
  { emoji: "🍫", name: "Choco", points: 20, msg: "Chocolate!! Teddy's fav! 🍫💕" },
  { emoji: "🍪", name: "Cookie", points: 10, msg: "Crunchy cookie! So good! 🍪" },
  { emoji: "🍓", name: "Berry", points: 12, msg: "Sweet strawberry! 🍓🥰" },
  { emoji: "🧁", name: "Cupcake", points: 18, msg: "Cupcake! Teddy is blushing! 🧁" },
  { emoji: "🍩", name: "Donut", points: 14, msg: "Donut make me stop eating! 🍩" },
];

const badItems = [
  { emoji: "🌶️", name: "Chili", points: -20, msg: "TOO SPICY!! 🌶️😭 Why?!" },
  { emoji: "🧅", name: "Onion", points: -15, msg: "Eww onion! Teddy is crying! 🧅😢" },
  { emoji: "🥦", name: "Broccoli", points: -10, msg: "Nooo not broccoli!! 🥦😤" },
];

const teddyFaces = ["😭", "😢", "😟", "🙂", "😊", "🥰"];
const teddyMessages = [
  "Teddy is very sad... please feed something sweet! 🥺",
  "Hmm... not great... try something yummy 😟",
  "Teddy is okay I guess... 😐",
  "Ooh that was nice! More please! 🙂",
  "Teddy is happy and full! 😊💕",
  "TEDDY LOVES YOU SO MUCH!! 🥰💖🧸",
];

const FeedTeddy = () => {
  const allItems = useMemo(() => [...goodItems, ...badItems].sort(() => Math.random() - 0.5), []);
  const [happiness, setHappiness] = useState(40);
  const [floatingEmoji, setFloatingEmoji] = useState<{ emoji: string; id: number } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [bounce, setBounce] = useState(false);
  const [emojiCounter, setEmojiCounter] = useState(0);

  const faceIdx = Math.min(Math.floor((happiness / 100) * teddyFaces.length), teddyFaces.length - 1);

  const feed = (item: (typeof allItems)[0]) => {
    setHappiness((h) => Math.max(0, Math.min(100, h + item.points)));
    setFloatingEmoji({ emoji: item.emoji, id: emojiCounter });
    setEmojiCounter((c) => c + 1);
    setFeedbackMsg(item.msg);
    setBounce(true);
    setTimeout(() => setBounce(false), 500);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Feed The Teddy 🧸</h3>

      {/* teddy */}
      <div className="relative flex justify-center">
        <motion.div
          animate={bounce ? { scale: [1, 1.25, 0.95, 1.1, 1], rotate: [0, -8, 8, -4, 0] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl cursor-pointer"
        >
          🧸
        </motion.div>
        <AnimatePresence>
          {floatingEmoji && (
            <motion.span
              key={floatingEmoji.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              animate={{ opacity: 0, y: -60, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute text-3xl pointer-events-none"
              style={{ top: "-10px" }}
            >
              {floatingEmoji.emoji}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="text-4xl">{teddyFaces[faceIdx]}</div>

      {/* happiness bar */}
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(346 100% 65%), hsl(280 50% 75%))" }}
          animate={{ width: `${happiness}%` }}
          transition={{ type: "spring", stiffness: 80 }}
        />
      </div>
      <p className="text-xs text-muted-foreground font-body">Happiness: {happiness}%</p>

      {/* feedback message */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            key={feedbackMsg}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card px-4 py-2 text-sm font-body text-foreground"
          >
            {feedbackMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-muted-foreground font-body">{teddyMessages[faceIdx]}</p>

      {/* food grid */}
      <div className="grid grid-cols-3 gap-2">
        {allItems.map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => feed(item)}
            className="glass-card p-3 flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-xs text-muted-foreground font-body">{item.name}</span>
          </motion.button>
        ))}
      </div>

      {happiness >= 90 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-primary text-sm"
        >
          Teddy is so full of love! Just like me for you 💖
        </motion.p>
      )}
    </div>
  );
};

export default FeedTeddy;
