import React from "react";
import { Card } from "@/components/ui/Card";
import { Server, Activity, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const DeploymentsPage: React.FC = () => {
  const deployments = [
    { id: "d-1849", env: "production", status: "success", version: "v2.1.4", time: "2 hours ago", author: "CI/CD Pipeline" },
    { id: "d-1848", env: "staging", status: "success", version: "v2.1.5-rc1", time: "5 hours ago", author: "Jane Doe" },
    { id: "d-1847", env: "production", status: "success", version: "v2.1.3", time: "2 days ago", author: "CI/CD Pipeline" },
    { id: "d-1846", env: "production", status: "failed", version: "v2.1.3", time: "2 days ago", author: "CI/CD Pipeline" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deployments</h1>
        <p className="text-muted-foreground mt-1">Platform health and release history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Production Status</p>
            <p className="text-lg font-bold text-green-500">Healthy</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Version</p>
            <p className="text-lg font-bold">v2.1.4</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-brand-production/10 text-brand-production rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Uptime</p>
            <p className="text-lg font-bold">99.98%</p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-sm">
              <th className="py-3 px-4 font-medium">Deployment ID</th>
              <th className="py-3 px-4 font-medium">Environment</th>
              <th className="py-3 px-4 font-medium">Version</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deployments.map((dep) => (
              <tr key={dep.id} className="hover:bg-muted/10">
                <td className="py-3 px-4 font-mono text-xs">{dep.id}</td>
                <td className="py-3 px-4">
                  <Badge variant={dep.env === 'production' ? 'info' : 'secondary'}>
                    {dep.env}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-medium">{dep.version}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {dep.status === 'success' ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <AlertTriangle className="text-red-500" size={16} />
                    )}
                    <span className="capitalize text-sm">{dep.status}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{dep.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
