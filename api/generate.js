export default async function handler(req, res) {
  const { type, tone } = req.body;

  const prompt = `Generate 10 captions for ${type} in ${tone} style.`;

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

  const text = await response.text(); // IMPORTANT CHANGE

  return res.status(response.status).json({
    status: response.status,
    raw: text
  });
}
