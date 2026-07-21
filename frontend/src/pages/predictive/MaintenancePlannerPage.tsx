import React, { useState } from "react";
import { Calendar as CalendarIcon, Filter, Plus, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";

export const MaintenancePlannerPage = () => {
  const [activeView, setActiveView] = useState("week");
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  const schedule: any[] = [];
  const backlog: any[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="text-accent" /> Maintenance Planner
          </h1>
          <p className="text-sm text-gray-500 mt-1">Schedule and assign work orders across the enterprise fleet</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-secondary-bg border border-gray-800 rounded p-1 flex">
            <button className={`px-3 py-1 rounded text-xs font-bold ${activeView === "week" ? "bg-accent text-white" : "text-gray-400 hover:text-white"}`} onClick={() => setActiveView("week")}>Week</button>
            <button className={`px-3 py-1 rounded text-xs font-bold ${activeView === "month" ? "bg-accent text-white" : "text-gray-400 hover:text-white"}`} onClick={() => setActiveView("month")}>Month</button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <CalendarIcon size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Maintenance Schedule</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload maintenance records and work orders to build the planner.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Upload Documents
          </button>
        </div>
      ) : (
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          <div className="w-64 flex flex-col gap-4">
            <Card className="flex-1 p-0 overflow-hidden flex flex-col bg-secondary-bg/20">
              <div className="p-3 border-b border-gray-800 bg-secondary-bg/50 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Unscheduled Backlog</h3>
                <Filter size={14} className="text-gray-400 cursor-pointer hover:text-white" />
              </div>
              <div className="p-2 space-y-2 overflow-y-auto flex-1">
                {backlog.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-4">No unscheduled items</p>
                ) : (
                  backlog.map((item: any) => (
                    <div key={item.id} className="p-3 bg-primary-bg border border-gray-800 rounded cursor-grab hover:border-gray-600 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-mono text-gray-500">{item.id}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-300">{item.title}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <Card className="flex-1 p-0 overflow-hidden flex flex-col bg-[#050505]">
            <div className="grid grid-cols-7 border-b border-gray-800 shrink-0">
              {days.map((day, i) => (
                <div key={day} className={`p-2 text-center text-xs font-bold uppercase tracking-wider ${i === 2 ? "text-accent bg-accent/5" : "text-gray-500"}`}>
                  {day}
                  {i === 2 && <span className="block text-white mt-1 text-base">Today</span>}
                </div>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              No scheduled maintenance. Work orders will appear here.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
