'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { ChatInputProps } from '../types';

const ChatInput = ({ onSendMessage, isDisabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || isDisabled) return;

    onSendMessage(message);
    setMessage('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 rounded-b-lg sticky bottom-0 shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isDisabled}
          className="flex-1 p-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
        />
        <button
          type="submit"
          disabled={isDisabled || message.trim() === ''}
          aria-label="Send message"
          className={`p-3 rounded-full flex items-center justify-center w-12 h-12 transition-colors ${
            isDisabled || message.trim() === ''
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          {isDisabled ? (
            <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;