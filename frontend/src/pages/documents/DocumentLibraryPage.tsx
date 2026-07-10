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
  const { data: documents, isLoading, refetch } = useDocumentList({ search: searchTerm });

  const mockData = documents || [
    { id: "d-1", title: "SIEMENS_M201_MANUAL_V2.pdf", category: "Manual", tags: ["M-201", "Maintenance"], status: "Indexed", date: "2024-02-14" },
    { id: "d-2", title: "Safety_Protocol_Q3.docx", category: "Compliance", tags: ["Safety", "Q3"], status: "Indexed", date: "2024-02-10" },
    { id: "d-3", title: "Bearing_Specs.pdf", category: "Specifications", tags: ["Parts", "Mechanical"], status: "Pending OCR", date: "2024-02-18" },
  ];

  const columns = [
    { header: "Document Title", accessorKey: "title", cell: (row: any) => (
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-400" />
        <Link to={`/documents/${row.id}`} className="text-accent hover:underline font-medium">{row.title}</Link>
      </div>
    )},
    { header: "Category", accessorKey: "category" },
    { header: "Tags", accessorKey: "tags", cell: (row: any) => (
      <div className="flex gap-1 flex-wrap">
        {row.tags?.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px] py-0">{t}</Badge>)}
      </div>
    )},
    { header: "Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "Indexed" ? "success" : "warning"}>
        {row.status}
      </Badge>
    )},
    { header: "Upload Date", accessorKey: "date", cell: (row: any) => <span className="text-gray-400 text-xs">{row.date}</span> },
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
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-gray-800 rounded-md text-sm text-gray-300 hover:text-white transition-colors">
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      <DataTable columns={columns} data={mockData} isLoading={isLoading} />
    </div>
  );
};
