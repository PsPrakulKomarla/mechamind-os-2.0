import React, { useState } from "react";
import { Settings, Save, Key, Bell, Shield, Palette } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: "General", icon: <Settings size={16} /> },
    { name: "Security & Auth", icon: <Shield size={16} /> },
    { name: "API Keys", icon: <Key size={16} /> },
    { name: "Notifications", icon: <Bell size={16} /> },
    { name: "Branding", icon: <Palette size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="text-gray-400" /> System Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage global platform settings and integrations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors font-medium">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex flex-1 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
                activeTab === tab.name ? "bg-accent/10 text-accent" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <Card className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">{activeTab} Settings</h2>
          
          {activeTab === "General" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Platform Name</label>
                <input type="text" defaultValue="MechaMind OS 2.0" placeholder="e.g. MechaMind OS 2.0" className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Default Timezone</label>
                <select className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent">
                  <option>UTC (Universal Coordinated Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-secondary-bg text-accent focus:ring-accent focus:ring-offset-gray-900" />
                  <span className="text-sm font-medium text-white">Enable Maintenance Mode</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">Only Super Admins will be able to log in while maintenance mode is active.</p>
              </div>
            </div>
          )}

          {activeTab === "Security & Auth" && (
            <div className="space-y-6 max-w-2xl">
               <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-secondary-bg text-accent focus:ring-accent focus:ring-offset-gray-900" />
                  <span className="text-sm font-medium text-white">Enforce Two-Factor Authentication (2FA)</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Session Timeout (minutes)</label>
                <input type="number" defaultValue={60} placeholder="e.g. 60" className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Minimum Password Length</label>
                <input type="number" defaultValue={12} placeholder="e.g. 12" className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent" />
              </div>
            </div>
          )}

          {activeTab === "API Keys" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">Manage API keys for external integrations.</p>
                <button className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded text-sm font-medium transition-colors">
                  + Generate New Key
                </button>
              </div>
              <div className="bg-secondary-bg border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-800/50 text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Key Prefix</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium">Last Used</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">ERP Integration</td>
                      <td className="px-4 py-3 font-mono text-xs">mm_live_8f92...</td>
                      <td className="px-4 py-3">2024-01-15</td>
                      <td className="px-4 py-3">10 mins ago</td>
                      <td className="px-4 py-3"><span className="text-success text-xs px-2 py-0.5 bg-success/10 rounded-full">Active</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">BI Dashboard</td>
                      <td className="px-4 py-3 font-mono text-xs">mm_test_b3c1...</td>
                      <td className="px-4 py-3">2023-11-20</td>
                      <td className="px-4 py-3">3 days ago</td>
                      <td className="px-4 py-3"><span className="text-warning text-xs px-2 py-0.5 bg-warning/10 rounded-full">Test</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">System Alerts Delivery</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-secondary-bg text-accent focus:ring-accent focus:ring-offset-gray-900" />
                    <span className="text-sm font-medium text-white">Email Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-secondary-bg text-accent focus:ring-accent focus:ring-offset-gray-900" />
                    <span className="text-sm font-medium text-white">In-App Alerts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-secondary-bg text-accent focus:ring-accent focus:ring-offset-gray-900" />
                    <span className="text-sm font-medium text-white">SMS Alerts (Critical only)</span>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-800">
                <label className="block text-sm font-bold text-gray-300 mb-2">Slack Webhook URL</label>
                <input type="url" placeholder="https://hooks.slack.com/services/..." className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent" />
                <p className="text-xs text-gray-500 mt-1">Leave blank to disable Slack notifications.</p>
              </div>
            </div>
          )}

          {activeTab === "Branding" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Company Logo URL</label>
                <input type="url" placeholder="https://example.com/logo.png" className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Primary Theme Color</label>
                <div className="flex items-center gap-4">
                  <input type="color" defaultValue="#3B82F6" className="w-12 h-12 rounded cursor-pointer bg-secondary-bg border border-gray-700 p-1" />
                  <input type="text" defaultValue="#3B82F6" placeholder="e.g. #3B82F6" className="flex-1 bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent font-mono" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-secondary-bg text-accent focus:ring-accent focus:ring-offset-gray-900" />
                  <span className="text-sm font-medium text-white">Enable Dark Mode by Default</span>
                </label>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
