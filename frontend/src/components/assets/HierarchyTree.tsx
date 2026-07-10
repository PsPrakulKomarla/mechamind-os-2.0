import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "react-flow-renderer";
import { Card } from "@/components/ui/Card";

interface HierarchyNode {
  id: string;
  type: "organization" | "factory" | "building" | "machine" | "component";
  label: string;
  parentId?: string;
}

export const HierarchyTree = ({ nodes: rawNodes, isLoading }: { nodes?: HierarchyNode[], isLoading?: boolean }) => {
  const { nodes, edges } = useMemo(() => {
    if (!rawNodes) return { nodes: [], edges: [] };

    const flowNodes = rawNodes.map((n, i) => ({
      id: n.id,
      data: { label: n.label },
      position: { x: (i % 3) * 200, y: Math.floor(i / 3) * 150 }, // Auto-layout stub
      style: {
        background: n.type === "machine" ? "#1F2937" : "#0B1220",
        color: "#F3F4F6",
        border: "1px solid #374151",
        borderRadius: "4px",
        padding: "10px",
        minWidth: "150px",
        textAlign: "center",
      }
    }));

    const flowEdges = rawNodes
      .filter(n => n.parentId)
      .map(n => ({
        id: `e-${n.parentId}-${n.id}`,
        source: n.parentId!,
        target: n.id,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6B7280" },
        style: { stroke: "#6B7280", strokeWidth: 2 }
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [rawNodes]);

  if (isLoading) {
    return <Card className="animate-pulse h-[600px] flex items-center justify-center text-gray-500">Loading Hierarchy...</Card>;
  }

  return (
    <Card className="h-[600px] w-full p-0 overflow-hidden">
      <ReactFlow nodes={nodes as any} edges={edges as any} fitView attributionPosition="bottom-right">
        <Background color="#374151" gap={16} size={1} />
        <Controls style={{ fill: "#6B7280" }} />
      </ReactFlow>
    </Card>
  );
};
