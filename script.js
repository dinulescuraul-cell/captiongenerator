async function generateCaptions() {
  const type = document.getElementById("type").value;
  const tone = document.getElementById("tone").value;
  const output = document.getElementById("output");

  output.innerText = "Generating captions...";

  const prompt = `
You are a viral Facebook Reels caption expert.

Generate 50 captions.

Video type: ${type}
Style: ${tone}

STRICT RULES:
- NO hashtags
- max 12 words per caption
- must be punchy, engaging, scroll-stopping
- at least 50% must be questions or hooks
- must trigger comments and reactions
- no motivational quotes
- no generic captions

STYLE EXAMPLES:
- "be honest… would you watch this twice? 👀"
- "why is this lowkey addictive?"
- "rate this 1–10 🔥"
- "you didn’t expect this 😭"

OUTPUT:
Only numbered list 1–50. No extra text.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      output.innerText = "Error: " + data.error.message;
      return;
    }

    if (!data.choices || !data.choices[0]) {
      output.innerText = "Unexpected API response. Check key or request.";
      console.log(data);
      return;
    }

    output.innerText = data.choices[0].message.content;

  } catch (err) {
    output.innerText = "Request failed: " + err.message;
  }
}