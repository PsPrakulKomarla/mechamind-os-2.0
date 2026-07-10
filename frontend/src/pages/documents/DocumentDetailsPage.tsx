import React from "react";
import { useParams } from "react-router-dom";
import { useDocumentDetails, useDocumentOcr, useDocumentSummary } from "@/hooks/useDocumentQueries";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { OcrViewer } from "@/components/documents/OcrViewer";
import { AiSummaryPanel } from "@/components/documents/AiSummaryPanel";
import { HierarchyTree } from "@/components/assets/HierarchyTree"; // Reusing Knowledge Graph component
import { FileText, Download } from "lucide-react";

export const DocumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: document, isLoading: docLoading } = useDocumentDetails(id || "");
  const { data: ocrData, isLoading: ocrLoading } = useDocumentOcr(id || "");
  const { data: summaryData, isLoading: summaryLoading } = useDocumentSummary(id || "");

  // Fallback mocks if API not connected
  const mockDoc = document || { title: "SIEMENS_M201_MANUAL_V2.pdf", size: "4.2 MB", version: "2.0", uploader: "Admin" };
  const mockOcr = ocrData || [
    { id: "o1", text: "WARNING: High Voltage", confidence: 0.99, box: { x: 10, y: 10, w: 40, h: 5 } },
    { id: "o2", text: "Ensure spindle is locked before opening casing.", confidence: 0.95, box: { x: 10, y: 20, w: 60, h: 5 } },
  ];
  const mockSummary = summaryData || {
    executiveSummary: "This document outlines the standard operating procedures and maintenance protocols for the Siemens M-201 industrial series.",
    keyPoints: ["Lock spindle before maintenance", "Torque specs: 45Nm", "Replace filter every 6 months"],
    machinesMentioned: ["M-201", "M-202"],
    warnings: ["HIGH VOLTAGE 480V", "Pinch hazard at joint B"]
  };
  const mockKgNodes = [
    { id: "doc", type: "document", label: mockDoc.title },
    { id: "m1", type: "machine", label: "M-201 Stamping Press", parentId: "doc" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-start justify-between border-b border-gray-800 pb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary-bg border border-gray-700 rounded-lg text-accent mt-1">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{mockDoc.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span>{mockDoc.size}</span>
              <span>•</span>
              <span>Version {mockDoc.version}</span>
              <span>•</span>
              <span>Uploaded by {mockDoc.uploader}</span>
              <Badge variant="success" className="ml-2">Indexed</Badge>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-gray-700 rounded-md text-sm text-white hover:bg-gray-800 transition-colors">
          <Download size={16} /> Download
        </button>
      </div>

      <div className="flex-1">
        <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
          <TabsList className="mb-4 self-start">
            <TabsTrigger value="preview">Document Preview</TabsTrigger>
            <TabsTrigger value="ocr">OCR & Extracted Text</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Links</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 min-h-[600px] bg-secondary-bg rounded-lg border border-gray-800 overflow-hidden">
            {/* Native browser preview via iframe placeholder */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
               [Native Browser PDF / Object Viewer IFrame rendered here]
            </div>
          </TabsContent>

          <TabsContent value="ocr">
            <OcrViewer imageUrl="/mock.jpg" ocrData={mockOcr} isLoading={docLoading || ocrLoading} />
          </TabsContent>

          <TabsContent value="summary">
            <AiSummaryPanel summary={mockSummary} isLoading={docLoading || summaryLoading} />
          </TabsContent>

          <TabsContent value="knowledge" className="h-[600px]">
            {/* Reusing React Flow HierarchyTree from Module 4 for Knowledge Graph UI */}
            <HierarchyTree nodes={mockKgNodes as any} isLoading={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
