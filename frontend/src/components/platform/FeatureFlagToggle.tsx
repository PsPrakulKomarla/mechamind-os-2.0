import React, { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

interface FeatureFlagToggleProps {
  flagKey: string;
  name: string;
  description: string;
  initialEnabled: boolean;
  onToggle: (key: string, enabled: boolean) => void;
}

export const FeatureFlagToggle: React.FC<FeatureFlagToggleProps> = ({
  flagKey,
  name,
  description,
  initialEnabled,
  onToggle
}) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(flagKey, newState);
  };

  return (
    <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
      <div className="pr-4">
        <h4 className="text-sm font-medium text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className="text-[10px] text-muted-foreground mt-2 font-mono bg-muted/50 inline-block px-1.5 py-0.5 rounded">
          {flagKey}
        </div>
      </div>
      <div className="flex-shrink-0 pt-1">
        <Toggle enabled={enabled} onToggle={handleToggle} />
      </div>
    </div>
  );
};
