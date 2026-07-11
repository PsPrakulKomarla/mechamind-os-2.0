import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";
import { Database, Search } from "lucide-react";

const initialNodes = [
  { id: "M1", position: { x: 250, y: 50 }, data: { label: "Milling Machine (Asset)" }, style: { background: "#1e293b", color: "#fff", border: "1px solid #3b82f6" } },
  { id: "Doc1", position: { x: 100, y: 150 }, data: { label: "Service Manual (PDF)" }, style: { background: "#1e293b", color: "#fff", border: "1px solid #14F195" } },
  { id: "WO1", position: { x: 400, y: 150 }, data: { label: "WO-2042 (Record)" }, style: { background: "#1e293b", color: "#fff", border: "1px solid #f59e0b" } },
  { id: "Chunk1", position: { x: 50, y: 250 }, data: { label: "Chunk: Spindle Replacement" }, style: { background: "#0f172a", color: "#94a3b8", border: "1px solid #334155" } },
  { id: "Chunk2", position: { x: 200, y: 250 }, data: { label: "Chunk: Lubrication Schedule" }, style: { background: "#0f172a", color: "#94a3b8", border: "1px solid #334155" } },
];

const initialEdges = [
  { id: "e1", source: "M1", target: "Doc1", label: "has_document", style: { stroke: "#64748b" } },
  { id: "e2", source: "M1", target: "WO1", label: "has_workorder", style: { stroke: "#64748b" } },
  { id: "e3", source: "Doc1", target: "Chunk1", label: "contains", style: { stroke: "#334155", strokeDasharray: "5 5" } },
  { id: "e4", source: "Doc1", target: "Chunk2", label: "contains", style: { stroke: "#334155", strokeDasharray: "5 5" } },
];

export const KnowledgeGraphExplorerPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
        <ReactFlow
          nodes={nodes}
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
              <input type="text" placeholder="Search nodes..." className="w-full bg-primary-bg border border-gray-700 rounded pl-8 pr-2 py-1.5 text-xs text-white outline-none" />
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
