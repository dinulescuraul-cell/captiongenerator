export default async function handler(req, res) {
  try {
    const { type, tone } = req.body;

    const prompt = `
Generate 50 viral Facebook captions.

Video type: ${type}
Tone: ${tone}

Rules:
- no hashtags
- max 12 words
- engaging, comment bait style
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
