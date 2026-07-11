import React from "react";
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface KPIWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "good" | "warning" | "critical";
  className?: string;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  status = "good",
  className = "" 
}) => {
  const statusColor = 
    status === "critical" ? "text-red-500" : 
    status === "warning" ? "text-yellow-500" : 
    "text-green-500";
    
  const statusBg = 
    status === "critical" ? "bg-red-500/10" : 
    status === "warning" ? "bg-yellow-500/10" : 
    "bg-brand-production/10";
    
  const iconColor = status === "good" ? "text-brand-production" : statusColor;

  return (
    <Card className={`p-4 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-md ${statusBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1">
        <h2 className={`text-2xl font-bold ${statusColor}`}>{value}</h2>
        {unit && <span className="text-sm text-muted-foreground font-medium">{unit}</span>}
      </div>
      
      {trend && (
        <div className="mt-2 flex items-center space-x-1 text-xs">
          <span className={`font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">vs last hour</span>
        </div>
      )}
    </Card>
  );
};
