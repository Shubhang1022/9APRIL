import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import TeddyBear from "@/components/TeddyBear";

const Ending = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center relative overflow-hidden px-6">
      <FloatingHearts />
      <Sparkles />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
        className="text-center relative z-10"
      >
        <TeddyBear size={100} className="mb-6" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="font-heading text-2xl sm:text-4xl text-foreground glow-text leading-relaxed mb-4"
        >
          I didn't just make this…
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="font-heading text-xl sm:text-2xl text-primary mb-12"
        >
          I tried to fix us 💖
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="glow-button text-lg"
        >
          Can we start again? 💕
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-8 text-muted-foreground text-sm font-body"
        >
          Made with all my love, just for you ❤️
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Ending;
