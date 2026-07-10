import React, { useState } from "react";
import { Send, Paperclip, Mic, Cpu } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (msg: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-primary-bg p-4 border-t border-gray-800">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
        <div className="flex items-center gap-2 mb-2 px-1 text-xs text-gray-500">
          <button type="button" className="flex items-center gap-1 hover:text-white transition-colors">
            <Cpu size={14} className="text-accent" />
            <span>Select Context (e.g. Machine M-201)</span>
          </button>
        </div>
        
        <div className="relative flex items-end gap-2 bg-secondary-bg border border-gray-700 rounded-xl px-3 py-2 focus-within:border-accent transition-colors shadow-sm">
          <button 
            type="button" 
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors mb-0.5"
            title="Attach File or Blueprint"
          >
            <Paperclip size={18} />
          </button>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask MechaMind Brain a question about your factory..."
            className="flex-1 max-h-48 min-h-[40px] bg-transparent text-gray-200 placeholder-gray-500 resize-none outline-none py-2 text-sm leading-relaxed"
            rows={1}
            disabled={isLoading}
          />

          <button 
            type="button" 
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors mb-0.5"
            title="Voice Input"
          >
            <Mic size={18} />
          </button>
          
          <button 
            type="submit" 
            disabled={!message.trim() || isLoading}
            className="p-2 bg-accent text-white rounded-full hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5 shadow-md"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </div>
        <div className="text-center mt-2 text-[10px] text-gray-600">
          MechaMind AI can make mistakes. Please verify critical industrial parameters.
        </div>
      </form>
    </div>
  );
};
