import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";
import { Activity } from "lucide-react";

interface LiveChartProps {
  title: string;
  data: { time: string, value: number }[];
  color?: string;
  unit?: string;
}

export const LiveChart = ({ title, data, color = "#14F195", unit = "" }: LiveChartProps) => {
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <Card className="p-4 h-72 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-gray-300">{title}</h3>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent animate-pulse" />
            <span className="text-xl font-mono font-bold text-white">
              {latestValue.toFixed(2)} {unit}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Live Feed</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10} 
              tickMargin={10}
              minTickGap={20}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              domain={['auto', 'auto']}
              tickFormatter={(val) => val.toFixed(0)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
              itemStyle={{ color: "#fff", fontSize: "12px", fontFamily: "monospace" }}
              labelStyle={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}
              formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, title]}
              animationDuration={100}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false} // Disable Recharts animation to handle rapid 1s ticks without bouncing
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
