import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { iotService } from "@/services/iotService";

// Standard REST Queries
export const useNetworkHealth = () => {
  return useQuery({
    queryKey: ["iotNetworkHealth"],
    queryFn: iotService.getNetworkHealth,
    refetchInterval: 10000, // Refresh every 10s
  });
};

export const useAlarmFeed = () => {
  return useQuery({
    queryKey: ["iotAlarms"],
    queryFn: iotService.getAlarmFeed,
    refetchInterval: 5000, // Refresh every 5s for near real-time
  });
};

// ---------------------------------------------------------
// WebSocket Mocks (Since we don't have a live socket server)
// ---------------------------------------------------------

/**
 * Mocks a live timeseries data stream for a specific sensor.
 * Generates a new data point every second.
 */
export const useLiveSensorStream = (sensorId: string, baseValue: number, volatility: number) => {
  const [data, setData] = useState<{ time: string, value: number }[]>([]);

  useEffect(() => {
    // Seed initial data
    const initial = Array.from({ length: 20 }).map((_, i) => ({
      time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString([], { hour12: false }),
      value: baseValue + (Math.random() * volatility - volatility / 2)
    }));
    setData(initial);

    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        const newValue = baseValue + (Math.random() * volatility - volatility / 2);
        next.push({
          time: new Date().toLocaleTimeString([], { hour12: false }),
          value: Number(newValue.toFixed(2))
        });
        return next;
      });
    }, 1000); // 1-second ticks

    return () => clearInterval(interval);
  }, [sensorId, baseValue, volatility]);

  return data;
};

/**
 * Mocks live object detection bounding boxes for Vision AI cameras
 */
export const useLiveVisionDetections = (cameraId: string) => {
  const [boxes, setBoxes] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate bounding box jitter and random object appearance
      const numObjects = Math.floor(Math.random() * 3) + 1; // 1 to 3 objects
      const newBoxes = Array.from({ length: numObjects }).map((_, i) => ({
        id: `${cameraId}-obj-${i}`,
        class: Math.random() > 0.8 ? "Defect" : "Component",
        confidence: 0.75 + Math.random() * 0.2, // 75-95%
        x: 20 + Math.random() * 60, // percentages
        y: 20 + Math.random() * 60,
        w: 10 + Math.random() * 20,
        h: 10 + Math.random() * 20,
      }));
      setBoxes(newBoxes);
    }, 500); // 500ms updates (2 FPS)

    return () => clearInterval(interval);
  }, [cameraId]);

  return boxes;
};
