
export default async function handler(req, res) {
  try {
    const { type, tone, count, platform, bestMode } = req.body;

    const prompt = `
You are an elite social media strategist who writes viral captions that get engagement.

Generate EXACTLY ${count} captions.

Video type: ${type}
Tone: ${tone}
Platform: ${platform}

VERY IMPORTANT RULES:
- max 12 words per caption
- NO explanations
- NO intro text
- NO "here are captions"
- start immediately with numbered list (1.)

PLATFORM BEHAVIOR:

IF platform = instagram:
Write captions that feel:
- aesthetic
- emotionally soft
- minimal but powerful
- vibe-based, cinematic energy
- subtle engagement (not aggressive)

IF platform = facebook:
Write captions that feel:
- highly engaging
- curiosity driven
- comment bait style
- questions, opinions, debate triggers
- slightly more direct and loud

CONTENT MIX:
- hooks (questions / curiosity)
- emotional lines
- funny/light relatable lines
- engagement triggers

${bestMode === "true" ? `
BEST MODE ENABLED:
- ONLY output your strongest viral captions
- remove anything generic or low engagement
- prioritize emotional + curiosity + shareability
` : ""}

OUTPUT FORMAT:
1. caption
2. caption
3. caption
...

IMPORTANT FINAL RULE:
Only output the numbered captions. Nothing else.
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

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
