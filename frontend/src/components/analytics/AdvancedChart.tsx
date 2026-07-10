import React, { useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Download, Maximize2, RefreshCw } from "lucide-react";

interface AdvancedChartProps {
  title: string;
  type: "bar" | "line" | "area" | "pie" | "radar";
  data: any[];
  xAxisKey?: string;
  series: { key: string; color: string; name: string }[];
  height?: number;
}

export const AdvancedChart = ({ title, type, data, xAxisKey = "name", series, height = 300 }: AdvancedChartProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generic renderers based on type
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            {series.map((s) => <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />)}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            {series.map((s) => <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={{ r: 4, fill: "#0f172a", strokeWidth: 2 }} />)}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            {series.map((s) => <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} fillOpacity={1} fill={`url(#grad-${s.key})`} />)}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Pie data={data} dataKey={series[0].key} nameKey={xAxisKey} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={series[index % series.length]?.color || "#14F195"} />
              ))}
            </Pie>
          </PieChart>
        );
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey={xAxisKey} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: "#64748b" }} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {series.map((s) => (
               <Radar key={s.key} name={s.name} dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.3} />
            ))}
          </RadarChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className={`flex flex-col relative transition-all duration-300 ${isFullscreen ? "fixed inset-4 z-50 shadow-2xl h-auto" : ""}`}>
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <div className="flex gap-2">
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"><RefreshCw size={14} /></button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"><Download size={14} /></button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      
      <div style={{ height: isFullscreen ? "calc(100vh - 100px)" : height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      {isFullscreen && (
        <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 bg-danger text-white px-3 py-1 rounded text-sm z-50">
          Close Fullscreen
        </button>
      )}
    </Card>
  );
};
