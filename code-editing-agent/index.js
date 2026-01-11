import ollama from 'ollama'
import 'dotenv/config'

const question = process.argv.slice(2).join(" ");
if (!question) {
  console.log("Ask a question.");
  process.exit(0);
}

const response = await ollama.chat({
  model: 'llama3.1',
  messages: [{ role: 'user', content: question }],
})
console.log(response.message.content)