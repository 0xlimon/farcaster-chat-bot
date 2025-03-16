// Define common types used across components

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}