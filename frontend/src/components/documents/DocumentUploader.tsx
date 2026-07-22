import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  File as FileIcon,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { clsx } from "clsx";
import { useBatchUploadDocuments } from "@/hooks/useDocumentQueries";

interface FileItem {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress?: number;
  error?: string;
}

const ACCEPTED_EXTENSIONS = [
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
  ".png", ".jpg", ".jpeg", ".webp", ".gif",
  ".mp4", ".mov", ".avi",
  ".csv", ".json", ".xml",
  ".zip", ".rar",
];

const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/json",
  "application/xml",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "application/zip",
  "application/x-rar-compressed",
]);

const MAX_FILE_SIZE_MB = 100;
const MAX_FILES = 200;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name: string): string {
  return name.slice(name.lastIndexOf(".")).toLowerCase();
}

function isAcceptedFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  if (ACCEPTED_EXTENSIONS.includes(ext)) return true;
  if (ACCEPTED_MIME_TYPES.has(file.type)) return true;
  return false;
}

let fileCounter = 0;
function uniqueId(): string {
  return `file-${Date.now()}-${++fileCounter}`;
}

interface DocumentUploaderProps {
  onUploadSuccess?: () => void;
  maxFiles?: number;
}

export const DocumentUploader = ({
  onUploadSuccess,
  maxFiles = MAX_FILES,
}: DocumentUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const batchMutation = useBatchUploadDocuments();

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: FileItem[] = [];

      for (const file of fileArray) {
        if (files.length + validFiles.length >= maxFiles) {
          alert(`Maximum ${maxFiles} files allowed.`);
          break;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit. Skipped.`);
          continue;
        }
        if (!isAcceptedFile(file)) {
          alert(`"${file.name}" is not a supported file type. Skipped.`);
          continue;
        }
        // Deduplicate by name+size
        const isDuplicate = files.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        ) || validFiles.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        );
        if (isDuplicate) continue;

        validFiles.push({ file, id: uniqueId(), status: "pending" });
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
        setUploadComplete(false);
      }
    },
    [files.length, maxFiles]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files?.length) {
        addFiles(e.target.files);
        // Reset input so same files can be re-selected
        e.target.value = "";
      }
    },
    [addFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setUploadComplete(false);
  }, []);

  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    // Mark all pending as uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "uploading" as const } : f
      )
    );

    try {
      const result = await batchMutation.mutateAsync({
        files: pendingFiles.map((f) => f.file),
        concurrency: 5,
        onProgress: () => {},
      });

      // Update statuses based on results
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status !== "uploading") return f;
          const uploaded = result.uploaded.find(
            (u) => u.filename === f.file.name
          );
          if (uploaded) {
            return { ...f, status: "success" as const };
          }
          const failed = result.failed.find(
            (fail) => fail.filename === f.file.name
          );
          if (failed) {
            return { ...f, status: "error" as const, error: failed.error };
          }
          return f;
        })
      );

      setUploadComplete(true);
      if (result.successCount > 0) {
        onUploadSuccess?.();
      }
    } catch (err) {
      // Mark all uploading as error
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error" as const, error: "Batch upload failed" }
            : f
        )
      );
    }
  }, [files, batchMutation, onUploadSuccess]);

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        className={clsx(
          "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer text-center",
          {
            "border-[#3B82F6] bg-[#3B82F6]/5 scale-[1.01]": dragActive,
            "border-gray-700 bg-[#111827]/60 hover:border-gray-500 hover:bg-[#111827]/80":
              !dragActive,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud
          size={40}
          className={clsx(
            dragActive ? "text-[#3B82F6]" : "text-gray-500"
          )}
        />
        <p className="mt-3 font-semibold text-white text-sm">
          {dragActive
            ? "Drop files here"
            : "Click to browse or drag & drop files"}
        </p>
        <p className="text-xs text-gray-500 mt-1.5">
          PDF, DOCX, Excel, Images, Videos, CSV, JSON, ZIP — Up to {MAX_FILE_SIZE_MB}MB each
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Supports up to {maxFiles} files at once
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleChange}
          accept={ACCEPTED_EXTENSIONS.join(",")}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {/* Summary Bar */}
          <div className="flex items-center justify-between bg-[#111827]/60 border border-gray-800 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-white font-medium">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              <span className="text-gray-500">{formatSize(totalSize)}</span>
              {successCount > 0 && (
                <span className="text-[#10B981]">{successCount} uploaded</span>
              )}
              {errorCount > 0 && (
                <span className="text-[#EF4444]">{errorCount} failed</span>
              )}
              {uploadingCount > 0 && (
                <span className="text-[#3B82F6]">{uploadingCount} uploading</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {uploadComplete && (
                <span className="text-xs text-[#10B981] font-medium">
                  Upload complete
                </span>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-[#EF4444] transition-colors px-2 py-1"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* File Items (virtualized list — show max 50 at a time for perf) */}
          <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
            {files.slice(0, 50).map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors",
                  {
                    "bg-[#111827]/40 border-gray-800":
                      item.status === "pending",
                    "bg-[#3B82F6]/5 border-[#3B82F6]/20":
                      item.status === "uploading",
                    "bg-[#10B981]/5 border-[#10B981]/20":
                      item.status === "success",
                    "bg-[#EF4444]/5 border-[#EF4444]/20":
                      item.status === "error",
                  }
                )}
              >
                <div className="shrink-0">
                  {item.status === "pending" && (
                    <FileIcon size={16} className="text-gray-500" />
                  )}
                  {item.status === "uploading" && (
                    <Loader2
                      size={16}
                      className="text-[#3B82F6] animate-spin"
                    />
                  )}
                  {item.status === "success" && (
                    <CheckCircle size={16} className="text-[#10B981]" />
                  )}
                  {item.status === "error" && (
                    <AlertTriangle size={16} className="text-[#EF4444]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">
                    {item.file.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {formatSize(item.file.size)}
                    {item.error && (
                      <span className="text-[#EF4444] ml-2">
                        — {item.error}
                      </span>
                    )}
                  </p>
                </div>
                {item.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="text-gray-600 hover:text-[#EF4444] transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            {files.length > 50 && (
              <div className="text-center py-2 text-xs text-gray-500">
                +{files.length - 50} more files...
              </div>
            )}
          </div>

          {/* Upload Button */}
          {pendingCount > 0 && (
            <button
              onClick={handleUpload}
              disabled={batchMutation.isPending}
              className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {batchMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading {uploadingCount} of {files.length} files...
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Upload {pendingCount} file{pendingCount !== 1 ? "s" : ""}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
