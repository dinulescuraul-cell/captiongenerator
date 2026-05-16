
function setTone(value, event) {
  document.getElementById("tone").value = value;

  document.querySelectorAll(".chips button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (event && event.target) {
    event.target.classList.add("active");
  }
}

function setPlatform(value) {
  document.getElementById("platform").value = value;

  document.getElementById("tab-ig").classList.remove("active");
  document.getElementById("tab-fb").classList.remove("active");

  if (value === "instagram") {
    document.getElementById("tab-ig").classList.add("active");
  } else {
    document.getElementById("tab-fb").classList.add("active");
  }
}

// NEW TOGGLES
function toggleBestMode() {
  const el = document.getElementById("bestMode");
  el.value = el.value === "true" ? "false" : "true";

  document.getElementById("bestModeBtn").classList.toggle("active");
}

function toggleScoreMode() {
  const el = document.getElementById("scoreMode");
  el.value = el.value === "true" ? "false" : "true";

  document.getElementById("scoreModeBtn").classList.toggle("active");
}

// SIMPLE VIRAL SCORE FUNCTION
function calculateScore(text) {
  let score = 5;

  if (text.includes("?")) score += 2;
  if (text.length <= 12) score += 2;
  if (text.toLowerCase().includes("you")) score += 1;
  if (text.toLowerCase().includes("would")) score += 1;
  if (text.toLowerCase().includes("why")) score += 1;

  return Math.min(score, 10);
}

async function generateCaptions() {
  const type = document.getElementById("type").value;
  const tone = document.getElementById("tone").value;
  const count = document.getElementById("count")?.value || 50;
  const platform = document.getElementById("platform")?.value || "instagram";

  const bestMode = document.getElementById("bestMode").value === "true";
  const scoreMode = document.getElementById("scoreMode").value === "true";

  const igOutput = document.getElementById("ig-output");
  const fbOutput = document.getElementById("fb-output");

  igOutput.innerHTML = "Generating Instagram captions... ✨";
  fbOutput.innerHTML = "Generating Facebook captions... ✨";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, tone, count, platform, bestMode })
    });

    const data = await response.json();

    if (data.error) {
      igOutput.innerHTML = "Error: " + JSON.stringify(data.error);
      fbOutput.innerHTML = "";
      return;
    }

    if (!data.choices || !data.choices[0]) {
      igOutput.innerHTML = "Unexpected response from server.";
      fbOutput.innerHTML = "";
      console.log(data);
      return;
    }

    const text = data.choices[0].message.content;

    const lines = text
      .split("\n")
      .map(l => l.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(l => {
        const lower = l.toLowerCase();

        if (
          lower.includes("here are") ||
          lower.includes("captions") ||
          lower.includes("output") ||
          lower.includes("sure") ||
          lower.includes("below")
        ) {
          return false;
        }

        return l.length > 0;
      })
      .slice(0, parseInt(count));

    igOutput.innerHTML = "";
    fbOutput.innerHTML = "";

    lines.forEach((caption) => {
      const box = document.createElement("div");
      box.className = "caption";

      const textSpan = document.createElement("span");
      textSpan.innerText = caption;

      // SCORE
      if (scoreMode) {
        const score = calculateScore(caption);

        const scoreTag = document.createElement("div");
        scoreTag.innerText = "🔥 " + score + "/10";
        scoreTag.className = "score";

        box.appendChild(scoreTag);
      }

      const btn = document.createElement("button");
      btn.innerText = "Copy";

      btn.onclick = () => {
        navigator.clipboard.writeText(caption);
        btn.innerText = "Copied!";
        setTimeout(() => btn.innerText = "Copy", 1000);
      };

      box.appendChild(textSpan);
      box.appendChild(btn);

      // SPLIT LOGIC (simple but clean)
      if (platform === "instagram") {
        igOutput.appendChild(box);
      } else {
        fbOutput.appendChild(box);
      }
    });

    // BEST MODE FILTER (optional cleanup)
    if (bestMode) {
      const filterTop = (container) => {
        const items = Array.from(container.querySelectorAll(".caption"));
        items.sort((a, b) => {
          const aScore = calculateScore(a.innerText);
          const bScore = calculateScore(b.innerText);
          return bScore - aScore;
        });

        container.innerHTML = "";
        items.slice(0, Math.min(10, items.length)).forEach(i => container.appendChild(i));
      };

      filterTop(igOutput);
      filterTop(fbOutput);
    }

  } catch (err) {
    igOutput.innerHTML = "Request failed: " + err.message;
    fbOutput.innerHTML = "";
  }
}
