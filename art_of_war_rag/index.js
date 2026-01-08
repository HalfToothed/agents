import { answerQuestion } from "./agent/agent.js";

const question = process.argv.slice(2).join(" ");
if (!question) {
  console.log("Ask a question.");
  process.exit(0);
}

const response = await answerQuestion(question);
console.log(response);
