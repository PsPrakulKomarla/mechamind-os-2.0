import uuid
from sqlalchemy import Column, String, Float, DateTime, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import EntityType, RelationshipType

class AssetRelationship(Base):
    """
    Generic graph edge connecting two assets.
    Forms the backbone of the Machine Knowledge Graph.
    """
    __tablename__ = "asset_relationships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    source_entity_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    source_entity_type = Column(Enum(EntityType), nullable=False)
    
    target_entity_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    target_entity_type = Column(Enum(EntityType), nullable=False)
    
    relationship_type = Column(Enum(RelationshipType), index=True, nullable=False)
    
    # Allows AI to weigh the confidence of inferred relationships (e.g., SIMILAR_TO)
    confidence_score = Column(Float, default=1.0)
    
    is_active = Column(Boolean, default=True, index=True) # Soft delete for auditing
    
    metadata_payload = Column(JSONB, nullable=True) # E.g., connection details, edge properties
    
    created_by_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
