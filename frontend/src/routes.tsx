import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import { useAuthStore } from "@/store/auth";
import { DashboardLayout } from "@/layouts/DashboardLayout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

// Lazy load pages for better performance
const LazyLoad = React.lazy;

// Auth pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { VerifyOtpPage } from "@/pages/auth/VerifyOtpPage";
import { MfaPage } from "@/pages/auth/MfaPage";
import { UnauthorizedPage } from "@/pages/auth/UnauthorizedPage";
import { AccountLockedPage } from "@/pages/auth/AccountLockedPage";
import { SessionExpiredPage } from "@/pages/auth/SessionExpiredPage";

// Dashboard
import { HomePage } from "@/pages/HomePage";
import { CommandCenterPage } from "@/pages/dashboard/CommandCenterPage";
import { ExecutiveDashboardPage } from "@/pages/analytics/ExecutiveDashboardPage";

// Assets
import { AssetDashboardPage } from "@/pages/assets/AssetDashboardPage";
import { MachineListPage } from "@/pages/assets/MachineListPage";
import { MachineDetailsPage } from "@/pages/assets/MachineDetailsPage";
import { HierarchyPage } from "@/pages/assets/HierarchyPage";

// Maintenance
import { MaintenanceDashboardPage } from "@/pages/maintenance/MaintenanceDashboardPage";
import { WorkOrdersPage } from "@/pages/maintenance/WorkOrdersPage";
import { WorkOrderDetailsPage } from "@/pages/maintenance/WorkOrderDetailsPage";
import { PredictiveMaintenancePage } from "@/pages/maintenance/PredictiveMaintenancePage";

// Documents
import { DocumentDashboardPage } from "@/pages/documents/DocumentDashboardPage";
import { DocumentLibraryPage } from "@/pages/documents/DocumentLibraryPage";
import { DocumentDetailsPage } from "@/pages/documents/DocumentDetailsPage";

// IoT
import { SensorDashboardPage } from "@/pages/iot/SensorDashboardPage";
import { LiveDashboardPage } from "@/pages/iot/LiveDashboardPage";
import { AlarmCenterPage } from "@/pages/iot/AlarmCenterPage";
import { VisionDashboardPage } from "@/pages/iot/VisionDashboardPage";

// AI
import { AiWorkspacePage } from "@/pages/ai/AiWorkspacePage";
import { AiKnowledgeDashboardPage } from "@/pages/ai/AiKnowledgeDashboardPage";
import { KnowledgeExplorerPage } from "@/pages/ai/KnowledgeExplorerPage";
import { KnowledgeGraphExplorerPage } from "@/pages/ai/KnowledgeGraphExplorerPage";
import { VectorSearchExplorerPage } from "@/pages/ai/VectorSearchExplorerPage";
import { PromptLibraryPage } from "@/pages/ai/PromptLibraryPage";
import { PromptManagementPage } from "@/pages/ai/PromptManagementPage";
import { ModelConfigurationPage } from "@/pages/ai/ModelConfigurationPage";
import { FeedbackQueuePage } from "@/pages/ai/FeedbackQueuePage";

// Analytics
import { DashboardBuilderPage } from "@/pages/analytics/DashboardBuilderPage";
import { EnergyAnalyticsPage } from "@/pages/analytics/EnergyAnalyticsPage";
import { FailureAnalyticsPage } from "@/pages/analytics/FailureAnalyticsPage";

// Digital Twin
import { DigitalTwinDashboardPage } from "@/pages/digitaltwin/DigitalTwinDashboardPage";
import { ControlRoomPage } from "@/pages/digitaltwin/ControlRoomPage";
import { FactoryExplorerPage } from "@/pages/digitaltwin/FactoryExplorerPage";
import { LiveMachineMonitoringPage } from "@/pages/digitaltwin/LiveMachineMonitoringPage";

// Predictive
import { PredictiveDashboardPage } from "@/pages/predictive/PredictiveDashboardPage";
import { FailurePredictionPage } from "@/pages/predictive/FailurePredictionPage";
import { RiskDashboardPage } from "@/pages/predictive/RiskDashboardPage";
import { MaintenancePlannerPage } from "@/pages/predictive/MaintenancePlannerPage";
import { WhatIfSimulationPage } from "@/pages/predictive/WhatIfSimulationPage";

