
export default async function handler(req, res) {
  try {
    const { type, tone, count, bestMode } = req.body;

    const prompt = `
You are an elite viral social media strategist.

Generate EXACTLY:
- 10 Instagram captions
- 10 Facebook captions

Video type: ${type}
Tone: ${tone}

VERY IMPORTANT RULES:
- max 12 words per caption
- NO explanations
- NO intro text
- NO numbering in output text
- ONLY return valid JSON

${bestMode === "true" ? `
BEST MODE ENABLED:
- only highly viral captions
- remove weak/generic ideas
- prioritize emotional + curiosity + engagement
` : ""}

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "instagram": [
    "caption 1",
    "caption 2",
    "caption 3",
    "caption 4",
    "caption 5",
    "caption 6",
    "caption 7",
    "caption 8",
    "caption 9",
    "caption 10"
  ],
  "facebook": [
    "caption 1",
    "caption 2",
    "caption 3",
    "caption 4",
    "caption 5",
    "caption 6",
    "caption 7",
    "caption 8",
    "caption 9",
    "caption 10"
  ]
}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: bestMode === "true" ? 0.8 : 0.9
      })
    });

    const data = await response.json();

    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({ error: "No model output" });
    }

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from AI",
        raw
      });
    }

    res.status(200).json(parsed);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
