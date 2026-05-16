export default async function handler(req, res) {
  try {
    const { type, tone, count } = req.body;

    const prompt = `
You are a professional social media strategist.

Generate ${count} viral captions.

Video type: ${type}
Tone: ${tone}

RULES:
- max 12 words per caption
- NO intro text
- start directly with 1.

STRUCTURE:
Mix hooks, emotions, humor, engagement bait.

IMPORTANT:
Only output ${count} captions.
No explanations.
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
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
