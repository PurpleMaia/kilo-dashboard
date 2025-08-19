import dotenv from 'dotenv'
import { ChatService } from "../src/app/llm/services";
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
        while (true) {
            const input = await getUserInput();
            const message = await ChatService.generateMessage(input);
            console.log('LLM: ', message);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
})();