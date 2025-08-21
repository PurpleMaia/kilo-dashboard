'use client'

import { useState } from "react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        const userMsg: Message = {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        };

        setInput(''); // reset input after submission
        setMessages(prev => [...prev, userMsg]); // append message to ongoing message frontend array 
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/llm/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            const assistantMsg: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 h-full">
            <div className="flex flex-col h-full max-w-2xl mx-auto p-4 bg-white rounded-md">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg ${
                                message.role === 'user'
                                    ? 'bg-gray-200 ml-auto max-w-4/5'
                                    : 'bg-lime-100 mr-auto max-w-4/5'
                            }`}
                        >
                            <p className="text-sm font-medium mb-1 capitalize">
                                {message.role}
                            </p>
                            <p>{message.content}</p>
                        </div>
                    ))}
                    {loading && (
                        <div className="bg-gray-100 mr-auto max-w-xs p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Assistant</p>
                            <p>Typing...</p>
                        </div>
                    )}
                </div>
                
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="px-4 py-2 bg-lime-800 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
        );
}