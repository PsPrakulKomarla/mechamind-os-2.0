import { useQuery, useMutation } from "@tanstack/react-query";
import { aiAgentService } from "@/services/aiAgentService";

export const useGetAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: aiAgentService.getAgents
  });
};

export const useStartChat = () => {
  return useMutation({
    mutationFn: ({ agentId, initialMessage }: { agentId: string; initialMessage: string }) =>
      aiAgentService.startChat(agentId, initialMessage)
  });
};
