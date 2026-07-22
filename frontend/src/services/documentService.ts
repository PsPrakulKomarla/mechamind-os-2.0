import { api } from "@/lib/api";

export interface UploadResult {
  document_id: string;
  filename: string;
  status: string;
}

export interface BatchUploadResult {
  uploaded: UploadResult[];
  failed: { filename: string; error: string }[];
  total: number;
  successCount: number;
  failCount: number;
}

export const documentService = {
  async getDashboardStats() {
    const res = await api.get("/documents/dashboard/stats");
    return res.data;
  },

  async getDocuments(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/documents?${params.toString()}`);
    return res.data;
  },

  async getDocumentDetails(documentId: string) {
    const res = await api.get(`/documents/${documentId}`);
    return res.data;
  },

  async getOcrData(documentId: string) {
    const res = await api.get(`/documents/${documentId}/ocr`);
    return res.data;
  },

  async getAiSummary(documentId: string) {
    const res = await api.get(`/documents/${documentId}/summary`);
    return res.data;
  },

  async uploadDocument(file: File, metadata?: any) {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }
    
    const res = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },

  /**
   * Upload multiple files concurrently with a configurable concurrency limit.
   * Returns results for each file (success/failure).
   */
  async uploadDocuments(
    files: File[],
    metadata?: any,
    concurrency: number = 5,
    onProgress?: (completed: number, total: number) => void
  ): Promise<BatchUploadResult> {
    const results: UploadResult[] = [];
    const failed: { filename: string; error: string }[] = [];
    let completed = 0;

    // Process files in batches of `concurrency`
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          if (metadata) {
            formData.append("metadata", JSON.stringify(metadata));
          }
          const res = await api.post("/documents/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 300000, // 5 min timeout per file for large files
          });
          return res.data as UploadResult;
        })
      );

      batchResults.forEach((result, idx) => {
        completed++;
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          failed.push({
            filename: batch[idx].name,
            error: result.reason?.message || "Upload failed",
          });
        }
      });

      onProgress?.(completed, files.length);
    }

    return {
      uploaded: results,
      failed,
      total: files.length,
      successCount: results.length,
      failCount: failed.length,
    };
  }
};
