import React from "react";
import { VisionCameraFeed } from "@/components/iot/VisionCameraFeed";
import { Camera } from "lucide-react";

export const VisionDashboardPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Camera className="text-accent" /> Vision AI Grid
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time object detection and anomaly highlighting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <VisionCameraFeed cameraId="cam-101" name="Assembly Line Alpha" />
        <VisionCameraFeed cameraId="cam-102" name="Assembly Line Beta" />
        <VisionCameraFeed cameraId="cam-201" name="Quality Check Station" />
        <VisionCameraFeed cameraId="cam-301" name="Warehouse Loading Bay" />
        <VisionCameraFeed cameraId="cam-sec-1" name="Perimeter North" />
        <VisionCameraFeed cameraId="cam-sec-2" name="Perimeter South" />
      </div>
    </div>
  );
};
