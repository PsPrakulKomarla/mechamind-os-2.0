import React from "react";
import { Card } from "@/components/ui/Card";
import { Server, Activity, CheckCircle, Clock, AlertTriangle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";

export const DeploymentsPage: React.FC = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deployments</h1>
        <p className="text-muted-foreground mt-1">Platform health and release history.</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Server size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Deployment Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Deploy the platform and configure CI/CD pipelines to track deployments.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                <Server size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Production Status</p>
                <p className="text-lg font-bold text-green-500">—</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Version</p>
                <p className="text-lg font-bold">—</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-brand-production/10 text-brand-production rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-lg font-bold">—</p>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="p-8 text-center text-gray-500 text-sm">
              Deployment history will appear once CI/CD pipelines are configured.
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
