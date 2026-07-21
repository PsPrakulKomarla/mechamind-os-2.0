import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  BarChart3,
  Boxes,
  Cpu,
  FileText,
  Wifi,
  Wrench,
  TrendingUp,
  Factory,
  Bot,
  Shield,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  ScanSearch,
  Workflow,
  Activity,
  User,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  group: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, group: "Overview" },
  { name: "AI Assistant", path: "/ai/workspace", icon: Brain, group: "Intelligence" },
  { name: "Knowledge Graph", path: "/ai/knowledge-graph", icon: ScanSearch, group: "Intelligence" },
  { name: "Vector Search", path: "/ai/vector-search", icon: Zap, group: "Intelligence" },
  { name: "Prompt Library", path: "/ai/prompts", icon: FileText, group: "Intelligence" },
  { name: "AI Models", path: "/ai/models", icon: Bot, group: "Intelligence" },
  { name: "Feedback Queue", path: "/ai/feedback", icon: Workflow, group: "Intelligence" },
  { name: "Analytics", path: "/analytics", icon: BarChart3, group: "Analytics" },
  { name: "Energy Analytics", path: "/analytics/energy", icon: Zap, group: "Analytics" },
  { name: "Failure Analytics", path: "/analytics/failures", icon: Activity, group: "Analytics" },
  { name: "Dashboard Builder", path: "/analytics/builder", icon: Settings, group: "Analytics" },
  { name: "Assets", path: "/assets", icon: Boxes, group: "Assets" },
  { name: "Machines", path: "/assets/machines", icon: Cpu, group: "Assets" },
  { name: "Hierarchy", path: "/assets/hierarchy", icon: Factory, group: "Assets" },
  { name: "Digital Twin", path: "/digital-twin", icon: Cpu, group: "Digital Twin" },
  { name: "Control Room", path: "/digital-twin/control-room", icon: Shield, group: "Digital Twin" },
  { name: "Factory Explorer", path: "/digital-twin/explorer", icon: Factory, group: "Digital Twin" },
  { name: "Live Monitoring", path: "/digital-twin/monitoring", icon: Activity, group: "Digital Twin" },
  { name: "Doc Dashboard", path: "/documents", icon: BarChart3, group: "Documents" },
  { name: "Library", path: "/documents/library", icon: FileText, group: "Documents" },
  { name: "IoT Dashboard", path: "/iot", icon: Wifi, group: "IoT" },
  { name: "Sensors", path: "/iot/sensors", icon: Activity, group: "IoT" },
  { name: "Vision AI", path: "/iot/vision", icon: ScanSearch, group: "IoT" },
  { name: "Alarms", path: "/iot/alarms", icon: Shield, group: "IoT" },
  { name: "Maintenance", path: "/maintenance", icon: Wrench, group: "Maintenance" },
  { name: "Work Orders", path: "/maintenance/work-orders", icon: Workflow, group: "Maintenance" },
  { name: "Predictive Alerts", path: "/maintenance/predictive", icon: TrendingUp, group: "Maintenance" },
  { name: "Predictive AI", path: "/predictive", icon: TrendingUp, group: "Predictive" },
  { name: "Failure Prediction", path: "/predictive/failures", icon: Activity, group: "Predictive" },
  { name: "Maintenance Planner", path: "/predictive/planner", icon: Wrench, group: "Predictive" },
  { name: "Risk Dashboard", path: "/predictive/risk", icon: Shield, group: "Predictive" },
  { name: "What-If Simulation", path: "/predictive/simulation", icon: Zap, group: "Predictive" },
  { name: "Production", path: "/production", icon: Factory, group: "Operations" },
  { name: "AI Agents", path: "/agents", icon: Bot, group: "Operations" },
  { name: "Admin", path: "/admin", icon: Shield, group: "Administration" },
  { name: "Users", path: "/admin/users", icon: Users, group: "Administration" },
  { name: "Roles", path: "/admin/roles", icon: Shield, group: "Administration" },
  { name: "Audit Logs", path: "/admin/audit-logs", icon: FileText, group: "Administration" },
  { name: "System Settings", path: "/admin/settings", icon: Settings, group: "Administration" },
  { name: "Profile", path: "/profile", icon: User, group: "Account" },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const groups = React.useMemo(() => {
    const map = new Map<string, NavItem[]>();
    for (const item of navItems) {
      const existing = map.get(item.group) || [];
      existing.push(item);
      map.set(item.group, existing);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <aside
      className={`h-full bg-secondary-bg border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800 shrink-0">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Cpu size={16} className="text-accent" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide">MECHAMIND</span>
              <span className="block text-[9px] text-gray-600 font-mono -mt-0.5">v2.0</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800/60 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 scrollbar-thin">
        {groups.map(([group, items]) => (
          <div key={group} className="mb-2">
            {!isCollapsed && (
              <div className="px-2.5 py-1.5 text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
                {group}
              </div>
            )}
            {items.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 mb-0.5 ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                  }`}
                >
                  <Icon
                    size={15}
                    className={isActive ? "text-accent" : ""}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-t border-gray-800">
          <div className="flex items-center gap-2 text-[10px] text-gray-600">
            <span className="w-1.5 h-1.5 bg-success rounded-full" />
            <span>System Online</span>
          </div>
        </div>
      )}
    </aside>
  );
};