import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-primary-bg">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-primary-bg">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
