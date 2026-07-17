import React, { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, CheckCircle } from "lucide-react";
import { clsx } from "clsx";
import { useUploadDocument } from "@/hooks/useDocumentQueries";

export const DocumentUploader = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadDocument();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    // Dynamic size limit validation (50MB)
    const MAX_SIZE_MB = 50;
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File exceeds the maximum upload size of ${MAX_SIZE_MB}MB.`);
      setSelectedFile(null);
      return;
    }
    
    // Using TanStack query mutation
    uploadMutation.mutate({ file: selectedFile }, {
      onSuccess: () => {
        setSelectedFile(null);
        if (onUploadSuccess) onUploadSuccess();
      }
    });
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div 
          className={clsx("border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors cursor-pointer text-center", {
            "border-accent bg-accent/5": dragActive,
            "border-gray-700 bg-secondary-bg hover:border-gray-500": !dragActive
          })}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud size={48} className={dragActive ? "text-accent" : "text-gray-500"} />
          <p className="mt-4 font-semibold text-white">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-2">PDF, DOCX, XLSX, TXT, PNG, JPG (Max 50MB)</p>
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            onChange={handleChange} 
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
          />
        </div>
      ) : (
        <div className="bg-secondary-bg border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-gray-800 rounded text-accent">
                <FileIcon size={24} />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploadMutation.isPending && !uploadMutation.isSuccess && (
              <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
          
          {uploadMutation.isSuccess ? (
            <div className="flex items-center justify-center gap-2 text-success text-sm py-2 bg-success/10 rounded">
              <CheckCircle size={16} /> Upload Complete & Indexed!
            </div>
          ) : (
            <button 
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="w-full py-2 bg-accent hover:bg-accent/90 text-white rounded font-medium text-sm transition-colors disabled:opacity-50"
            >
              {uploadMutation.isPending ? "Uploading & Analyzing..." : "Start Upload"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
