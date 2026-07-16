import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/RouteGuards";

import { AgentHubPage } from "@/pages/agents/AgentHubPage";
import { WorkforceDashboardPage } from "@/pages/mobile/WorkforceDashboardPage";
import { OperationsDashboardPage } from "@/pages/production/OperationsDashboardPage";
import { FeatureFlagsPage } from "@/pages/platform/FeatureFlagsPage";
import { DeploymentsPage } from "@/pages/platform/DeploymentsPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { HomePage } from "@/pages/HomePage";

// Simplified routing layout stubs
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agents",
    element: <ProtectedRoute><AgentHubPage /></ProtectedRoute>,
  },
  {
    path: "/mobile",
    element: <ProtectedRoute><WorkforceDashboardPage /></ProtectedRoute>,
  },
  {
    path: "/production",
    element: <ProtectedRoute><OperationsDashboardPage /></ProtectedRoute>,
  },
  {
    path: "/platform/flags",
    element: <ProtectedRoute><FeatureFlagsPage /></ProtectedRoute>,
  },
  {
    path: "/platform/deployments",
    element: <ProtectedRoute><DeploymentsPage /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <div className="p-8">404 - Not Found</div>,
  },
]);
