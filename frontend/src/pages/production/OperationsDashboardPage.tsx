import React from "react";
import { KPIWidget } from "@/components/production/KPIWidget";
import { JobQueue } from "@/components/production/JobQueue";
import { Activity, Zap, TrendingUp, AlertOctagon } from "lucide-react";

const mockJobs = [
  { id: "j1", orderNumber: "ORD-8921", product: "Motor Assembly", status: "running", progress: 65, estimatedCompletion: "15 mins" },
  { id: "j2", orderNumber: "ORD-8922", product: "Sensor Housing", status: "queued", progress: 0 },
  { id: "j3", orderNumber: "ORD-8920", product: "Drive Shaft", status: "completed", progress: 100 },
  { id: "j4", orderNumber: "ORD-8919", product: "Control Panel", status: "failed", progress: 42 },
] as any[];

export const OperationsDashboardPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Production Operations</h1>
          <p className="text-muted-foreground mt-1">Real-time factory floor performance and job tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 min-h-[300px] flex items-center justify-center text-muted-foreground">
            OEE Trend Chart Placeholder
          </div>
        </div>
        <div>
          <JobQueue jobs={mockJobs} />
        </div>
      </div>
    </div>
  );
};
