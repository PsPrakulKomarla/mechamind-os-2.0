import React from "react";
import { Activity, Server, Database, Globe, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";

export const SystemMonitoringPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-accent" /> Infrastructure Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">Live observability for Kubernetes, Redis, and API Gateways</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Activity size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Infrastructure Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Deploy the backend services and connect monitoring to see infrastructure metrics.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Setup Data
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-info/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <Globe className="text-info" size={24} />
                  <div>
                    <h3 className="font-bold text-white">API Gateway</h3>
                    <p className="text-xs text-gray-500">Nginx Ingress</p>
                  </div>
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="space-y-4">
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Request Rate</span><span className="text-white font-mono">—</span></div></div>
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Error Rate (5xx)</span><span className="text-white font-mono">—</span></div></div>
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Avg Latency</span><span className="text-white font-mono">—</span></div></div>
              </div>
            </Card>

            <Card className="p-6 border-accent/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <Server className="text-accent" size={24} />
                  <div>
                    <h3 className="font-bold text-white">EKS Cluster</h3>
                    <p className="text-xs text-gray-500">mechamind-prod-1</p>
                  </div>
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="space-y-4">
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Node Count</span><span className="text-white font-mono">—</span></div></div>
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">CPU Allocation</span><span className="text-white font-mono">—</span></div></div>
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Pod Restarts (1h)</span><span className="text-white font-mono">—</span></div></div>
              </div>
            </Card>

            <Card className="p-6 border-warning/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <Database className="text-warning" size={24} />
                  <div>
                    <h3 className="font-bold text-white">PostgreSQL Primary</h3>
                    <p className="text-xs text-gray-500">Aurora Serverless</p>
                  </div>
                </div>
                <Badge variant="warning">Warning</Badge>
              </div>
              <div className="space-y-4">
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Active Connections</span><span className="text-white font-mono">—</span></div></div>
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Storage IOPS</span><span className="text-white font-mono">—</span></div></div>
              </div>
            </Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-secondary-bg/50">
              <h3 className="font-bold text-white text-sm">Microservices Health</h3>
            </div>
            <div className="p-8 text-center text-gray-500 text-sm">
              Service health metrics will appear when backend services are deployed.
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
