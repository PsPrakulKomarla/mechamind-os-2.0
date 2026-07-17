import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "@/services/aiService";

export const useConversations = () => {
  return useQuery({
    queryKey: ["aiConversations"],
    queryFn: aiService.getConversations,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: { message: string; factory_id?: string; conversation_id?: string; context?: Record<string, unknown> }) => 
      aiService.sendMessage(payload),
    onSuccess: () => {
      // Refetch conversation list after sending a message
      queryClient.invalidateQueries({ queryKey: ["aiConversations"] });
    }
  });
};

export const usePromptLibrary = () => {
  return useQuery({
    queryKey: ["aiPromptLibrary"],
    queryFn: aiService.getPromptLibrary,
  });
};
