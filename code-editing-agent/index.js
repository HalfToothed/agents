import ollama from 'ollama'
import 'dotenv/config'
import readline from 'node:readline';


// Add two numbers function
// function addTwoNumbers({a,b}) {
//     return a + b;
// }

// // Subtract two numbers function 
// function subtractTwoNumbers({a,b}) {
//     return a - b;
// }

// // Tool definition for add function
// const addTwoNumbersTool = {
//     type: 'function',
//     function: {
//         name: 'addTwoNumbers',
//         description: 'Add two numbers together',
//         parameters: {
//             type: 'object',
//             required: ['a', 'b'],
//             properties: {
//                 a: { type: 'number', description: 'The first number' },
//                 b: { type: 'number', description: 'The second number' }
//             }
//         }
//     }
// };

// // Tool definition for subtract function
// const subtractTwoNumbersTool = {
//     type: 'function',
//     function: {
//         name: 'subtractTwoNumbers',
//         description: 'Subtract two numbers',
//         parameters: {
//             type: 'object',
//             required: ['a', 'b'],
//             properties: {
//                 a: { type: 'number', description: 'The first number' },
//                 b: { type: 'number', description: 'The second number' }
//             }
//         }
//     }
// };

function getTemperature(city) {
  const temperatures = {
    'New York': '22°C',
    'London': '15°C',
    'Tokyo': '18°C',
  }
  return temperatures[city] ?? 'Unknown'
}

const tools = [
  {
    type: 'function',
    function: {
      name: 'get_temperature',
      description: 'Get the current temperature for a city',
      parameters: {
        type: 'object',
        required: ['city'],
        properties: {
          city: { type: 'string', description: 'The name of the city' },
        },
      },
    },
  },
]

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
    
    const systemMessage = {
            role: 'system',
            content: "You are a helpful assistant. Use tools only when they are required to answer the question. If no tool is relevant, respond normally in plain text."
        }
    conversation.push(systemMessage)
    let message = await runInference(conversation)
    conversation.push(message)
    
    
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
        let response = await runInference(conversation)
        if(response.message.tool_calls?.length){
             const call = response.message.tool_calls[0]
                const args = call.function.arguments;
                let result = getTemperature(args.city)

            conversation.push({ role: 'tool', tool_name: call.function.name, content: result })
            response = await runInference(conversation)
        }
        conversation.push(response.message)
        
        console.log("Agent:", response.message.content)
    }
}

async function runInference(conversation) {
  const response = await ollama.chat({
    model: 'llama3.1', 
    messages: conversation,
    tools: tools,
    think: true             
  })
  return response
}


await Run();