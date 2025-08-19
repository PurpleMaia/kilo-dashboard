import { LLMClient } from "./client";

const INSIGHTS_SYSTEM_PROMPT = `You are a data analyst expert. Analyze the provided data and generate actionable insights. 
Focus on trends, anomalies, and business recommendations. Be concise but thorough.`;

export class DataInsightsService {
    
    static async generateInsights(data: any): Promise<string> {
        const formattedData = this.formatDataForInsights(data)
        const messages = [
            { role: 'system' as const, content: INSIGHTS_SYSTEM_PROMPT },
            { 
                role: 'user' as const, 
                content: [
                    'Please analyze the following data and provide key insights:',
                    '',
                    formattedData,
                    '',
                    'Focus on actionable recommendations and notable patterns.'
                ].join('\n')
            }
        ];

        return LLMClient.makeRequest(messages, {
            temperature: 0.3,
            maxTokens: 1000,
        });
    }

    static async generateSummary(data: any): Promise<string> {
        const formattedData = this.formatDataForInsights(data);
        
        const messages = [
            { role: 'system' as const, content: 'Create concise summaries of data. Maximum 3 sentences.' },
            { 
                role: 'user' as const, 
                content: `Summarize this data briefly:\n\n${formattedData}`
            }
        ];

        return LLMClient.makeRequest(messages, {
            temperature: 0.1,
            maxTokens: 200,
        });
    }
    
    private static formatDataForInsights(data: any): string {
        // Your insights-specific formatting logic
        return JSON.stringify(data);
    }
}

const CHAT_SYSPROMPT='You are a helpful agroforestry assistant, rooted in Hawaiian ecological practices. Assist the user with any recommendations based on Hawaiian practices combined with modern approaches.'
export class ChatService {

    static async generateMessage(input: string): Promise<string> {
        const messages = [
            { role: 'system' as const, content: CHAT_SYSPROMPT },
            { 
                role: 'user' as const, 
                content: input
            }
        ];

        return LLMClient.makeRequest(messages, {
            temperature: 0.8,
            maxTokens: 1000,
        });
    }
}