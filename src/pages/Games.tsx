import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sparkles from "@/components/Sparkles";
import FeedTeddy from "@/components/games/FeedTeddy";
import OpenLoveLetters from "@/components/games/OpenLoveLetters";
import DecorateOurLove from "@/components/games/DecorateOurLove";
import PutTeddyToSleep from "@/components/games/PutTeddyToSleep";
import FindHiddenKisses from "@/components/games/FindHiddenKisses";
import OpenSurpriseBox from "@/components/games/OpenSurpriseBox";
import MakeMeSmile from "@/components/games/MakeMeSmile";
import MatchOurVibes from "@/components/games/MatchOurVibes";

/* ── inline mini games ── */
const MoodSlider = () => {
  const [value, setValue] = useState(50);
  const moods = [
    { emoji: "😡", label: "Gussa" },
    { emoji: "😤", label: "Irritated" },
    { emoji: "😐", label: "Meh" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😊", label: "Happy" },
    { emoji: "🥰", label: "In Love" },
  ];
  const idx = Math.min(Math.floor((value / 100) * moods.length), moods.length - 1);
  return (
    <div className="space-y-5 text-center">
      <h3 className="font-heading text-lg text-foreground">Mood Slider 🎚️</h3>
      <motion.span
        key={idx}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-7xl block"
      >
        {moods[idx].emoji}
      </motion.span>
      <p className="font-heading text-primary">{moods[idx].label}</p>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <p className="text-sm text-muted-foreground font-body">
        {value >= 80
          ? "Yeh wali smile rakhna hamesha 💖"
          : value >= 50
          ? "Thoda aur slide karo... 🥺"
          : "Kya hua? Baat karo mujhse 💕"}
      </p>
    </div>
  );
};

const CatchThoughts = () => {
  const [score, setScore] = useState(0);
  const thoughts = ["I love you 💖", "Miss you 🥺", "You're cute 🥰", "My favorite ❤️", "Always yours 💕"];
  const [bubbles, setBubbles] = useState(
    thoughts.map((t, i) => ({
      id: i,
      text: t,
      caught: false,
      left: 8 + Math.random() * 65,
      top: 8 + Math.random() * 60,
    }))
  );

  const catchBubble = (id: number) => {
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, caught: true } : b)));
    setScore((s) => s + 1);
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Catch My Thoughts 💭</h3>
      <p className="text-sm text-muted-foreground font-body">Caught: {score}/{thoughts.length}</p>
      <div className="relative h-64 glass-card overflow-hidden">
        {bubbles.map((b) =>
          !b.caught ? (
            <motion.button
              key={b.id}
              animate={{ y: [0, -12, 0, 12, 0], x: [0, 6, -6, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
              onClick={() => catchBubble(b.id)}
              className="absolute glass-card px-3 py-2 text-xs font-body text-foreground cursor-pointer hover:bg-primary/20 shadow-md"
              style={{ left: `${b.left}%`, top: `${b.top}%` }}
            >
              {b.text}
            </motion.button>
          ) : null
        )}
        {score === thoughts.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-pink-50/80 backdrop-blur-sm"
          >
            <p className="font-heading text-lg text-primary">Tumne mere saare thoughts pakad liye! 💖</p>
          </motion.div>
        )}
      </div>
      {score === thoughts.length && (
        <p className="text-sm font-body text-muted-foreground">Kyunki tum hi mere dil mein rehte ho 🧸</p>
      )}
    </div>
  );
};

const HeartbeatSync = () => {
  const [taps, setTaps] = useState(0);
  const [scale, setScale] = useState(1);
  const [lastMsg, setLastMsg] = useState("");

  const messages = [
    "Dhak dhak! 💓",
    "Aur! 💕",
    "Sync ho rahe hain! ❤️",
    "Dil mila! 🥰",
    "Ek hi dhadkan! 💖",
  ];

  const tap = () => {
    const newTaps = taps + 1;
    setTaps(newTaps);
    setScale(1.35);
    setTimeout(() => setScale(1), 180);
    if (newTaps % 4 === 0) {
      setLastMsg(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => setLastMsg(""), 1500);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-heading text-lg text-foreground">Heartbeat Sync 💓</h3>
      <p className="text-sm text-muted-foreground font-body">Tap the heart! Beats: {taps}</p>
      <div className="relative flex justify-center h-28 items-center">
        <motion.button animate={{ scale }} onClick={tap} className="text-7xl cursor-pointer select-none">
          ❤️
        </motion.button>
        <AnimatePresence>
          {lastMsg && (
            <motion.div
              key={lastMsg + taps}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-0 text-sm font-heading text-primary pointer-events-none"
            >
              {lastMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {taps >= 20 && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-primary font-heading text-sm">
          Hamare dil ek hi beat pe chal rahe hain! 💕🧸
        </motion.p>
      )}
    </div>
  );
};

const games = [
  { id: "feed", name: "Feed Teddy", emoji: "🧸", desc: "Feed the teddy yummy things!", component: FeedTeddy },
  { id: "letters", name: "Love Letters", emoji: "💌", desc: "Open secret love letters", component: OpenLoveLetters },
  { id: "decorate", name: "Decorate Love", emoji: "💝", desc: "Decorate our heart canvas", component: DecorateOurLove },
  { id: "sleep", name: "Teddy Sleep", emoji: "🌙", desc: "Pat teddy to sleep", component: PutTeddyToSleep },
  { id: "kisses", name: "Hidden Kisses", emoji: "💋", desc: "Find all the hidden kisses", component: FindHiddenKisses },
  { id: "surprise", name: "Surprise Box", emoji: "🎁", desc: "Open surprise messages!", component: OpenSurpriseBox },
  { id: "smile", name: "Make Me Smile", emoji: "😊", desc: "Cheer me up with love", component: MakeMeSmile },
  { id: "match", name: "Match Vibes", emoji: "💕", desc: "Memory match game", component: MatchOurVibes },
  { id: "mood", name: "Mood Slider", emoji: "🎚️", desc: "Slide to your mood", component: MoodSlider },
  { id: "thoughts", name: "Catch Thoughts", emoji: "💭", desc: "Catch my floating thoughts", component: CatchThoughts },
  { id: "heartbeat", name: "Heartbeat Sync", emoji: "💓", desc: "Sync our heartbeats", component: HeartbeatSync },
];

const Games = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const ActiveComponent = games.find((g) => g.id === activeGame)?.component;

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden px-4 py-6">
      <Sparkles />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <button
          onClick={() => (activeGame ? setActiveGame(null) : navigate("/home"))}
          className="text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-heading text-2xl text-foreground">
          {activeGame ? games.find((g) => g.id === activeGame)?.name : "Play Games 🎮"}
        </h2>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 gap-3"
            >
              {games.map((game, i) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveGame(game.id)}
                  className="glass-card-hover p-4 flex flex-col items-center gap-2 text-left"
                >
                  <span className="text-4xl">{game.emoji}</span>
                  <span className="font-heading text-sm text-foreground text-center">{game.name}</span>
                  <span className="text-xs text-muted-foreground font-body text-center leading-tight">{game.desc}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-5"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Games;
