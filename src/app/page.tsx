'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues with the SDK
const ChatBot = dynamic(() => import('../components/ChatBot'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
        <ChatBot />
      </div>
    </main>
  );
}