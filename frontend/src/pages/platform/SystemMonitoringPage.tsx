import React from "react";
import { Activity, Server, Database, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const SystemMonitoringPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-accent" /> Infrastructure Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">Live observability for Kubernetes, Redis, and API Gateways</p>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <Badge variant="success">us-east-1</Badge>
          <Badge variant="success">eu-central-1</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Gateway */}
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
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Request Rate</span>
                 <span className="text-white font-mono">4,200 req/s</span>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Error Rate (5xx)</span>
                 <span className="text-white font-mono">0.02%</span>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Avg Latency</span>
                 <span className="text-white font-mono">42ms</span>
               </div>
             </div>
          </div>
        </Card>

        {/* Kubernetes Cluster */}
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
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Node Count</span>
                 <span className="text-white font-mono">24 / 24 Ready</span>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">CPU Allocation</span>
                 <span className="text-warning font-mono">78%</span>
               </div>
               <div className="w-full h-1 bg-gray-800 rounded"><div className="h-full bg-warning w-[78%]"></div></div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Pod Restarts (1h)</span>
                 <span className="text-white font-mono">3</span>
               </div>
             </div>
          </div>
        </Card>

        {/* Database */}
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
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Active Connections</span>
                 <span className="text-white font-mono">1,402 / 2,000</span>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400">Storage IOPS</span>
                 <span className="text-warning font-mono">High</span>
               </div>
               <div className="w-full h-1 bg-gray-800 rounded"><div className="h-full bg-warning w-[85%]"></div></div>
             </div>
             <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded">
               Heavy read volume on `iot_telemetry` table.
             </div>
          </div>
        </Card>
      </div>

      {/* Services List */}
      <Card className="p-0 overflow-hidden">
         <div className="p-4 border-b border-gray-800 bg-secondary-bg/50">
           <h3 className="font-bold text-white text-sm">Microservices Health</h3>
         </div>
         <div className="divide-y divide-gray-800">
           {[
             { name: "auth-service", status: "Healthy", uptime: "14d 2h", version: "v2.4.1" },
             { name: "digital-twin-ws", status: "Healthy", uptime: "2d 4h", version: "v1.9.0" },
             { name: "predictive-engine-ml", status: "Healthy", uptime: "1d 12h", version: "v3.0.2" },
             { name: "mobile-sync-worker", status: "Degraded", uptime: "0d 4h", version: "v1.1.0" },
           ].map(svc => (
             <div key={svc.name} className="p-4 flex items-center justify-between hover:bg-secondary-bg/30 transition-colors">
               <div>
                 <p className="font-bold text-gray-300">{svc.name}</p>
                 <p className="text-xs text-gray-500 font-mono">Uptime: {svc.uptime} | Version: {svc.version}</p>
               </div>
               <Badge variant={svc.status === "Healthy" ? "success" : "warning"}>{svc.status}</Badge>
             </div>
           ))}
         </div>
      </Card>
    </div>
  );
};
