import fs from "fs";
import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434";
const CHAT_MODEL = "llama3.1:8b";        // example
const EMBED_MODEL = "nomic-embed-text";  // example

function cosineSimilarity(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

async function embed(text) {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: EMBED_MODEL,
      prompt: text
    })
  });
  const data = await res.json();
  return data.embedding;
}

async function chat(prompt) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: CHAT_MODEL,
      prompt,
      stream: false
    })
  });
  const data = await res.json();
  return data.response;
}

function loadBook() {
  const raw = fs.readFileSync("data/art_of_war.txt", "utf-8");
  return raw.split(/\n(?=Chapter\s+\d+)/);
}

async function buildIndex(chapters) {
  const index = [];
  for (const chapter of chapters) {
    const embedding = await embed(chapter);
    index.push({ text: chapter, embedding });
  }
  return index;
}

export async function answerQuestion(question) {
  const chapters = loadBook();
  const index = await buildIndex(chapters);

  const qEmbedding = await embed(question);

  const ranked = index
    .map(c => ({
      ...c,
      score: cosineSimilarity(qEmbedding, c.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked[0].score < 0.25) {
    return "The answer is not found in *The Art of War*.";
  }

  const context = ranked.map(r => r.text).join("\n\n");

  const prompt = `
You are a text-grounded agent.
Answer ONLY using the provided text.
If insufficient, refuse.

TEXT:
${context}

QUESTION:
${question}

FORMAT:
1. Direct answer
2. Supporting explanation
3. Sources (chapter number and title)
`;

  return await chat(prompt);
}
