import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAiStats } from "@/hooks/useAiKnowledgeQueries";
import { Brain, Database, Zap, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";

export const AiKnowledgeDashboardPage = () => {
  const { data: stats, isLoading } = useAiStats();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="text-accent animate-pulse" /> AI Knowledge & Learning Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor Vector DB size, embeddings, and global AI metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Embeddings" value={stats?.totalEmbeddings ?? "—"} trend={stats?.totalEmbeddings_trend} isLoading={isLoading} />
        <StatCard title="Indexed Documents" value={stats?.indexedDocs ?? "—"} trend={stats?.indexedDocs_trend} isLoading={isLoading} />
        <StatCard title="Avg Retrieval Confidence" value={stats?.avgConfidence ?? "—"} trend={stats?.avgConfidence_trend} isLoading={isLoading} />
        <StatCard title="Pending Feedback" value={stats?.pendingFeedback ?? "—"} trend={stats?.pendingFeedback_trend} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Link to="/ai/knowledge-graph" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <Database size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Knowledge Graph Explorer</h3>
          <p className="text-sm text-gray-400 mt-2">Visually inspect relationships between assets, failures, and RCA documents.</p>
        </Link>

        <Link to="/ai/vector-search" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <Zap size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Vector Search Inspector</h3>
          <p className="text-sm text-gray-400 mt-2">Run semantic queries and inspect raw chunks and cosine similarity scores.</p>
        </Link>

        <Link to="/ai/prompts" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <BookOpen size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Prompt Management</h3>
          <p className="text-sm text-gray-400 mt-2">Edit global RAG templates, test variables, and manage model configuration.</p>
        </Link>
      </div>

      <Card className="mt-6 p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-secondary-bg/50">
          <h3 className="font-bold text-white">Recent Learning Events</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {stats?.recentEvents && stats.recentEvents.length > 0 ? (
            stats.recentEvents.map((event: any, i: number) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-800/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{event.title || "Indexing event"}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.detail || ""}</p>
                </div>
                <span className={`text-xs font-mono ${event.status === "success" ? "text-success" : "text-warning"}`}>
                  {event.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No learning events yet. Process documents to see indexing activity here.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
