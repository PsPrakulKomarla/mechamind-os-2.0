import React from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const HomePage = () => {
  return (
    <DashboardLayout>
      <CommandCenterHome />
    </DashboardLayout>
  );
};

const CommandCenterHome = () => {
  const stats = [
    { title: "Total Assets", value: "1,247", change: "+12%", color: "from-blue-500 to-blue-600" },
    { title: "Open Work Orders", value: "42", change: "-5%", color: "from-orange-500 to-orange-600" },
    { title: "Active Alarms", value: "3", change: "Critical", color: "from-red-500 to-red-600" },
    { title: "AI Insights", value: "284", change: "+18%", color: "from-green-500 to-green-600" },
  ];

  const quickActions = [
    { name: "Asset Management", path: "/assets", desc: "Manage machines & equipment" },
    { name: "Maintenance", path: "/maintenance", desc: "Work orders & schedules" },
    { name: "IoT Sensors", path: "/iot/sensors", desc: "Live telemetry & alerts" },
    { name: "AI Knowledge", path: "/ai/workspace", desc: "Copilot & knowledge base" },
    { name: "Digital Twin", path: "/digital-twin", desc: "3D factory visualization" },
    { name: "Analytics", path: "/analytics/dashboard-builder", desc: "Custom dashboards & KPIs" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-gray-400 mt-1">Real-time overview of your industrial operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-secondary-bg border border-gray-800 rounded-lg p-5">
            <p className="text-sm text-gray-400">{stat.title}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                stat.change.startsWith("+") ? "bg-green-500/20 text-green-400" :
                stat.change.startsWith("-") ? "bg-red-500/20 text-red-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-secondary-bg border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <div
              key={action.name}
              onClick={() => window.location.href = action.path}
              className="p-4 bg-primary-bg border border-gray-800 rounded-lg hover:border-accent hover:bg-gray-800/50 transition-all cursor-pointer group"
            >
              <p className="font-medium text-white group-hover:text-accent">{action.name}</p>
              <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-secondary-bg border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {[
            { event: "Work Order #WO-8921 completed", time: "2 min ago", type: "maintenance" },
            { event: "Temperature alert on Compressor C-401", time: "15 min ago", type: "alert" },
            { event: "New document uploaded: Pump Manual v3", time: "1 hour ago", type: "document" },
            { event: "AI insight: Bearing wear detected on Motor M1", time: "3 hours ago", type: "ai" },
            { event: "Predictive model retrained - accuracy 94.2%", time: "Yesterday", type: "model" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === "alert" ? "bg-red-500" :
                activity.type === "maintenance" ? "bg-blue-500" :
                activity.type === "document" ? "bg-green-500" :
                activity.type === "ai" ? "bg-purple-500" : "bg-yellow-500"
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-300">{activity.event}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};