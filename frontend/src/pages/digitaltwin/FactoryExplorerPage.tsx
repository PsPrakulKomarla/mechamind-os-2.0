import React, { useState } from "react";
import { InteractiveFactoryMap3D } from "@/components/digitaltwin/InteractiveFactoryMap3D";
import { FolderTree, Map, Building2, ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";

export const FactoryExplorerPage = () => {
  const [activeNode, setActiveNode] = useState<string>("Factory Alpha");

  const hierarchy = [
    { id: "building-1", type: "building", name: "Main Assembly Plant" },
    { id: "line-a", type: "line", name: "Production Line A", parent: "building-1" },
    { id: "m-1", type: "machine", name: "Alpha Spindle (M1)", parent: "line-a", status: "healthy" },
    { id: "m-2", type: "machine", name: "Beta Lathe (M2)", parent: "line-a", status: "warning" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderTree className="text-info" /> Factory Explorer
          </h1>
          <p className="text-sm text-gray-500 mt-1">Navigate the spatial hierarchy of your enterprise</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-secondary-bg px-4 py-2 rounded-lg border border-gray-800">
          <Building2 size={14} /> Global <ChevronRight size={14} /> Factory Alpha <ChevronRight size={14} /> <span className="text-white font-bold">{activeNode}</span>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Navigation Tree */}
        <div className="w-1/4 border border-gray-800 bg-secondary-bg/20 rounded-lg flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-secondary-bg/50">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="text" placeholder="Search assets..." className="w-full bg-primary-bg border border-gray-700 rounded pl-8 pr-2 py-1.5 text-sm text-white outline-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li className="text-white font-bold text-sm cursor-pointer hover:text-info flex items-center gap-2" onClick={() => setActiveNode("Main Assembly Plant")}>
                <Building2 size={14} className="text-info" /> Main Assembly Plant
              </li>
              <ul className="pl-6 mt-2 space-y-2 border-l border-gray-800 ml-2">
                <li className="text-gray-300 font-medium text-sm cursor-pointer hover:text-info flex items-center gap-2" onClick={() => setActiveNode("Production Line A")}>
                  <FolderTree size={14} className="text-accent" /> Production Line A
                </li>
                <ul className="pl-6 mt-2 space-y-2 border-l border-gray-800 ml-2">
                  <li className="text-gray-400 text-sm cursor-pointer hover:text-white flex items-center gap-2">
                     Alpha Spindle (M1) <span className="w-2 h-2 rounded-full bg-success inline-block"></span>
                  </li>
                  <li className="text-gray-400 text-sm cursor-pointer hover:text-white flex items-center gap-2">
                     Beta Lathe (M2) <span className="w-2 h-2 rounded-full bg-warning inline-block"></span>
                  </li>
                </ul>
              </ul>
            </ul>
          </div>
        </div>

        {/* Spatial Map */}
        <Card className="w-3/4 p-0 overflow-hidden relative border border-gray-800 bg-[#050505]">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Badge variant="secondary" className="bg-primary-bg/80 backdrop-blur border-gray-700">Level 1 Blueprint</Badge>
            <Badge variant="secondary" className="bg-primary-bg/80 backdrop-blur border-gray-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span> Live Sync
            </Badge>
          </div>
          <InteractiveFactoryMap3D />
        </Card>
      </div>
    </div>
  );
};
