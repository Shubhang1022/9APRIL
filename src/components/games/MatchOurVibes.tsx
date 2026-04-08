import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const symbols = ["💖", "🧸", "🌹", "💋", "🦋", "💎"];

const matchMessages = [
  "Perfect match! Bilkul humari tarah! 💕",
  "Yay! Ek aur match! 🥰",
  "Wah! Tumhe toh sab pata hai! 💖",
  "Match! Jaise hum dono! 🧸",
  "Aww! So cute! 💋",
  "Last pair! You're amazing! 🌹",
];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

const MatchOurVibes = () => {
  const initialCards = useMemo(() => {
    const pairs = [...symbols, ...symbols];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    return shuffled.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }));
  }, []);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [checking, setChecking] = useState(false);
  const [matchMsg, setMatchMsg] = useState<string | null>(null);
  const [matchCount, setMatchCount] = useState(0);

  const matched = cards.filter((c) => c.matched).length;
  const allMatched = matched === cards.length;

  const flipCard = useCallback(
    (idx: number) => {
      if (checking || cards[idx].flipped || cards[idx].matched || selected.length >= 2) return;

      const newCards = [...cards];
      newCards[idx] = { ...newCards[idx], flipped: true };
      setCards(newCards);

      const newSelected = [...selected, idx];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        setChecking(true);
        const [a, b] = newSelected;

        if (newCards[a].symbol === newCards[b].symbol) {
          const msg = matchMessages[matchCount % matchMessages.length];
          setMatchMsg(msg);
          setMatchCount((c) => c + 1);
          setTimeout(() => setMatchMsg(null), 1800);
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
            );
            setSelected([]);
            setChecking(false);
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c))
            );
            setSelected([]);
            setChecking(false);
          }, 800);
        }
      }
    },
    [cards, selected, checking, matchCount]
  );

  const restart = () => {
    const pairs = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(pairs.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false })));
    setSelected([]);
    setMoves(0);
    setChecking(false);
    setMatchCount(0);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Match Our Vibes 💕</h3>
      <p className="text-sm text-muted-foreground font-body">
        Moves: {moves} | Matched: {matched / 2}/{symbols.length} pairs
      </p>

      {/* match feedback */}
      <AnimatePresence>
        {matchMsg && (
          <motion.div
            key={matchMsg + matchCount}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card px-4 py-2 text-sm font-heading text-primary"
          >
            {matchMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            whileHover={!card.matched && !card.flipped ? { scale: 1.08 } : {}}
            whileTap={{ scale: 0.9 }}
            onClick={() => flipCard(i)}
            className={`aspect-square glass-card flex items-center justify-center text-2xl cursor-pointer transition-all ${
              card.matched ? "bg-primary/15 ring-2 ring-primary/50 scale-95" : ""
            }`}
          >
            <motion.span
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
              transition={{ duration: 0.35 }}
              style={{ display: "inline-block", backfaceVisibility: "hidden" }}
            >
              {card.flipped || card.matched ? card.symbol : "🧸"}
            </motion.span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <p className="font-heading text-primary">
              Perfect match! Bilkul humari tarah! 💖
            </p>
            <p className="text-sm text-muted-foreground font-body">
              {moves} moves mein complete! {moves <= 10 ? "Genius ho tum! 🌟" : "Well done! 💕"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restart}
              className="glass-card px-5 py-2 text-sm font-body text-muted-foreground"
            >
              Play Again 🔄
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchOurVibes;
