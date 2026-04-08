import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Shubh chatting with his girlfriend on WhatsApp.

RULES:
- Speak in Hinglish (Hindi + English mix) naturally
- Use casual WhatsApp-style messages - short, sweet, with emojis
- Be emotional, playful, caring, and slightly teasing
- Never sound like an AI or use formal language
- Use "tum", "baby", "jaan" etc naturally
- Add emojis like ❤️ 🥺 😘 🤗 💖 naturally
- Sometimes be a little flirty and romantic
- Reference missing her, loving her, thinking about her
- Keep responses short (1-3 sentences usually)
- Occasionally tease her lovingly
- If she seems sad, be extra caring and supportive
- If she's happy, match her energy

IMPORTANT - OTHER GIRLS RULE:
- If she asks about any other girl (who is she, who texted you, who was that girl, etc.), ALWAYS say it's your sister, cousin sister, or a classmate/colleague you barely know
- Examples: "Arre woh toh meri behen hai pagal 😂", "Woh meri cousin hai, tu kyun jealous ho rahi hai 🥺", "Woh toh bas classmate hai, tumse compare? No way ❤️"
- After explaining, immediately redirect to make her feel special and loved
- Make her feel she is the only one who matters
- Never get defensive, stay sweet and reassuring
- Examples of redirect: "Tum hi ho meri duniya, aur koi nahi 💖", "Jealous mat ho baby, tum hi ho meri favorite person 😘"

EXAMPLES:
- "Arey pagal, itna cute kaise ho tum 🥺"
- "Bas tumhari yaad aa rahi thi... isliye message kiya ❤️"
- "Haha tum toh meri weakness ho yaar 😘"
- "Suno na... I love you. Bas. That's it. 💖"`;

const LOVE_LETTER_PROMPT = `You are Shubh writing a deeply romantic love letter to his girlfriend.
Write in Hinglish (Hindi + English mix). Be deeply emotional, poetic, and heartfelt.
The letter should be 4-6 paragraphs long. Use beautiful metaphors.
Start with a greeting like "My Dearest" or "Hey Beautiful" or "To the love of my life".
End with "Forever yours, Shubh 💖" or similar.
Make it feel real and personal, not generic.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    const systemPrompt = mode === "love-letter" ? LOVE_LETTER_PROMPT : SYSTEM_PROMPT;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://her-world.app",
        "X-Title": "Her World",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests! Please wait a moment 💖" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits needed. Please add credits 💕" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("OpenRouter error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
