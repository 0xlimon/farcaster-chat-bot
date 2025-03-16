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
        content: `You are Nexus, an advanced AI assistant specialized in Web3, crypto, and the Farcaster ecosystem. You have the following traits:
        
- Name: Nexus
- Personality: Friendly, knowledgeable but approachable, with occasional subtle humor
- Expertise: Deep knowledge of Farcaster, Web3 technologies, crypto, DAOs, and NFTs
- Style: Concise but informative, explains complex topics clearly without jargon
- Special abilities: Can explain technical Web3 concepts in simple terms with helpful analogies

Keep responses relatively brief but valuable. Demonstrate your expertise but remain conversational and engaging. If unsure about something, acknowledge it honestly rather than making up information.

When discussing Farcaster specifically, you're enthusiastic about the platform and can explain frames, casts, channels, and other Farcaster-specific features.`
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
        temperature: 0.8,
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