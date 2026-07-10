import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Camera, Radio } from "lucide-react";
import { useLiveVisionDetections } from "@/hooks/useIotQueries";

export const VisionCameraFeed = ({ cameraId, name }: { cameraId: string, name: string }) => {
  const boxes = useLiveVisionDetections(cameraId);

  const defects = boxes.filter(b => b.class === "Defect").length;

  return (
    <Card className="p-0 overflow-hidden relative group">
      {/* Feed Header */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-gray-300" />
          <span className="font-bold text-white text-sm drop-shadow-md">{name}</span>
        </div>
        <div className="flex gap-2">
          {defects > 0 && (
            <Badge variant="danger" className="animate-pulse shadow-lg">
              {defects} Anomaly Detected
            </Badge>
          )}
          <Badge variant="success" className="flex items-center gap-1 shadow-lg bg-black/50 border-success/50 text-success">
            <Radio size={10} className="animate-pulse" /> LIVE
          </Badge>
        </div>
      </div>

      {/* Video Feed Placeholder (Using a dark canvas for now) */}
      <div className="w-full aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center border-b border-gray-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <span className="text-gray-700 font-mono text-xl opacity-30">CAM_FEED_{cameraId}</span>
        
        {/* Render Bounding Boxes */}
        {boxes.map(box => (
          <div 
            key={box.id}
            className={`absolute border-2 transition-all duration-300 ease-linear ${box.class === "Defect" ? "border-danger bg-danger/10" : "border-accent bg-accent/10"}`}
            style={{ 
              left: `${box.x}%`, 
              top: `${box.y}%`, 
              width: `${box.w}%`, 
              height: `${box.h}%` 
            }}
          >
            <div className={`absolute -top-6 left-0 px-1 py-0.5 text-[10px] font-mono text-white whitespace-nowrap ${box.class === "Defect" ? "bg-danger" : "bg-accent"}`}>
              {box.class} [{(box.confidence * 100).toFixed(0)}%]
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Footer */}
      <div className="p-3 bg-secondary-bg flex justify-between items-center text-xs text-gray-400">
        <span className="font-mono">FPS: {(24 + Math.random() * 6).toFixed(1)}</span>
        <span>Objects: {boxes.length}</span>
        <span className="font-mono">Latency: {(40 + Math.random() * 20).toFixed(0)}ms</span>
      </div>
    </Card>
  );
};
