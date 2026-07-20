import { api } from "@/lib/api";

const MOCK_MACHINES = [
  {
    id: "m-1",
    serial_number: "SN-2023-A101",
    name: "Stamping Press M-201",
    category: "Heavy Machinery",
    manufacturer: "Siemens",
    health_score: 82,
    status: "running",
    location: "Zone A - Assembly Line 1",
    last_maintenance: "2023-11-12",
  },
  {
    id: "m-2",
    serial_number: "SN-2021-B202",
    name: "CNC Mill M-105",
    category: "Machining",
    manufacturer: "Haas",
    health_score: 95,
    status: "running",
    location: "Zone B - Machining",
    last_maintenance: "2024-01-05",
  },
  {
    id: "m-3",
    serial_number: "SN-2019-C303",
    name: "Conveyor Belt C-12",
    category: "Logistics",
    manufacturer: "Bosch",
    health_score: 45,
    status: "maintenance",
    location: "Zone C - Packaging",
    last_maintenance: "2023-09-20",
  },
  {
    id: "m-4",
    serial_number: "SN-2022-D404",
    name: "Industrial Robot R-03",
    category: "Robotics",
    manufacturer: "FANUC",
    health_score: 72,
    status: "running",
    location: "Zone A - Assembly Line 2",
    last_maintenance: "2023-12-01",
  },
  {
    id: "m-5",
    serial_number: "SN-2020-E505",
    name: "Hydraulic Press H-02",
    category: "Heavy Machinery",
    manufacturer: "Komatsu",
    health_score: 28,
    status: "stopped",
    location: "Zone D - Forming",
    last_maintenance: "2023-06-15",
  },
];

export const assetService = {
  async getHierarchy(organizationId?: string, factoryId?: string) {
    try {
      const params = new URLSearchParams();
      if (organizationId) params.append("organization_id", organizationId);
      if (factoryId) params.append("factory_id", factoryId);
      
      const res = await api.get(`/assets/hierarchy?${params.toString()}`);
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getMachines(filters: any = {}) {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/assets/machines?${params.toString()}`);
      // Fallback to mock data if the DB is completely empty (for prototype showcase)
      if (!res.data.data || res.data.data.length === 0) {
        return MOCK_MACHINES;
      }
      return res.data.data;
    } catch {
      return MOCK_MACHINES;
    }
  },

  async getMachineDetails(machineId: string) {
    try {
      const res = await api.get(`/assets/machines/${machineId}`);
      return res.data.data;
    } catch {
      return MOCK_MACHINES.find(m => m.id === machineId) || MOCK_MACHINES[0];
    }
  },

  async getDigitalTwin(machineId: string) {
    try {
      const res = await api.get(`/digital-twin/machines/${machineId}`);
      return res.data.data;
    } catch {
      return null;
    }
  },
  
  async getMachineHealth(machineId: string) {
    try {
      const res = await api.get(`/assets/machines/${machineId}/health`);
      return res.data.data;
    } catch {
      return { score: 85, trend: 2.5, status: 'good' };
    }
  }
};
