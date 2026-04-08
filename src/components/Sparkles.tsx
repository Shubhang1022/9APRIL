import { useEffect, useState } from "react";

const Sparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setSparkles(arr);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute animate-sparkle text-yellow-300"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            fontSize: "14px",
          }}
        >
          ✨
        </span>
      ))}
    </div>
  );
};

export default Sparkles;
