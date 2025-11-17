async function analyzeImage() {
    const fileInput = document.getElementById("inputImage");
    const output = document.getElementById("output");

    if (!fileInput.files.length) {
        output.innerHTML = "Please upload an image first.";
        return;
    }

    output.innerHTML = "Analyzing... please wait.";

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
        const base64 = reader.result.split(",")[1];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_KEY_HERE"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Identify the animal/plant/insect and describe danger level." },
                            { type: "image_url", image_url: reader.result }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        const result = data.choices[0].message.content;
        output.innerHTML = result;

        speak(result);
    };

    reader.readAsDataURL(file);
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    speechSynthesis.speak(msg);
}
