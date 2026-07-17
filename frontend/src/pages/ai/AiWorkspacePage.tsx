import React, { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/ai/ChatInput";
import { ChatMessage, ChatMessageData, MessageEvidence } from "@/components/ai/ChatMessage";
import { EvidenceViewer } from "@/components/ai/EvidenceViewer";
import { AgentVisualization, AgentStatus } from "@/components/ai/AgentVisualization";
import { useSendMessage, useConversations } from "@/hooks/useAiQueries";
import type { CopilotCitation } from "@/services/aiService";
import { Button } from "@/components/ui/Button";
import { Sparkles, ThumbsUp, ThumbsDown, Copy, Check, Bell, User, Menu, Plus } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What's the maintenance procedure for Pump P-101?",
  "Show me common issues for Boiler B-601",
  "What are the operating parameters for Compressor C-401?",
  "Find documents about vibration analysis",
  "What's the last maintenance date for Turbine TG-301?",
  "Explain the safety procedure for confined space entry",
];

interface UiChatMessage extends ChatMessageData {
  citations?: CopilotCitation[];
  feedback?: 'helpful' | 'not_helpful';
  created_at?: string;
  conversation_id?: string;
}

export const AiWorkspacePage = () => {
  const [messages, setMessages] = useState<UiChatMessage[]>([
    {
      id: "m-0",
      role: "assistant",
      content: "Hello. I am the MechaMind Industrial Copilot. How can I assist you with your operations today?"
    }
  ]);
  const [activeEvidence, setActiveEvidence] = useState<MessageEvidence | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const sendMessageMutation = useSendMessage();
  const { data: conversations } = useConversations();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMsgId = `m-${Date.now()}`;
    setMessages(prev => [...prev, { 
      id: newMsgId, 
      role: "user", 
      content: text,
      created_at: new Date().toISOString()
    }]);
    
    setAgents([
      { id: "a1", name: "IoT Analyst", type: "iot", status: "thinking", message: "Querying sensors..." },
      { id: "a2", name: "Knowledge Retrieval", type: "knowledge", status: "thinking", message: "Searching manuals..." }
    ]);

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: text,
        conversation_id: activeConversationId ?? undefined,
      });

      if (!activeConversationId && response.conversation_id) {
        setActiveConversationId(response.conversation_id);
      }

      setAgents([
        { id: "a1", name: "IoT Analyst", type: "iot", status: "complete" },
        { id: "a2", name: "Knowledge Retrieval", type: "knowledge", status: "complete" }
      ]);

      const evidenceList: MessageEvidence[] = response.sources.map((s, i) => ({
        id: `ev-${i}`,
        type: "document" as const,
        title: s.document_name,
        relevance: 0.9,
      }));

      setMessages(prev => [...prev, { 
        id: `m-ai-${Date.now()}`, 
        role: "assistant", 
        content: response.answer,
        confidence: response.confidence ? parseFloat(response.confidence) : undefined,
        evidence: evidenceList.length > 0 ? evidenceList : undefined,
        citations: response.sources,
        created_at: new Date().toISOString(),
        conversation_id: response.conversation_id,
      }]);
      
      setTimeout(() => setAgents([]), 3000);
    } catch {
      setAgents([]);
      setMessages(prev => prev.filter(m => m.id !== newMsgId));
    }
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not_helpful') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([{
      id: "m-0",
      role: "assistant",
      content: "Hello. I am the MechaMind Industrial Copilot. How can I assist you with your operations today?"
    }]);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-primary-bg -mx-8 -my-6">
      {/* Chat Sessions Sidebar */}
      <aside className={`w-64 flex-shrink-0 border-r border-gray-800 bg-secondary-bg flex flex-col transition-all duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full hidden'}`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm">Chat Sessions</h2>
          <button
            onClick={handleNewConversation}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title="New conversation"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {(!conversations || conversations.length === 0) ? (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Start a new conversation</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-gray-700/50 border border-gray-600'
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <span className="font-medium text-gray-200 text-sm block truncate">
                  {conv.title || `Conversation ${conv.id.slice(0, 8)}`}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(conv.created_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative transition-all duration-300" style={{ marginRight: activeEvidence ? '320px' : '0' }}>
        
        {/* Header */}
        <div className="h-14 border-b border-gray-800 flex items-center px-6 bg-secondary-bg/50 backdrop-blur-sm z-10 gap-4">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-white text-sm">MechaMind Copilot Workspace</h2>
            <p className="text-[10px] text-gray-500">Ask questions about your industrial documents</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
              <Bell size={16} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="User menu">
              <User size={16} />
            </Button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
          {messages.length <= 1 ? (
            <div className="max-w-2xl mx-auto text-center py-12">
              <Sparkles className="h-16 w-16 mx-auto text-accent mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Knowledge Copilot</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
                Ask me anything about your equipment, procedures, maintenance records, or compliance documents.
                I'll search through your knowledge base and provide answers with source citations.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="secondary"
                    size="sm"
                    className="text-left"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.slice(1).map(msg => (
                <div key={msg.id} className="group">
                  <ChatMessage 
                    message={msg} 
                    onEvidenceClick={(ev) => setActiveEvidence(ev)} 
                  />
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="ml-16 pl-4 border-l-2 border-gray-800 mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Sources</p>
                      <div className="space-y-1">
                        {msg.citations.slice(0, 3).map((citation, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-300 truncate">{citation.document_name}</p>
                              {citation.section && (
                                <p className="text-xs text-gray-500">Section: {citation.section}</p>
                              )}
                              {citation.page_number && <span className="text-xs text-accent">Page {citation.page_number}</span>}
                            </div>
                          </div>
                        ))}
                        {msg.citations.length > 3 && (
                          <p className="text-xs text-gray-500">+{msg.citations.length - 3} more sources</p>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Feedback Actions */}
                  {msg.role === 'assistant' && (
                    <div className="ml-16 flex items-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-gray-500">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                      </span>
                      <button
                        onClick={() => handleFeedback(msg.id, 'helpful')}
                        className={`p-1 rounded hover:bg-gray-800 ${msg.feedback === 'helpful' ? 'text-green-500' : 'text-gray-500'}`}
                        aria-label="Mark as helpful"
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'not_helpful')}
                        className={`p-1 rounded hover:bg-gray-800 ${msg.feedback === 'not_helpful' ? 'text-red-500' : 'text-gray-500'}`}
                        aria-label="Mark as not helpful"
                      >
                        <ThumbsDown size={12} />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="p-1 rounded hover:bg-gray-800 text-gray-500"
                        aria-label="Copy message"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          
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