import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector

from app.db.base_class import Base

class KnowledgeEmbedding(Base):
    """
    Stores semantic knowledge vectors derived from document chunks,
    prepared for Retrieval-Augmented Generation (RAG).
    """
    __tablename__ = "knowledge_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Strict multi-tenancy isolation
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=True) 
    
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), index=True, nullable=False)
    chunk_id = Column(UUID(as_uuid=True), ForeignKey("extracted_contents.id"), index=True, nullable=False)
    
    content = Column(String, nullable=False)
    
    # 384 dimensions is standard for huggingface models like 'all-MiniLM-L6-v2'
    embedding_vector = Column(Vector(384))
    
    # Stores references to machines, parameters, page numbers for filtered search
    metadata_payload = Column(JSONB, nullable=True)
    
    # Allows experts to permanently boost standard cosine similarity scores for validated solutions
    priority_boost = Column(Float, default=0.0, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
