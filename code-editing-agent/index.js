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
    model: 'llama3.1', 
    messages: conversation,
    tools: [addTwoNumbersTool, subtractTwoNumbersTool],    
    stream: false,             
  })

  return {
    role: 'assistant',
    content: response.message.content
  }
}


// Add two numbers function
function addTwoNumbers({a,b}) {
    return a + b;
}

// Subtract two numbers function 
function subtractTwoNumbers({a,b}) {
    return a - b;
}

// Tool definition for add function
const addTwoNumbersTool = {
    type: 'function',
    function: {
        name: 'addTwoNumbers',
        description: 'Add two numbers together',
        parameters: {
            type: 'object',
            required: ['a', 'b'],
            properties: {
                a: { type: 'number', description: 'The first number' },
                b: { type: 'number', description: 'The second number' }
            }
        }
    }
};

// Tool definition for subtract function
const subtractTwoNumbersTool = {
    type: 'function',
    function: {
        name: 'subtractTwoNumbers',
        description: 'Subtract two numbers',
        parameters: {
            type: 'object',
            required: ['a', 'b'],
            properties: {
                a: { type: 'number', description: 'The first number' },
                b: { type: 'number', description: 'The second number' }
            }
        }
    }
};


await Run();