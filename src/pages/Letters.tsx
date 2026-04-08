import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeddyBear from "@/components/TeddyBear";
import Sparkles from "@/components/Sparkles";
import { streamChat } from "@/lib/chat-stream";
import { toast } from "sonner";

const Letters = () => {
  const navigate = useNavigate();
  const [letter, setLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateLetter = async () => {
    setIsGenerating(true);
    setLetter("");
    setHasGenerated(true);

    await streamChat({
      messages: [{ role: "user", content: "Write me a beautiful romantic love letter for my girlfriend. Make it unique and heartfelt." }],
      mode: "love-letter",
      onDelta: (chunk) => setLetter((prev) => prev + chunk),
      onDone: () => setIsGenerating(false),
      onError: (err) => {
        toast.error(err);
        setIsGenerating(false);
      },
    });
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden px-4 py-6">
      <Sparkles />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <button onClick={() => navigate("/home")} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-heading text-2xl text-foreground">Love Letters 💌</h2>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 relative"
          style={{ minHeight: "400px" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <TeddyBear size={150} />
          </div>

          <div className="relative z-10">
            {!hasGenerated ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <TeddyBear size={60} />
                <p className="text-muted-foreground font-heading text-center">
                  Tap below to get a love letter written just for you 💕
                </p>
              </div>
            ) : isGenerating && !letter ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <TeddyBear size={50} />
                <span className="text-muted-foreground font-heading">Writing something special... ✍️</span>
              </div>
            ) : (
              <p className="font-body text-sm sm:text-base text-foreground whitespace-pre-line leading-relaxed">
                {letter}
                {isGenerating && <span className="animate-pulse">▍</span>}
              </p>
            )}
          </div>
        </motion.div>

        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateLetter}
            disabled={isGenerating}
            className="glow-button flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
            {hasGenerated ? "Write me another one 💕" : "Write me a letter 💌"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Letters;
