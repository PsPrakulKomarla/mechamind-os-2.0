import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDocumentDashboardStats } from "@/hooks/useDocumentQueries";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const uploadData = [
  { name: "Jan", uploads: 120, ocr: 115 },
  { name: "Feb", uploads: 210, ocr: 205 },
  { name: "Mar", uploads: 180, ocr: 175 },
  { name: "Apr", uploads: 290, ocr: 280 },
  { name: "May", uploads: 350, ocr: 342 },
  { name: "Jun", uploads: 420, ocr: 418 },
  { name: "Jul", uploads: 380, ocr: 375 },
];

const categoryData = [
  { name: "Maintenance Manuals", value: 650 },
  { name: "Compliance & Safety", value: 420 },
  { name: "Technical Specs", value: 250 },
  { name: "IoT Schematics", value: 172 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export const DocumentDashboardPage = () => {
  const { data: stats, isLoading } = useDocumentDashboardStats();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Document Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise Library & OCR Processing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Documents" value={stats?.total || "1,492"} trend={5.2} isLoading={isLoading} />
        <StatCard title="Pending Review" value={stats?.pending || "24"} trend={-1.5} isLoading={isLoading} />
        <StatCard title="OCR Success Rate" value={`${stats?.ocrRate || "99.2"}%`} trend={0.1} isLoading={isLoading} />
        <StatCard title="Knowledge Nodes" value={stats?.nodes || "18,401"} trend={12.4} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
         {/* Uploads Over Time */}
         <div className="lg:col-span-2 bg-secondary-bg border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white mb-6">Uploads & OCR Processing Over Time</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uploadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

         {/* Category Distribution */}
         <div className="bg-secondary-bg border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/20 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-2">Category Distribution</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
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
      </div>
    </div>
  );
};
