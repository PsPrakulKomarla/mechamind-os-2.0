import React from "react";
import { Card } from "@/components/ui/Card";
import { Settings, Save, Cpu } from "lucide-react";

export const ModelConfigurationPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="text-accent" /> Model Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">Select and tune LLM and Embedding providers globally</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded font-medium hover:bg-accent/90 transition-colors">
          <Save size={16} /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-white mb-6 border-b border-gray-800 pb-3">Primary Generative Model (LLM)</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Provider</label>
              <select className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent">
                <option value="gemini">Google Gemini Pro 1.5</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="claude">Anthropic Claude 3.5 Sonnet</option>
                <option value="local">Local Model (vLLM / Ollama)</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-gray-400">Temperature</label>
                <span className="text-xs text-accent font-mono">0.2</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full accent-accent" />
              <p className="text-xs text-gray-500 mt-1">Lower values produce more deterministic, factual responses (recommended for Enterprise RAG).</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-gray-400">Max Output Tokens</label>
                <span className="text-xs text-accent font-mono">2048</span>
              </div>
              <input type="range" min="256" max="8192" step="256" defaultValue="2048" className="w-full accent-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-white mb-6 border-b border-gray-800 pb-3">Embedding Model</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Provider</label>
              <select className="w-full bg-secondary-bg border border-gray-700 rounded p-2.5 text-white outline-none focus:border-accent">
                <option value="gemini_embed">text-embedding-004 (Google)</option>
                <option value="openai_embed">text-embedding-3-large (OpenAI)</option>
                <option value="local_embed">BGE-m3 (Local)</option>
              </select>
            </div>
            
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg mt-4">
              <h4 className="text-sm font-bold text-warning mb-1">Warning: Re-indexing Required</h4>
              <p className="text-xs text-gray-300">Changing the embedding model requires re-processing all 4,821 documents in the knowledge base. This operation may take several hours and incur API costs.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
