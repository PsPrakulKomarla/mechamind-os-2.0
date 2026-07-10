import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "@/services/aiService";

export const useConversations = () => {
  return useQuery({
    queryKey: ["aiConversations"],
    queryFn: aiService.getConversations,
  });
};

export const useConversationHistory = (conversationId: string) => {
  return useQuery({
    queryKey: ["aiHistory", conversationId],
    queryFn: () => aiService.getConversationHistory(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, message, context }: { conversationId: string, message: string, context?: any }) => 
      aiService.sendMessage(conversationId, message, context),
    onSuccess: (_, variables) => {
      // Invalidate the specific conversation history to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["aiHistory", variables.conversationId] });
    }
  });
};

export const usePromptLibrary = () => {
  return useQuery({
    queryKey: ["aiPromptLibrary"],
    queryFn: aiService.getPromptLibrary,
  });
};
