function setTone(value, event) {
  document.getElementById("tone").value = value;

  document.querySelectorAll(".chips button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (event && event.target) {
    event.target.classList.add("active");
  }
}
    }
  });
}

async function generateCaptions() {
  const type = document.getElementById("type").value;
  const tone = document.getElementById("tone").value;
  const output = document.getElementById("output");

  output.innerHTML = "Generating captions... ✨";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, tone })
    });

    const data = await response.json();

    if (data.error) {
      output.innerHTML = "Error: " + JSON.stringify(data.error);
      return;
    }

    if (!data.choices || !data.choices[0]) {
      output.innerHTML = "Unexpected response from server.";
      console.log(data);
      return;
    }

    // raw captions text
    const text = data.choices[0].message.content;

    // split into lines
    const lines = text
      .split("\n")
      .map(l => l.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(Boolean);

    // clear output
    output.innerHTML = "";

    // create caption cards
    lines.forEach((caption) => {
      const box = document.createElement("div");
      box.className = "caption";

      const textSpan = document.createElement("span");
      textSpan.innerText = caption;

      const btn = document.createElement("button");
      btn.innerText = "Copy";

      btn.onclick = () => {
        navigator.clipboard.writeText(caption);
        btn.innerText = "Copied!";
        setTimeout(() => btn.innerText = "Copy", 1000);
      };

      box.appendChild(textSpan);
      box.appendChild(btn);
      output.appendChild(box);
    });

  } catch (err) {
    output.innerHTML = "Request failed: " + err.message;
  }
}
