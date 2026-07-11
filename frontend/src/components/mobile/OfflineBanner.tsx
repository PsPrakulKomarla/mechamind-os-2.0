import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { useOfflineSync } from "@/hooks/useOfflineSync";

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useOfflineSync();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-between text-sm text-yellow-600 dark:text-yellow-500">
      <div className="flex items-center space-x-2">
        <WifiOff size={16} />
        <span>You are currently offline. Changes will be synced when connection is restored.</span>
      </div>
      <button className="flex items-center space-x-1 hover:text-yellow-700 dark:hover:text-yellow-400">
        <RefreshCw size={14} />
        <span>Retry</span>
      </button>
    </div>
  );
};
