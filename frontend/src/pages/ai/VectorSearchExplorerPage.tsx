import React, { useState } from "react";
import { Zap, Search, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Mock Database of Chunks to simulate a real vector search
const MOCK_VECTOR_DB = [
  { id: "chunk-101", doc: "Spindle_Maintenance.pdf", text: "To replace the spindle bearing, first isolate the power supply to the main motor. The expected downtime is 2.5 hours." },
  { id: "chunk-102", doc: "Spindle_Maintenance.pdf", text: "Lubrication of the spindle shaft must occur every 500 operational hours using ISO VG 32 oil." },
  { id: "chunk-201", doc: "Safety_Protocol_v2.pdf", text: "All personnel must wear Class 2 electrical isolation gloves before inspecting the motor casing." },
  { id: "chunk-305", doc: "Pump_Manual.pdf", text: "If the centrifugal pump exhibits cavitation noise (sounding like gravel), immediately throttle the discharge valve." },
  { id: "chunk-306", doc: "Pump_Manual.pdf", text: "Pump bearing temperature should not exceed 85 degrees Celsius under normal load." },
];

export const VectorSearchExplorerPage = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Simulate a semantic search function (pseudo cosine-similarity ranking based on keyword hits)
  const performSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const keywords = query.toLowerCase().split(" ").filter(w => w.length > 2);
      
      const scored = MOCK_VECTOR_DB.map(chunk => {
        let score = 0.50; // base background similarity
        const lowerText = chunk.text.toLowerCase();
        
        keywords.forEach(kw => {
          if (lowerText.includes(kw)) score += 0.25;
        });

        // Simulate noise
        score += (Math.random() * 0.1 - 0.05);
        if (score > 0.99) score = 0.99;
        
        return { ...chunk, score };
      });

      // Filter out low scores and sort descending
      const filtered = scored.filter(s => s.score > 0.55).sort((a, b) => b.score - a.score);
      setResults(filtered);
      setIsSearching(false);
    }, 600); // Simulate network/DB latency
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="text-info" /> Vector Search Explorer
          </h1>
          <p className="text-sm text-gray-500 mt-1">Simulate semantic RAG queries against the embedding database</p>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-150px)]">
        {/* Search Panel */}
        <div className="w-1/3 flex flex-col gap-4">
          <Card className="p-4 bg-secondary-bg/50">
            <h3 className="font-bold text-white mb-3 text-sm">Query Parameters</h3>
            <form onSubmit={performSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Semantic Query</label>
                <textarea 
                  className="w-full bg-primary-bg border border-gray-700 rounded p-3 text-sm text-white outline-none focus:border-info resize-none h-24"
                  placeholder="e.g. How do I fix a noisy pump?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Top K</label>
                  <input type="number" defaultValue={5} placeholder="e.g. 5" className="w-full bg-primary-bg border border-gray-700 rounded p-2 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Min Similarity</label>
                  <input type="number" defaultValue={0.65} step={0.01} placeholder="e.g. 0.65" className="w-full bg-primary-bg border border-gray-700 rounded p-2 text-sm text-white outline-none" />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSearching || !query.trim()}
                className="w-full py-2 bg-info hover:bg-info/90 text-white rounded font-bold transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <Search size={16} /> {isSearching ? "Calculating Distance..." : "Execute Search"}
              </button>
            </form>
          </Card>

          <Card className="flex-1 bg-secondary-bg/20 p-4">
             <h3 className="font-bold text-gray-400 text-sm mb-2 uppercase tracking-wider">Metrics</h3>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Embedding Model</span>
                 <span className="text-gray-300 font-mono">text-embedding-004</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Dimensions</span>
                 <span className="text-gray-300 font-mono">768</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Distance Metric</span>
                 <span className="text-gray-300 font-mono">Cosine Similarity</span>
               </div>
             </div>
          </Card>
        </div>

        {/* Results Panel */}
        <Card className="w-2/3 flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-secondary-bg/30 flex justify-between items-center">
            <h2 className="font-bold text-white">Retrieved Chunks ({results.length})</h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {results.length === 0 && !isSearching && (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Enter a query to visualize the vector search results.</p>
              </div>
            )}

            {results.map((result, idx) => (
              <div key={idx} className="border border-gray-800 bg-secondary-bg/20 rounded-lg p-4 hover:border-info/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">{result.id}</Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><ChevronRight size={12}/> {result.doc}</span>
                  </div>
                  <Badge variant={result.score > 0.8 ? "success" : result.score > 0.65 ? "warning" : "secondary"} className="font-mono">
                    Score: {result.score.toFixed(3)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-mono">"{result.text}"</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
