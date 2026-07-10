import uuid
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.enums import ExtractedEntityType

class ExtractedEntity(Base):
    """
    Named entities extracted from document text.
    """
    __tablename__ = "extracted_entities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), index=True, nullable=False)
    
    entity_type = Column(Enum(ExtractedEntityType), nullable=False, index=True)
    entity_name = Column(String, nullable=False, index=True) # E.g., 'Pump P-101'
    entity_value = Column(String, nullable=True) # Normalized value
    
    # Traceability
    confidence_score = Column(Float, nullable=False)
    metadata_payload = Column(JSONB, nullable=True) # Page number, bounding box, NLP method
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EntityRelationship(Base):
    """
    Semantic connections between entities (e.g. Failure 'Overheating' applies to Machine 'P-101')
    """
    __tablename__ = "entity_relationships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    source_entity_id = Column(UUID(as_uuid=True), ForeignKey("extracted_entities.id"), nullable=False, index=True)
    target_entity_id = Column(UUID(as_uuid=True), ForeignKey("extracted_entities.id"), nullable=False, index=True)
    
    relationship_type = Column(String, nullable=False, index=True) # e.g. 'AFFECTS', 'HAS_PARAMETER'
    confidence_score = Column(Float, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class KnowledgeMap(Base):
    """
    Maps an ExtractedEntity to a physical Asset Master DB row.
    """
    __tablename__ = "knowledge_maps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    extracted_entity_id = Column(UUID(as_uuid=True), ForeignKey("extracted_entities.id"), unique=True, nullable=False)
    
    # Generic foreign key to Machine, Component, etc.
    target_table = Column(String, nullable=False) # 'machines', 'components'
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    match_score = Column(Float, nullable=False) # Fuzzy match score 0.0 to 1.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())
