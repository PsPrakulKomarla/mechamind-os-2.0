import React from "react";
import { HierarchyTree } from "@/components/assets/HierarchyTree";
import { useAssetHierarchy } from "@/hooks/useAssetQueries";

export const HierarchyPage = () => {
  const { data, isLoading } = useAssetHierarchy();

  // Mock data for foundation visualization if backend is empty
  const mockNodes = [
    { id: "org-1", type: "organization", label: "MechaCorp Global" },
    { id: "fact-1", type: "factory", label: "Berlin Gigafactory", parentId: "org-1" },
    { id: "fact-2", type: "factory", label: "Austin Plant", parentId: "org-1" },
    { id: "bld-1", type: "building", label: "Assembly Hall A", parentId: "fact-1" },
    { id: "mach-1", type: "machine", label: "Robotic Arm X1", parentId: "bld-1" },
    { id: "mach-2", type: "machine", label: "Stamping Press", parentId: "bld-1" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Asset Hierarchy</h1>
      </div>
      
      <div className="flex-1">
        <HierarchyTree nodes={data?.nodes || mockNodes} isLoading={isLoading} />
      </div>
    </div>
  );
};
