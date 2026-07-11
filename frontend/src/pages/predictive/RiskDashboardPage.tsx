import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";

export const RiskDashboardPage = () => {
  // Mock data: x = Probability (0-100), y = Impact/Severity (0-100), z = Asset Size (visual only)
  const riskData = [
    { id: "M4", name: "Main Pump", prob: 85, impact: 90, z: 200 },
    { id: "M2", name: "Beta Lathe", prob: 62, impact: 70, z: 150 },
    { id: "M1", name: "Alpha Spindle", prob: 12, impact: 85, z: 150 },
    { id: "C1", name: "Conveyor Belt", prob: 45, impact: 30, z: 100 },
    { id: "V1", name: "HVAC Unit", prob: 95, impact: 20, z: 80 },
  ];

  // Custom tooltip for scatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-secondary-bg border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-white mb-1">{data.name} ({data.id})</p>
          <p className="text-xs text-danger">Probability: {data.prob}%</p>
          <p className="text-xs text-warning">Severity: {data.impact}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-danger" /> Asset Risk Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise risk matrix plotting failure probability vs operational impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Risk Matrix</h3>
            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-danger/80"></div> Critical Risk</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-warning/80"></div> Moderate Risk</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-success/80"></div> Low Risk</span>
            </div>
          </div>
          <div className="flex-1 relative">
            {/* Background quadrant colors for visual mapping */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-5 pointer-events-none ml-[40px] mb-[30px]">
              <div className="bg-warning"></div>
              <div className="bg-danger"></div>
              <div className="bg-success"></div>
              <div className="bg-warning"></div>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="prob" name="Probability" domain={[0, 100]} stroke="#94a3b8" label={{ value: 'Probability of Failure (%)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 100]} stroke="#94a3b8" label={{ value: 'Operational Impact Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <ZAxis type="number" dataKey="z" range={[100, 500]} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Assets" 
                  data={riskData} 
                  fill="#ef4444"
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    const fill = payload.prob > 75 && payload.impact > 75 ? "#ef4444" : 
                                 payload.prob > 50 || payload.impact > 50 ? "#f59e0b" : "#14F195";
                    return <circle cx={cx} cy={cy} r={8} fill={fill} opacity={0.8} />;
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-0 overflow-hidden border-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="bg-danger/10 p-4 border-b border-danger/20 flex items-center gap-2">
              <AlertTriangle className="text-danger" size={18} />
              <h3 className="font-bold text-danger text-sm">Critical Risk Assets</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div>
                  <p className="font-bold text-white text-sm">Main Pump (M4)</p>
                  <p className="text-xs text-gray-500">Risk Score: 92/100</p>
                </div>
                <button className="text-xs bg-danger text-white px-3 py-1 rounded font-bold">Mitigate</button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-sm">HVAC Unit (V1)</p>
                  <p className="text-xs text-gray-500">Risk Score: 78/100</p>
                </div>
                <button className="text-xs bg-secondary-bg text-white border border-gray-700 hover:border-gray-500 px-3 py-1 rounded font-bold">Mitigate</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
