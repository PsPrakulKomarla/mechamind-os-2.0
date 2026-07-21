import React from "react";
import { Terminal, Database, ShieldAlert, Cpu, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";

export const AiOperationsDashboardPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="text-info" /> MLOps & AI Operations
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor token usage, model safety metrics, and evaluation pipelines</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Terminal size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No AI Operations Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Process documents through the AI pipeline to generate token usage and model metrics.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Upload Documents
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Tokens (30d)" value="—" isLoading={false} />
            <StatCard title="Est. Inference Cost" value="—" isLoading={false} />
            <StatCard title="Avg Latency" value="—" isLoading={false} />
            <StatCard title="Hallucination Rate" value="—" isLoading={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 h-[350px] flex items-center justify-center text-gray-500 text-sm">
                Token usage data will appear after processing documents.
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
                      <span className="text-gray-500 font-mono">—</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded"></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Context Relevance</span>
                      <span className="text-gray-500 font-mono">—</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded"></div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={16} className="text-accent"/> A/B Test: RCA Prompt</h3>
                <p className="text-gray-500 text-xs text-center py-4">No A/B tests configured yet.</p>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
