import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/ai": "AI",
  "/ai/workspace": "AI Assistant",
  "/ai/knowledge": "Knowledge Dashboard",
  "/ai/knowledge-graph": "Knowledge Graph",
  "/ai/knowledge-explorer": "Knowledge Explorer",
  "/ai/vector-search": "Vector Search",
  "/ai/prompts": "Prompt Library",
  "/ai/prompts/manage": "Prompt Management",
  "/ai/models": "AI Models",
  "/ai/feedback": "Feedback Queue",
  "/analytics": "Analytics",
  "/analytics/energy": "Energy Analytics",
  "/analytics/failures": "Failure Analytics",
  "/analytics/builder": "Dashboard Builder",
  "/assets": "Assets",
  "/assets/machines": "Machines",
  "/assets/hierarchy": "Hierarchy",
  "/digital-twin": "Digital Twin",
  "/digital-twin/control-room": "Control Room",
  "/digital-twin/explorer": "Factory Explorer",
  "/digital-twin/monitoring": "Live Monitoring",
  "/documents": "Documents",
  "/documents/library": "Document Library",
  "/iot": "IoT",
  "/iot/sensors": "Sensors",
  "/iot/vision": "Vision AI",
  "/iot/alarms": "Alarms",
  "/maintenance": "Maintenance",
  "/maintenance/work-orders": "Work Orders",
  "/maintenance/predictive": "Predictive Alerts",
  "/predictive": "Predictive AI",
  "/predictive/failures": "Failure Prediction",
  "/predictive/planner": "Maintenance Planner",
  "/predictive/risk": "Risk Dashboard",
  "/predictive/simulation": "What-If Simulation",
  "/production": "Production",
  "/agents": "AI Agents",
  "/admin": "Administration",
  "/admin/users": "User Management",
  "/admin/roles": "Role Management",
  "/admin/audit-logs": "Audit Logs",
  "/admin/settings": "System Settings",
  "/profile": "Profile",
  "/platform/flags": "Feature Flags",
  "/platform/deployments": "Deployments",
  "/platform/ai-agents": "AI Agent Workspace",
  "/platform/ai-operations": "AI Operations",
  "/platform/ci-cd": "CI/CD Pipelines",
  "/platform/monitoring": "System Monitoring",
  "/platform/mobile": "Mobile Workforce",
  "/mobile": "Workforce",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) return null;

  const breadcrumbs: Array<{ label: string; path: string }> = [];

  let currentPath = "";
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath];
    if (label) {
      breadcrumbs.push({ label, path: currentPath });
    }
  }

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-gray-300 transition-colors"
      >
        <Home size={12} />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight size={12} className="text-gray-600" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-300 font-medium">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-gray-300 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
