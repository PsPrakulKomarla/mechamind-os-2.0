import React from "react";
import { useParams, Link } from "react-router-dom";
import { RulChart } from "@/components/predictive/RulChart";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, ShieldAlert, FileText, Wrench } from "lucide-react";

export const FailurePredictionPage = () => {
  const { id } = useParams<{ id: string }>();

  // Mock RUL Data for Chart
  const rulData = Array.from({ length: 30 }).map((_, i) => {
    const day = `Day ${i}`;
    const actualHealth = i <= 15 ? 100 - (i * 1.5) - (Math.random() * 2) : null;
    const predictedHealth = i > 15 ? 100 - (15 * 1.5) - ((i - 15) * 2.5) : null;
    return {
      day,
      actualHealth,
      predictedHealth,
      confidenceHigh: predictedHealth ? predictedHealth + 5 : null,
      confidenceLow: predictedHealth ? predictedHealth - 5 : null,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <Link to="/predictive" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Asset {id || "M4"} Failure Analysis
          </h1>
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded font-bold text-sm hover:bg-accent/90 transition-colors">
          Generate Work Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-white">Remaining Useful Life (RUL) Curve</h3>
                <p className="text-xs text-gray-500 mt-1">Extrapolating degradation based on current vibration telemetry</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold uppercase">Est. Time to Failure</p>
                <p className="text-2xl font-black text-danger">12 Days</p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <RulChart data={rulData} failureThreshold={20} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-0 overflow-hidden border-danger/50 bg-danger/5">
            <div className="bg-danger/10 p-4 border-b border-danger/20 flex items-center gap-2">
              <ShieldAlert className="text-danger" size={18} />
              <h3 className="font-bold text-danger text-sm">Failure Prediction</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Likely Failure Mode</p>
                <p className="text-lg font-bold text-white">Bearing Seizure (Code 41)</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Confidence Score</p>
                <p className="text-lg font-mono text-warning">85.4%</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 uppercase font-bold mb-2">Key Risk Indicators</p>
                 <ul className="text-xs text-gray-300 space-y-2">
                   <li className="flex justify-between"><span className="text-gray-500">Vibration Trend</span> <span className="text-danger">+42% / week</span></li>
                   <li className="flex justify-between"><span className="text-gray-500">Thermal Trend</span> <span className="text-warning">+12% / week</span></li>
                 </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Wrench size={16} className="text-info"/> Suggested Spare Parts</h3>
             <ul className="space-y-3">
               <li className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                 <span className="text-gray-300">Ceramic Bearing Set (x2)</span>
                 <span className="text-success text-xs font-bold">In Stock (12)</span>
               </li>
               <li className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                 <span className="text-gray-300">Synthetic Lubricant 5L</span>
                 <span className="text-success text-xs font-bold">In Stock (4)</span>
               </li>
               <li className="flex justify-between items-center text-sm">
                 <span className="text-gray-300">Spindle Seal Ring</span>
                 <span className="text-danger text-xs font-bold">Backordered</span>
               </li>
             </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
