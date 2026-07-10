from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import EntityType
from app.schemas.relationship import RelationshipCreate, RelationshipResponse, GraphTraversalResponse
from app.services.relationship import relationship_service

router = APIRouter(tags=["Knowledge Graph Relationships"])

@router.post("/", response_model=RelationshipResponse, status_code=status.HTTP_201_CREATED)
async def create_relationship(
    obj_in: RelationshipCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a generic directed edge between two assets in the Knowledge Graph."""
    return await relationship_service.create_relationship(db, obj_in, current_user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_relationship(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft deletes a relationship."""
    await relationship_service.delete_relationship(db, id, current_user.id)

@router.get("/assets/{entity_id}/relationships", response_model=List[RelationshipResponse])
async def get_neighbors(
    entity_id: UUID,
    entity_type: EntityType = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get immediate neighbors of an asset."""
    return await relationship_service.get_neighbors(db, entity_id, entity_type, current_user.id)

@router.get("/assets/{entity_id}/dependencies", response_model=List[GraphTraversalResponse])
async def get_dependencies(
    entity_id: UUID,
    entity_type: EntityType = Query(...),
    direction: str = Query("downstream"), # "upstream" or "downstream"
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Traverse the Knowledge Graph natively using PostgreSQL CTE.
    direction=downstream finds everything this asset impacts.
    direction=upstream finds everything that impacts this asset.
    """
    return await relationship_service.get_dependencies(db, entity_id, entity_type, direction, current_user.id)
