import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/components/RouteGuards";
import { DashboardLayout } from "@/layouts/DashboardLayout";

const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import("@/pages/auth/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import("@/pages/auth/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import("@/pages/auth/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = React.lazy(() => import("@/pages/auth/VerifyEmailPage").then(m => ({ default: m.VerifyEmailPage })));
const MfaPage = React.lazy(() => import("@/pages/auth/MfaPage").then(m => ({ default: m.MfaPage })));
const SessionExpiredPage = React.lazy(() => import("@/pages/auth/SessionExpiredPage").then(m => ({ default: m.SessionExpiredPage })));
const AccountLockedPage = React.lazy(() => import("@/pages/auth/AccountLockedPage").then(m => ({ default: m.AccountLockedPage })));
const UnauthorizedPage = React.lazy(() => import("@/pages/auth/UnauthorizedPage").then(m => ({ default: m.UnauthorizedPage })));

const ExecutiveDashboardPage = React.lazy(() => import("@/pages/dashboard/ExecutiveDashboardPage").then(m => ({ default: m.ExecutiveDashboardPage })));
const AiWorkspacePage = React.lazy(() => import("@/pages/ai/AiWorkspacePage").then(m => ({ default: m.AiWorkspacePage })));
const KnowledgeExplorerPage = React.lazy(() => import("@/pages/ai/KnowledgeExplorerPage").then(m => ({ default: m.KnowledgeExplorerPage })));
const KnowledgeGraphExplorerPage = React.lazy(() => import("@/pages/ai/KnowledgeGraphExplorerPage").then(m => ({ default: m.KnowledgeGraphExplorerPage })));
const VectorSearchExplorerPage = React.lazy(() => import("@/pages/ai/VectorSearchExplorerPage").then(m => ({ default: m.VectorSearchExplorerPage })));
const PromptLibraryPage = React.lazy(() => import("@/pages/ai/PromptLibraryPage").then(m => ({ default: m.PromptLibraryPage })));
const PromptManagementPage = React.lazy(() => import("@/pages/ai/PromptManagementPage").then(m => ({ default: m.PromptManagementPage })));
const ModelConfigurationPage = React.lazy(() => import("@/pages/ai/ModelConfigurationPage").then(m => ({ default: m.ModelConfigurationPage })));
const AiKnowledgeDashboardPage = React.lazy(() => import("@/pages/ai/AiKnowledgeDashboardPage").then(m => ({ default: m.AiKnowledgeDashboardPage })));
const FeedbackQueuePage = React.lazy(() => import("@/pages/ai/FeedbackQueuePage").then(m => ({ default: m.FeedbackQueuePage })));

const AnalyticsExecutive = React.lazy(() => import("@/pages/analytics/ExecutiveDashboardPage").then(m => ({ default: m.ExecutiveDashboardPage })));
const EnergyAnalyticsPage = React.lazy(() => import("@/pages/analytics/EnergyAnalyticsPage").then(m => ({ default: m.EnergyAnalyticsPage })));
const FailureAnalyticsPage = React.lazy(() => import("@/pages/analytics/FailureAnalyticsPage").then(m => ({ default: m.FailureAnalyticsPage })));
const DashboardBuilderPage = React.lazy(() => import("@/pages/analytics/DashboardBuilderPage").then(m => ({ default: m.DashboardBuilderPage })));

const AssetDashboardPage = React.lazy(() => import("@/pages/assets/AssetDashboardPage").then(m => ({ default: m.AssetDashboardPage })));
const MachineListPage = React.lazy(() => import("@/pages/assets/MachineListPage").then(m => ({ default: m.MachineListPage })));
const MachineDetailsPage = React.lazy(() => import("@/pages/assets/MachineDetailsPage").then(m => ({ default: m.MachineDetailsPage })));
const HierarchyPage = React.lazy(() => import("@/pages/assets/HierarchyPage").then(m => ({ default: m.HierarchyPage })));

const DigitalTwinDashboardPage = React.lazy(() => import("@/pages/digitaltwin/DigitalTwinDashboardPage").then(m => ({ default: m.DigitalTwinDashboardPage })));
const ControlRoomPage = React.lazy(() => import("@/pages/digitaltwin/ControlRoomPage").then(m => ({ default: m.ControlRoomPage })));
const FactoryExplorerPage = React.lazy(() => import("@/pages/digitaltwin/FactoryExplorerPage").then(m => ({ default: m.FactoryExplorerPage })));
const LiveMachineMonitoringPage = React.lazy(() => import("@/pages/digitaltwin/LiveMachineMonitoringPage").then(m => ({ default: m.LiveMachineMonitoringPage })));

const DocumentDashboardPage = React.lazy(() => import("@/pages/documents/DocumentDashboardPage").then(m => ({ default: m.DocumentDashboardPage })));
const DocumentLibraryPage = React.lazy(() => import("@/pages/documents/DocumentLibraryPage").then(m => ({ default: m.DocumentLibraryPage })));
const DocumentDetailsPage = React.lazy(() => import("@/pages/documents/DocumentDetailsPage").then(m => ({ default: m.DocumentDetailsPage })));

const LiveDashboardPage = React.lazy(() => import("@/pages/iot/LiveDashboardPage").then(m => ({ default: m.LiveDashboardPage })));
const SensorDashboardPage = React.lazy(() => import("@/pages/iot/SensorDashboardPage").then(m => ({ default: m.SensorDashboardPage })));
const VisionDashboardPage = React.lazy(() => import("@/pages/iot/VisionDashboardPage").then(m => ({ default: m.VisionDashboardPage })));
const AlarmCenterPage = React.lazy(() => import("@/pages/iot/AlarmCenterPage").then(m => ({ default: m.AlarmCenterPage })));

const MaintenanceDashboardPage = React.lazy(() => import("@/pages/maintenance/MaintenanceDashboardPage").then(m => ({ default: m.MaintenanceDashboardPage })));
const WorkOrdersPage = React.lazy(() => import("@/pages/maintenance/WorkOrdersPage").then(m => ({ default: m.WorkOrdersPage })));
const WorkOrderDetailsPage = React.lazy(() => import("@/pages/maintenance/WorkOrderDetailsPage").then(m => ({ default: m.WorkOrderDetailsPage })));
const PredictiveMaintenancePage = React.lazy(() => import("@/pages/maintenance/PredictiveMaintenancePage").then(m => ({ default: m.PredictiveMaintenancePage })));

const PredictiveDashboardPage = React.lazy(() => import("@/pages/predictive/PredictiveDashboardPage").then(m => ({ default: m.PredictiveDashboardPage })));
const FailurePredictionPage = React.lazy(() => import("@/pages/predictive/FailurePredictionPage").then(m => ({ default: m.FailurePredictionPage })));
const MaintenancePlannerPage = React.lazy(() => import("@/pages/predictive/MaintenancePlannerPage").then(m => ({ default: m.MaintenancePlannerPage })));
const RiskDashboardPage = React.lazy(() => import("@/pages/predictive/RiskDashboardPage").then(m => ({ default: m.RiskDashboardPage })));
const WhatIfSimulationPage = React.lazy(() => import("@/pages/predictive/WhatIfSimulationPage").then(m => ({ default: m.WhatIfSimulationPage })));

const OperationsDashboardPage = React.lazy(() => import("@/pages/production/OperationsDashboardPage").then(m => ({ default: m.OperationsDashboardPage })));
const AgentHubPage = React.lazy(() => import("@/pages/agents/AgentHubPage").then(m => ({ default: m.AgentHubPage })));

const AdminDashboardPage = React.lazy(() => import("@/pages/admin/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));
const UserManagementPage = React.lazy(() => import("@/pages/admin/UserManagementPage").then(m => ({ default: m.UserManagementPage })));
const RoleManagementPage = React.lazy(() => import("@/pages/admin/RoleManagementPage").then(m => ({ default: m.RoleManagementPage })));
const AuditLogsPage = React.lazy(() => import("@/pages/admin/AuditLogsPage").then(m => ({ default: m.AuditLogsPage })));
const SystemSettingsPage = React.lazy(() => import("@/pages/admin/SystemSettingsPage").then(m => ({ default: m.SystemSettingsPage })));

const ProfilePage = React.lazy(() => import("@/pages/profile/ProfilePage").then(m => ({ default: m.ProfilePage })));

const ComplianceDashboardPage = React.lazy(() => import("@/pages/compliance/ComplianceDashboardPage").then(m => ({ default: m.ComplianceDashboardPage })));
const LessonsLearnedPage = React.lazy(() => import("@/pages/lessons/LessonsLearnedPage").then(m => ({ default: m.LessonsLearnedPage })));

const FeatureFlagsPage = React.lazy(() => import("@/pages/platform/FeatureFlagsPage").then(m => ({ default: m.FeatureFlagsPage })));
const DeploymentsPage = React.lazy(() => import("@/pages/platform/DeploymentsPage").then(m => ({ default: m.DeploymentsPage })));
const AiAgentWorkspacePage = React.lazy(() => import("@/pages/platform/AiAgentWorkspacePage").then(m => ({ default: m.AiAgentWorkspacePage })));
const AiOperationsDashboardPage = React.lazy(() => import("@/pages/platform/AiOperationsDashboardPage").then(m => ({ default: m.AiOperationsDashboardPage })));
const CiCdPipelinePage = React.lazy(() => import("@/pages/platform/CiCdPipelinePage").then(m => ({ default: m.CiCdPipelinePage })));
const SystemMonitoringPage = React.lazy(() => import("@/pages/platform/SystemMonitoringPage").then(m => ({ default: m.SystemMonitoringPage })));
const MobileWorkforceDashboardPage = React.lazy(() => import("@/pages/platform/MobileWorkforceDashboardPage").then(m => ({ default: m.MobileWorkforceDashboardPage })));

const OnboardingPage = React.lazy(() => import("@/pages/onboarding/OnboardingPage"));
const LandingPage = React.lazy(() => import("@/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const WorkforceDashboardPage = React.lazy(() => import("@/pages/mobile/WorkforceDashboardPage").then(m => ({ default: m.WorkforceDashboardPage })));
const NotFoundPage = React.lazy(() => import("@/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute><LazyPage><LoginPage /></LazyPage></PublicRoute>,
  },
  {
    path: "/register",
    element: <PublicRoute><LazyPage><RegisterPage /></LazyPage></PublicRoute>,
  },
  {
    path: "/forgot-password",
    element: <PublicRoute><LazyPage><ForgotPasswordPage /></LazyPage></PublicRoute>,
  },
  {
    path: "/reset-password",
    element: <PublicRoute><LazyPage><ResetPasswordPage /></LazyPage></PublicRoute>,
  },
  {
    path: "/verify-email",
    element: <LazyPage><VerifyEmailPage /></LazyPage>,
  },
  {
    path: "/mfa",
    element: <LazyPage><MfaPage /></LazyPage>,
  },
  {
    path: "/session-expired",
    element: <LazyPage><SessionExpiredPage /></LazyPage>,
  },
  {
    path: "/account-locked",
    element: <LazyPage><AccountLockedPage /></LazyPage>,
  },
  {
    path: "/unauthorized",
    element: <LazyPage><UnauthorizedPage /></LazyPage>,
  },
  {
    path: "/",
    element: <LazyPage><LandingPage /></LazyPage>,
  },
  {
    path: "/onboarding",
    element: <ProtectedLayout><LazyPage><OnboardingPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/dashboard",
    element: <ProtectedLayout><LazyPage><ExecutiveDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/workspace",
    element: <ProtectedLayout><LazyPage><AiWorkspacePage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/knowledge",
    element: <ProtectedLayout><LazyPage><AiKnowledgeDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/knowledge-graph",
    element: <ProtectedLayout><LazyPage><KnowledgeGraphExplorerPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/knowledge-explorer",
    element: <ProtectedLayout><LazyPage><KnowledgeExplorerPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/vector-search",
    element: <ProtectedLayout><LazyPage><VectorSearchExplorerPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/prompts",
    element: <ProtectedLayout><LazyPage><PromptLibraryPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/prompts/manage",
    element: <ProtectedLayout><LazyPage><PromptManagementPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/models",
    element: <ProtectedLayout><LazyPage><ModelConfigurationPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/ai/feedback",
    element: <ProtectedLayout><LazyPage><FeedbackQueuePage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/analytics",
    element: <ProtectedLayout><LazyPage><AnalyticsExecutive /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/analytics/energy",
    element: <ProtectedLayout><LazyPage><EnergyAnalyticsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/analytics/failures",
    element: <ProtectedLayout><LazyPage><FailureAnalyticsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/analytics/builder",
    element: <ProtectedLayout><LazyPage><DashboardBuilderPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/assets",
    element: <ProtectedLayout><LazyPage><AssetDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/assets/machines",
    element: <ProtectedLayout><LazyPage><MachineListPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/assets/machines/:id",
    element: <ProtectedLayout><LazyPage><MachineDetailsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/assets/hierarchy",
    element: <ProtectedLayout><LazyPage><HierarchyPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/digital-twin",
    element: <ProtectedLayout><LazyPage><DigitalTwinDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/digital-twin/control-room",
    element: <ProtectedLayout><LazyPage><ControlRoomPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/digital-twin/explorer",
    element: <ProtectedLayout><LazyPage><FactoryExplorerPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/digital-twin/monitoring",
    element: <ProtectedLayout><LazyPage><LiveMachineMonitoringPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/documents",
    element: <ProtectedLayout><LazyPage><DocumentDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/documents/library",
    element: <ProtectedLayout><LazyPage><DocumentLibraryPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/documents/:id",
    element: <ProtectedLayout><LazyPage><DocumentDetailsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/iot",
    element: <ProtectedLayout><LazyPage><LiveDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/iot/sensors",
    element: <ProtectedLayout><LazyPage><SensorDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/iot/vision",
    element: <ProtectedLayout><LazyPage><VisionDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/iot/alarms",
    element: <ProtectedLayout><LazyPage><AlarmCenterPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/maintenance",
    element: <ProtectedLayout><LazyPage><MaintenanceDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/maintenance/work-orders",
    element: <ProtectedLayout><LazyPage><WorkOrdersPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/maintenance/work-orders/:id",
    element: <ProtectedLayout><LazyPage><WorkOrderDetailsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/maintenance/predictive",
    element: <ProtectedLayout><LazyPage><PredictiveMaintenancePage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/predictive",
    element: <ProtectedLayout><LazyPage><PredictiveDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/predictive/failures",
    element: <ProtectedLayout><LazyPage><FailurePredictionPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/predictive/planner",
    element: <ProtectedLayout><LazyPage><MaintenancePlannerPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/predictive/risk",
    element: <ProtectedLayout><LazyPage><RiskDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/predictive/simulation",
    element: <ProtectedLayout><LazyPage><WhatIfSimulationPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/production",
    element: <ProtectedLayout><LazyPage><OperationsDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/agents",
    element: <ProtectedLayout><LazyPage><AgentHubPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/admin",
    element: <ProtectedLayout><LazyPage><AdminDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/admin/users",
    element: <ProtectedLayout><LazyPage><UserManagementPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/admin/roles",
    element: <ProtectedLayout><LazyPage><RoleManagementPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/admin/audit-logs",
    element: <ProtectedLayout><LazyPage><AuditLogsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/admin/settings",
    element: <ProtectedLayout><LazyPage><SystemSettingsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/compliance",
    element: <ProtectedLayout><LazyPage><ComplianceDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/lessons",
    element: <ProtectedLayout><LazyPage><LessonsLearnedPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/profile",
    element: <ProtectedLayout><LazyPage><ProfilePage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/flags",
    element: <ProtectedLayout><LazyPage><FeatureFlagsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/deployments",
    element: <ProtectedLayout><LazyPage><DeploymentsPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/ai-agents",
    element: <ProtectedLayout><LazyPage><AiAgentWorkspacePage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/ai-operations",
    element: <ProtectedLayout><LazyPage><AiOperationsDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/ci-cd",
    element: <ProtectedLayout><LazyPage><CiCdPipelinePage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/monitoring",
    element: <ProtectedLayout><LazyPage><SystemMonitoringPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/platform/mobile",
    element: <ProtectedLayout><LazyPage><MobileWorkforceDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "/mobile",
    element: <ProtectedLayout><LazyPage><WorkforceDashboardPage /></LazyPage></ProtectedLayout>,
  },
  {
    path: "*",
    element: <LazyPage><NotFoundPage /></LazyPage>,
  },
]);
