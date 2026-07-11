import React from "react";
import { Terminal, Database, ShieldAlert, Cpu } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { Badge } from "@/components/ui/Badge";

export const AiOperationsDashboardPage = () => {
  // Mock data for token usage
  const tokenData = Array.from({ length: 7 }).map((_, i) => ({
    day: `Day ${i+1}`,
    gemini: Math.floor(Math.random() * 50000) + 10000,
    openai: Math.floor(Math.random() * 20000) + 5000,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="text-info" /> MLOps & AI Operations
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor token usage, model safety metrics, and evaluation pipelines</p>
        </div>
        <Badge variant="success" className="font-mono">API Health: 99.9%</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Tokens (30d)" value="1.2M" trend={12} isLoading={false} />
        <StatCard title="Est. Inference Cost" value="$14.20" trend={5} isLoading={false} />
        <StatCard title="Avg Latency" value="840ms" trend={-2} isLoading={false} />
        <StatCard title="Hallucination Rate" value="0.2%" trend={-15} isLoading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 h-[350px]">
             <h3 className="font-bold text-white mb-4">Token Usage by Provider</h3>
             <AdvancedChart 
               type="bar" 
               data={tokenData} 
               xAxisKey="day" 
               series={[
                 { dataKey: "gemini", name: "Gemini 1.5", color: "#3b82f6" },
                 { dataKey: "openai", name: "GPT-4o", color: "#14F195" },
               ]} 
             />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-0 overflow-hidden border-gray-800">
             <div className="bg-secondary-bg/50 p-4 border-b border-gray-800 flex items-center gap-2">
               <ShieldAlert className="text-warning" size={18} />
               <h3 className="font-bold text-white text-sm">Safety & Evaluation</h3>
             </div>
             <div className="p-4 space-y-4">
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Groundedness Score (RAG)</span>
                   <span className="text-success font-bold font-mono">98.5%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded"><div className="h-full bg-success w-[98.5%]"></div></div>
               </div>
               
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Context Relevance</span>
                   <span className="text-warning font-bold font-mono">82.1%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded"><div className="h-full bg-warning w-[82.1%]"></div></div>
               </div>
             </div>
          </Card>

          <Card className="p-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={16} className="text-accent"/> A/B Test: RCA Prompt</h3>
             <div className="flex justify-between items-center bg-primary-bg p-3 border border-gray-800 rounded mb-2">
               <div>
                 <p className="text-sm font-bold text-gray-300">v2.1 (Current)</p>
                 <p className="text-xs text-gray-500">Context window: 4k</p>
               </div>
               <Badge variant="success">Winner</Badge>
             </div>
             <div className="flex justify-between items-center bg-primary-bg p-3 border border-gray-800 rounded opacity-50">
               <div>
                 <p className="text-sm font-bold text-gray-300">v2.2 (Challenger)</p>
                 <p className="text-xs text-gray-500">Context window: 8k</p>
               </div>
               <span className="text-xs text-gray-500">Failed: High Latency</span>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
