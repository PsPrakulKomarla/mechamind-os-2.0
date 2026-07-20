import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { Database, Search, Loader2 } from "lucide-react";
import { useKnowledgeGraph } from "@/hooks/useAiQueries";

export const KnowledgeGraphExplorerPage = () => {
  const { data: graphData, isLoading } = useKnowledgeGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (graphData) {
      const flowNodes = (graphData.nodes || []).map((n: any, i: number) => {
        // Fallback positioning if backend doesn't provide it
        const angle = (i / (graphData.nodes?.length || 1)) * Math.PI * 2;
        const radius = 200;
        return {
          id: n.id,
          data: { label: n.label || n.id },
          position: n.position || { x: Math.cos(angle) * radius + 300, y: Math.sin(angle) * radius + 250 },
          style: {
            background: n.type === 'document' ? '#0f172a' : '#1e293b',
            color: n.type === 'document' ? '#94a3b8' : '#fff',
            border: `1px solid ${n.type === 'document' ? '#14F195' : '#3b82f6'}`,
            padding: "10px",
            borderRadius: "4px"
          }
        };
      });

      const flowEdges = (graphData.edges || []).map((e: any, i: number) => ({
        id: e.id || `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || e.relation,
        labelStyle: { fill: "#9CA3AF", fontSize: 10, fontWeight: 700 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6B7280" },
        style: { stroke: "#64748b", strokeWidth: 1.5 }
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [graphData, setNodes, setEdges]);

  // Filter nodes based on search term
  const filteredNodes = React.useMemo(() => {
    if (!searchTerm) return nodes;
    return nodes.map(n => ({
      ...n,
      hidden: !n.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    }));
  }, [nodes, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="text-info" /> Knowledge Graph Explorer
          </h1>
          <p className="text-sm text-gray-500 mt-1">Navigate the ontological relationships between assets and vector chunks.</p>
        </div>
      </div>

      <div className="flex-1 relative border border-gray-800 rounded-lg overflow-hidden bg-primary-bg">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-bg/50 backdrop-blur-sm z-50">
            <Loader2 className="animate-spin text-accent" size={32} />
          </div>
        ) : null}
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background color="#334155" gap={16} />
          <Controls className="bg-secondary-bg border-gray-700 fill-white" />
          <MiniMap nodeColor="#3b82f6" maskColor="rgba(15, 23, 42, 0.8)" style={{ backgroundColor: "#1e293b" }} />
          
          <Panel position="top-right" className="bg-secondary-bg p-4 rounded border border-gray-800 shadow-xl m-4 w-64">
            <h3 className="text-sm font-bold text-white mb-3">Graph Filters</h3>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Search nodes..." 
                className="w-full bg-primary-bg border border-gray-700 rounded pl-8 pr-2 py-1.5 text-xs text-white outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-primary-bg text-info" /> Show Assets
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-primary-bg text-accent" /> Show Documents
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-primary-bg text-warning" /> Show Work Orders
              </label>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};
