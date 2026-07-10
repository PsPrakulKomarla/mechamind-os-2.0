import React from "react";
import { Card } from "@/components/ui/Card";
import { BrainCircuit, AlertTriangle, FileText, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import ReactMarkdown from "react-markdown";

interface DocumentSummary {
  executiveSummary: string;
  keyPoints: string[];
  machinesMentioned: string[];
  warnings: string[];
}

export const AiSummaryPanel = ({ summary, isLoading }: { summary?: DocumentSummary, isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-64 flex flex-col justify-center items-center text-gray-500">Generating AI Summary...</Card>;
  }

  if (!summary) {
    return (
      <Card className="h-64 flex flex-col justify-center items-center text-gray-500">
        <BrainCircuit size={48} className="mb-4 opacity-50" />
        <p>No AI Summary available for this document.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Executive Summary Col */}
      <div className="md:col-span-2 space-y-6">
        <Card>
          <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
            <FileText className="text-accent" size={20} />
            Executive Summary
          </h3>
          <div className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed">
            <ReactMarkdown>{summary.executiveSummary}</ReactMarkdown>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
            <Zap className="text-info" size={20} />
            Key Procedures & Points
          </h3>
          <ul className="space-y-2">
            {summary.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-accent mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Sidebar Col */}
      <div className="space-y-6">
        {summary.warnings.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <h3 className="font-bold text-warning text-sm flex items-center gap-2 mb-3">
              <AlertTriangle size={16} />
              Critical Warnings
            </h3>
            <ul className="space-y-2">
              {summary.warnings.map((warning, idx) => (
                <li key={idx} className="text-xs text-gray-300 border-l-2 border-warning pl-2 py-1">
                  {warning}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card>
          <h3 className="font-bold text-white text-sm mb-3">Detected Entities</h3>
          <div className="flex flex-wrap gap-2">
            {summary.machinesMentioned.map((machine, idx) => (
              <Badge key={idx} variant="secondary" className="border-gray-700">
                {machine}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
