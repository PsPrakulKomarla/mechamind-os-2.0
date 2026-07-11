import React, { useState } from "react";
import { Calendar as CalendarIcon, Filter, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const MaintenancePlannerPage = () => {
  const [activeView, setActiveView] = useState("week");

  // Mock schedule data
  const schedule = [
    { id: "WO-9912", title: "M4 Bearing Replacement", day: 2, duration: 4, type: "predictive", assigned: "Tech. Davis" },
    { id: "WO-9913", title: "M1 Firmware Update", day: 1, duration: 1, type: "preventive", assigned: "Eng. Smith" },
    { id: "WO-9914", title: "M2 Coolant Flush", day: 4, duration: 2, type: "preventive", assigned: "Tech. Lee" },
  ];

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
          <button className="flex items-center gap-1 bg-accent text-white px-3 py-1.5 rounded font-bold text-sm hover:bg-accent/90 transition-colors">
            <Plus size={16} /> New Work Order
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Backlog Sidebar */}
        <div className="w-64 flex flex-col gap-4">
          <Card className="flex-1 p-0 overflow-hidden flex flex-col bg-secondary-bg/20">
            <div className="p-3 border-b border-gray-800 bg-secondary-bg/50 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Unscheduled Backlog</h3>
              <Filter size={14} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {[
                { id: "WO-9915", title: "Conveyor Belt Tensioning", priority: "high" },
                { id: "WO-9916", title: "HVAC Filter Change", priority: "low" },
                { id: "WO-9917", title: "Pump Seal Inspection", priority: "medium" },
              ].map(item => (
                <div key={item.id} className="p-3 bg-primary-bg border border-gray-800 rounded cursor-grab hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-gray-500">{item.id}</span>
                    <Badge variant={item.priority === "high" ? "danger" : item.priority === "medium" ? "warning" : "default"} className="text-[10px]">{item.priority}</Badge>
                  </div>
                  <p className="text-sm font-bold text-gray-300">{item.title}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Custom CSS Grid Calendar */}
        <Card className="flex-1 p-0 overflow-hidden flex flex-col bg-[#050505]">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-800 shrink-0">
            {days.map((day, i) => (
              <div key={day} className={`p-2 text-center text-xs font-bold uppercase tracking-wider ${i === 2 ? "text-accent bg-accent/5" : "text-gray-500"}`}>
                {day}
                {i === 2 && <span className="block text-white mt-1 text-base">Today</span>}
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div className="flex-1 grid grid-cols-7 grid-rows-[repeat(12,minmax(50px,1fr))] gap-[1px] bg-gray-800 overflow-y-auto relative p-[1px]">
             {/* Background Cells */}
             {Array.from({ length: 7 * 12 }).map((_, i) => (
                <div key={i} className="bg-primary-bg hover:bg-secondary-bg/50 transition-colors"></div>
             ))}

             {/* Rendered Events */}
             {schedule.map(ev => {
               // Calculate CSS grid coordinates (very simplistic for prototype)
               // grid-column: start / end
               const startCol = ev.day;
               const spanRows = ev.duration;
               
               return (
                 <div 
                   key={ev.id}
                   className={`absolute rounded p-2 m-1 border-l-4 shadow-lg ${
                     ev.type === "predictive" ? "bg-warning/10 border-warning border border-l-warning" : "bg-info/10 border-info border border-l-info"
                   }`}
                   style={{
                     left: `calc(${(ev.day - 1) * (100 / 7)}% + 4px)`,
                     width: `calc(${100 / 7}% - 8px)`,
                     top: `calc(${1 * 50}px + 4px)`, // Hardcoded start row for prototype visual
                     height: `calc(${ev.duration * 50}px - 8px)`,
                     zIndex: 10
                   }}
                 >
                   <p className="text-xs font-bold text-white mb-1 leading-tight">{ev.title}</p>
                   <p className="text-[10px] text-gray-400 font-mono">{ev.id}</p>
                   <div className="mt-2 text-[10px] bg-secondary-bg/80 px-1.5 py-0.5 rounded inline-block text-gray-300">
                     {ev.assigned}
                   </div>
                 </div>
               )
             })}
          </div>
        </Card>
      </div>
    </div>
  );
};
