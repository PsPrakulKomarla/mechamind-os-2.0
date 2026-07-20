import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { LiveAlertCenter } from "@/components/dashboard/LiveAlertCenter";
import { PerformanceLineChart, EnergyAreaChart } from "@/components/dashboard/DashboardCharts";
import { useExecutiveKPIs, useAiInsights, useLiveAlerts, usePerformanceCharts } from "@/hooks/useDashboardQueries";
import { useAuthStore } from "@/store/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Wrench,
  FileText,
  Boxes,
  Wifi,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertTriangle,
  Activity,
  type LucideIcon,
} from "lucide-react";

const QuickActionCard = ({
  icon: Icon,
  label,
  description,
  color,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-3 bg-primary-bg border border-gray-800 rounded-lg hover:border-gray-700 transition-all group text-left"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={18} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate">{label}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
    </div>
    <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
  </button>
);

const RecentActivityItem = ({
  icon: Icon,
  iconColor,
  title,
  detail,
  time,
}: {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  detail: string;
  time: string;
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
      <Icon size={14} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white font-medium truncate">{title}</p>
      <p className="text-xs text-gray-500 truncate">{detail}</p>
    </div>
    <span className="text-[10px] text-gray-600 font-mono whitespace-nowrap">{time}</span>
  </div>
);

export const ExecutiveDashboardPage = () => {
  const { data: kpis, isLoading: kpiLoading } = useExecutiveKPIs();
  const { data: insights, isLoading: insightsLoading } = useAiInsights();
  const { data: alerts, isLoading: alertsLoading } = useLiveAlerts();
  const { data: charts, isLoading: chartsLoading } = usePerformanceCharts();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const recentActivity = [
    { icon: CheckCircle, iconColor: "bg-[#10B981]/20", title: "Work Order WO-2024-012 completed", detail: "Lubrication route on Assembly Line 4", time: "2h ago" },
    { icon: AlertTriangle, iconColor: "bg-[#F59E0B]/20", title: "Predictive alert on Conveyor C-12", detail: "Motor temperature trending upward", time: "3h ago" },
    { icon: Brain, iconColor: "bg-[#8B5CF6]/20", title: "AI generated maintenance recommendation", detail: "PM consolidation for Zone B machines", time: "5h ago" },
    { icon: Activity, iconColor: "bg-[#3B82F6]/20", title: "Machine M-201 health score updated", detail: "Dropped to 72% (-8 points)", time: "6h ago" },
    { icon: FileText, iconColor: "bg-[#06B6D4]/20", title: "Document uploaded: Safety SOP Rev 3.2", detail: "Processed and indexed by AI pipeline", time: "8h ago" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {getGreeting()}, {user?.first_name || "Operator"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Here&apos;s your factory overview for today. {alerts?.length || 0} active alerts require attention.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant={alerts?.some((a: any) => a.severity === "critical") ? "danger" : "success"}>
              {alerts?.some((a: any) => a.severity === "critical") ? "Critical Alerts" : "All Systems Normal"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Overall OEE" value={`${kpis?.oee || "87.3"}%`} trend={kpis?.oee_trend || 2.4} trendLabel="vs last month" isLoading={kpiLoading} />
        <StatCard title="Active Work Orders" value={kpis?.work_orders || 42} trend={-2} trendLabel="vs last week" isLoading={kpiLoading} />
        <StatCard title="Total Machines" value={kpis?.total_machines || 156} isLoading={kpiLoading} />
        <StatCard title="Compliance Score" value={`${kpis?.compliance_score || 94.2}%`} trend={1.5} trendLabel="vs last quarter" isLoading={kpiLoading} />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickActionCard icon={Brain} label="AI Assistant" description="Ask AI" color="bg-[#8B5CF6]/20" onClick={() => navigate("/ai/workspace")} />
          <QuickActionCard icon={Wrench} label="Work Orders" description="42 open" color="bg-[#F59E0B]/20" onClick={() => navigate("/maintenance/work-orders")} />
          <QuickActionCard icon={Boxes} label="Assets" description="156 machines" color="bg-[#3B82F6]/20" onClick={() => navigate("/assets/machines")} />
          <QuickActionCard icon={TrendingUp} label="Predictions" description="3 alerts" color="bg-[#EF4444]/20" onClick={() => navigate("/maintenance/predictive")} />
          <QuickActionCard icon={Wifi} label="IoT Live" description="Real-time" color="bg-[#06B6D4]/20" onClick={() => navigate("/iot")} />
          <QuickActionCard icon={FileText} label="Documents" description="Library" color="bg-[#10B981]/20" onClick={() => navigate("/documents/library")} />
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceLineChart data={charts?.oee_history} isLoading={chartsLoading} />
        <EnergyAreaChart data={charts?.energy_history} isLoading={chartsLoading} />
      </div>

      {/* Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AiInsightsPanel insights={insights} isLoading={insightsLoading} />
        </div>
        <div className="space-y-6">
          <LiveAlertCenter alerts={alerts} isLoading={alertsLoading} />
        </div>
      </div>

      {/* Bottom Row: Recent Activity + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <Clock size={16} className="text-gray-500" />
            Recent Activity
          </h3>
          <div className="divide-y divide-gray-800/50">
            {recentActivity.map((item, i) => (
              <RecentActivityItem key={i} {...item} />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <Zap size={16} className="text-[#06B6D4]" />
            System Status
          </h3>
          <div className="space-y-4">
            {[
              { name: "Backend API", status: "online", latency: "12ms" },
              { name: "PostgreSQL", status: "online", latency: "3ms" },
              { name: "Redis Cache", status: "online", latency: "1ms" },
              { name: "AI Inference", status: "online", latency: "180ms" },
              { name: "Vector Search", status: "online", latency: "45ms" },
              { name: "WebSocket", status: "online", latency: "8ms" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.status === "online" ? "bg-[#10B981]" : "bg-[#EF4444]"}`} />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <span className="text-xs font-mono text-gray-500">{item.latency}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
