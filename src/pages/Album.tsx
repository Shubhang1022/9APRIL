import { useState, useRef, useCallback, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import Sparkles from "@/components/Sparkles";
import FloatingHearts from "@/components/FloatingHearts";

interface PageData {
  type: "cover" | "intro" | "media" | "message" | "finale";
  src?: string;
  mediaType?: "image" | "video";
  caption?: string;
  message?: string;
  bg?: string;
}

const cuteMessages = [
  "Tumhare bina kuch adhura sa lagta hai 💕",
  "Tum meri sabse pyaari yaad ho 🧸",
  "I fall for you every single day ❤️",
  "You make ordinary moments magical ✨",
  "Meri duniya tum se shuru, tum pe khatam 🌍",
];

const pages: PageData[] = [
  { type: "cover", message: "Our Moments 💖", bg: "from-pink-200 to-rose-300" },
  { type: "intro", message: "Welcome to Our Love Album 💖\nEvery page holds a piece of us…" },
  { type: "media", src: "/moments/moment1.jpg", mediaType: "image", caption: "The day my world changed forever 💫" },
  { type: "media", src: "/moments/moment2.jpg", mediaType: "image", caption: "Your smile — my favourite view 😊" },
  { type: "message", message: cuteMessages[0] },
  { type: "media", src: "/moments/moment3.mp4", mediaType: "video", caption: "Our little adventure together 🎬" },
  { type: "media", src: "/moments/moment4.jpg", mediaType: "image", caption: "This moment lives in my heart rent-free 🏡" },
  { type: "message", message: cuteMessages[1] },
  { type: "media", src: "/moments/moment5.jpg", mediaType: "image", caption: "You + Me = Everything ❤️" },
  { type: "media", src: "/moments/moment6.mp4", mediaType: "video", caption: "I replay this in my head all the time 🔁" },
  { type: "message", message: cuteMessages[2] },
  { type: "media", src: "/moments/moment7.jpg", mediaType: "image", caption: "My safe place is next to you 🧸" },
  { type: "media", src: "/moments/moment8.jpg", mediaType: "image", caption: "Every second with you is a gift 🎁" },
  { type: "media", src: "/moments/moment9.jpg", mediaType: "image", caption: "Har pal tumhare saath khaas hai 🌸" },
  { type: "media", src: "/moments/moment10.jpg", mediaType: "image", caption: "Yeh wala moment dil mein hai 💖" },
  { type: "media", src: "/moments/moment11.jpg", mediaType: "image", caption: "You are brightest light in every darkness of my life" },
  { type: "media", src: "/moments/moment12.jpg", mediaType: "image", caption: "You smell the heaven with cute smile" },
  { type: "media", src: "/moments/moment13.jpg", mediaType: "image", caption: "You complete me" },
  { type: "media", src: "/moments/moment14.jpg", mediaType: "image", caption: "The love I want to give is not in numbers , its beyond everything" },
  { type: "media", src: "/moments/moment15.jpg", mediaType: "image", caption: "Yeh pal hamesha yaad rahega ✨" },
  { type: "media", src: "/moments/moment16.jpg", mediaType: "image", caption: "Sirf tumhare saath 💫" },
  { type: "media", src: "/moments/moment17.jpg", mediaType: "image", caption: "Dil se tumhara 🧸" },
  { type: "media", src: "/moments/moment18.jpg", mediaType: "image", caption: "Har jagah tum hi tum 💗" },
  { type: "media", src: "/moments/moment19.webp", mediaType: "image", caption: "Aur bahut saari yaadein baaki hain �" },
  { type: "finale", message: "This album will keep growing,\nbecause our story never ends… 💖\n\nI love you, forever and always 🧸" },
  { type: "cover", message: "The End… for now 🧸💕", bg: "from-purple-200 to-pink-300" },
];

/* ── confetti ── */
const Confetti = () => {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ["hsl(346,100%,65%)", "hsl(280,50%,75%)", "hsl(40,100%,70%)", "hsl(180,60%,70%)"][i % 4],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: "easeIn" }}
          className="absolute"
          style={{ width: p.size, height: p.size, borderRadius: "2px", backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

/* ── polaroid frame for images ── */
const PolaroidImage = ({ src, caption }: { src?: string; caption?: string }) => (
  <div
    className="w-full bg-white rounded-xl p-2 shadow-md"
    style={{ boxShadow: "0 4px 16px rgba(236,72,153,0.18), 0 1px 4px rgba(0,0,0,0.07)" }}
  >
    <div className="w-full rounded-lg overflow-hidden" style={{ height: "175px" }}>
      <img
        src={src}
        alt={caption}
        className="w-full h-full object-cover object-center"
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
      />
    </div>
    {caption && (
      <p className="font-heading text-[10px] text-center text-pink-500 mt-1.5 px-1 leading-tight">
        {caption}
      </p>
    )}
  </div>
);

/* ── polaroid frame for videos ── */
const PolaroidVideo = ({ src, caption }: { src: string; caption?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  return (
    <div
      className="w-full bg-white rounded-xl p-2 shadow-md"
      style={{ boxShadow: "0 4px 16px rgba(236,72,153,0.18), 0 1px 4px rgba(0,0,0,0.07)" }}
    >
      <div className="relative w-full rounded-lg overflow-hidden" style={{ height: "175px" }}>
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="w-full h-full object-cover object-center"
        />
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !muted;
              setMuted(!muted);
            }
          }}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-pink-500 shadow"
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>
      {caption && (
        <p className="font-heading text-[10px] text-center text-pink-500 mt-1.5 px-1 leading-tight">
          {caption}
        </p>
      )}
    </div>
  );
};

