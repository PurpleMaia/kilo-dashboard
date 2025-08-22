import OpenAI from "openai";
import { LLMClient } from "./client";
import { cache } from "react";

// Handler of message history and packages it for LLMClient
export class ConversationManager {
    private messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
    private userID: string

    public constructor(systemPrompt: string, userID: string) {
        this.messages = [{ role: 'system', content: systemPrompt }]
        this.userID = userID
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

    // TODO make functions:
    // clear messages
    // truncate messages
}

const CHAT_SYSPROMPT = 'You are a helpful agroforestry assistant, rooted in Hawaiian ecological practices. Assist the user with any recommendations based on Hawaiian practices combined with modern approaches.'
export class ChatService {
    private static instance: ChatService
    private system_prompt: string = CHAT_SYSPROMPT
    private llmClient: LLMClient

    // service gets its own manager (with its system prompt) and its own llm client
    public constructor() {
        this.llmClient = LLMClient.getInstance()
    }

    static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance
    }

    /**
     * Sends request to attached LLM Client and gets a response, also makes a ConversationManager instance add messages from user & assistant
     * @returns llm response
     */
    public async generateResponse(conversation: ConversationManager, userMessage: string): Promise<string> {
        conversation.addMessage('user', userMessage)

        const response = await this.llmClient.makeRequest(conversation.getMessages())

        conversation.addMessage('assistant', response)

        return response
    }

    public createConversation(userID: string): ConversationManager {
        return new ConversationManager(this.system_prompt, userID)
    }
}

interface UserSession {
    userId: string;
    conversations: Map<string, ConversationManager>;
    createdAt: Date;
    lastActivity: Date;
}

export class SessionManager {
    private static sessions = new Map<string, UserSession>();

    static createSession(userId: string): UserSession {
        const session: UserSession = {
            userId,
            conversations: new Map(),
            createdAt: new Date(),
            lastActivity: new Date()
        };

        this.sessions.set(userId, session);
        console.log(`Created conversation session for user ${userId}`);
        return session;
    }

    static getSession(userId: string): UserSession | null {
        const session = this.sessions.get(userId);
        if (session) {
            session.lastActivity = new Date();
        }
        return session || null;
    }

    static getOrCreateSession(userId: string): UserSession {
        return this.getSession(userId) || this.createSession(userId);
    }

    static addConversationToSession(
        userId: string,
        conversation: ConversationManager
    ): void {
        const session = this.getOrCreateSession(userId);
        session.conversations.set(userId, conversation);
        session.lastActivity = new Date();
    }

    static getConversationFromSession(
        userId: string,
    ): ConversationManager | null {
        const session = this.getSession(userId);
        return session?.conversations.get(userId) || null;
    }

    static getUserConversations(userId: string): ConversationManager[] {
        const session = this.getSession(userId);
        return session ? Array.from(session.conversations.values()) : [];
    }

}