# Farcaster ChatBot Frame

A chat bot implementation for Farcaster using Frames v2. This chat bot allows users to have conversations and ask questions through a Farcaster frame.

## Features

- Interactive chat interface
- Integration with AI models via API
- Responsive design
- Farcaster Frame v2 implementation
- User authentication through Farcaster account

## Prerequisites

- Node.js 18.x or later
- Yarn package manager
- A Farcaster account
- AI API access (optional, but recommended for full functionality)

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/farcaster-chatbot-frame.git
cd farcaster-chatbot-frame
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
AI_API_URL=https://api.hyperbolic.xyz/v1/chat/completions
AI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

## Development

To start the development server:

```bash
yarn dev
```

This will start a local server at http://localhost:3000.

## Deploying to Production

1. Build the production version:

```bash
yarn build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.).

## Using with Farcaster

To use this chat bot with Farcaster:

1. Deploy your application to a public URL
2. Create a Farcaster domain manifest file at `/.well-known/farcaster.json`
3. Follow the Farcaster developer documentation to register your frame
4. Users can access your chat bot through the Farcaster client

## Usage

When a user accesses your frame through Farcaster:

1. The chat bot will be presented with a welcome message
2. Users can type and send messages
3. The AI will respond to the user's messages
4. The conversation history is maintained during the session

## Customization

You can customize various aspects of the chat bot:

- Change the system prompt in `src/app/api/chat/route.ts`
- Modify the UI design in the component files
- Adjust the AI model parameters in the API request

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.