from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    factory_id: Optional[UUID] = None
    conversation_id: Optional[UUID] = None
    context: Optional[Dict[str, Any]] = None

class Citation(BaseModel):
    document_name: str
    page_number: Optional[str] = None
    section: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: UUID
    message_id: UUID
    answer: str
    confidence: Optional[str] = None
    risk_level: Optional[str] = None
    sources: List[Citation] = []
    recommendations: List[str] = []
    
class ConversationHistoryResponse(BaseModel):
    id: UUID
    title: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class MessageResponse(BaseModel):
    role: str
    content: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
