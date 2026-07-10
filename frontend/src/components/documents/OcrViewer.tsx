import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileSearch } from "lucide-react";

interface OcrBox {
  id: string;
  text: string;
  confidence: number;
  box: { x: number, y: number, w: number, h: number }; // percentages
}

export const OcrViewer = ({ imageUrl, ocrData, isLoading }: { imageUrl?: string, ocrData?: OcrBox[], isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-[600px] flex items-center justify-center text-gray-500">Extracting Document Text...</Card>;
  }

  if (!imageUrl || !ocrData) {
    return (
      <Card className="h-[600px] flex flex-col items-center justify-center text-gray-500">
        <FileSearch size={48} className="mb-4 opacity-50" />
        <p>No OCR data generated for this document.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
      {/* Image Panel with Overlays */}
      <Card className="flex-1 p-0 relative overflow-hidden bg-primary-bg flex items-center justify-center">
        {/* Mocking the image view since we don't have actual binary storage mounted yet */}
        <div className="relative w-full h-full bg-gray-900 border border-gray-800 flex items-center justify-center">
           <span className="text-gray-700 font-mono text-xl absolute">ORIGINAL DOCUMENT</span>
           
           {ocrData.map((box) => (
             <div 
               key={box.id}
               className="absolute border border-accent bg-accent/10 hover:bg-accent/30 transition-colors cursor-pointer group"
               style={{ 
                 left: `${box.box.x}%`, 
                 top: `${box.box.y}%`, 
                 width: `${box.box.w}%`, 
                 height: `${box.box.h}%` 
               }}
             >
               <div className="absolute -top-6 left-0 bg-secondary-bg border border-gray-700 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 text-white shadow-xl pointer-events-none">
                 {box.text} ({(box.confidence * 100).toFixed(0)}%)
               </div>
             </div>
           ))}
        </div>
      </Card>

      {/* Extracted Text List Panel */}
      <Card className="w-full lg:w-80 flex flex-col p-0">
        <div className="p-4 border-b border-gray-800 bg-secondary-bg/50">
          <h3 className="font-bold text-white text-sm">Detected Text</h3>
          <p className="text-xs text-gray-500 mt-1">Found {ocrData.length} text blocks</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {ocrData.map((box) => (
            <div key={box.id} className="bg-primary-bg border border-gray-800 p-2 rounded">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-gray-400">ID: {box.id}</span>
                <Badge variant={box.confidence > 0.9 ? "success" : "warning"} className="text-[10px] py-0">
                  {box.confidence.toFixed(2)}
                </Badge>
              </div>
              <p className="text-sm text-gray-200">{box.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
