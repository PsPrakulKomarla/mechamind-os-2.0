import { api } from "@/lib/api";

export const iotService = {
  async getNetworkHealth() {
    const res = await api.get("/iot/network-health");
    return res.data.data;
  },

  async getSensorData(sensorId: string, timeRange: string = "1h") {
    const res = await api.get(`/iot/sensors/${sensorId}?range=${timeRange}`);
    return res.data.data;
  },

  async getCameraList() {
    const res = await api.get("/iot/vision/cameras");
    return res.data.data;
  },

  async getAlarmFeed() {
    const res = await api.get("/iot/alarms/live");
    return res.data.data;
  },

  // Fallback REST endpoint for vision anomalies if WebSockets drop
  async getVisionAnomalies(cameraId: string) {
    const res = await api.get(`/iot/vision/cameras/${cameraId}/anomalies`);
    return res.data.data;
  }
};
