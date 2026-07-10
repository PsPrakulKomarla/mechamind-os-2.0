import React from "react";
import { Card } from "@/components/ui/Card";

interface GaugeChartProps {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  threshold?: number;
}

export const GaugeChart = ({ title, value, min, max, unit, threshold }: GaugeChartProps) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  let colorClass = "text-accent";
  let bgClass = "stroke-accent";
  
  if (threshold && value > threshold) {
    colorClass = "text-danger";
    bgClass = "stroke-danger animate-pulse";
  } else if (threshold && value > threshold * 0.8) {
    colorClass = "text-warning";
    bgClass = "stroke-warning";
  }

  // SVG parameters
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-gray-600 transition-colors">
      <h3 className="text-sm font-bold text-gray-400 mb-4 self-start absolute top-4 left-4">{title}</h3>
      
      <div className="relative w-32 h-32 mt-4 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle 
            className="text-gray-800 stroke-current" 
            strokeWidth="8" 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent"
          ></circle>
          {/* Progress circle */}
          <circle 
            className={`${bgClass} transition-all duration-500 ease-out`} 
            strokeWidth="8" 
            strokeLinecap="round" 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
          ></circle>
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-mono font-bold ${colorClass}`}>
            {value.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500 font-mono mt-1">{unit}</span>
        </div>
      </div>
    </Card>
  );
};
