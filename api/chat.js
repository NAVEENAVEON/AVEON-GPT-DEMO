// api/chat.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "No message" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "Missing API key on server" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: "You are Aveon CMS demo assistant. Answer concisely and professionally." },
          { role: "user", content: message }
        ],
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
