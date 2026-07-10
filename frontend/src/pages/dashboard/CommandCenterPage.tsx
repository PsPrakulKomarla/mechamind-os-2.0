import React from "react";
import { ExecutiveDashboardPage } from "@/pages/dashboard/ExecutiveDashboardPage";

export const CommandCenterPage = () => {
  // In a fully built out application, this page would act as a router itself
  // detecting the user's role and serving FactoryDashboard, DepartmentDashboard,
  // or ExecutiveDashboard accordingly.
  
  // For the foundation, we will route directly to the Executive Dashboard layout.
  return <ExecutiveDashboardPage />;
};
