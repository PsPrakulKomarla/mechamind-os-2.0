import React from "react";
import { KPIWidget } from "@/components/production/KPIWidget";
import { JobQueue } from "@/components/production/JobQueue";
import { Activity, Zap, TrendingUp, AlertOctagon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockJobs = [
  { id: "j1", orderNumber: "ORD-8921", product: "Motor Assembly", status: "running", progress: 65, estimatedCompletion: "15 mins" },
  { id: "j2", orderNumber: "ORD-8922", product: "Sensor Housing", status: "queued", progress: 0 },
  { id: "j3", orderNumber: "ORD-8920", product: "Drive Shaft", status: "completed", progress: 100 },
  { id: "j4", orderNumber: "ORD-8919", product: "Control Panel", status: "failed", progress: 42 },
] as any[];

const oeeData = [
  { time: "06:00", oee: 82 },
  { time: "07:00", oee: 85 },
  { time: "08:00", oee: 88 },
  { time: "09:00", oee: 91 },
  { time: "10:00", oee: 87 },
  { time: "11:00", oee: 89 },
  { time: "12:00", oee: 84 },
  { time: "13:00", oee: 86 },
  { time: "14:00", oee: 90 },
  { time: "15:00", oee: 87 },
  { time: "16:00", oee: 88 },
  { time: "17:00", oee: 85 },
];

export const OperationsDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Production Operations</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time factory floor performance and job tracking</p>
        </div>
        <div className="text-xs text-gray-500 font-mono bg-card-bg px-3 py-1.5 rounded-md border border-gray-800">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIWidget 
          title="Overall Equipment Effectiveness" 
          value="87.4" 
          unit="%" 
          icon={Activity} 
          trend={{ value: 2.1, isPositive: true }} 
        />
        <KPIWidget 
          title="Current Power Draw" 
          value="420" 
          unit="kW" 
          icon={Zap} 
          trend={{ value: 5.4, isPositive: false }} 
          status="warning"
        />
        <KPIWidget 
          title="Units Produced" 
          value="1,248" 
          icon={TrendingUp} 
          trend={{ value: 12, isPositive: true }} 
        />
        <KPIWidget 
          title="Active Alerts" 
          value="3" 
          icon={AlertOctagon} 
          status="critical"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card-bg border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">OEE Trend — Today</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oeeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                  <YAxis domain={[75, 95]} stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#9CA3AF" }}
                  />
                  <Line type="monotone" dataKey="oee" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div>
          <JobQueue jobs={mockJobs} />
        </div>
      </div>
    </div>
  );
};
