import React from "react";
import { InteractiveFactoryMap3D } from "@/components/digitaltwin/InteractiveFactoryMap3D";
import { useAlarms } from "@/hooks/useDigitalTwinQueries";
import { ShieldAlert, Activity, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const ControlRoomPage = () => {
  const { data: alarms } = useAlarms({ status: "active" });

  const mockAlarms: Array<{ id: string; severity: "critical" | "warning" | "info"; message: string; time: string }> = alarms || [
    { id: "AL-101", severity: "critical", message: "Main Pump M4 - Overheating", time: "10:42 AM" },
    { id: "AL-102", severity: "warning", message: "Conveyor M3 - High Load", time: "10:35 AM" },
    { id: "AL-103", severity: "info", message: "Spindle M1 - Maintenance required soon", time: "09:15 AM" },
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white flex flex-col p-2 gap-2 fixed inset-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-danger animate-pulse" />
          <h1 className="text-xl font-black tracking-widest uppercase">Global Control Center</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">System Status</span>
            <span className="text-sm font-bold text-success font-mono">NOMINAL</span>
          </div>
          <div className="flex flex-col items-end border-l border-gray-700 pl-4">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Active Alarms</span>
            <span className="text-sm font-bold text-danger font-mono">3</span>
          </div>
          <button onClick={() => window.history.back()} className="ml-4 px-4 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold transition-colors">EXIT</button>
        </div>
      </div>

      <div className="flex gap-2 flex-1 overflow-hidden">
        {/* Left Panel - Alarms */}
        <div className="w-1/4 bg-[#0f172a] border border-gray-800 rounded-lg flex flex-col overflow-hidden">
          <div className="bg-[#1e293b] p-3 border-b border-gray-800">
            <h2 className="text-sm font-bold flex items-center gap-2"><Activity size={16}/> Active Alarms Feed</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {mockAlarms.map((a, i) => (
              <div key={i} className={`p-3 rounded border ${
                a.severity === "critical" ? "bg-danger/10 border-danger/50" :
                a.severity === "warning" ? "bg-warning/10 border-warning/50" : "bg-info/10 border-info/50"
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <Badge variant={a.severity as any} className="text-[10px] uppercase">{a.severity}</Badge>
                  <span className="text-[10px] text-gray-400 font-mono">{a.time}</span>
                </div>
                <p className="text-xs font-medium text-gray-200">{a.message}</p>
                {a.severity === "critical" && (
                   <button className="mt-2 w-full py-1 bg-danger hover:bg-danger/80 text-white rounded text-[10px] font-bold">
                     ACKNOWLEDGE
                   </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Main 3D Twin */}
        <div className="w-1/2 bg-[#000] border border-gray-800 rounded-lg relative overflow-hidden">
           <div className="absolute top-4 left-4 z-10">
             <Badge variant="default" className="bg-primary-bg/80 backdrop-blur border-gray-700">Production Line A - Live</Badge>
           </div>
           <InteractiveFactoryMap3D />
        </div>

        {/* Right Panel - Machine Diagnostics */}
        <div className="w-1/4 flex flex-col gap-2">
          <div className="flex-1 bg-[#0f172a] border border-gray-800 rounded-lg p-4">
             <h2 className="text-sm font-bold flex items-center gap-2 mb-4"><Cpu size={16}/> Diagnostics: Main Pump M4</h2>
             
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Vibration (RMS)</span>
                   <span className="text-danger font-bold font-mono">5.2 mm/s</span>
                 </div>
                 <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                   <div className="h-full bg-danger w-[85%] animate-pulse"></div>
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Core Temp</span>
                   <span className="text-warning font-bold font-mono">75.4 °C</span>
                 </div>
                 <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                   <div className="h-full bg-warning w-[60%]"></div>
                 </div>
               </div>

               <div className="mt-6 p-3 border border-danger/30 bg-danger/5 rounded-lg">
                 <p className="text-[10px] text-danger font-bold uppercase mb-1">AI Recommendation</p>
                 <p className="text-xs text-gray-300">Shut down Main Pump M4 immediately to prevent catastrophic bearing failure.</p>
               </div>
             </div>
          </div>
          
          <div className="h-1/3 bg-[#0f172a] border border-gray-800 rounded-lg p-4 flex flex-col justify-center items-center">
            <button className="w-3/4 py-4 rounded-full bg-danger hover:bg-danger/90 text-white font-black tracking-widest text-lg shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105 active:scale-95 border-2 border-danger/50">
              EMERGENCY STOP (M4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
