import OpenAI from 'openai';

// Singleton instance of the LLM connection
export class LLMClient {
    private static instance: OpenAI;
    
    /**     
     * Creates a new client or returns the active instance
     * @returns LLMClient object
     */
    static getInstance(): OpenAI {
        if (!this.instance) {
            this.instance = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
                baseURL: process.env.OPENAI_BASE_URL,
                maxRetries: 3,
                timeout: 30000,                
            });
        }
        return this.instance;
    }

    /**    
     * Retrieves current instance and starts a message
     * @param messages message history     
     * @returns LLM response
     */
    static async makeRequest(
        messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        options: {
            temperature?: number;
            maxTokens?: number;
            model?: string;
        } = {}
    ): Promise<string> {
        const client = this.getInstance();
        
        try {
            console.log('Thinking...')
            const response = await client.chat.completions.create({
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