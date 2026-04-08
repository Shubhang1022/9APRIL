import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letters = [
  {
    color: "from-pink-200 to-rose-300",
    sealColor: "bg-rose-400",
    message: "Tum mera dil dhak dhak karti ho har roz 💓\nYeh feeling kabhi khatam nahi hogi.",
    surprise: "💖",
    from: "Tumhara Shubh 🧸",
  },
  {
    color: "from-purple-200 to-violet-300",
    sealColor: "bg-violet-400",
    message: "Subah uthke pehla khayal tumhara hota hai ☀️\nAur raat ko neend aane se pehle bhi.",
    surprise: "🌹",
    from: "Always yours 💕",
  },
  {
    color: "from-amber-200 to-orange-300",
    sealColor: "bg-orange-400",
    message: "Tumhara 'hello' mera favorite word hai 🥺\nAur tumhara 'bye' sabse mushkil.",
    surprise: "💌",
    from: "Miss you always 🌙",
  },
  {
    color: "from-blue-200 to-indigo-300",
    sealColor: "bg-indigo-400",
    message: "Har love song mujhe tumhari yaad dilata hai 🎵\nShayad tum hi meri favorite song ho.",
    surprise: "🎶",
    from: "Dil se, Shubh 💙",
  },
  {
    color: "from-emerald-200 to-green-300",
    sealColor: "bg-emerald-400",
    message: "Tumhare saath 'forever' believe karna easy hai ✨\nKyunki tum ho toh sab possible lagta hai.",
    surprise: "💍",
    from: "Forever wala pyaar 💚",
  },
  {
    color: "from-rose-200 to-pink-300",
    sealColor: "bg-pink-500",
    message: "Mera dil tumhara hai, hamesha ke liye 🧸\nYeh promise hai, wada hai, sach hai.",
    surprise: "❤️‍🔥",
    from: "Tumhara hi, Shubh 💖",
  },
];

const OpenLoveLetters = () => {
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const openLetter = (idx: number) => {
    setOpened((prev) => new Set(prev).add(idx));
    setActiveIdx(idx);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Open My Love Letters 💌</h3>
      <p className="text-sm text-muted-foreground font-body">
        Tap each envelope 💌 {opened.size}/{letters.length} opened
      </p>

      <div className="grid grid-cols-3 gap-3">
        {letters.map((letter, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => openLetter(i)}
            className={`relative glass-card p-4 flex flex-col items-center gap-2 cursor-pointer overflow-hidden bg-gradient-to-br ${letter.color}`}
          >
            {/* seal */}
            {!opened.has(i) && (
              <div className={`absolute top-1 right-1 w-4 h-4 rounded-full ${letter.sealColor} opacity-80`} />
            )}
            <motion.span
              className="text-3xl"
              animate={opened.has(i) ? { rotateY: [0, 90, 0] } : {}}
              transition={{ duration: 0.6 }}
            >
              {opened.has(i) ? letter.surprise : "✉️"}
            </motion.span>
            <span className="text-xs text-pink-700 font-body font-semibold">
              {opened.has(i) ? "Read ✓" : `Letter ${i + 1}`}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeIdx !== null && (
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`glass-card p-5 mt-2 bg-gradient-to-br ${letters[activeIdx].color} border-0`}
          >
            <p className="text-3xl mb-3">{letters[activeIdx].surprise}</p>
            <p className="font-body text-pink-800 text-sm leading-relaxed whitespace-pre-line">
              {letters[activeIdx].message}
            </p>
            <p className="text-xs text-pink-600 mt-3 font-heading italic">— {letters[activeIdx].from}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {opened.size === letters.length && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-primary text-sm"
        >
          Tumne saare letters padh liye! Har ek word sach hai 💕🧸
        </motion.p>
      )}
    </div>
  );
};

export default OpenLoveLetters;
