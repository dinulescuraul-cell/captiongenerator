export default function handler(req, res) {
  return res.status(200).json({
    exists: !!process.env.GROQ_API_KEY,
    length: process.env.GROQ_API_KEY?.length || 0,
    preview: process.env.GROQ_API_KEY?.slice(0, 6) || null
  });
}
