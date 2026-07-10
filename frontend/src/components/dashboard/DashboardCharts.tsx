import React from "react";
import { Card } from "@/components/ui/Card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";

export const PerformanceLineChart = ({ data, isLoading }: { data?: any[], isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-72"><div className="h-full bg-gray-800/50 rounded"></div></Card>;
  }

  return (
    <Card className="h-72 flex flex-col">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Overall Equipment Effectiveness (OEE) Trend</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "4px", color: "#F3F4F6" }}
              itemStyle={{ color: "#3B82F6" }}
            />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const EnergyAreaChart = ({ data, isLoading }: { data?: any[], isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-72"><div className="h-full bg-gray-800/50 rounded"></div></Card>;
  }

  return (
    <Card className="h-72 flex flex-col">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Energy Consumption (kWh)</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "4px" }}
            />
            <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
