import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { LayoutDashboard, Save, Plus, Move } from "lucide-react";

export const DashboardBuilderPage = () => {
  const [layout, setLayout] = useState<any[]>([
    { id: "w1", title: "OEE Trend Widget", type: "line" },
    { id: "w2", title: "Factory Radar", type: "radar" },
  ]);

  const addWidget = () => {
    setLayout([...layout, { id: `w${Date.now()}`, title: "New Custom Widget", type: "bar" }]);
  };

  const removeWidget = (id: string) => {
    setLayout(layout.filter(w => w.id !== id));
  };

  // Mock data for the builder previews
  const mockData = [
    { name: "A", value: 400 },
    { name: "B", value: 300 },
    { name: "C", value: 200 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-accent" /> Custom Dashboard Builder
          </h1>
          <p className="text-sm text-gray-500 mt-1">Drag and drop components to build your own view.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addWidget} className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg border border-gray-700 text-gray-300 rounded hover:text-white transition-colors">
            <Plus size={14} /> Add Widget
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-accent text-white rounded hover:bg-accent/90 transition-colors">
            <Save size={14} /> Save Layout
          </button>
        </div>
      </div>

      <div className="flex-1 bg-primary-bg border border-gray-800 border-dashed rounded-lg p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {layout.map((widget) => (
            <div key={widget.id} className="relative group">
              <div className="absolute -top-3 -right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-gray-800 text-gray-400 rounded hover:text-white cursor-move">
                  <Move size={14} />
                </button>
                <button onClick={() => removeWidget(widget.id)} className="p-1.5 bg-danger text-white rounded hover:bg-danger/80">
                  <Plus size={14} className="rotate-45" />
                </button>
              </div>
              
              <AdvancedChart 
                title={widget.title} 
                type={widget.type} 
                data={mockData} 
                series={[{ key: "value", name: "Value", color: "#14F195" }]} 
              />
            </div>
          ))}
          
          {layout.length === 0 && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-500">
              <LayoutDashboard size={48} className="mb-4 opacity-50" />
              <p>Your dashboard is empty. Click "Add Widget" to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
