export default function handler(req, res) {
  const key = process.env.GROQ_API_KEY;

  return res.status(200).json({
    exists: !!key,
    length: key ? key.length : 0,
    starts_correctly: key ? key.startsWith("gsk_") : false,
    preview: key ? key.slice(0, 8) : null
  });
}
