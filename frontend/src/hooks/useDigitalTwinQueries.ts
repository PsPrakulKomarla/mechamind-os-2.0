import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { digitalTwinService } from "@/services/digitalTwinService";
import { useEffect, useState } from "react";

export const useFactoryOverview = () => {
  return useQuery({
    queryKey: ["factoryOverview"],
    queryFn: digitalTwinService.getFactoryOverview,
    refetchInterval: 60000, // Poll every minute for high-level stats
  });
};

export const useMachineLayout = () => {
  return useQuery({
    queryKey: ["machineLayout"],
    queryFn: digitalTwinService.getMachineLayout,
  });
};

// Simulate a WebSocket stream updating the map coordinates and machine health
export const useLiveMachineMapStream = () => {
  const [machines, setMachines] = useState([
    { id: "M1", x: -2, y: 0, z: -2, status: "healthy", type: "milling" },
    { id: "M2", x: 2, y: 0, z: -2, status: "warning", type: "lathe" },
    { id: "M3", x: -2, y: 0, z: 2, status: "healthy", type: "conveyor" },
    { id: "M4", x: 2, y: 0, z: 2, status: "critical", type: "pump" },
  ]);

  useEffect(() => {
    // Simulate real-time status flipping
    const interval = setInterval(() => {
      setMachines((prev) => 
        prev.map(m => {
          if (m.id === "M2" && Math.random() > 0.8) {
            return { ...m, status: m.status === "warning" ? "healthy" : "warning" };
          }
          if (m.id === "M4" && Math.random() > 0.9) {
             return { ...m, status: m.status === "critical" ? "warning" : "critical" };
          }
          return m;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return machines;
};

export const useMachineStatus = (machineId: string) => {
  return useQuery({
    queryKey: ["machineStatus", machineId],
    queryFn: () => digitalTwinService.getMachineStatus(machineId),
    refetchInterval: 5000,
  });
};

export const useAlarms = (filters: any) => {
  return useQuery({
    queryKey: ["twinAlarms", filters],
    queryFn: () => digitalTwinService.getAlarms(filters),
    refetchInterval: 10000,
  });
};

export const useAcknowledgeAlarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alarmId: string) => digitalTwinService.acknowledgeAlarm(alarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["twinAlarms"] });
    }
  });
};
