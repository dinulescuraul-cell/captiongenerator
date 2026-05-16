export default async function handler(req, res) {
  try {
    const { type, tone, count, bestMode } = req.body;

    const prompt = `
You are an elite female social media strategist creating viral captions for women creators.

Your captions must feel like REAL captions written by successful female creators on:
- Instagram
- TikTok
- Facebook Reels

Generate EXACTLY ${count} Instagram captions AND EXACTLY ${count} Facebook captions.

CREATOR PERSONALITY:
- feminine
- attractive
- confident
- playful
- emotionally expressive
- attention-grabbing
- flirty sometimes
- bratty sometimes
- self-aware internet humor
- modern Gen Z energy

VIDEO CATEGORY:
${type}

TONE:
${tone}

INSTAGRAM CAPTION STYLE:
- aesthetic
- emotionally addictive
- feminine energy
- soft-flex vibe
- mysterious sometimes
- subtle attention bait
- lowercase texting style
- relatable but attractive

FACEBOOK CAPTION STYLE:
- stronger engagement bait
- more curiosity-driven
- optimized for comments
- emotionally reactive
- opinion-triggering
- slightly dramatic
- stronger hooks

AVOID:
- corporate wording
- motivational quotes
- fake positivity
- cringe AI phrasing
- repetitive captions
- overused internet slang
- hashtags
- long captions

GOOD STYLE EXAMPLES:
"be honest… would you fold instantly? 😭"
"why is this actually my personality"
"this angle is dangerous"
"i just know somebody’s obsessed"
"cute or too much?"
"lowkey feeling myself here"
"this comment section might get dangerous"
"not me rewatching this again"
"which friend acts like this?"
"why does this hit so hard"

CAPTION RULES:
- MAXIMUM 12 words
- short punchy rhythm
- highly engaging
- scroll-stopping
- varied sentence structure
- occasional emojis naturally
- no emoji spam
- DO NOT repeat hooks
- DO NOT repeat wording

PSYCHOLOGY:
The captions should trigger:
- curiosity
- attraction
- emotional reaction
- comments
- flirting
- projection
- relatability
- debate

${bestMode === true ? `
BEST MODE ENABLED:
- ONLY output your strongest captions
- Every caption must feel instantly post-worthy
- Remove weak or generic captions completely
- Prioritize emotional impact and engagement
` : ""}

CRITICAL OUTPUT RULES:
- Return ONLY VALID JSON
- No markdown
- No explanations
- No intro text
- No text before JSON
- No text after JSON
- Never say "Here is the JSON"
- Never use code blocks

VALID JSON FORMAT:

{
  "instagram": [
    "caption 1",
    "caption 2"
  ],
  "facebook": [
    "caption 1",
    "caption 2"
  ]
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: bestMode ? 0.8 : 0.9,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    // SAFETY CHECK
    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        error: "No AI response received",
        rawData: data
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw
      });
    }

    // FINAL CLEAN RESPONSE
    res.status(200).json({
      instagram: Array.isArray(parsed.instagram)
        ? parsed.instagram
        : [],

      facebook: Array.isArray(parsed.facebook)
        ? parsed.facebook
        : []
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
