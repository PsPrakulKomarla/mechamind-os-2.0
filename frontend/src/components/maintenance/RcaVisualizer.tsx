import React from "react";
import { Card } from "@/components/ui/Card";
import { AlertTriangle, ChevronRight, CheckCircle } from "lucide-react";

interface RootCauseData {
  problem: string;
  whys: string[];
  recommendation: string;
}

export const RcaVisualizer = ({ data, isLoading }: { data?: RootCauseData, isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-64 flex items-center justify-center text-gray-500">Generating AI Root Cause Analysis...</Card>;
  }

  if (!data) {
    return (
      <Card className="h-64 flex flex-col items-center justify-center text-gray-500">
        <AlertTriangle size={48} className="mb-4 opacity-50" />
        <p>No Root Cause Analysis data available.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-danger">
        <h3 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Observed Problem</h3>
        <p className="text-white font-medium text-lg">{data.problem}</p>
      </Card>

      <div className="pl-4 space-y-3 relative before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gray-800">
        {data.whys.map((why, index) => (
          <div key={index} className="relative pl-6">
            <span className="absolute left-0 top-3 w-4 h-0.5 bg-gray-800"></span>
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-secondary-bg border-2 border-accent"></div>
            
            <Card className="p-3 bg-secondary-bg/50 hover:bg-secondary-bg transition-colors">
              <div className="flex gap-3">
                <span className="text-accent font-bold text-sm">Why?</span>
                <p className="text-sm text-gray-300">{why}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Card className="border-l-4 border-l-success mt-6 bg-success/5">
        <h3 className="text-xs text-success uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
          <CheckCircle size={14} /> Corrective Action (AI Recommended)
        </h3>
        <p className="text-gray-200 text-sm leading-relaxed">{data.recommendation}</p>
      </Card>
    </div>
  );
};
