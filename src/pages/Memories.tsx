import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sparkles from "@/components/Sparkles";

// 👇 Add your photo paths here — put images in public/memories/
const memories = [
  { id: 1, quote: "Yeh wali smile meri weakness hai ❤️", feeling: "I felt like the luckiest person alive looking at you.", emoji: "📸", image: "/memories/memory1.jpg" },
  { id: 2, quote: "Tum ho toh sab better lagta hai", feeling: "That day, everything felt perfect because you were there.", emoji: "🌅", image: "/memories/memory2.jpg" },
  { id: 3, quote: "I wish I could freeze this moment", feeling: "I never wanted that moment to end.", emoji: "⏳", image: "/memories/memory3.jpg" },
  { id: 4, quote: "Tumhari hasi sunke sara stress chala jaata hai", feeling: "Your laugh literally heals me.", emoji: "😊", image: "/memories/memory4.jpg" },
  { id: 5, quote: "Yeh din bohot special tha mere liye", feeling: "I replay this memory in my head all the time.", emoji: "💫", image: "/memories/memory5.jpg" },
  { id: 6, quote: "Tum mere liye duniya ho", feeling: "You are my everything, and this picture proves it.", emoji: "🌍", image: "/memories/memory6.jpg" },
];

const Memories = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<typeof memories[0] | null>(null);
  const [showFeeling, setShowFeeling] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden px-4 py-6">
      <Sparkles />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <button onClick={() => navigate("/home")} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-heading text-2xl text-foreground">Our Story 🌌</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto relative z-10">
        {memories.map((mem, i) => (
          <motion.button
            key={mem.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15, type: "spring" }}
            whileHover={{ scale: 1.06, rotate: i % 2 === 0 ? 2 : -2 }}
            onClick={() => { setSelected(mem); setShowFeeling(false); }}
            className="glass-card-hover aspect-square flex flex-col overflow-hidden p-0 relative"
          >
            {/* photo */}
            <div className="w-full flex-1 overflow-hidden">
              <img
                src={mem.image}
                alt={mem.quote}
                className="w-full h-full object-contain object-center "
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                }}
              />
              {/* fallback emoji if no image */}
              <div className="hidden absolute inset-0 flex items-center justify-center text-5xl bg-secondary/50">
                {mem.emoji}
              </div>
            </div>
            {/* caption strip */}
            <div className="w-full bg-white/80 backdrop-blur-sm px-2 py-1.5">
              <p className="text-[10px] font-body text-pink-600 text-center line-clamp-2 leading-tight">{mem.quote}</p>
            </div>
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: memories.length * 0.15, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowFinal(true)}
          className="glass-card-hover aspect-square flex flex-col items-center justify-center gap-2 p-4 border-2 border-primary/30"
        >
          <span className="text-4xl">💖</span>
          <span className="text-xs font-heading text-primary">Final Memory</span>
        </motion.button>
      </div>

      {/* Memory Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-5 max-w-sm w-full space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-4xl">{selected.emoji}</span>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* photo in modal */}
              <div className="w-full rounded-xl overflow-hidden border-2 border-pink-100 shadow-md" style={{ height: "200px" }}>
                <img
                  src={selected.image}
                  alt={selected.quote}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              <p className="font-heading text-base text-foreground">"{selected.quote}"</p>

              {showFeeling && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground font-body italic"
                >
                  {selected.feeling}
                </motion.p>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowFeeling(true)}
                  className="glow-button text-xs py-2 px-4"
                >
                  What was I feeling? 💭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final memory */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 gradient-bg flex flex-col items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="text-center"
            >
              <span className="text-7xl block mb-6">💖</span>
              <h2 className="font-heading text-2xl sm:text-3xl text-foreground glow-text mb-4">
                Out of all these memories…
              </h2>
              <p className="font-heading text-xl text-primary">
                my favorite is still you ❤️
              </p>
              <button
                onClick={() => setShowFinal(false)}
                className="mt-8 text-muted-foreground text-sm font-body hover:text-primary transition-colors"
              >
                Go back to memories
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Memories;