// Production
import { OperationsDashboardPage } from "@/pages/production/OperationsDashboardPage";

// Agents
import { AgentHubPage } from "@/pages/agents/AgentHubPage";

// Mobile
import { WorkforceDashboardPage } from "@/pages/mobile/WorkforceDashboardPage";

// Platform
import { FeatureFlagsPage } from "@/pages/platform/FeatureFlagsPage";
import { DeploymentsPage } from "@/pages/platform/DeploymentsPage";
import { SystemMonitoringPage } from "@/pages/platform/SystemMonitoringPage";
import { CiCdPipelinePage } from "@/pages/platform/CiCdPipelinePage";
import { AiAgentWorkspacePage } from "@/pages/platform/AiAgentWorkspacePage";
import { AiOperationsDashboardPage } from "@/pages/platform/AiOperationsDashboardPage";
import { MobileWorkforceDashboardPage } from "@/pages/platform/MobileWorkforceDashboardPage";

// Admin
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { UserManagementPage } from "@/pages/admin/UserManagementPage";
import { RoleManagementPage } from "@/pages/admin/RoleManagementPage";
import { AuditLogsPage } from "@/pages/admin/AuditLogsPage";
import { SystemSettingsPage } from "@/pages/admin/SystemSettingsPage";

// Profile
import { ProfilePage } from "@/pages/profile/ProfilePage";

