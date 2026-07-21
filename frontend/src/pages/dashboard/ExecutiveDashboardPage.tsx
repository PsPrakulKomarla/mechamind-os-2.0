import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { LiveAlertCenter } from "@/components/dashboard/LiveAlertCenter";
import { PerformanceLineChart, EnergyAreaChart } from "@/components/dashboard/DashboardCharts";
import { useExecutiveKPIs, useAiInsights, useLiveAlerts, usePerformanceCharts } from "@/hooks/useDashboardQueries";
import { useAuthStore } from "@/store/auth";
import { useOnboardingStore } from "@/store/onboarding";
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
  Upload,
  FolderOpen,
  GitBranch,
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

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
      <Icon size={28} className="text-gray-600" />
    </div>
    <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
    <p className="text-gray-500 text-xs max-w-xs mb-4">{description}</p>
    {actionLabel && actionHref && (
      <button
        onClick={() => window.location.href = actionHref}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
      >
        <Upload size={12} />
        {actionLabel}
      </button>
    )}
  </div>
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
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const recentActivity = alerts?.slice(0, 5).map((alert: any, i: number) => ({
    icon: alert.severity === "critical" ? AlertTriangle : alert.severity === "high" ? AlertTriangle : Activity,
    iconColor: alert.severity === "critical" ? "bg-[#EF4444]/20" : alert.severity === "high" ? "bg-[#F59E0B]/20" : "bg-[#3B82F6]/20",
    title: alert.source || "System Event",
    detail: alert.message || "No details available",
    time: alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : "",
  })) || [];

  const showEmptyState = !hasDocuments;

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
              {showEmptyState
                ? "Welcome to MechaMind OS. Get started by uploading your first document."
                : `Here's your factory overview for today. ${alerts?.length || 0} active alerts require attention.`
              }
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {showEmptyState ? (
              <button
                onClick={() => navigate("/onboarding")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-sm font-medium hover:bg-[#3B82F6]/15 transition-colors"
              >
                <Upload size={14} />
                Setup Wizard
              </button>
            ) : (
              <Badge variant={alerts?.some((a: any) => a.severity === "critical") ? "danger" : "success"}>
                {alerts?.some((a: any) => a.severity === "critical") ? "Critical Alerts" : "All Systems Normal"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding CTA if empty */}
      {showEmptyState && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-3">
            <div className="flex flex-col md:flex-row items-center gap-6 py-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-semibold text-lg mb-1">Build Your Knowledge Brain</h3>
                <p className="text-gray-400 text-sm">Upload industrial documents, SOPs, maintenance records, and IoT data to unlock AI-powered insights.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/onboarding")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] text-white text-sm font-semibold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  <Upload size={16} />
                  Upload Documents
                </button>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111827] border border-gray-700 text-white text-sm font-medium hover:border-[#8B5CF6]/40 transition-colors"
                >
                  <Boxes size={16} className="text-[#8B5CF6]" />
                  Load Demo Data
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {showEmptyState ? (
          <>
            <Card className="flex flex-col items-center justify-center py-8 text-center">
              <TrendingUp size={24} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No OEE data yet</p>
              <p className="text-gray-600 text-xs">Upload documents to begin</p>
            </Card>
            <Card className="flex flex-col items-center justify-center py-8 text-center">
              <Wrench size={24} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No work orders</p>
              <p className="text-gray-600 text-xs">Import maintenance data</p>
            </Card>
            <Card className="flex flex-col items-center justify-center py-8 text-center">
              <Boxes size={24} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No machines tracked</p>
              <p className="text-gray-600 text-xs">Add asset information</p>
            </Card>
            <Card className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle size={24} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No compliance data</p>
              <p className="text-gray-600 text-xs">Upload SOPs and reports</p>
            </Card>
          </>
        ) : (
          <>
            <StatCard title="Overall OEE" value={kpis?.oee ? `${kpis.oee}%` : "—"} trend={kpis?.oee_trend} trendLabel="vs last month" isLoading={kpiLoading} />
            <StatCard title="Active Work Orders" value={kpis?.work_orders ?? "—"} trend={kpis?.work_orders_trend} trendLabel="vs last week" isLoading={kpiLoading} />
            <StatCard title="Total Machines" value={kpis?.total_machines ?? "—"} isLoading={kpiLoading} />
            <StatCard title="Compliance Score" value={kpis?.compliance_score ? `${kpis.compliance_score}%` : "—"} trend={kpis?.compliance_trend} trendLabel="vs last quarter" isLoading={kpiLoading} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickActionCard icon={Brain} label="AI Assistant" description="Ask AI" color="bg-[#8B5CF6]/20" onClick={() => navigate("/ai/workspace")} />
          <QuickActionCard icon={Wrench} label="Work Orders" description={showEmptyState ? "Import data" : (kpis?.work_orders ? `${kpis.work_orders} open` : "View")} color="bg-[#F59E0B]/20" onClick={() => navigate("/maintenance/work-orders")} />
          <QuickActionCard icon={Boxes} label="Assets" description={showEmptyState ? "Add machines" : (kpis?.total_machines ? `${kpis.total_machines} machines` : "View")} color="bg-[#3B82F6]/20" onClick={() => navigate("/assets/machines")} />
          <QuickActionCard icon={TrendingUp} label="Predictions" description={showEmptyState ? "Upload data" : "View"} color="bg-[#EF4444]/20" onClick={() => navigate("/maintenance/predictive")} />
          <QuickActionCard icon={Wifi} label="IoT Live" description="Real-time" color="bg-[#06B6D4]/20" onClick={() => navigate("/iot")} />
          <QuickActionCard icon={FileText} label="Documents" description={showEmptyState ? "Upload" : "Library"} color="bg-[#10B981]/20" onClick={() => navigate(showEmptyState ? "/onboarding" : "/documents/library")} />
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showEmptyState ? (
          <>
            <Card>
              <EmptyState icon={TrendingUp} title="No Performance Data" description="Upload industrial documents to start generating OEE analytics and performance trends." actionLabel="Upload Documents" actionHref="/onboarding" />
            </Card>
            <Card>
              <EmptyState icon={Zap} title="No Energy Analytics" description="Connect IoT sensors or upload energy reports to visualize consumption patterns." actionLabel="Upload Documents" actionHref="/onboarding" />
            </Card>
          </>
        ) : (
          <>
            <PerformanceLineChart data={charts?.oee_history} isLoading={chartsLoading} />
            <EnergyAreaChart data={charts?.energy_history} isLoading={chartsLoading} />
          </>
        )}
      </div>

      {/* Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showEmptyState ? (
            <Card>
              <EmptyState icon={Brain} title="No AI Insights" description="Process documents through the AI pipeline to generate actionable maintenance and operational insights." actionLabel="Get Started" actionHref="/onboarding" />
            </Card>
          ) : (
            <AiInsightsPanel insights={insights} isLoading={insightsLoading} />
          )}
        </div>
        <div className="space-y-6">
          {showEmptyState ? (
            <Card>
              <EmptyState icon={AlertTriangle} title="No Active Alerts" description="Upload IoT sensor data and machine information to enable real-time alert monitoring." actionLabel="Setup Monitoring" actionHref="/onboarding" />
            </Card>
          ) : (
            <LiveAlertCenter alerts={alerts} isLoading={alertsLoading} />
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Activity + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <Clock size={16} className="text-gray-500" />
            {showEmptyState ? "Getting Started" : "Recent Activity"}
          </h3>
          {showEmptyState ? (
            <div className="space-y-3 py-4">
              {[
                { icon: Upload, color: "bg-[#3B82F6]/20", text: "Upload your first document to begin building your knowledge brain" },
                { icon: GitBranch, color: "bg-[#8B5CF6]/20", text: "The AI will extract entities and build a knowledge graph" },
                { icon: Brain, color: "bg-[#06B6D4]/20", text: "Once processed, you can query your industrial knowledge with AI" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={14} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {recentActivity.length > 0 ? (
                recentActivity.map((item: any, i: number) => (
                  <RecentActivityItem key={i} {...item} />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <Zap size={16} className="text-[#06B6D4]" />
            System Status
          </h3>
          <div className="space-y-3">
            {[
              { name: "Backend API", status: "online" },
              { name: "PostgreSQL", status: "online" },
              { name: "Redis Cache", status: "online" },
              { name: "AI Inference", status: showEmptyState ? "standby" : "online" },
              { name: "Vector Search", status: showEmptyState ? "standby" : "online" },
              { name: "WebSocket", status: "online" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.status === "online" ? "bg-[#10B981]" : item.status === "standby" ? "bg-[#F59E0B]" : "bg-[#EF4444]"}`} />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <Badge variant={item.status === "online" ? "success" : item.status === "standby" ? "warning" : "danger"} className="text-[10px] py-0">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
