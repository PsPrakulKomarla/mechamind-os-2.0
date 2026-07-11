import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  Settings,
  Menu,
  Building2,
  Wrench,
  FileText,
  Wifi,
  Brain,
  BarChart3,
  Box,
  TrendingUp,
  Factory,
  Bot,
  Smartphone,
  Globe,
  Shield,
  User,
  ChevronDown,
  ChevronRight,
  Database,
  AlertTriangle,
  Activity,
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  children?: { name: string; path: string }[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    name: "Assets",
    path: "/assets",
    icon: Building2,
    children: [
      { name: "Overview", path: "/assets" },
      { name: "Machines", path: "/assets/machines" },
      { name: "Hierarchy", path: "/assets/hierarchy" },
    ],
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
    children: [
      { name: "Overview", path: "/maintenance" },
      { name: "Work Orders", path: "/maintenance/work-orders" },
      { name: "Predictive", path: "/maintenance/predictive" },
    ],
  },
  {
    name: "Documents",
    path: "/documents",
    icon: FileText,
    children: [
      { name: "Overview", path: "/documents" },
      { name: "Library", path: "/documents/library" },
    ],
  },
  {
    name: "IoT & Sensors",
    path: "/iot/sensors",
    icon: Wifi,
    children: [
      { name: "Sensors", path: "/iot/sensors" },
      { name: "Live Data", path: "/iot/live" },
      { name: "Alarms", path: "/iot/alarms" },
      { name: "Vision", path: "/iot/vision" },
    ],
  },
  {
    name: "AI & Knowledge",
    path: "/ai/workspace",
    icon: Brain,
    children: [
      { name: "AI Workspace", path: "/ai/workspace" },
      { name: "Knowledge Base", path: "/ai/knowledge" },
      { name: "Knowledge Explorer", path: "/ai/knowledge-explorer" },
      { name: "Knowledge Graph", path: "/ai/knowledge-graph" },
      { name: "Vector Search", path: "/ai/vector-search" },
      { name: "Prompts", path: "/ai/prompts" },
    ],
  },
  {
    name: "Analytics",
    path: "/analytics/dashboard-builder",
    icon: BarChart3,
    children: [
      { name: "Executive", path: "/dashboard/executive" },
      { name: "Dashboard Builder", path: "/analytics/dashboard-builder" },
      { name: "Energy", path: "/analytics/energy" },
      { name: "Failure Analytics", path: "/analytics/failures" },
    ],
  },
  {
    name: "Digital Twin",
    path: "/digital-twin",
    icon: Box,
    children: [
      { name: "Overview", path: "/digital-twin" },
      { name: "Control Room", path: "/digital-twin/control-room" },
      { name: "Factory Explorer", path: "/digital-twin/factory-explorer" },
      { name: "Live Monitoring", path: "/digital-twin/monitoring" },
    ],
  },
  {
    name: "Predictive",
    path: "/predictive",
    icon: TrendingUp,
    children: [
      { name: "Overview", path: "/predictive" },
      { name: "Failure Prediction", path: "/predictive/failures" },
      { name: "Risk Dashboard", path: "/predictive/risk" },
      { name: "Planner", path: "/predictive/planner" },
      { name: "Simulation", path: "/predictive/simulation" },
    ],
  },
  { name: "Production", path: "/production", icon: Factory },
  { name: "AI Agents", path: "/agents", icon: Bot },
  { name: "Mobile Workforce", path: "/mobile", icon: Smartphone },
  {
    name: "Platform",
    path: "/platform/flags",
    icon: Globe,
    children: [
      { name: "Feature Flags", path: "/platform/flags" },
      { name: "Deployments", path: "/platform/deployments" },
      { name: "Monitoring", path: "/platform/monitoring" },
      { name: "CI/CD", path: "/platform/ci-cd" },
    ],
  },
  {
    name: "Admin",
    path: "/admin",
    icon: Shield,
    children: [
      { name: "Dashboard", path: "/admin" },
      { name: "Users", path: "/admin/users" },
      { name: "Roles", path: "/admin/roles" },
      { name: "Audit Logs", path: "/admin/audit-logs" },
      { name: "Settings", path: "/admin/settings" },
    ],
  },
  { name: "Profile", path: "/profile", icon: User },
];

// Render lucide icon with size prop compatible with React 19 strict typing
function LucideIcon({ icon: Icon, size, className }: { icon: React.ElementType; size: number; className?: string }) {
  return React.createElement(Icon, { size, className });
}

const SidebarItem = ({
  item,
  isCollapsed,
  location,
}: {
  item: NavItem;
  isCollapsed: boolean;
  location: any;
}) => {
  const [expanded, setExpanded] = useState(() => {
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path || location.pathname.startsWith(item.path));
    }
    return false;
  });
  
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const isActive = !hasChildren && (location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path)));

  if (isCollapsed && hasChildren) {
    return (
      <div className="relative group">
        <Link
          to={children[0].path}
          className="flex items-center justify-center px-3 py-2 rounded text-sm font-medium transition-all text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <LucideIcon icon={item.icon} size={18} />
        </Link>
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {item.name}
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="relative group">
        <Link
          to={item.path}
          className={`flex items-center justify-center px-3 py-2 rounded text-sm font-medium transition-all ${
            isActive ? "bg-accent text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LucideIcon icon={item.icon} size={18} />
        </Link>
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {item.name}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setExpanded(!expanded);
          } else {
            window.location.href = item.path;
          }
        }}
        className={`flex items-center justify-between gap-3 px-3 py-2 rounded text-sm font-medium transition-all cursor-pointer ${
          isActive ? "bg-accent text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <LucideIcon icon={item.icon} size={18} className="flex-shrink-0" />
          <span className="truncate">{item.name}</span>
        </div>
        {hasChildren && (
          <span className="flex-shrink-0">
            {expanded ? <LucideIcon icon={ChevronDown} size={14} /> : <LucideIcon icon={ChevronRight} size={14} />}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-700 pl-2">
          {children.map((child) => {
            const isChildActive = location.pathname === child.path;
            return (
              <div
                key={child.path}
                onClick={() => window.location.href = child.path}
                className={`block px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                  isChildActive
                    ? "bg-accent/20 text-accent"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                {child.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`h-full bg-secondary-bg border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
              <LucideIcon icon={Activity} size={14} />
            </div>
            <span className="font-bold text-white tracking-wider text-sm">MECHAMIND OS</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-primary-bg"
        >
          <LucideIcon icon={Menu} size={18} />
        </button>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isCollapsed={isCollapsed}
            location={location}
          />
        ))}
      </nav>
    </aside>
  );
};