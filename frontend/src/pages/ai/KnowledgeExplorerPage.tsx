import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "react-flow-renderer";
import { Card } from "@/components/ui/Card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export const KnowledgeExplorerPage = () => {
  // Hardcoded foundation mock for the Knowledge Graph visualization
  const { nodes, edges } = useMemo(() => {
    const rawNodes = [
      { id: "mach-1", type: "machine", label: "Stamping Press M-201", group: "core" },
      { id: "fault-1", type: "fault", label: "Excessive Vibration", group: "issue" },
      { id: "doc-1", type: "document", label: "Siemens Operator Manual", group: "reference" },
      { id: "comp-1", type: "component", label: "Primary Spindle Bearing", group: "part" },
      { id: "work-1", type: "workorder", label: "WO-9982 (Replacement)", group: "history" }
    ];

    const flowNodes = rawNodes.map((n, i) => {
      // Basic circle placement for demo
      const angle = (i / rawNodes.length) * Math.PI * 2;
      const radius = 200;
      return {
        id: n.id,
        data: { label: n.label },
        position: { x: Math.cos(angle) * radius + 300, y: Math.sin(angle) * radius + 250 },
        style: {
          background: n.group === "core" ? "#3B82F6" : "#1F2937",
          color: "#F3F4F6",
          border: "1px solid #374151",
          borderRadius: "8px",
          padding: "10px",
          textAlign: "center",
          boxShadow: n.group === "core" ? "0 0 15px rgba(59, 130, 246, 0.5)" : "none"
        }
      };
    });

    const rawEdges = [
      { source: "mach-1", target: "fault-1", label: "experiences" },
      { source: "mach-1", target: "comp-1", label: "contains" },
      { source: "fault-1", target: "doc-1", label: "documented in" },
      { source: "comp-1", target: "work-1", label: "replaced in" }
    ];

    const flowEdges = rawEdges.map((e, i) => ({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      label: e.label,
      labelStyle: { fill: "#9CA3AF", fontSize: 10, fontWeight: 700 },
      labelBgStyle: { fill: "#1F2937" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6B7280" },
      style: { stroke: "#6B7280", strokeWidth: 1.5, strokeDasharray: "5 5" }
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, []);

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
          <Input type="text" placeholder="Search Knowledge Graph..." className="pl-10" />
        </div>
      </div>
      
      <div className="flex-1">
        <Card className="h-[600px] w-full p-0 overflow-hidden">
          <ReactFlow nodes={nodes as any} edges={edges as any} fitView attributionPosition="bottom-right">
            <Background color="#374151" gap={16} size={1} />
            <Controls style={{ fill: "#6B7280" }} />
          </ReactFlow>
        </Card>
      </div>
    </div>
  );
};
