import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import { useAuthStore } from "@/store/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

import { AgentHubPage } from "@/pages/agents/AgentHubPage";
import { WorkforceDashboardPage } from "@/pages/mobile/WorkforceDashboardPage";
import { OperationsDashboardPage } from "@/pages/production/OperationsDashboardPage";
import { FeatureFlagsPage } from "@/pages/platform/FeatureFlagsPage";
import { DeploymentsPage } from "@/pages/platform/DeploymentsPage";

// Simplified routing layout stubs
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <div className="p-8">Login Page (Foundation Ready)</div>,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="p-8">Dashboard Layout & Content (Foundation Ready)</div>
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
], { future: { v7_startTransition: true } });
