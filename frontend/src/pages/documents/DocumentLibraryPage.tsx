import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useDocumentList } from "@/hooks/useDocumentQueries";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Upload, FileText } from "lucide-react";
import { DocumentUploader } from "@/components/documents/DocumentUploader";

export const DocumentLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { data: documents, isLoading, refetch } = useDocumentList({ search: searchTerm });

  const mockData = documents?.items || documents || [
    { id: "d-1", title: "SIEMENS_M201_MANUAL_V2.pdf", document_type: "Manual", extracted_metadata: { tags: ["M-201", "Maintenance"] }, processing_status: "Indexed", created_at: "2024-02-14" },
    { id: "d-2", title: "Safety_Protocol_Q3.docx", document_type: "Compliance", extracted_metadata: { tags: ["Safety", "Q3"] }, processing_status: "Indexed", created_at: "2024-02-10" },
    { id: "d-3", title: "Bearing_Specs.pdf", document_type: "Specifications", extracted_metadata: { tags: ["Parts", "Mechanical"] }, processing_status: "Pending OCR", created_at: "2024-02-18" },
  ];

  const columns = [
    { header: "Document Title", accessorKey: "title", cell: (row: any) => (
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-400" />
        <Link to={`/documents/${row.id}`} className="text-accent hover:underline font-medium">{row.title}</Link>
      </div>
    )},
    { header: "Type", accessorKey: "document_type" },
    { header: "Tags", accessorKey: "tags", cell: (row: any) => (
      <div className="flex gap-1 flex-wrap">
        {row.extracted_metadata?.tags?.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px] py-0">{t}</Badge>)}
      </div>
    )},
    { header: "Status", accessorKey: "processing_status", cell: (row: any) => (
      <Badge variant={row.processing_status === "COMPLETED" || row.processing_status === "Indexed" ? "success" : "warning"}>
        {row.processing_status}
      </Badge>
    )},
    { header: "Upload Date", accessorKey: "created_at", cell: (row: any) => {
        const d = new Date(row.created_at);
        return <span className="text-gray-400 text-xs">{isNaN(d.getTime()) ? row.created_at : d.toLocaleDateString()}</span>;
    }},
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Document Library</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and search industrial documentation</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm hover:bg-accent/90 transition-colors"
        >
          <Upload size={16} /> {showUpload ? "Cancel Upload" : "Upload Document"}
        </button>
      </div>

      {showUpload && (
        <div className="bg-primary-bg border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Upload New Document</h2>
          <DocumentUploader onUploadSuccess={() => {
            setShowUpload(false);
            refetch();
          }} />
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <Input 
            type="text" 
            placeholder="Semantic Search across all documents, OCR, and AI summaries..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-gray-800 rounded-md text-sm text-gray-300 hover:text-white transition-colors"
        >
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-primary-bg border border-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-secondary-bg/50">
              <h2 className="font-bold text-white">Advanced Metadata Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Category</label>
                <select className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent">
                  <option value="">All Categories</option>
                  <option value="Manual">Manual</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Specifications">Specifications</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Status</label>
                <select className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent">
                  <option value="">All Statuses</option>
                  <option value="Indexed">Indexed</option>
                  <option value="Pending OCR">Pending OCR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Tags (Comma Separated)</label>
                <input type="text" placeholder="e.g. M-201, Safety" className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent" />
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-800">
                <button type="button" onClick={() => setShowFilters(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                  Clear Filters
                </button>
                <button type="button" onClick={() => setShowFilters(false)} className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-sm font-medium transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={mockData} isLoading={isLoading} />
    </div>
  );
};
