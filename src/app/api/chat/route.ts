import { NextResponse } from 'next/server';

// Message structure for API request
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

// AI API URL and key
// These values should be read from environment variables
const API_URL = process.env.AI_API_URL || 'https://api.hyperbolic.xyz/v1/chat/completions';
const API_KEY = process.env.AI_API_KEY || '';

export async function POST(request: Request) {
  try {
    // Read request data
    const body: ChatRequest = await request.json();
    
    // Add system message to the beginning of messages
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant on Farcaster. Be concise, polite, and helpful. If you are unsure of an answer, say so.'
      },
      ...body.messages
    ];

    // Send request to AI API
    const aiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages,
        model: 'meta-llama/Meta-Llama-3-70B-Instruct',
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    
    // Extract assistant message
    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}