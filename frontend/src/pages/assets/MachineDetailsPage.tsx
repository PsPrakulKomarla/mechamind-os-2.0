import React from "react";
import { useMachineDetails, useDigitalTwin } from "@/hooks/useAssetQueries";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { DigitalTwinViewer } from "@/components/assets/DigitalTwinViewer";
import { Badge } from "@/components/ui/Badge";

export const MachineDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: machine, isLoading: machineLoading } = useMachineDetails(id || "");
  const { data: twinData, isLoading: twinLoading } = useDigitalTwin(id || "");

  if (machineLoading) {
    return <div className="p-8 text-gray-500">Loading Machine Details...</div>;
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
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Manufacturer:</span> <span className="text-white">Siemens</span></div>
              <div><span className="text-gray-500">Installation Date:</span> <span className="text-white">2024-01-15</span></div>
              <div><span className="text-gray-500">Current Shift:</span> <span className="text-white">Morning</span></div>
              <div><span className="text-gray-500">Location:</span> <span className="text-white">Factory A - Line 1</span></div>
            </div>
          </Card>
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
          <Card>
             <div className="h-64 flex items-center justify-center text-gray-500">
                [Health Analytics Charts Component]
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
             <div className="h-64 flex items-center justify-center text-gray-500">
                [Maintenance Work Order Timeline]
             </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
