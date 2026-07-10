import React from "react";
import { Card } from "@/components/ui/Card";
import { BrainCircuit, AlertTriangle, CheckCircle, Zap } from "lucide-react";

interface Insight {
  id: string;
  type: "warning" | "recommendation" | "optimization";
  title: string;
  description: string;
  confidence: number;
}

export const AiInsightsPanel = ({ insights, isLoading }: { insights?: Insight[], isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-64"><div className="h-full bg-gray-800/50 rounded"></div></Card>;
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <BrainCircuit className="text-accent" size={18} /> AI Brain Insights
        </h3>
        <p className="text-sm text-gray-500">No active insights generated at this time.</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
        <BrainCircuit className="text-accent" size={18} /> 
        AI Brain Insights
      </h3>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {insights.map(insight => (
          <div key={insight.id} className="bg-primary-bg border border-gray-800 rounded p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {insight.type === "warning" && <AlertTriangle size={14} className="text-warning" />}
                {insight.type === "recommendation" && <CheckCircle size={14} className="text-success" />}
                {insight.type === "optimization" && <Zap size={14} className="text-info" />}
                <span className="text-sm font-semibold text-gray-200">{insight.title}</span>
              </div>
              <span className="text-xs font-mono text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                {(insight.confidence * 100).toFixed(0)}% conf
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
