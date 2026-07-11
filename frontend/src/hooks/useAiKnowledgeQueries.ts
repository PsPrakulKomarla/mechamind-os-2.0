import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiKnowledgeService } from "@/services/aiKnowledgeService";

export const useAiStats = () => {
  return useQuery({
    queryKey: ["aiStats"],
    queryFn: aiKnowledgeService.getAiStats,
  });
};

export const useKnowledgeGraph = () => {
  return useQuery({
    queryKey: ["knowledgeGraph"],
    queryFn: aiKnowledgeService.getKnowledgeGraph,
  });
};

export const usePrompts = () => {
  return useQuery({
    queryKey: ["aiPrompts"],
    queryFn: aiKnowledgeService.getPrompts,
  });
};

export const useSavePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => aiKnowledgeService.savePrompt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
    }
  });
};

// We will use a mock simulation inside the page component for the true "working" feel of semantic search.
export const useVectorSearch = () => {
  return useMutation({
    mutationFn: (query: string) => aiKnowledgeService.searchVectors(query),
  });
};

export const useFeedbackQueue = () => {
  return useQuery({
    queryKey: ["aiFeedbackQueue"],
    queryFn: aiKnowledgeService.getFeedbackQueue,
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => aiKnowledgeService.updateFeedbackStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiFeedbackQueue"] });
    }
  });
};

export const useModelConfig = () => {
  return useQuery({
    queryKey: ["aiModelConfig"],
    queryFn: aiKnowledgeService.getModelConfig,
  });
};
