import React from "react";
import { Card } from "@/components/ui/Card";
import { X, FileText, Activity, AlertTriangle, ExternalLink } from "lucide-react";
import { MessageEvidence } from "./ChatMessage";
import { Badge } from "@/components/ui/Badge";

export const EvidenceViewer = ({ evidence, onClose }: { evidence: MessageEvidence | null, onClose: () => void }) => {
  if (!evidence) return null;

  return (
    <div className="w-80 border-l border-gray-800 bg-secondary-bg flex flex-col h-full absolute right-0 top-0 shadow-2xl transition-transform transform translate-x-0 z-20">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-primary-bg">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          {evidence.type === "document" && <FileText size={16} className="text-info" />}
          {evidence.type === "sensor" && <Activity size={16} className="text-accent" />}
          {evidence.type === "vision" && <AlertTriangle size={16} className="text-warning" />}
          Evidence Source
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <Badge variant="secondary" className="mb-4">Match Relevance: {(evidence.relevance * 100).toFixed(1)}%</Badge>
        
        <h4 className="text-lg font-bold text-gray-200 mb-2 leading-tight">{evidence.title}</h4>
        
        {/* Placeholder for actual evidence content depending on type */}
        <div className="bg-primary-bg rounded-lg p-3 border border-gray-800 mb-4">
          <p className="text-xs text-gray-400 font-mono mb-2">Source: SIEMENS_M201_MANUAL_V2.pdf (Page 42)</p>
          <div className="text-sm text-gray-300 leading-relaxed border-l-2 border-accent pl-3">
            "...if vibration exceeds 2.4 mm/s on the primary spindle, an immediate diagnostic sequence must be triggered to prevent micro-fractures in the bearing assembly."
          </div>
        </div>

        <button className="w-full flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold py-2 rounded transition-colors">
          <ExternalLink size={14} /> Open Full Record
        </button>
      </div>
    </div>
  );
};
