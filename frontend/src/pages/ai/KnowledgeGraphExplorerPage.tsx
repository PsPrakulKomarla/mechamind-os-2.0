import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Database, Search, Loader2, X, Package, FileText, Users, Wrench, AlertTriangle, Radio, ChevronRight } from "lucide-react";
import { useKnowledgeGraph } from "@/hooks/useAiQueries";
import { useOnboardingStore } from "@/store/onboarding";

interface NodeMetadata {
  id: string;
  label: string;
  type: string;
  description?: string;
  properties?: Record<string, any>;
}

const NODE_COLORS: Record<string, { bg: string; border: string; icon: typeof Package }> = {
  equipment: { bg: "#1e3a5f", border: "#3B82F6", icon: Package },
  document: { bg: "#1a2e1a", border: "#10B981", icon: FileText },
  technician: { bg: "#2d1f3d", border: "#8B5CF6", icon: Users },
  procedure: { bg: "#1f2d1f", border: "#06B6D4", icon: Wrench },
  failure: { bg: "#3d1f1f", border: "#EF4444", icon: AlertTriangle },
  sensor: { bg: "#3d2f1f", border: "#F59E0B", icon: Radio },
};

const ENTITY_TYPES = [
  { key: "equipment", label: "Equipment", color: "#3B82F6", icon: Package },
  { key: "document", label: "Documents", color: "#10B981", icon: FileText },
  { key: "technician", label: "Technicians", color: "#8B5CF6", icon: Users },
  { key: "procedure", label: "Procedures", color: "#06B6D4", icon: Wrench },
  { key: "failure", label: "Failures", color: "#EF4444", icon: AlertTriangle },
  { key: "sensor", label: "Sensors", color: "#F59E0B", icon: Radio },
];

function NodeDetailPanel({ node, onClose }: { node: NodeMetadata | null; onClose: () => void }) {
  if (!node) return null;
  const config = NODE_COLORS[node.type] || NODE_COLORS.equipment;
  const Icon = config.icon;

  return (
    <div className="w-80 border-l border-gray-800 bg-secondary-bg flex flex-col shrink-0 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.border}20` }}>
            <Icon size={14} style={{ color: config.border }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-[180px]">{node.label}</h3>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">{node.type}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {node.description && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Description</p>
            <p className="text-xs text-gray-300">{node.description}</p>
          </div>
        )}
        {node.properties && Object.keys(node.properties).length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Properties</p>
            <div className="space-y-2">
              {Object.entries(node.properties).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-[#111827]/60 border border-gray-800 rounded-lg px-3 py-2">
                  <span className="text-[10px] text-gray-500 uppercase">{key.replace(/_/g, " ")}</span>
                  <span className="text-xs text-gray-300 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!node.description && (!node.properties || Object.keys(node.properties).length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-xs">No additional metadata available for this node.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const KnowledgeGraphExplorerPage = () => {
  const { data: graphData, isLoading } = useKnowledgeGraph();
  const { hasDocuments } = useOnboardingStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<NodeMetadata | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(ENTITY_TYPES.map((e) => e.key));

  const toggleFilter = useCallback((key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }, []);

  useEffect(() => {
    if (graphData) {
      const flowNodes = (graphData.nodes || []).map((n: any, i: number) => {
        const angle = (i / (graphData.nodes?.length || 1)) * Math.PI * 2;
        const radius = 250;
        const nodeType = n.type || "equipment";
        const config = NODE_COLORS[nodeType] || NODE_COLORS.equipment;

        return {
          id: n.id,
          data: {
            label: n.label || n.id,
            nodeType,
            description: n.description,
            properties: n.properties,
          },
          position: n.position || { x: Math.cos(angle) * radius + 400, y: Math.sin(angle) * radius + 300 },
          style: {
            background: config.bg,
            color: "#e2e8f0",
            border: `2px solid ${config.border}`,
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 600,
            boxShadow: `0 0 15px ${config.border}15`,
            cursor: "pointer",
          },
        };
      });

      const flowEdges = (graphData.edges || []).map((e: any, i: number) => ({
        id: e.id || `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || e.relation,
        labelStyle: { fill: "#9CA3AF", fontSize: 9, fontWeight: 700 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#4B5563", width: 16, height: 16 },
        style: { stroke: "#475569", strokeWidth: 1.5 },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [graphData, setNodes, setEdges]);

  const filteredNodes = useMemo(() => {
    return nodes.map((n) => {
      const matchesSearch = !searchTerm || n.data.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilters.includes(n.data.nodeType);
      return {
        ...n,
        hidden: !matchesSearch || !matchesFilter,
      };
    });
  }, [nodes, searchTerm, activeFilters]);

  const handleNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode({
      id: node.id,
      label: node.data.label,
      type: node.data.nodeType || "equipment",
      description: node.data.description,
      properties: node.data.properties,
    });
  }, []);

  const isEmpty = !hasDocuments && (!graphData || !graphData.nodes || graphData.nodes.length === 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="text-info" /> Knowledge Graph Explorer
          </h1>
          <p className="text-sm text-gray-500 mt-1">Navigate relationships between assets, documents, and operations</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Equipment
          <span className="w-2 h-2 rounded-full bg-[#10B981] ml-2" /> Documents
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] ml-2" /> Technicians
        </div>
      </div>

      <div className="flex-1 flex relative border border-gray-800 rounded-lg overflow-hidden bg-primary-bg">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-bg/50 backdrop-blur-sm z-50">
            <Loader2 className="animate-spin text-accent" size={32} />
          </div>
        ) : null}

        {isEmpty && !isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <Database size={48} className="text-gray-600 mb-4" />
            <h3 className="text-white font-semibold mb-1">No Knowledge Graph Data</h3>
            <p className="text-gray-500 text-sm max-w-xs">Upload documents or load demo data to build the knowledge graph.</p>
          </div>
        ) : (
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Background color="#1e293b" gap={16} />
            <Controls className="bg-secondary-bg border-gray-700 fill-white" />
            <MiniMap
              nodeColor={(n) => NODE_COLORS[n.data?.nodeType]?.border || "#3b82f6"}
              maskColor="rgba(15, 23, 42, 0.8)"
              style={{ backgroundColor: "#1e293b" }}
            />

            <Panel position="top-right" className="bg-secondary-bg p-4 rounded-lg border border-gray-800 shadow-xl m-4 w-64">
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Search & Filter</h3>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className="w-full bg-primary-bg border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-accent transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                {ENTITY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeFilters.includes(type.key);
                  return (
                    <button
                      key={type.key}
                      onClick={() => toggleFilter(type.key)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-[#111827] border border-gray-700 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: `${type.color}20` }}>
                        <Icon size={10} style={{ color: type.color }} />
                      </div>
                      <span className="flex-1 text-left">{type.label}</span>
                      <div className={`w-3.5 h-3.5 rounded border ${isActive ? "border-accent bg-accent/20" : "border-gray-700"}`} />
                    </button>
                  );
                })}
              </div>
            </Panel>
          </ReactFlow>
        )}

        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
};
