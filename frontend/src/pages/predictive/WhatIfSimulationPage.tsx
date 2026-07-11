import React, { useState } from "react";
import { Activity, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { Badge } from "@/components/ui/Badge";

export const WhatIfSimulationPage = () => {
  const [delayDays, setDelayDays] = useState(0);

  // Mathematical simulation for frontend prototype
  // As delay increases, probability of failure shoots up exponentially
  const baseProbability = 15; // %
  const currentProbability = Math.min(99, baseProbability + Math.pow(delayDays, 1.8));
  
  // Cost increases slowly then spikes if failure occurs
  const baseCost = 2500;
  const estimatedCost = baseCost + (delayDays * 150) + (currentProbability > 80 ? 15000 : 0);

  // Downtime increases similarly
  const baseDowntime = 4; // hours
  const estimatedDowntime = baseDowntime + (delayDays * 0.5) + (currentProbability > 80 ? 48 : 0);

  // Generate chart data dynamically based on slider
  const chartData = Array.from({ length: 30 }).map((_, i) => ({
    day: `Day ${i}`,
    risk: Math.min(99, baseProbability + Math.pow(i, 1.8)),
    cost: baseCost + (i * 150) + (Math.min(99, baseProbability + Math.pow(i, 1.8)) > 80 ? 15000 : 0)
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-accent" /> What-If Scenario Simulator
          </h1>
          <p className="text-sm text-gray-500 mt-1">Simulate the financial and operational impact of delaying maintenance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1 p-6 flex flex-col">
          <h3 className="font-bold text-white mb-6 border-b border-gray-800 pb-2">Simulation Parameters</h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Target Asset</label>
              <select className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none">
                <option value="M4">M4 - Main Pump</option>
                <option value="M2">M2 - Beta Lathe</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-gray-400">Delay Maintenance By</label>
                <span className="text-lg font-black text-accent">{delayDays} Days</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={delayDays} 
                onChange={(e) => setDelayDays(parseInt(e.target.value))} 
                className="w-full accent-accent" 
              />
              <p className="text-xs text-gray-500 mt-2">Slide to see the projected impact on risk and costs if the scheduled repair is postponed.</p>
            </div>
            
            <div className="mt-8 p-4 bg-primary-bg border border-gray-800 rounded-lg">
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Baseline Constraints</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex justify-between"><span>Current Parts Cost:</span> <span>$1,200</span></li>
                <li className="flex justify-between"><span>Emergency Labor Multiplier:</span> <span>1.5x</span></li>
                <li className="flex justify-between"><span>Downtime Cost/Hr:</span> <span className="text-danger">$3,500</span></li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`p-5 border-l-4 transition-colors ${currentProbability > 80 ? 'border-l-danger bg-danger/5' : currentProbability > 50 ? 'border-l-warning bg-warning/5' : 'border-l-success'}`}>
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Failure Probability</p>
              <p className={`text-3xl font-black font-mono ${currentProbability > 80 ? 'text-danger' : currentProbability > 50 ? 'text-warning' : 'text-success'}`}>
                {currentProbability.toFixed(1)}%
              </p>
              {currentProbability > 80 && <p className="text-xs text-danger mt-1 font-bold">Critical Risk Zone</p>}
            </Card>

            <Card className="p-5 border-l-4 border-l-info">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Est. Repair Cost</p>
              <p className="text-3xl font-black text-white font-mono">
                ${estimatedCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">+{((estimatedCost - baseCost) / baseCost * 100).toFixed(0)}% increase</p>
            </Card>

            <Card className="p-5 border-l-4 border-l-accent">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Est. Downtime</p>
              <p className="text-3xl font-black text-white font-mono">
                {estimatedDowntime.toFixed(1)} hrs
              </p>
            </Card>
          </div>

          <Card className="p-6 h-[400px]">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-white">30-Day Projection (Risk vs Cost)</h3>
               <Badge variant="default" className="bg-secondary-bg border-gray-700 text-gray-300">Exponential Degradation Model</Badge>
             </div>
             {/* Note: In a real app we might use a ComposedChart to overlay Risk(%) and Cost($) on dual Y axes. Using basic line here for visual. */}
             <AdvancedChart 
               type="line" 
               data={chartData} 
               xAxisKey="day" 
               series={[
                 { dataKey: "risk", name: "Risk (%)", color: "#ef4444" },
               ]} 
             />
          </Card>
        </div>
      </div>
    </div>
  );
};
