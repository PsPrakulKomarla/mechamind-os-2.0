from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import EntityType, RelationshipType

class RelationshipBase(BaseModel):
    source_entity_id: UUID
    source_entity_type: EntityType
    target_entity_id: UUID
    target_entity_type: EntityType
    relationship_type: RelationshipType
    confidence_score: Optional[float] = 1.0
    metadata_payload: Optional[Dict[str, Any]] = None

class RelationshipCreate(RelationshipBase):
    pass

class RelationshipResponse(RelationshipBase):
    id: UUID
    is_active: bool
    created_at: datetime
    created_by_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class GraphTraversalResponse(BaseModel):
    """Represents a node in a traversed graph"""
    entity_id: UUID
    entity_type: EntityType
    relationship_type: RelationshipType # How it connects to its parent in the traversal
    depth: int # Distance from the root node
    path: List[UUID] # Path of IDs from root to this node
