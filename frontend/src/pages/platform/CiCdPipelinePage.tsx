import React from "react";
import { GitBranch, Play, CheckCircle, Clock, XCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const CiCdPipelinePage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="text-accent" /> Deployment Pipeline
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage CI/CD workflows, releases, and environment rollbacks</p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded font-bold text-sm hover:bg-accent/90 transition-colors">
          <Play size={16} /> Trigger Manual Build
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pipeline */}
          <Card className="p-6">
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="font-bold text-white text-lg">Release v2.4.2</h3>
                 <p className="text-xs text-gray-500 font-mono mt-1">Commit: 8f9a2b1 • branch: main</p>
               </div>
               <Badge variant="warning" className="animate-pulse">Deploying to Staging</Badge>
             </div>
             
             {/* Pipeline Visualizer */}
             <div className="flex items-center justify-between relative mt-8 mb-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
                
                {/* Steps */}
                {[
                  { name: "Build", status: "success", icon: CheckCircle },
                  { name: "Test (Unit)", status: "success", icon: CheckCircle },
                  { name: "Test (E2E)", status: "success", icon: CheckCircle },
                  { name: "Staging", status: "running", icon: Clock },
                  { name: "Production", status: "pending", icon: Clock },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-primary-bg px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${step.status === 'success' ? 'bg-success/10 border-success text-success' : 
                        step.status === 'running' ? 'bg-warning/10 border-warning text-warning animate-pulse' : 
                        'bg-gray-800 border-gray-700 text-gray-500'}`}
                    >
                      <step.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold ${step.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{step.name}</span>
                  </div>
                ))}
             </div>
          </Card>

          {/* History */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-secondary-bg/50">
              <h3 className="font-bold text-white text-sm">Deployment History</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                { version: "v2.4.1", env: "Production", time: "2 days ago", status: "success" },
                { version: "v2.4.0", env: "Production", time: "5 days ago", status: "success" },
                { version: "v2.3.9-hotfix", env: "Production", time: "1 week ago", status: "failed" },
              ].map((dep, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {dep.status === "success" ? <CheckCircle className="text-success" size={18}/> : <XCircle className="text-danger" size={18}/>}
                    <div>
                      <p className="font-bold text-gray-300">{dep.version} &rarr; {dep.env}</p>
                      <p className="text-xs text-gray-500">{dep.time}</p>
                    </div>
                  </div>
                  {dep.status === "success" ? (
                    <button className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors border border-gray-700 px-2 py-1 rounded">
                      <RotateCcw size={12} /> Rollback
                    </button>
                  ) : (
                    <Badge variant="danger">Failed</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
             <h3 className="font-bold text-white mb-4">Environment Status</h3>
             <div className="space-y-4">
                <div className="p-3 border border-success/30 bg-success/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">Production</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Running: v2.4.1</p>
                </div>
                <div className="p-3 border border-warning/30 bg-warning/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">Staging</span>
                    <Badge variant="warning">Deploying</Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Running: v2.4.2-rc.1</p>
                </div>
                <div className="p-3 border border-gray-700 bg-secondary-bg rounded opacity-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-300">Dev</span>
                    <Badge variant="default">Idle</Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Running: v2.4.2-beta.4</p>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
