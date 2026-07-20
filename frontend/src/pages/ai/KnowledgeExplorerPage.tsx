import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/Card";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useKnowledgeGraph } from "@/hooks/useAiQueries";

export const KnowledgeExplorerPage = () => {
  const { data: graphData, isLoading } = useKnowledgeGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (graphData) {
      const flowNodes = (graphData.nodes || []).map((n: any, i: number) => {
        const angle = (i / (graphData.nodes?.length || 1)) * Math.PI * 2;
        const radius = 200;
        return {
          id: n.id,
          data: { label: n.label || n.id },
          position: n.position || { x: Math.cos(angle) * radius + 300, y: Math.sin(angle) * radius + 250 },
          style: {
            background: n.group === "core" ? "#3B82F6" : "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "center" as const,
            boxShadow: n.group === "core" ? "0 0 15px rgba(59, 130, 246, 0.5)" : "none"
          }
        };
      });

      const flowEdges = (graphData.edges || []).map((e: any, i: number) => ({
        id: e.id || `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || e.relation,
        labelStyle: { fill: "#9CA3AF", fontSize: 10, fontWeight: 700 },
        labelBgStyle: { fill: "#1F2937" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6B7280" },
        style: { stroke: "#6B7280", strokeWidth: 1.5, strokeDasharray: "5 5" }
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [graphData, setNodes, setEdges]);

  const filteredNodes = React.useMemo(() => {
    if (!searchTerm) return nodes;
    return nodes.map(n => ({
      ...n,
      hidden: !n.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    }));
  }, [nodes, searchTerm]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Knowledge Explorer</h1>
          <p className="text-sm text-gray-500">Navigate the relationships between your machines, faults, and documents.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <Input 
            type="text" 
            placeholder="Search Knowledge Graph..." 
            className="pl-10" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1">
        <Card className="h-[600px] w-full p-0 overflow-hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-bg/50 backdrop-blur-sm z-50">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : null}
          <ReactFlow nodes={filteredNodes as any} edges={edges as any} fitView attributionPosition="bottom-right">
            <Background color="#374151" gap={16} size={1} />
            <Controls style={{ fill: "#6B7280" }} />
          </ReactFlow>
        </Card>
      </div>
    </div>
  );
};
