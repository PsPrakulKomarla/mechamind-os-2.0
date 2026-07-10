import React, { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/ai/ChatInput";
import { ChatMessage, ChatMessageData, MessageEvidence } from "@/components/ai/ChatMessage";
import { EvidenceViewer } from "@/components/ai/EvidenceViewer";
import { AgentVisualization, AgentStatus } from "@/components/ai/AgentVisualization";
import { useSendMessage } from "@/hooks/useAiQueries";

export const AiWorkspacePage = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "m-0",
      role: "assistant",
      content: "Hello. I am the MechaMind Industrial Copilot. How can I assist you with your operations today?"
    }
  ]);
  const [activeEvidence, setActiveEvidence] = useState<MessageEvidence | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  
  const sendMessageMutation = useSendMessage();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMsgId = `m-${Date.now()}`;
    setMessages(prev => [...prev, { id: newMsgId, role: "user", content: text }]);
    
    // Simulate multi-agent processing delay
    setAgents([
      { id: "a1", name: "IoT Analyst", type: "iot", status: "thinking", message: "Querying sensors..." },
      { id: "a2", name: "Knowledge Retrieval", type: "knowledge", status: "thinking", message: "Searching manuals..." }
    ]);

    // This is where a real streaming socket would connect. For foundation, we mock the delay.
    setTimeout(() => {
      setAgents([
        { id: "a1", name: "IoT Analyst", type: "iot", status: "complete" },
        { id: "a2", name: "Knowledge Retrieval", type: "knowledge", status: "complete" }
      ]);
      
      setMessages(prev => [...prev, { 
        id: `m-ai-${Date.now()}`, 
        role: "assistant", 
        content: `Based on the latest telemetry and the SIEMENS operator manual, the vibration anomaly on **M-201** is likely caused by bearing wear on the primary spindle.\n\n### Recommendations:\n1. Schedule maintenance within 48 hours.\n2. Reduce spindle speed by 15% immediately.\n\nI have attached the relevant documentation.`,
        confidence: 0.92,
        evidence: [
          { id: "e1", type: "document", title: "SIEMENS M201 Manual", relevance: 0.98 },
          { id: "e2", type: "sensor", title: "M201 Vib-Sensor A", relevance: 0.95 }
        ]
      }]);
      
      setTimeout(() => setAgents([]), 3000);
    }, 2500);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-primary-bg -mx-8 -my-6">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative transition-all duration-300" style={{ marginRight: activeEvidence ? '320px' : '0' }}>
        
        {/* Header */}
        <div className="h-14 border-b border-gray-800 flex items-center px-6 bg-secondary-bg/50 backdrop-blur-sm z-10">
          <h2 className="font-semibold text-white">MechaMind Copilot Workspace</h2>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
          {messages.map(msg => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onEvidenceClick={(ev) => setActiveEvidence(ev)} 
            />
          ))}
          
          {agents.length > 0 && (
            <div className="px-4 md:px-6">
              <AgentVisualization agents={agents} />
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="w-full">
          <ChatInput onSendMessage={handleSendMessage} isLoading={agents.some(a => a.status === "thinking")} />
        </div>
      </div>

      {/* Evidence Side Panel */}
      <EvidenceViewer evidence={activeEvidence} onClose={() => setActiveEvidence(null)} />
    </div>
  );
};
