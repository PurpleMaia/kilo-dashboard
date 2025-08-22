import dotenv from 'dotenv'
import OpenAI from 'openai';

dotenv.config()

// Singleton instance of the LLM connection
export class LLMClient {
    private static instance: LLMClient;
    private client: OpenAI
    
    private constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.OPENAI_BASE_URL,
            maxRetries: 3,
            timeout: 30000,                
        });        
    }

    static getInstance(): LLMClient {
        if (!LLMClient.instance) {
            LLMClient.instance = new LLMClient();
        }
        return LLMClient.instance
    }

    /**        
     * Requests LLM Service to generate a response based on message history 
     * @param messages message history     
     * @returns LLM response
     */
    public async makeRequest(
        messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],        
        options: {
            temperature?: number;
            maxTokens?: number;
            model?: string;
        } = {}
    ): Promise<string> {
        
        try {
            console.log('Thinking with messages: ', messages)
            const response = await this.client.chat.completions.create({
                model: options.model || process.env.MODEL || 'gpt-4o',
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 1000,
            });

            return response.choices[0]?.message?.content?.trim() || '';
        } catch (error) {
            console.error('LLM request failed:', error);
            throw new Error(`LLM request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}