import React from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KpiCardProps {
  title: string;
  value: string | number;
  trend: number;
  target?: string;
  sparklineData?: number[];
  color?: "accent" | "info" | "warning" | "danger" | "success";
  isLoading?: boolean;
}

export const KpiCard = ({ title, value, trend, target, sparklineData, color = "accent", isLoading }: KpiCardProps) => {
  if (isLoading) {
    return <Card className="animate-pulse h-32 bg-secondary-bg/50 border-gray-800"></Card>;
  }

  const isPositive = trend > 0;
  const isNeutral = trend === 0;
  
  const colorMap = {
    accent: "#14F195",
    info: "#3b82f6",
    warning: "#f59e0b",
    danger: "#ef4444",
    success: "#22c55e"
  };

  const chartData = sparklineData?.map((v, i) => ({ i, value: v })) || [];

  return (
    <Card className="p-5 flex flex-col justify-between overflow-hidden relative group hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white font-mono tracking-tight">{value}</p>
        </div>
        
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
          isNeutral ? "bg-gray-800 text-gray-400" :
          isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
        }`}>
          {isNeutral ? <Minus size={12} /> : isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end z-10">
        {target && (
          <p className="text-xs text-gray-500 font-medium">Target: <span className="text-gray-300">{target}</span></p>
        )}
      </div>

      {/* Sparkline background */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colorMap[color]} 
                fill={colorMap[color]} 
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
