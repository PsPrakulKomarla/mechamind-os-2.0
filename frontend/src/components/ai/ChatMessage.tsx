import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BrainCircuit, User, AlertTriangle, Link as LinkIcon, FileText } from "lucide-react";
import { clsx } from "clsx";
import { Badge } from "@/components/ui/Badge";

export interface MessageEvidence {
  id: string;
  type: "document" | "sensor" | "vision";
  title: string;
  relevance: number;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  confidence?: number;
  evidence?: MessageEvidence[];
}

export const ChatMessage = ({ message, onEvidenceClick }: { message: ChatMessageData, onEvidenceClick?: (e: MessageEvidence) => void }) => {
  const isAi = message.role === "assistant";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-800/50 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700/50">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("flex gap-4 py-6 px-4 md:px-6 w-full group", {
      "bg-secondary-bg/30": isAi,
      "bg-transparent": !isAi
    })}>
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mt-1 border shadow-sm">
        {isAi ? (
          <div className="w-full h-full bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent">
            <BrainCircuit size={16} />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400">
            <User size={16} />
          </div>
        )}
      </div>

      <div className="flex-1 max-w-4xl min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-semibold text-sm text-gray-200">
            {isAi ? "MechaMind Brain" : "You"}
          </span>
          {isAi && message.confidence && (
            <Badge variant={message.confidence > 0.8 ? "success" : "warning"} className="text-[10px] py-0">
              {(message.confidence * 100).toFixed(0)}% Confidence
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-300 leading-relaxed prose prose-invert max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Evidence Cards Render */}
        {isAi && message.evidence && message.evidence.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {message.evidence.map(ev => (
              <button 
                key={ev.id}
                onClick={() => onEvidenceClick && onEvidenceClick(ev)}
                className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md px-2.5 py-1.5 text-gray-300 transition-colors"
              >
                {ev.type === "document" ? <FileText size={12} className="text-info" /> : <AlertTriangle size={12} className="text-warning" />}
                <span className="truncate max-w-[150px]">{ev.title}</span>
                <span className="text-gray-500">{(ev.relevance * 100).toFixed(0)}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
