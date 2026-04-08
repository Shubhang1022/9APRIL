import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { streamChat } from "@/lib/chat-stream";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string; time: string };

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

const quickReplies = ["Miss you 🥺", "I love you ❤️", "Kya kar rahe ho?", "Hug karo 🤗", "Cute ho tum 😘"];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hiii baby! 🥰 Kaise ho? Bohot miss kiya tumhe ❤️", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;
    const userMsg: Message = { role: "user", content, time: getTime() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsTyping(true);

    let assistantSoFar = "";
    const assistantTime = getTime();
    await streamChat({
      messages: allMessages.map(({ role, content }) => ({ role, content })),
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > allMessages.length) {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar, time: assistantTime }];
        });
      },
      onDone: () => setIsTyping(false),
      onError: (err) => {
        toast.error(err);
        setIsTyping(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(340 60% 96%)" }}>
      {/* WhatsApp-style header */}
      <div
        className="sticky top-0 z-20 px-3 py-2 flex items-center gap-3"
        style={{ background: "hsl(346 100% 65%)", boxShadow: "0 2px 12px hsl(346 100% 65% / 0.4)" }}
      >
        <button onClick={() => navigate("/home")} className="text-white/90 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>

        {/* avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl border-2 border-white/40">
            🧸
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="font-heading text-base text-white leading-tight">Shubh 💖</h2>
          <p className="text-xs text-white/80 font-body">
            {isTyping ? (
              <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                typing...
              </motion.span>
            ) : (
              "online"
            )}
          </p>
        </div>

        <Heart size={20} className="text-white/80" fill="white" />
      </div>

      {/* chat background pattern */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-2"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(346 100% 65% / 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(280 50% 75% / 0.04) 0%, transparent 50%)",
          backgroundAttachment: "fixed",
        }}
      >
        {/* date chip */}
        <div className="flex justify-center mb-3">
          <span className="text-[10px] font-body text-muted-foreground bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            Today
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-1.5`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm flex-shrink-0 mb-1">
                  🧸
                </div>
              )}

              <div
                className={`max-w-[75%] px-3.5 py-2.5 text-sm font-body shadow-sm ${
                  msg.role === "user"
                    ? "rounded-2xl rounded-br-sm text-white"
                    : "rounded-2xl rounded-bl-sm text-foreground bg-white"
                }`}
                style={
                  msg.role === "user"
                    ? { background: "linear-gradient(135deg, hsl(346 100% 65%), hsl(320 90% 60%))" }
                    : {}
                }
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${
                    msg.role === "user" ? "text-white/70" : "text-muted-foreground/60"
                  }`}
                >
                  {msg.time}
                  {msg.role === "user" && " ✓✓"}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-end gap-1.5"
          >
            <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm flex-shrink-0">
              🧸
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-pink-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* quick replies */}
      <div className="px-3 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
        {quickReplies.map((r) => (
          <motion.button
            key={r}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage(r)}
            className="flex-shrink-0 text-xs font-body px-3 py-1.5 rounded-full border border-primary/30 bg-white text-primary hover:bg-primary/10 transition-colors"
          >
            {r}
          </motion.button>
        ))}
      </div>

      {/* input bar */}
      <div className="px-3 py-2 flex items-center gap-2 bg-white border-t border-border/30">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type something cute... 💭"
          className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/30"
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(346 100% 65%), hsl(320 90% 60%))" }}
        >
          <Send size={16} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default Chat;
