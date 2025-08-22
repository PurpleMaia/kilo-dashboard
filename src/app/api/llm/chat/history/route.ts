import { ChatService, SessionManager } from "@/app/llm/services";
import { getUserID } from "@/lib/server-utils";
import { NextResponse } from "next/server";
export async function GET() {
    try {        

        const userID = await getUserID()

        const chatService = ChatService.getInstance()

        let conversation = SessionManager.getConversationFromSession(userID)

        if (!conversation) {
            // make new conversation and add it to userID session
            conversation = chatService.createConversation(userID)
            SessionManager.addConversationToSession(userID, conversation)
        }

        const history = conversation.getMessages().slice(1)

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