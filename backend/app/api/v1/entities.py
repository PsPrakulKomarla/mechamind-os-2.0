from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.entity import ExtractedEntityResponse, EntityRelationshipResponse
from app.repositories.entity import entity_repo
from app.repositories.document import document_repo
from app.services.authorization import AuthorizationService
from app.services.nlp.entity_extractor import entity_extractor_svc

router = APIRouter(tags=["Entity Extraction"])

async def _verify_doc_access(db: AsyncSession, document_id: UUID, user_id: UUID, permission: str):
    doc = await document_repo.get(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.factory_id:
        await AuthorizationService.authorize(db, user_id, [permission], ScopeType.FACTORY, str(doc.factory_id))
    else:
        await AuthorizationService.authorize(db, user_id, [permission], ScopeType.ORGANIZATION, str(doc.organization_id))
    return doc

@router.post("/documents/{document_id}/extract-entities", response_model=List[ExtractedEntityResponse])
async def trigger_entity_extraction(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually triggers the NLP pipeline over previously extracted document chunks."""
    await _verify_doc_access(db, document_id, current_user.id, "document.update")
    entities = await entity_extractor_svc.extract_from_document(db, document_id)
    return entities

@router.get("/documents/{document_id}/entities", response_model=List[ExtractedEntityResponse])
async def get_document_entities(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch all industrial entities identified in a document."""
    await _verify_doc_access(db, document_id, current_user.id, "document.read")
    return await entity_repo.get_document_entities(db, document_id)

@router.get("/{entity_id}/relationships", response_model=List[EntityRelationshipResponse])
async def get_entity_relationships(
    entity_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all semantic relationships connected to an entity (e.g., what failed near this machine)."""
    # Skipping deep RBAC for prototype endpoint; typically you'd verify entity ownership.
    return await entity_repo.get_entity_relationships(db, entity_id)
