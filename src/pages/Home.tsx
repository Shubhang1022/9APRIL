import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import { MessageCircle, Mic, Gamepad2, Star, Mail, Phone, BookOpen } from "lucide-react";

const cards = [
  { icon: MessageCircle, label: "Chat with Me", emoji: "💬", path: "/chat", color: "from-pink-400 to-rose-500" },
  { icon: Mic, label: "Talk to Me", emoji: "🎙", path: "/voice", color: "from-purple-400 to-violet-500" },
  { icon: Gamepad2, label: "Play Games", emoji: "🎮", path: "/games", color: "from-amber-400 to-orange-500" },
  { icon: Star, label: "Our Story", emoji: "🌌", path: "/memories", color: "from-blue-400 to-indigo-500" },
  { icon: BookOpen, label: "Our Moments", emoji: "📖", path: "/album", color: "from-fuchsia-400 to-pink-500" },
  { icon: Mail, label: "Love Letters", emoji: "💌", path: "/letters", color: "from-rose-400 to-pink-500" },
  { icon: Phone, label: "Call Me", emoji: "📞", path: "/call", color: "from-green-400 to-emerald-500" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen gradient-bg overflow-hidden px-4 py-8">
      <FloatingHearts />
      <Sparkles />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 relative z-10"
      >
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground glow-text">
          Your World 💖
        </h1>
        <p className="text-muted-foreground mt-2 font-body">What do you feel like doing?</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto relative z-10">
        {cards.map((card, i) => (
          <motion.button
            key={card.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(card.path)}
            className="glass-card-hover p-5 flex flex-col items-center gap-3 cursor-pointer"
          >
            <span className="text-4xl">{card.emoji}</span>
            <span className="font-heading text-sm sm:text-base text-foreground">{card.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-12 relative z-10"
      >
        <button
          onClick={() => navigate("/ending")}
          className="text-muted-foreground text-sm hover:text-primary transition-colors font-body"
        >
          Skip to the end... 🤫
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
