import { ChatService } from "@/app/llm/services";
import { NextResponse } from "next/server";
export async function GET() {
    try {        
        const chatService = ChatService.getInstance()

        const history = chatService.getMessageHistory()

        console.log('History:', history)

        return NextResponse.json({
            history
        })
    } catch (error) {
        console.error('Chat API error: ', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}