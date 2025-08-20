import OpenAI from "openai";
import { LLMClient } from "./client";

// Handler of message history and packages it for LLMClient
export class ConversationManager {
    private messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]

    public constructor(systemPrompt: string) {
        this.messages = [{ role: 'system', content: systemPrompt}]
    }

    /**
     * Adds a new message to the current Conversation Manager messages array 
     */
    public addMessage(role: 'user' | 'assistant', content: string) {
        this.messages.push({ role, content })
    }

    /**
     * @returns Copy of messages array
     */
    public getMessages() {
        return [...this.messages]
    }
    
    //clear messages
    public clearMessages() {
        this.messages
    }
    //truncate messages

}

const CHAT_SYSPROMPT='You are a helpful agroforestry assistant, rooted in Hawaiian ecological practices. Assist the user with any recommendations based on Hawaiian practices combined with modern approaches.'
export class ChatService {    
    private system_prompt: string = CHAT_SYSPROMPT
    private llmClient: LLMClient
    private conversation: ConversationManager

    // service gets its own manager (with its system prompt) and its own llm client
    public constructor() {
        this.conversation = new ConversationManager(this.system_prompt)
        this.llmClient = new LLMClient()
    }

    public async generateResponse(userMessage: string): Promise<string> {

        this.conversation.addMessage('user', userMessage)        

        const response = await this.llmClient.makeRequest(this.conversation.getMessages())

        this.conversation.addMessage('assistant', response)

        console.log('Result: ', this.conversation.getMessages())

        return response
    }

    
}