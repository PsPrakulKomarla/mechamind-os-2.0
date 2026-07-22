import React from "react";
import { useParams } from "react-router-dom";
import { useWorkOrderDetails, useRcaDetails } from "@/hooks/useMaintenanceQueries";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RcaVisualizer } from "@/components/maintenance/RcaVisualizer";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { Wrench, Clock, User, FileText, CheckCircle, AlertTriangle } from "lucide-react";

const mockVibrationData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  vibration: +(0.5 + Math.random() * 2).toFixed(2),
}));
mockVibrationData[14] = { time: "14:00", vibration: 2.8 };
mockVibrationData[15] = { time: "15:00", vibration: 2.6 };
mockVibrationData[16] = { time: "16:00", vibration: 1.9 };

const mockRca = {
  problem: "Stamping Press M-201 primary bearing failed catastrophically during production run #8421",
  whys: [
    { level: 1, question: "Why did the bearing fail?", answer: "Bearing cage fractured and rollers seized due to overheating." },
    { level: 2, question: "Why did the bearing overheat?", answer: "Lubrication starvation — grease fitting was clogged." },
    { level: 3, question: "Why was the grease fitting clogged?", answer: "Contaminated grease from bulk container — no filtration in dispensing system." },
    { level: 4, question: "Why was unfiltered grease used?", answer: "Maintenance procedure does not specify filtration step for bulk grease refills." },
    { level: 5, question: "Why was the procedure never updated?", answer: "No formal review cycle for lubrication schedules; last updated 2019." },
  ],
  recommendation: "Install inline grease filter on bulk dispensing system. Update lubrication PM procedure to include filtration step. Schedule quarterly lubrication procedure review."
};

const mockWorkOrder = {
  id: "WO-2026-001",
  title: "Replace primary spindle bearing",
  description: "During routine vibration monitoring, Stamping Press M-201 showed elevated acceleration levels (2.8 mm/s²) on the Drive End bearing. Inspection revealed excessive play and discoloration on the outer race. The bearing must be replaced and the lubrication system inspected for contaminants before returning to service.",
  machine: "Stamping Press M-201",
  priority: "Critical",
  status: "open",
  assignee: "J. Smith",
  dueDate: "2026-07-25",
  hasAnomaly: true,
  anomalyNote: "Bearing acceleration spike at 14:00 — 2.8 mm/s² (threshold: 1.5 mm/s²). Immediate inspection recommended.",
  spareParts: [
    { name: "SKF 6319 Deep Groove Ball Bearing", inStock: true, quantity: 2 },
    { name: "High-temp lithium grease (1 kg)", inStock: true, quantity: 1 },
    { name: "Bearing puller set (rental)", inStock: false, quantity: 1 },
    { name: "Shaft seal (45x62x8 mm)", inStock: true, quantity: 1 },
  ],
  vibrationData: mockVibrationData,
};

export const WorkOrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: woData, isLoading: woLoading } = useWorkOrderDetails(id || "");
  const { data: rcaData, isLoading: rcaLoading } = useRcaDetails(id || "");

  const wo = woData || mockWorkOrder;
  const rca = rcaData || mockRca;

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
              <h1 className="text-2xl font-bold text-white tracking-tight">{wo.title}</h1>
              <Badge variant="danger" className="uppercase text-[10px] py-0">{wo.priority}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span className="font-mono text-gray-300">{wo.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-accent"><Wrench size={14}/> {wo.machine}</span>
              {wo.assignee && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><User size={14}/> {wo.assignee}</span>
                </>
              )}
              {wo.dueDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> Due: {wo.dueDate}</span>
                </>
              )}
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
              <p className="text-sm text-gray-300 leading-relaxed">{wo.description || "No description available."}</p>
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
            <RcaVisualizer data={rca || { problem: "", whys: [], recommendation: "" }} isLoading={rcaLoading} />
          </TabsContent>

          <TabsContent value="parts">
            <Card className="h-64 flex flex-col justify-center items-center text-gray-500">
              {wo.spareParts ? (
                <div className="w-full p-4">
                  <h3 className="text-sm font-bold text-white mb-4">Required Spare Parts</h3>
                  <div className="space-y-2">
                    {wo.spareParts.map((part: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary-bg/50 rounded border border-gray-800">
                        <span className="text-sm text-gray-300">{part.name}</span>
                        <span className={`text-xs font-bold ${part.inStock ? 'text-success' : 'text-danger'}`}>
                          {part.inStock ? `In Stock (${part.quantity})` : 'Backordered'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm">No spare parts data available</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            {wo.vibrationData ? (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Vibration Anomaly Detection</h3>
                  <div className="flex items-center gap-2 text-xs">
                    {wo.hasAnomaly ? (
                      <span className="flex items-center gap-1 text-danger">
                        <AlertTriangle size={12} /> Anomaly Detected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-success">
                        <CheckCircle size={12} /> Normal
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wo.vibrationData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {wo.anomalyNote && (
                  <div className="mt-3 p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>{wo.anomalyNote}</span>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-64 flex flex-col justify-center items-center text-gray-500">
                <p className="text-sm">No vibration data available for this work order</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
