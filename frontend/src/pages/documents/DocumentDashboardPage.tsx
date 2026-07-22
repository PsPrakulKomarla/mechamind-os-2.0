import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useDocumentDashboardStats, useDocumentList } from "@/hooks/useDocumentQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { Link } from "react-router-dom";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FileText, Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export const DocumentDashboardPage = () => {
  const { data: stats, isLoading } = useDocumentDashboardStats();
  const { data: docsData, isLoading: docsLoading } = useDocumentList({ limit: 5 });
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const documents = docsData?.items || docsData || [];
  const isEmpty = !hasDocuments && !stats && documents.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Document Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise Library & OCR Processing</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <FileText size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Documents Yet</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">Upload industrial documents to start building your knowledge base.</p>
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
            <StatCard title="Total Documents" value={stats?.total ?? "—"} trend={stats?.total_trend} isLoading={isLoading} />
            <StatCard title="Pending Review" value={stats?.pending ?? "—"} trend={stats?.pending_trend} isLoading={isLoading} />
            <StatCard title="OCR Success Rate" value={stats?.ocrRate ? `${stats.ocrRate}%` : "—"} trend={stats?.ocr_trend} isLoading={isLoading} />
            <StatCard title="Knowledge Nodes" value={stats?.nodes ?? "—"} trend={stats?.nodes_trend} isLoading={isLoading} />
          </div>

          {stats?.uploadHistory && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 bg-secondary-bg border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/20">
                <h2 className="text-lg font-semibold text-white mb-6">Uploads & OCR Processing Over Time</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.uploadHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOcr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#6B7280" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px' }}
                        itemStyle={{ color: '#E5E7EB' }}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
                      <Area type="monotone" dataKey="uploads" name="Total Uploads" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUploads)" />
                      <Area type="monotone" dataKey="ocr" name="Successful OCR" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorOcr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {stats?.categoryDistribution && (
                <div className="bg-secondary-bg border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/20 flex flex-col">
                  <h2 className="text-lg font-semibold text-white mb-2">Category Distribution</h2>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={stats.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {stats.categoryDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px' }}
                          itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {!stats?.uploadHistory && (
            <div className="bg-secondary-bg border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">Upload charts will appear once document data is available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
