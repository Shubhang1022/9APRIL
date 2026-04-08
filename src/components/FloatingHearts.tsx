import { useEffect, useState } from "react";

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart = {
          id: Date.now(),
          left: Math.random() * 100,
          delay: 0,
          size: 12 + Math.random() * 20,
        };
        const filtered = prev.filter((h) => Date.now() - h.id < 4500);
        return [...filtered, newHeart];
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute bottom-0 animate-float-heart text-primary"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💖
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
