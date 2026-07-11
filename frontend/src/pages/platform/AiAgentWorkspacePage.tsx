import React from "react";
import { Bot, User, ShieldAlert, Wrench } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const AiAgentWorkspacePage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="text-accent" /> Multi-Agent Collaboration Workspace
          </h1>
          <p className="text-sm text-gray-500 mt-1">Orchestrate specialized AI agents to debate and solve complex factory issues</p>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-150px)]">
        {/* Left Agent */}
        <Card className="flex-1 p-0 flex flex-col overflow-hidden border-warning/30 bg-[#0a0f1c]">
          <div className="p-4 border-b border-warning/20 bg-warning/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/20 rounded-full text-warning"><Wrench size={16}/></div>
              <h3 className="font-bold text-white">Reliability Agent</h3>
            </div>
            <span className="text-xs text-gray-500 font-mono">Model: GPT-4o</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-secondary-bg p-3 rounded-lg border border-gray-800">
               <p className="text-sm text-gray-300">Based on the RCA documents for M4, the bearing failure is primarily caused by insufficient lubrication intervals. I recommend altering the PM schedule to 250 hours.</p>
            </div>
            <div className="bg-secondary-bg p-3 rounded-lg border border-gray-800">
               <p className="text-sm text-gray-300">I have calculated the new RUL trajectory. This change will extend asset life by 1.2 years.</p>
            </div>
          </div>
        </Card>

        {/* Center: Context/Task */}
        <div className="w-64 shrink-0 flex flex-col gap-4">
          <Card className="p-4 bg-secondary-bg/50">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Active Task</h4>
            <p className="text-sm font-bold text-white mb-1">M4 Root Cause Analysis</p>
            <p className="text-xs text-gray-400">Determine why the main pump failed and adjust maintenance strategy to prevent recurrence.</p>
          </Card>
          
          <Card className="p-4 bg-secondary-bg/20 border-dashed border-gray-700 flex-1 flex flex-col items-center justify-center text-center">
            <User size={32} className="text-gray-500 mb-2" />
            <p className="text-sm text-gray-400">Human-in-the-loop (HITL) approval required before finalizing strategy.</p>
            <button className="mt-4 px-4 py-2 bg-accent text-white font-bold text-xs rounded hover:bg-accent/90 transition-colors w-full">Approve Findings</button>
          </Card>
        </div>

        {/* Right Agent */}
        <Card className="flex-1 p-0 flex flex-col overflow-hidden border-danger/30 bg-[#1c0a0a]">
          <div className="p-4 border-b border-danger/20 bg-danger/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-danger/20 rounded-full text-danger"><ShieldAlert size={16}/></div>
              <h3 className="font-bold text-white">Safety & Compliance Agent</h3>
            </div>
            <span className="text-xs text-gray-500 font-mono">Model: Claude 3.5</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-secondary-bg p-3 rounded-lg border border-gray-800 ml-4">
               <p className="text-sm text-gray-300">I object to the Reliability Agent's proposal. Increasing lubrication frequency requires technicians to bypass the primary safety guard more often, increasing risk of OSHA violations.</p>
            </div>
            <div className="bg-secondary-bg p-3 rounded-lg border border-gray-800 ml-4 border-l-4 border-l-danger">
               <p className="text-sm text-gray-300">Alternative: Install an auto-lubrication system. It costs $2,500 but eliminates safety risk entirely.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
