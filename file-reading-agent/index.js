import ollama from 'ollama'
import 'dotenv/config'
import readline from 'node:readline';
import fs from 'node:fs';
import path from 'path';


// Add two numbers function
function addTwoNumbers({a,b}) {
    return a + b;
}

// Subtract two numbers function 
function subtractTwoNumbers({a,b}) {
    return a - b;
}

function listFiles(directory_name){
  const parentDir = path.join(directory_name, '..');
  let filenames = fs.readdirSync(parentDir);
  return filenames.toString();
}

function readFile(filename){
  try {
    const filePath = path.resolve(filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
} 

const listFilesTool = {
  type:'function',
  function:{
    name: 'listFiles',
    description: 'List files and directories at a given path. If no path is provided, lists files in the current directory.',
    parameters: {
      type:'object',
      required:['file'],
      properties:{
        file:{type:'string', description:'the name or relative path of the directory'}
      }
    }
  }
}

const readFileTool = {
  type: 'function',
  function: {
    name: 'readFile',
    description: 'Read the contents of a given relative file path. Use this when you want to see whats inside a file. Do not use this with directory names.',
    parameters: {
        type: 'object',
        required: ['file'],
        properties: {
          file: { type: 'string', description: 'The name or relative file path' },
        },
    }
  }
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

function executeTool(response, conversation){
    for (const call of response.message.tool_calls) {
      console.log("Tool: ",call);
      let result
      if (call.function.name === 'addTwoNumbers') {
        const args = call.function.arguments
        result = addTwoNumbers(args.a, args.b)
      } 
      else if (call.function.name === 'subtractTwoNumbers') {
        const args = call.function.arguments
        result = subtractTwoNumbers(args.a, args.b)
      }
      else if (call.function.name === 'readFile') {
        const args = call.function.arguments
        result = readFile(args.file)
      } 
      else if (call.function.name === 'listFiles') {
        const args = call.function.arguments
        result = listFiles(args.file)
      } 
      else {
        result = 'Unknown tool'
      }
      // add the tool result to the messages
      conversation.push({ role: 'tool', tool_name: call.function.name, content: result })  
  }
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

        while (response.message.tool_calls) {
          executeTool(response, conversation)
          response = await runInference(conversation)
        }

        conversation.push(response.message)
        
        console.log("Agent:", response.message.content)
        console.log();
    }
}

async function runInference(conversation) {
  const response = await ollama.chat({
    model: 'llama3.1',
    messages: conversation,
    tools: [addTwoNumbersTool, subtractTwoNumbersTool, readFileTool, listFilesTool],
  })
  return response
}

await Run();