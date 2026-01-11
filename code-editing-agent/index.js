import ollama from 'ollama'
import 'dotenv/config'
import readline from 'node:readline';

export function getUserMessage() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('You: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function Run(){
    const conversation = []
    console.log("Chat with ollama (use 'ctrl-c' to quit)")
    
    while (true){
        let userInput = await getUserMessage();
        if(!userInput){
            break;
        }

        const userMessage = {
            role: 'user',
            content: userInput
        }

        conversation.push(userMessage)
        
        let message = await runInference(conversation)

        conversation.push(message)
        console.log("Agent:", message.content)
    }
}

async function runInference(conversation) {
  const response = await ollama.chat({
    model: 'llama3.1',           // or mistral, qwen, etc.
    messages: conversation,    // full conversation history
    stream: false,             // blocking (Claude-like)
  })

  return {
    role: 'assistant',
    content: response.message.content
  }
}

await Run();