/* ── individual page (forwarded ref required by react-pageflip) ── */
const Page = forwardRef<HTMLDivElement, { page: PageData; pageNum: number }>(
  ({ page, pageNum }, ref) => {
    const isLeft = pageNum % 2 === 0;
    const bgClass = page.bg
      ? `bg-gradient-to-br ${page.bg}`
      : isLeft
      ? "bg-gradient-to-br from-pink-50 to-rose-100"
      : "bg-gradient-to-br from-purple-50 to-pink-100";

    return (
      <div
        ref={ref}
        className={`relative w-full h-full ${bgClass} overflow-hidden select-none`}
        style={{
          boxShadow: isLeft
            ? "inset -8px 0 20px rgba(0,0,0,0.06)"
            : "inset 8px 0 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* lined paper texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 28px)" }}
        />
        {/* corner stickers */}
        <span className="absolute top-2 left-2 text-sm opacity-50 pointer-events-none">🌸</span>
        <span className="absolute top-2 right-2 text-sm opacity-50 pointer-events-none">✨</span>
        <span className="absolute bottom-5 left-2 text-xs opacity-40 pointer-events-none">💕</span>
        <span className="absolute bottom-5 right-2 text-sm opacity-50 pointer-events-none">🧸</span>
        {/* page number */}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-pink-400 font-body opacity-60">
          {pageNum + 1}
        </span>

        <div className="h-full flex flex-col items-center justify-center p-4 pb-8">
          {page.type === "cover" && (
            <div className="text-center space-y-3">
              <motion.span className="text-6xl block" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                📖
              </motion.span>
              <h2 className="font-heading text-base text-pink-700 leading-snug whitespace-pre-line">{page.message}</h2>
              <span className="text-3xl">🧸💖</span>
            </div>
          )}

          {page.type === "intro" && (
            <div className="text-center space-y-3">
              <motion.span className="text-5xl block" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
                💌
              </motion.span>
              <p className="font-heading text-xs text-pink-700 whitespace-pre-line leading-relaxed">{page.message}</p>
            </div>
          )}

          {page.type === "media" && page.mediaType === "image" && (
            <PolaroidImage src={page.src} caption={page.caption} />
          )}

          {page.type === "media" && page.mediaType === "video" && (
            <PolaroidVideo src={page.src!} caption={page.caption} />
          )}

          {page.type === "message" && (
            <div className="text-center space-y-3">
              <motion.span className="text-4xl block" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                💖
              </motion.span>
              <p className="font-heading text-xs text-pink-600 leading-relaxed">{page.message}</p>
            </div>
          )}

          {page.type === "finale" && (
            <div className="text-center space-y-3">
              <motion.span className="text-5xl block" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                💖
              </motion.span>
              <p className="font-heading text-xs text-pink-700 whitespace-pre-line leading-relaxed">{page.message}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);
Page.displayName = "Page";

/* ── main album component ── */
const Album = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const totalPages = pages.length;

  const onFlip = useCallback(
    (e: { data: number }) => {
      setCurrentPage(e.data);
      if (e.data >= totalPages - 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    },
    [totalPages]
  );

  const goNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);
  const goPrev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden px-2 py-4 flex flex-col">
      <Sparkles />
      <FloatingHearts />
      {showConfetti && <Confetti />}

      {/* header */}
      <div className="flex items-center gap-3 mb-4 relative z-10 px-2">
        <button onClick={() => navigate("/home")} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-heading text-xl text-foreground glow-text">Our Moments 📖</h2>
        <span className="ml-auto text-xs font-body text-muted-foreground">
          {currentPage + 1} / {totalPages}
        </span>
      </div>

      {/* book */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative">
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-2xl opacity-30"
            style={{ width: "70%", height: "24px", background: "hsl(346 100% 65%)" }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to right,rgba(0,0,0,0.06),rgba(0,0,0,0.18),rgba(0,0,0,0.06))" }}
          />

          <HTMLFlipBook
            ref={bookRef}
            width={260}
            height={360}
            size="fixed"
            minWidth={200}
            maxWidth={300}
            minHeight={280}
            maxHeight={400}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="rounded shadow-2xl"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={700}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            disableFlipByClick={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
          >
            {pages.map((page, i) => (
              <Page key={i} page={page} pageNum={i} />
            ))}
          </HTMLFlipBook>
        </div>

        <AnimatePresence>
          {currentPage === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-xs text-muted-foreground font-body text-center"
            >
              Tap the page corner or use arrows to flip 📖
            </motion.p>
          )}
        </AnimatePresence>

        {/* nav */}
        <div className="flex items-center gap-5 mt-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            disabled={currentPage === 0}
            className="glow-button !px-5 !py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Prev
          </motion.button>

          <div className="flex gap-1 flex-wrap justify-center max-w-[140px]">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentPage ? "bg-primary scale-150" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            disabled={currentPage >= totalPages - 1}
            className="glow-button !px-5 !py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Album;
