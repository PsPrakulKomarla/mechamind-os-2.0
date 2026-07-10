import React from "react";
import { Card } from "@/components/ui/Card";
import { BookOpen, Search, Wrench, AlertTriangle } from "lucide-react";

export const PromptLibraryPage = () => {
  const templates = [
    { title: "Diagnose Fault", icon: <AlertTriangle className="text-warning" size={20}/>, description: "Analyze the root cause of a specific machine failure code.", prompt: "Analyze fault code [CODE] on [MACHINE] using recent sensor telemetry and manuals." },
    { title: "Maintenance Summary", icon: <Wrench className="text-info" size={20}/>, description: "Summarize the last 6 months of maintenance records.", prompt: "Summarize all maintenance activities and part replacements for [MACHINE] over the last 6 months." },
    { title: "Manual Search", icon: <BookOpen className="text-accent" size={20}/>, description: "Ask a specific question against the technical library.", prompt: "According to the OEM manual, what is the torque specification for [PART]?" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prompt Library</h1>
          <p className="text-sm text-gray-500 mt-1">Standardized AI workflows for your factory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, i) => (
          <Card key={i} className="hover:border-accent/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                {tpl.icon}
              </div>
              <h3 className="font-bold text-white">{tpl.title}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4 h-10">{tpl.description}</p>
            <div className="bg-primary-bg p-3 rounded border border-gray-800 font-mono text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
              "{tpl.prompt}"
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
