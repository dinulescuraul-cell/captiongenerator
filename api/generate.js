export default async function handler(req, res) {
  try {
    const { type, tone } = req.body || {};

    const prompt = `
You are a viral Facebook Reels caption expert.

Generate 50 captions.

Video type: ${type || "general"}
Tone: ${tone || "engaging"}

RULES:
- max 12 words per caption
- no hashtags
- punchy, emotional, hook-driven
- 70% must be questions or hooks
- numbered list 1–50 only
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    // IMPORTANT: return full Groq response for debugging safety
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
