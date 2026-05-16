export default function handler(req, res) {
  return res.status(200).json({
    message: "THIS IS THE ACTIVE VERCEL FUNCTION",
    time: Date.now()
  });
}
