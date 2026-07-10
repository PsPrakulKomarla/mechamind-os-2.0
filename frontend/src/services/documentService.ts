import { api } from "@/lib/api";

export const documentService = {
  async getDashboardStats() {
    const res = await api.get("/documents/dashboard/stats");
    return res.data.data;
  },

  async getDocuments(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/documents?${params.toString()}`);
    return res.data.data;
  },

  async getDocumentDetails(documentId: string) {
    const res = await api.get(`/documents/${documentId}`);
    return res.data.data;
  },

  async getOcrData(documentId: string) {
    const res = await api.get(`/documents/${documentId}/ocr`);
    return res.data.data;
  },

  async getAiSummary(documentId: string) {
    const res = await api.get(`/documents/${documentId}/summary`);
    return res.data.data;
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
    return res.data.data;
  }
};
