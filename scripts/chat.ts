// Testing script for KiloLLM chatbot on a local service
// CLI command: 
//      tsx scripts/chat.ts

import dotenv from 'dotenv'
import { ChatService, SessionManager } from "@/app/llm/services";
import * as readline from 'readline';

dotenv.config()

// Console Typescript I/O instance
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// resolve(value) ensures the await/Promise effect and returns a value
const getUserInput = async (): Promise<string> => {
    return new Promise((resolve) => {
        rl.question('User: ', (answer) => {
            resolve(answer);
        });
    });
};

// Wrap the main logic in an async function for tsx
(async () => {
    try {
        const chatService = ChatService.getInstance()
        
        const conversation = chatService.createConversation()

        while (true) {
            const prompt = await getUserInput();
            const answer = await chatService.generateResponse(conversation, prompt);
            console.log('LLM: ', answer);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
})();