import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentService, BatchUploadResult } from "@/services/documentService";

export const useDocumentDashboardStats = () => {
  return useQuery({
    queryKey: ["documentStats"],
    queryFn: documentService.getDashboardStats,
  });
};

export const useDocumentList = (filters: any) => {
  return useQuery({
    queryKey: ["documents", filters],
    queryFn: () => documentService.getDocuments(filters),
  });
};

export const useDocumentDetails = (documentId: string) => {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => documentService.getDocumentDetails(documentId),
    enabled: !!documentId,
  });
};

export const useDocumentOcr = (documentId: string) => {
  return useQuery({
    queryKey: ["documentOcr", documentId],
    queryFn: () => documentService.getOcrData(documentId),
    enabled: !!documentId,
  });
};

export const useDocumentSummary = (documentId: string) => {
  return useQuery({
    queryKey: ["documentSummary", documentId],
    queryFn: () => documentService.getAiSummary(documentId),
    enabled: !!documentId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }: { file: File, metadata?: any }) => documentService.uploadDocument(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documentStats"] });
    }
  });
};

export const useBatchUploadDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      files,
      metadata,
      concurrency,
      onProgress,
    }: {
      files: File[];
      metadata?: any;
      concurrency?: number;
      onProgress?: (completed: number, total: number) => void;
    }) => documentService.uploadDocuments(files, metadata, concurrency, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documentStats"] });
    }
  });
};
