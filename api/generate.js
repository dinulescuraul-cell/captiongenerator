export default function handler(req, res) {
  return res.status(200).json({
    env_exists: !!process.env.GROQ_API_KEY,
    key_start: process.env.GROQ_API_KEY
      ? process.env.GROQ_API_KEY.slice(0, 6)
      : null
  });
}
