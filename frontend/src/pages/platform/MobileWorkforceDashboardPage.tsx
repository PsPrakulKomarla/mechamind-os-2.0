import React, { useState } from "react";
import { QrCode, WifiOff, Camera, Mic, CheckCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const MobileWorkforceDashboardPage = () => {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      {/* Mobile-first Header Simulation */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Field Technician</h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><WifiOff size={12}/> Offline Mode Active</p>
        </div>
        <div className="relative">
          <Badge variant="warning" className="animate-pulse">3 Pending Syncs</Badge>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsScanning(true)}
          className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center group"
        >
          <QrCode size={32} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Scan Asset</h3>
        </button>

        <button className="bg-secondary-bg border border-gray-800 hover:border-info transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center group">
          <Camera size={32} className="text-info mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Capture Defect</h3>
        </button>

        <button className="bg-secondary-bg border border-gray-800 hover:border-success transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center group">
          <Mic size={32} className="text-success mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Voice Notes</h3>
        </button>
        
        <button className="bg-secondary-bg border border-gray-800 hover:border-warning transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center group">
          <CheckCircle size={32} className="text-warning mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Checklists</h3>
        </button>
      </div>

      {/* Offline Sync Queue */}
      <Card className="p-0 overflow-hidden border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-secondary-bg/50 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Offline Work Queue</h3>
          <RefreshCw size={14} className="text-gray-500" />
        </div>
        <div className="divide-y divide-gray-800">
          <div className="p-4 bg-primary-bg/50">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-bold text-gray-300">WO-9912 Completion</p>
              <Badge variant="warning" className="text-[10px]">Queued</Badge>
            </div>
            <p className="text-xs text-gray-500">Waiting for network connection...</p>
          </div>
          <div className="p-4 bg-primary-bg/50">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-bold text-gray-300">Photo Upload: M4 Defect</p>
              <Badge variant="warning" className="text-[10px]">Queued</Badge>
            </div>
            <p className="text-xs text-gray-500">2.4 MB pending upload</p>
          </div>
        </div>
      </Card>

      {/* Simulated QR Scanner Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6">
          <div className="relative w-64 h-64 border-2 border-accent/50 rounded-lg overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-accent/10"></div>
             <div className="w-full h-1 bg-accent/50 absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_10px_rgba(20,241,149,0.8)]"></div>
             {/* Corner brackets */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent"></div>
          </div>
          <p className="text-white mt-6 font-bold tracking-widest uppercase">Scanning Asset Tag...</p>
          <button 
            onClick={() => setIsScanning(false)}
            className="mt-8 px-6 py-2 bg-gray-800 text-white rounded-full font-bold"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
