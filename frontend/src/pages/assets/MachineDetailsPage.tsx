import React from "react";
import { useMachineDetails, useDigitalTwin } from "@/hooks/useAssetQueries";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { DigitalTwinViewer } from "@/components/assets/DigitalTwinViewer";
import { Badge } from "@/components/ui/Badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Cpu, Thermometer, Gauge, Clock, Wrench } from "lucide-react";

const generateHealthData = () =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    vibration: Math.round((1.5 + Math.random() * 1.2) * 100) / 100,
    temperature: Math.round(70 + Math.random() * 20),
  }));

const mockTimeline = [
  { date: "2024-02-15", type: "PM", title: "Lubrication & Filter Change", status: "completed" },
  { date: "2024-02-01", type: "CM", title: "Bearing Inspection", status: "completed" },
  { date: "2024-01-15", type: "PM", title: "Quarterly Overhaul", status: "completed" },
  { date: "2024-01-02", type: "CM", title: "Motor Alignment Correction", status: "completed" },
];

export const MachineDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: machine, isLoading: machineLoading } = useMachineDetails(id || "");
  const { data: twinData, isLoading: twinLoading } = useDigitalTwin(id || "");
  const healthData = React.useMemo(() => generateHealthData(), []);

  if (machineLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-card-bg rounded" />
        <div className="h-64 bg-card-bg rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Profile */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">{machine?.name || `Machine ${id}`}</h1>
          <div className="flex gap-2">
            <Badge variant="secondary">SN: {machine?.serial_number || "UNK-001"}</Badge>
            <Badge variant="info">{machine?.category || "Industrial Equipment"}</Badge>
            <Badge variant={machine?.status === "running" ? "success" : "warning"}>{machine?.status || "running"}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Health Score</div>
          <div className="text-3xl font-bold text-success">{machine?.health_score || 98}%</div>
        </div>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health & Sensors</TabsTrigger>
          <TabsTrigger value="twin">Digital Twin</TabsTrigger>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Cpu size={16} className="text-accent" /> Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Manufacturer:</span> <span className="text-white">{machine?.manufacturer || "Siemens"}</span></div>
                <div><span className="text-gray-500">Model:</span> <span className="text-white">{machine?.model || "S7-1500"}</span></div>
                <div><span className="text-gray-500">Install Date:</span> <span className="text-white">{machine?.install_date || "2024-01-15"}</span></div>
                <div><span className="text-gray-500">Location:</span> <span className="text-white">{machine?.location || "Factory A - Line 1"}</span></div>
                <div><span className="text-gray-500">Rated Power:</span> <span className="text-white">{machine?.power || "15 kW"}</span></div>
                <div><span className="text-gray-500">Current Shift:</span> <span className="text-white">Morning (06:00-14:00)</span></div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Gauge size={16} className="text-info" /> Live Sensor Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Vibration", value: "2.4 mm/s", status: "normal", icon: Gauge },
                  { label: "Temperature", value: "85°C", status: "warning", icon: Thermometer },
                  { label: "RPM", value: "1,450", status: "normal", icon: Cpu },
                  { label: "Load", value: "78%", status: "normal", icon: Gauge },
                ].map((sensor) => (
                  <div key={sensor.label} className="bg-primary-bg border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <sensor.icon size={14} className="text-gray-500" />
                      <Badge variant={sensor.status === "normal" ? "success" : "warning"} className="text-[9px] py-0">
                        {sensor.status}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-white">{sensor.value}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{sensor.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="twin">
          <DigitalTwinViewer
            machineId={id!}
            sensors={twinData?.sensors || [
              { id: "s1", metric: "Vibration", value: "2.4 mm/s", x: 30, y: 40, status: "normal" },
              { id: "s2", metric: "Temperature", value: "85°C", x: 70, y: 60, status: "warning" }
            ]}
            isLoading={twinLoading}
          />
        </TabsContent>

        <TabsContent value="health">
          <Card className="h-80 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4">Vibration Trend (24h)</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#F3F4F6" }}
                  />
                  <Line type="monotone" dataKey="vibration" stroke="#3B82F6" strokeWidth={2} dot={false} name="Vibration (mm/s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gray-500" /> Maintenance Timeline
            </h3>
            <div className="space-y-4">
              {mockTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  {i < mockTimeline.length - 1 && (
                    <div className="absolute left-[11px] top-7 w-px h-full bg-gray-800" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench size={10} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.title}</span>
                      <Badge variant={item.type === "PM" ? "info" : "warning"} className="text-[9px] py-0">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
