
function setTone(value, event) {
  document.getElementById("tone").value = value;

  document.querySelectorAll(".chips button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (event && event.target) {
    event.target.classList.add("active");
  }
}

// TOGGLES
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

// SCORE SYSTEM
function calculateScore(text) {
  let score = 5;

  if (text.includes("?")) score += 2;
  if (text.length <= 12) score += 2;
  if (text.toLowerCase().includes("you")) score += 1;
  if (text.toLowerCase().includes("would")) score += 1;
  if (text.toLowerCase().includes("why")) score += 1;

  return Math.min(score, 10);
}

function createCaptionBox(caption, scoreMode) {
  const box = document.createElement("div");
  box.className = "caption";

  const textSpan = document.createElement("span");
  textSpan.innerText = caption;

  box.appendChild(textSpan);

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

  box.appendChild(btn);

  return box;
}

async function generateCaptions() {
  const type = document.getElementById("type").value;
  const tone = document.getElementById("tone").value;
  const count = parseInt(document.getElementById("count")?.value || 10);

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
      body: JSON.stringify({
        type,
        tone,
        count,
        bestMode
      })
    });

    const data = await response.json();

    if (data.error) {
      igOutput.innerHTML = "Error: " + JSON.stringify(data.error);
      fbOutput.innerHTML = "";
      return;
    }

    const ig = data.instagram || [];
    const fb = data.facebook || [];

    igOutput.innerHTML = "";
    fbOutput.innerHTML = "";

    ig.slice(0, count).forEach(caption => {
      igOutput.appendChild(createCaptionBox(caption, scoreMode));
    });

    fb.slice(0, count).forEach(caption => {
      fbOutput.appendChild(createCaptionBox(caption, scoreMode));
    });

    // BEST MODE FILTER
    if (bestMode) {
      const sortContainer = (container) => {
        const items = Array.from(container.children);

        items.sort((a, b) => {
          return calculateScore(b.innerText) - calculateScore(a.innerText);
        });

        container.innerHTML = "";
        items.slice(0, 10).forEach(i => container.appendChild(i));
      };

      sortContainer(igOutput);
      sortContainer(fbOutput);
    }

  } catch (err) {
    igOutput.innerHTML = "Request failed: " + err.message;
    fbOutput.innerHTML = "";
  }
}
