import { api } from "@/lib/api";

export interface CopilotChatRequest {
  message: string;
  factory_id?: string;
  conversation_id?: string;
  context?: Record<string, unknown>;
}

export interface CopilotCitation {
  document_name: string;
  page_number?: string;
  section?: string;
}

export interface CopilotChatResponse {
  conversation_id: string;
  message_id: string;
  answer: string;
  confidence?: string;
  risk_level?: string;
  sources: CopilotCitation[];
  recommendations: string[];
}

/**
 * Matches backend schema in backend/app/schemas/copilot.py
 * - POST /api/v1/copilot/chat  → ChatResponse
 * - GET  /api/v1/copilot/history → List[ConversationHistoryResponse]
 *
 * Individual message history is NOT exposed by the backend yet.
 * Only conversation summaries (id, title, created_at) are available.
 */

export interface ConversationItem {
  id: string;
  title?: string;
  created_at: string;
}

export const aiService = {
  /** POST /copilot/chat — send a message to the industrial copilot */
  async sendMessage(payload: CopilotChatRequest): Promise<CopilotChatResponse> {
    const res = await api.post("/copilot/chat", payload);
    return res.data;
  },

  /** GET /copilot/history — list conversation summaries (no message content) */
  async getConversations(): Promise<ConversationItem[]> {
    const res = await api.get("/copilot/history");
    return res.data;
  },

  async getPromptLibrary() {
    const res = await api.get("/brain/prompts/library");
    return res.data.data;
  },

  async getKnowledgeGraphNodes(focusId?: string) {
    const params = focusId ? `?focus_id=${focusId}` : "";
    const res = await api.get(`/brain/knowledge-graph${params}`);
    return res.data.data;
  }
};
