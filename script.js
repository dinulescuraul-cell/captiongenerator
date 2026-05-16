async function generateCaptions() {
  const type = document.getElementById("type").value;
  const tone = document.getElementById("tone").value;
  const output = document.getElementById("output");

  output.innerText = "Generating captions...";

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
      output.innerText = "Error: " + JSON.stringify(data.error);
      return;
    }

    if (data.choices && data.choices[0]) {
      output.innerText = data.choices[0].message.content;
    } else {
      output.innerText = "Unexpected response from server.";
      console.log(data);
    }

  } catch (err) {
    output.innerText = "Request failed: " + err.message;
  }
}function setTone(value) {
  document.getElementById("tone").value = value;
}
