import React from "react";
import { FeatureFlagToggle } from "@/components/platform/FeatureFlagToggle";
import { Card } from "@/components/ui/Card";
import { Shield, AlertTriangle } from "lucide-react";

export const FeatureFlagsPage: React.FC = () => {
  const handleToggle = (key: string, enabled: boolean) => {
    console.log(`Toggled ${key} to ${enabled}`);
    // In a real app, this would call an API to update the flag
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feature Flags</h1>
          <p className="text-muted-foreground mt-1">Manage progressive delivery and experimental features.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-500/10 px-3 py-1.5 rounded-md">
          <AlertTriangle size={16} />
          <span>Changes take effect immediately</span>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6 text-brand-production">
          <Shield size={20} />
          <h2 className="text-lg font-semibold">Core Platform</h2>
        </div>
        
        <div className="space-y-2">
          <FeatureFlagToggle 
            flagKey="enable-ai-copilot" 
            name="AI Copilot V2" 
            description="Enables the new streaming-based AI copilot interface across the application." 
            initialEnabled={true} 
            onToggle={handleToggle} 
          />
          <FeatureFlagToggle 
            flagKey="enable-mobile-sync" 
            name="Mobile Offline Sync" 
            description="Allows mobile workers to queue actions when offline via IndexedDB." 
            initialEnabled={true} 
            onToggle={handleToggle} 
          />
          <FeatureFlagToggle 
            flagKey="beta-predictive-models" 
            name="Beta Predictive Models" 
            description="Uses experimental SageMaker models for RUL instead of standard linear regression." 
            initialEnabled={false} 
            onToggle={handleToggle} 
          />
        </div>
      </Card>
    </div>
  );
};
