'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import sdk from '@farcaster/frame-sdk';
import { FrameContext } from '../lib/types';
import { Message, ChatMessagesProps } from '../types';

// Import components dynamically to prevent module resolution issues
const ChatInput = dynamic(() => import('@/components/ChatInput'), { 
  ssr: false,
  loading: () => <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
});

const ChatMessages = dynamic<ChatMessagesProps>(() => import('@/components/ChatMessages'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
});

export default function ChatBot() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const contextData = await sdk.context;
        setContext(contextData);
        console.log('Farcaster context loaded:', contextData);
        sdk.actions.ready();
      } catch (error) {
        console.error('Error loading Farcaster SDK:', error);
      }
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  // Adjust container height based on viewport
  useEffect(() => {
    const adjustHeight = () => {
      if (chatContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const maxHeight = Math.min(viewportHeight * 0.9, 700); // 90% of viewport height, max 700px
        chatContainerRef.current.style.height = `${maxHeight}px`;
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (content.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Get user profile info
  const userDisplayName = context?.user?.displayName || context?.user?.username || `FID: ${context?.user?.fid}`;
  const userProfileImage = context?.user?.pfpUrl;

  return (
    <div 
      ref={chatContainerRef}
      className="w-full max-w-md mx-auto rounded-xl shadow-xl overflow-hidden flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Header with user info */}
      <div className="bg-indigo-600 dark:bg-indigo-800 p-4 text-white shadow-md">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-xl font-bold">Farcaster Chat</h1>
            <p className="text-xs text-indigo-200">AI-powered assistant</p>
          </div>
          {context?.user && (
            <div className="flex items-center space-x-2">
              <div className="text-right text-sm">
                <p className="font-medium">{userDisplayName}</p>
                <p className="text-xs text-indigo-200">Connected</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-400 flex items-center justify-center">
                {userProfileImage ? (
                  <Image 
                    src={userProfileImage} 
                    alt={userDisplayName || 'User profile'} 
                    width={40} 
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                    priority={true}
                    onError={(e) => {
                      console.error('Error loading profile image:', userProfileImage);
                      // Switch to default icon on error
                      const target = e.target as HTMLImageElement;
                      if (target) {
                        target.style.display = 'none';
                      }
                    }}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
        {ChatMessages && 
          <ChatMessages messages={messages} isLoading={isLoading} />
        }
      </div>

      {/* Input area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {ChatInput && 
          <ChatInput onSendMessage={sendMessage} isDisabled={isLoading} />
        }
      </div>
    </div>
  );
}