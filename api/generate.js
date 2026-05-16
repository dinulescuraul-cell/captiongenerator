
export default async function handler(req, res) {
  try {
    const { type, tone, count, platform } = req.body;

    const prompt = `
You are a professional social media strategist.

Generate ${count} viral captions.

Video type: ${type}
Tone: ${tone}
Platform: ${platform}

RULES:
- max 12 words per caption
- NO intro text
- start directly with 1.

PLATFORM STYLE RULES:

IF platform = instagram:
- aesthetic, emotional, minimal, vibe-based
- soft hooks, aesthetic energy, subtle engagement

IF platform = facebook:
- strong engagement, curiosity hooks, comment bait
- questions, opinions, controversial curiosity

CONTENT STRUCTURE:
Mix:
- hooks (questions / curiosity)
- emotional captions
- funny captions
- engagement bait

IMPORTANT:
Only output ${count} captions.
No explanations. No intro text.
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
