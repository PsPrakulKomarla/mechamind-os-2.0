import React from "react";
import { useParams } from "react-router-dom";
import { useWorkOrderDetails, useRcaDetails } from "@/hooks/useMaintenanceQueries";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RcaVisualizer } from "@/components/maintenance/RcaVisualizer";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { Wrench, Clock, User, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export const WorkOrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: woData, isLoading: woLoading } = useWorkOrderDetails(id || "");
  const { data: rcaData, isLoading: rcaLoading } = useRcaDetails(id || "");

  // Mocks
  const mockWo = woData || {
    id: "WO-2024-001",
    title: "Replace primary spindle bearing",
    machine: "Stamping Press M-201",
    priority: "critical",
    status: "open",
    assignee: "John Smith",
    dueDate: "2024-03-01",
    estimatedDuration: "4 hours",
    description: "AI Copilot detected anomalous vibration indicating bearing wear. Replace immediately to prevent catastrophic failure."
  };

  const mockRca = rcaData || {
    problem: "Excessive vibration detected on primary spindle (2.4 mm/s).",
    whys: [
      "Bearing housing clearance exceeded tolerance.",
      "Inadequate lubrication during previous PM cycle.",
      "Lubrication pump line was partially blocked.",
      "Contaminants found in the fluid reservoir.",
      "Filter change was skipped during last shutdown."
    ],
    recommendation: "Replace bearing assembly, flush lubrication lines, replace filters, and update PM checklist to make filter inspection mandatory."
  };

  const vibrationData = [
    { time: "00:00", vibration: 0.8, threshold: 2.0 },
    { time: "04:00", vibration: 0.9, threshold: 2.0 },
    { time: "08:00", vibration: 1.2, threshold: 2.0 },
    { time: "12:00", vibration: 1.8, threshold: 2.0 },
    { time: "16:00", vibration: 2.4, threshold: 2.0 },
    { time: "20:00", vibration: 2.1, threshold: 2.0 },
    { time: "23:59", vibration: 2.4, threshold: 2.0 },
  ];

  if (woLoading) return <div className="p-8 text-gray-500">Loading Work Order Details...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-start justify-between border-b border-gray-800 pb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger mt-1">
            <Wrench size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">{mockWo.title}</h1>
              <Badge variant="danger" className="uppercase text-[10px] py-0">{mockWo.priority}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span className="font-mono text-gray-300">{mockWo.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-accent"><Wrench size={14}/> {mockWo.machine}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User size={14}/> {mockWo.assignee}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={14}/> Due: {mockWo.dueDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <select className="bg-secondary-bg border border-gray-700 text-white text-sm rounded px-3 py-1.5 outline-none focus:border-accent">
            <option value="open">Status: Open</option>
            <option value="in-progress">Status: In Progress</option>
            <option value="review">Status: Review</option>
            <option value="closed">Status: Closed</option>
          </select>
        </div>
      </div>

      <div className="flex-1">
        <Tabs defaultValue="details" className="w-full h-full flex flex-col">
          <TabsList className="mb-4 self-start">
            <TabsTrigger value="details">Execution Details</TabsTrigger>
            <TabsTrigger value="rca">Root Cause Analysis</TabsTrigger>
            <TabsTrigger value="parts">Required Parts</TabsTrigger>
            <TabsTrigger value="ai">AI Context</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <h3 className="text-sm font-bold text-white mb-2">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{mockWo.description}</p>
            </Card>
            
            <Card>
              <h3 className="text-sm font-bold text-white mb-4">Inspection Checklist</h3>
              <div className="space-y-2">
                {["Lockout/Tagout procedures verified", "Remove safety casing", "Extract bearing", "Insert replacement", "Restore power & test"].map((step, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-secondary-bg/50 rounded border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-accent focus:ring-accent bg-gray-900" />
                    <span className="text-sm text-gray-300">{step}</span>
                  </label>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rca">
            <RcaVisualizer data={mockRca} isLoading={rcaLoading} />
          </TabsContent>

          <TabsContent value="parts">
            <Card className="h-64 flex flex-col justify-center items-center text-gray-500">
              [Inventory Integration: Bill of Materials & Stock Check]
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Vibration Anomaly Detection</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-danger">
                    <AlertTriangle size={12} /> Anomaly Detected
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">Module 4 Digital Twin</span>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vibrationData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="vibrationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} domain={[0, 3]} unit=" mm/s" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "6px" }}
                      labelStyle={{ color: "#9ca3af" }}
                      itemStyle={{ color: "#f87171" }}
                    />
                    <Area type="monotone" dataKey="vibration" stroke="#ef4444" fill="url(#vibrationGradient)" strokeWidth={2} />
                    <ReferenceDot x="16:00" y={2.4} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                    <ReferenceDot x="23:59" y={2.4} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>AI detected anomalous vibration at 16:00 and 23:59, exceeding the 2.0 mm/s threshold. Pattern indicates progressive bearing degradation consistent with imminent failure.</span>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
