import React, { useState } from "react";
import { TaskList } from "@/components/mobile/TaskList";
import { OfflineBanner } from "@/components/mobile/OfflineBanner";
import { Search } from "lucide-react";

const mockTasks = [
  { id: "t1", title: "Inspect Line B Motor", description: "Routine vibration analysis on main drive motor.", status: "pending", priority: "high", dueDate: "Today, 14:00" },
  { id: "t2", title: "Calibrate Sensor Hub 3", description: "Monthly calibration of temperature sensors in Zone C.", status: "in-progress", priority: "medium", dueDate: "Today, 16:30" },
  { id: "t3", title: "Replace Air Filter", description: "HVAC unit 2 requires a filter swap.", status: "completed", priority: "low" },
] as any[];

export const WorkforceDashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState(mockTasks);

  const handleComplete = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <OfflineBanner />
      
      <div className="px-4 py-6 bg-brand-mobile text-white">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="opacity-80 text-sm mt-1">3 active assignments</p>
        
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-white/10 border border-white/20 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40"
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-20">
        <TaskList tasks={tasks} onComplete={handleComplete} />
      </div>
    </div>
  );
};