export const router = createBrowserRouter([
  // Auth routes (no layout)
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/verify-otp", element: <VerifyOtpPage /> },
  { path: "/mfa", element: <MfaPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/account-locked", element: <AccountLockedPage /> },
  { path: "/session-expired", element: <SessionExpiredPage /> },

  // Dashboard
  { path: "/", element: <ProtectedRoute><HomePage /></ProtectedRoute> },
  { path: "/dashboard/executive", element: <ProtectedLayout><ExecutiveDashboardPage /></ProtectedLayout> },

  // Assets
  { path: "/assets", element: <ProtectedLayout><AssetDashboardPage /></ProtectedLayout> },
  { path: "/assets/machines", element: <ProtectedLayout><MachineListPage /></ProtectedLayout> },
  { path: "/assets/machines/:id", element: <ProtectedLayout><MachineDetailsPage /></ProtectedLayout> },
  { path: "/assets/hierarchy", element: <ProtectedLayout><HierarchyPage /></ProtectedLayout> },

  // Maintenance
  { path: "/maintenance", element: <ProtectedLayout><MaintenanceDashboardPage /></ProtectedLayout> },
  { path: "/maintenance/work-orders", element: <ProtectedLayout><WorkOrdersPage /></ProtectedLayout> },
  { path: "/maintenance/work-orders/:id", element: <ProtectedLayout><WorkOrderDetailsPage /></ProtectedLayout> },
  { path: "/maintenance/predictive", element: <ProtectedLayout><PredictiveMaintenancePage /></ProtectedLayout> },

  // Documents
  { path: "/documents", element: <ProtectedLayout><DocumentDashboardPage /></ProtectedLayout> },
  { path: "/documents/library", element: <ProtectedLayout><DocumentLibraryPage /></ProtectedLayout> },
  { path: "/documents/:id", element: <ProtectedLayout><DocumentDetailsPage /></ProtectedLayout> },

  // IoT
  { path: "/iot/sensors", element: <ProtectedLayout><SensorDashboardPage /></ProtectedLayout> },
  { path: "/iot/live", element: <ProtectedLayout><LiveDashboardPage /></ProtectedLayout> },
  { path: "/iot/alarms", element: <ProtectedLayout><AlarmCenterPage /></ProtectedLayout> },
  { path: "/iot/vision", element: <ProtectedLayout><VisionDashboardPage /></ProtectedLayout> },

  // AI
  { path: "/ai/workspace", element: <ProtectedLayout><AiWorkspacePage /></ProtectedLayout> },
  { path: "/ai/knowledge", element: <ProtectedLayout><AiKnowledgeDashboardPage /></ProtectedLayout> },
  { path: "/ai/knowledge-explorer", element: <ProtectedLayout><KnowledgeExplorerPage /></ProtectedLayout> },
  { path: "/ai/knowledge-graph", element: <ProtectedLayout><KnowledgeGraphExplorerPage /></ProtectedLayout> },
  { path: "/ai/vector-search", element: <ProtectedLayout><VectorSearchExplorerPage /></ProtectedLayout> },
  { path: "/ai/prompts", element: <ProtectedLayout><PromptLibraryPage /></ProtectedLayout> },
  { path: "/ai/prompt-management", element: <ProtectedLayout><PromptManagementPage /></ProtectedLayout> },
  { path: "/ai/models", element: <ProtectedLayout><ModelConfigurationPage /></ProtectedLayout> },
  { path: "/ai/feedback", element: <ProtectedLayout><FeedbackQueuePage /></ProtectedLayout> },

  // Analytics
  { path: "/analytics/dashboard-builder", element: <ProtectedLayout><DashboardBuilderPage /></ProtectedLayout> },
  { path: "/analytics/energy", element: <ProtectedLayout><EnergyAnalyticsPage /></ProtectedLayout> },
  { path: "/analytics/failures", element: <ProtectedLayout><FailureAnalyticsPage /></ProtectedLayout> },

  // Digital Twin
  { path: "/digital-twin", element: <ProtectedLayout><DigitalTwinDashboardPage /></ProtectedLayout> },
  { path: "/digital-twin/control-room", element: <ProtectedLayout><ControlRoomPage /></ProtectedLayout> },
  { path: "/digital-twin/factory-explorer", element: <ProtectedLayout><FactoryExplorerPage /></ProtectedLayout> },
  { path: "/digital-twin/monitoring", element: <ProtectedLayout><LiveMachineMonitoringPage /></ProtectedLayout> },

  // Predictive
  { path: "/predictive", element: <ProtectedLayout><PredictiveDashboardPage /></ProtectedLayout> },
  { path: "/predictive/failures", element: <ProtectedLayout><FailurePredictionPage /></ProtectedLayout> },
  { path: "/predictive/risk", element: <ProtectedLayout><RiskDashboardPage /></ProtectedLayout> },
  { path: "/predictive/planner", element: <ProtectedLayout><MaintenancePlannerPage /></ProtectedLayout> },
  { path: "/predictive/simulation", element: <ProtectedLayout><WhatIfSimulationPage /></ProtectedLayout> },

  // Production
  { path: "/production", element: <ProtectedLayout><OperationsDashboardPage /></ProtectedLayout> },

  // Agents
  { path: "/agents", element: <ProtectedLayout><AgentHubPage /></ProtectedLayout> },

  // Mobile
  { path: "/mobile", element: <ProtectedLayout><WorkforceDashboardPage /></ProtectedLayout> },

  // Platform
  { path: "/platform/flags", element: <ProtectedLayout><FeatureFlagsPage /></ProtectedLayout> },
  { path: "/platform/deployments", element: <ProtectedLayout><DeploymentsPage /></ProtectedLayout> },
  { path: "/platform/monitoring", element: <ProtectedLayout><SystemMonitoringPage /></ProtectedLayout> },
  { path: "/platform/ci-cd", element: <ProtectedLayout><CiCdPipelinePage /></ProtectedLayout> },
  { path: "/platform/ai-agents", element: <ProtectedLayout><AiAgentWorkspacePage /></ProtectedLayout> },
  { path: "/platform/ai-ops", element: <ProtectedLayout><AiOperationsDashboardPage /></ProtectedLayout> },
  { path: "/platform/mobile-workforce", element: <ProtectedLayout><MobileWorkforceDashboardPage /></ProtectedLayout> },

  // Admin
  { path: "/admin", element: <ProtectedLayout><AdminDashboardPage /></ProtectedLayout> },
  { path: "/admin/users", element: <ProtectedLayout><UserManagementPage /></ProtectedLayout> },
  { path: "/admin/roles", element: <ProtectedLayout><RoleManagementPage /></ProtectedLayout> },
  { path: "/admin/audit-logs", element: <ProtectedLayout><AuditLogsPage /></ProtectedLayout> },
  { path: "/admin/settings", element: <ProtectedLayout><SystemSettingsPage /></ProtectedLayout> },

  // Profile
  { path: "/profile", element: <ProtectedLayout><ProfilePage /></ProtectedLayout> },

  // 404
  { path: "*", element: <ProtectedLayout><div className="p-12 text-center"><h1 className="text-4xl font-bold text-white mb-4">404</h1><p className="text-gray-400">Page not found</p></div></ProtectedLayout> },
]);