import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface RulChartProps {
  data: any[];
  failureThreshold?: number;
}

export const RulChart = ({ data, failureThreshold = 20 }: RulChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14F195" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis 
          dataKey="day" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
          itemStyle={{ color: "#e2e8f0" }}
        />
        {/* Actual Historical Health */}
        <Area 
          type="monotone" 
          dataKey="actualHealth" 
          stroke="#14F195" 
          fillOpacity={1} 
          fill="url(#colorHealth)" 
          strokeWidth={2}
          connectNulls
        />
        {/* Predicted Degradation Curve */}
        <Area 
          type="monotone" 
          dataKey="predictedHealth" 
          stroke="#f59e0b" 
          strokeDasharray="5 5"
          fillOpacity={1} 
          fill="url(#colorPredicted)" 
          strokeWidth={2}
          connectNulls
        />
        
        {/* Confidence Interval Bands (if provided) */}
        <Area 
          type="monotone" 
          dataKey="confidenceHigh" 
          stroke="none" 
          fill="#f59e0b" 
          fillOpacity={0.1}
        />
        <Area 
          type="monotone" 
          dataKey="confidenceLow" 
          stroke="none" 
          fill="#1e293b" 
          fillOpacity={1} // Masks the area below the low confidence bound
        />

        {/* Failure Threshold Line */}
        <ReferenceLine y={failureThreshold} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Failure Threshold', fill: '#ef4444', fontSize: 10 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
