import React, { useState } from "react";
import { AgentHub } from "@/components/agents/AgentHub";
import { useGetAgents, useStartChat } from "@/hooks/useAIChat";

export const AgentHubPage: React.FC = () => {
  const { data: agents, isLoading } = useGetAgents();
  const startChat = useStartChat();
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleStartChat = (agentId: string) => {
    startChat.mutate(
      { agentId, initialMessage: "Hello, I need some assistance." },
      {
        onSuccess: (data) => {
          setActiveChat(data.chatId);
          // In a real app, this would route to a chat view or open a modal
        }
      }
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Agent Hub</h1>
        <p className="text-muted-foreground mt-2">
          Discover and collaborate with specialized AI agents across your operations.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-agent"></div>
        </div>
      ) : (
        <AgentHub 
          agents={agents || []} 
          onStartChat={handleStartChat} 
        />
      )}
      
      {activeChat && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg">
          Chat session {activeChat} started! (UI pending)
          <button className="ml-4 text-xs underline" onClick={() => setActiveChat(null)}>Close</button>
        </div>
      )}
    </div>
  );
};
