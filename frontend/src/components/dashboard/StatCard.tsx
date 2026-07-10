import React from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage change, positive or negative
  trendLabel?: string;
  isLoading?: boolean;
}

export const StatCard = ({ title, value, trend, trendLabel, isLoading }: StatCardProps) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-800 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-800 rounded w-1/3"></div>
      </Card>
    );
  }

  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card className="flex flex-col justify-between hover:border-gray-700 transition-colors">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <div className={clsx("flex items-center text-xs font-medium px-1.5 py-0.5 rounded", {
            "bg-success/20 text-success": isPositive,
            "bg-danger/20 text-danger": isNegative,
            "bg-gray-800 text-gray-400": trend === 0,
          })}>
            {isPositive && <TrendingUp size={12} className="mr-1" />}
            {isNegative && <TrendingDown size={12} className="mr-1" />}
            {trend === 0 && <Minus size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
          {trendLabel && <span className="text-xs text-gray-500">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
};
