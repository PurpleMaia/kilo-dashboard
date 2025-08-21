import { chatService } from "@/app/llm/services";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        // get prompt from the request body
        const { prompt } = await req.json() 
         
        console.log('User:', prompt)
                
        const response = await chatService.generateResponse(prompt)
        console.log('LLM:', response)

        return NextResponse.json({
            response
        })
    } catch (error) {
        console.error('Chat API error: ', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}