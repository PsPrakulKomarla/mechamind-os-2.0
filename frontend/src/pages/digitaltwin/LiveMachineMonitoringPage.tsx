import React from "react";
import { useParams, Link } from "react-router-dom";
import { useMachineStatus } from "@/hooks/useDigitalTwinQueries";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { Card } from "@/components/ui/Card";
import { Activity, AlertTriangle, Cpu, Zap, ArrowLeft, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const LiveMachineMonitoringPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: status, isLoading } = useMachineStatus(id || "M1");

  // Mock real-time data for the chart
  const vibrationData = Array.from({ length: 20 }).map((_, i) => ({
    time: `10:${i < 10 ? '0'+i : i}`,
    vibration: Math.random() * 2 + (i > 15 ? 4 : 1), // spike at the end
  }));

  const temperatureData = Array.from({ length: 20 }).map((_, i) => ({
    time: `10:${i < 10 ? '0'+i : i}`,
    temp: 60 + Math.random() * 10 + (i * 0.5), // gradual increase
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <Link to="/digital-twin" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="text-accent" /> {id || "M1"} Live Telemetry
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <Badge variant="success" className="animate-pulse flex items-center gap-1 px-3 py-1">
             <div className="w-2 h-2 bg-success rounded-full"></div> LIVE STREAM
           </Badge>
           <button className="bg-danger text-white px-4 py-2 rounded font-bold text-sm hover:bg-danger/90 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
             EMERGENCY STOP
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-info">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Operating Mode</p>
          <p className="text-xl font-bold text-white">Production</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-success">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Health Score</p>
          <div className="flex items-end gap-1"><p className="text-xl font-bold text-success font-mono">92</p><span className="text-xs text-gray-500 mb-1">/100</span></div>
        </Card>
        <Card className="p-4 border-l-4 border-l-warning">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Vibration (RMS)</p>
          <p className="text-xl font-bold text-warning font-mono">5.2 mm/s</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-accent">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Core Temp</p>
          <p className="text-xl font-bold text-white font-mono">75.4 °C</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 h-[300px]">
             <h3 className="font-bold text-white mb-4">Vibration Analysis (Last 20 Mins)</h3>
             <AdvancedChart type="line" data={vibrationData} xAxisKey="time" series={[{ dataKey: "vibration", name: "Vibration (mm/s)", color: "#f59e0b" }]} />
          </Card>
          
          <Card className="p-6 h-[300px]">
             <h3 className="font-bold text-white mb-4">Thermal Profile (Last 20 Mins)</h3>
             <AdvancedChart type="area" data={temperatureData} xAxisKey="time" series={[{ dataKey: "temp", name: "Temperature (°C)", color: "#3b82f6" }]} />
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-0 overflow-hidden border-warning/50">
             <div className="bg-warning/10 p-4 border-b border-warning/20 flex items-center gap-2">
               <AlertTriangle className="text-warning" size={18} />
               <h3 className="font-bold text-warning text-sm">Active Alarms</h3>
             </div>
             <div className="p-4">
               <p className="text-sm text-gray-300 font-medium">Vibration Threshold Exceeded</p>
               <p className="text-xs text-gray-500 mt-1">Detected anomaly at 10:16 on Sensor V-01.</p>
               <button className="mt-4 w-full py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 rounded text-xs font-bold text-white transition-colors">
                 Acknowledge Alarm
               </button>
             </div>
           </Card>

           <Card className="p-0 overflow-hidden border-accent/50 shadow-[0_0_30px_rgba(20,241,149,0.05)]">
             <div className="bg-accent/10 p-4 border-b border-accent/20 flex items-center gap-2">
               <Lightbulb className="text-accent" size={18} />
               <h3 className="font-bold text-accent text-sm">AI Copilot Insights</h3>
             </div>
             <div className="p-4 space-y-3">
               <p className="text-sm text-gray-300">Based on the current vibration signature and rising thermal profile, the AI Engine predicts a <strong>85% probability of a spindle bearing failure</strong> within the next 48 hours.</p>
               <div className="p-3 bg-secondary-bg rounded-lg border border-gray-800">
                 <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Recommended Actions</p>
                 <ul className="text-xs text-gray-300 space-y-1 ml-4 list-disc marker:text-accent">
                   <li>Reduce spindle RPM by 20% immediately.</li>
                   <li>Dispatch technician for manual lubrication.</li>
                   <li>Schedule WO for bearing replacement.</li>
                 </ul>
               </div>
               <button className="w-full py-2 bg-accent hover:bg-accent/90 text-primary-bg font-bold rounded text-xs transition-colors">
                 Generate Work Order
               </button>
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
