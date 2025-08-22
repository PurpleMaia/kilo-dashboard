import { ChatService, SessionManager } from "@/app/llm/services";
import { getUserID } from "@/lib/server-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // get message & dataSummary from the request body
        // const { userMessage, dataSummary } = await req.json() 
        const { userMessage } = await req.json() 
         
        console.log('User:', userMessage)

        const userID = await getUserID()

        const chatService = ChatService.getInstance()

        let conversation = SessionManager.getConversationFromSession(userID)

        if (!conversation) {
            // make new conversation and add it to userID session
            conversation = chatService.createConversation()
            SessionManager.addConversationToSession(userID, conversation)
        }

        // const prompt = formatPrompt(userMessage, dataSummary)

        const response = await chatService.generateResponse(conversation, userMessage)
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
    
/* eslint-disable */
function formatPrompt(userMessage: string, dataSummary: any) {
    return `
        USER: 
        ${userMessage}

        DATA: 
        ${dataSummary}
    `
}
/* eslint-enable */