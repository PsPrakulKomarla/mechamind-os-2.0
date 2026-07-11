import React, { useState } from "react";
import { PromptEditor } from "@/components/ai/PromptEditor";
import { usePrompts, useSavePrompt } from "@/hooks/useAiKnowledgeQueries";
import { BookOpen, Save, History, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const PromptManagementPage = () => {
  const { data: prompts, isLoading } = usePrompts();
  const saveMutation = useSavePrompt();

  const [activePrompt, setActivePrompt] = useState("maintenance_rca_v2");
  const [promptContent, setPromptContent] = useState(
    "System: You are an expert reliability engineer evaluating a failure.\n\nUser: Analyze the following symptoms for asset {{asset_id}}.\nContext: {{vector_context}}\n\nAssistant:"
  );

  const handleSave = () => {
    saveMutation.mutate({ id: activePrompt, content: promptContent });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-accent" /> Prompt Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Version control and tune the RAG system prompts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded transition-colors text-sm">
            <History size={14} /> Version History
          </button>
          <button 
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-1.5 bg-accent text-white rounded hover:bg-accent/90 transition-colors font-medium text-sm disabled:opacity-50"
          >
            <Save size={14} /> {saveMutation.isPending ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-64 border border-gray-800 bg-secondary-bg/20 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 font-bold text-gray-300 text-sm bg-secondary-bg/50">Active Templates</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {["maintenance_rca_v2", "copilot_chat_base", "document_summary_v1"].map(p => (
              <button 
                key={p}
                onClick={() => setActivePrompt(p)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors ${activePrompt === p ? "bg-accent/10 text-accent border border-accent/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <Card className="flex-1 flex flex-col p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-lg">{activePrompt}</h3>
              <p className="text-xs text-gray-500 mt-1">Last edited by System Admin on 2026-07-10</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-success/20 text-success rounded transition-colors text-xs font-bold">
              <Play size={12} /> Test Prompt
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            <PromptEditor 
              value={promptContent} 
              onChange={setPromptContent} 
              variables={["asset_id", "vector_context", "user_query", "date"]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
