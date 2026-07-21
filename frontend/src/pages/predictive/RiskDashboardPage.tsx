import React from "react";
import { AlertTriangle, ShieldAlert, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";

export const RiskDashboardPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  const riskData: any[] = [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-secondary-bg border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-white mb-1">{data.name} ({data.id})</p>
          <p className="text-xs text-danger">Probability: {data.prob}%</p>
          <p className="text-xs text-warning">Severity: {data.impact}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-danger" /> Asset Risk Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise risk matrix plotting failure probability vs operational impact</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <ShieldAlert size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Risk Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload asset data and failure records to enable risk assessment.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Risk Matrix</h3>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-danger/80"></div> Critical Risk</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-warning/80"></div> Moderate Risk</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-success/80"></div> Low Risk</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-5 pointer-events-none ml-[40px] mb-[30px]">
                <div className="bg-warning"></div>
                <div className="bg-danger"></div>
                <div className="bg-success"></div>
                <div className="bg-warning"></div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" dataKey="prob" name="Probability" domain={[0, 100]} stroke="#94a3b8" label={{ value: 'Probability of Failure (%)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                  <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 100]} stroke="#94a3b8" label={{ value: 'Operational Impact Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <ZAxis type="number" dataKey="z" range={[100, 500]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Assets" data={riskData} fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
              {riskData.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  Risk data will appear after processing asset information.
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-0 overflow-hidden border-gray-800">
              <div className="bg-secondary-bg/50 p-4 border-b border-gray-800 flex items-center gap-2">
                <AlertTriangle className="text-gray-500" size={18} />
                <h3 className="font-bold text-white text-sm">Critical Risk Assets</h3>
              </div>
              <div className="p-8 text-center text-gray-500 text-sm">
                No critical risk assets identified yet.
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
