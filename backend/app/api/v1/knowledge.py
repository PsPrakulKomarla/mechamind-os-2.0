from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType, AuditAction, EntityType
from app.schemas.knowledge import SearchRequest, SearchResponse
from app.repositories.document import document_repo
from app.models.extraction import ExtractedContent
from sqlalchemy import select
from app.services.knowledge.chunking import chunking_service
from app.services.knowledge.vector_store import vector_store
from app.services.authorization import AuthorizationService
from app.services.audit import audit_service

router = APIRouter(tags=["Industrial Knowledge Memory"])

@router.post("/embed/{document_id}", status_code=status.HTTP_201_CREATED)
async def generate_embeddings(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Pulls ExtractedContent for a document, chunks it, and writes the vectors to pgvector.
    """
    doc = await document_repo.get(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    scope = ScopeType.FACTORY if doc.factory_id else ScopeType.ORGANIZATION
    scope_id = str(doc.factory_id) if doc.factory_id else str(doc.organization_id)
    await AuthorizationService.authorize(db, current_user.id, ["document.update"], scope, scope_id)
    
    # 1. Fetch extracted content
    query = select(ExtractedContent).where(ExtractedContent.document_id == document_id)
    result = await db.execute(query)
    contents = result.scalars().all()
    
    count = 0
    # 2. Chunk & Embed
    for content in contents:
        chunks = chunking_service.create_chunks(content.text_content, content.metadata_payload)
        for chunk in chunks:
            await vector_store.save_embedding(
                db=db,
                organization_id=doc.organization_id,
                factory_id=doc.factory_id,
                document_id=document_id,
                chunk_id=content.id,
                content=chunk["text"],
                metadata=chunk["metadata"]
            )
            count += 1
            
    await audit_service.log_action(db, current_user.id, AuditAction.UPDATE, EntityType.DOCUMENT, document_id, {"event": "embeddings_generated", "chunks": count})
    return {"status": "success", "chunks_embedded": count}


@router.post("/search", response_model=SearchResponse)
async def semantic_search(
    request: SearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Perform a mathematically similar search over the semantic knowledge base.
    """
    # Enforce multi-tenancy dynamically
    if request.factory_id:
        await AuthorizationService.authorize(db, current_user.id, ["document.read"], ScopeType.FACTORY, str(request.factory_id))
        org_id = current_user.organization_id # Derived securely from token
    else:
        await AuthorizationService.authorize(db, current_user.id, ["document.read"], ScopeType.ORGANIZATION, str(current_user.organization_id))
        org_id = current_user.organization_id
        
    results = await vector_store.search(
        db=db,
        query=request.query,
        organization_id=org_id,
        factory_id=request.factory_id,
        filters=request.filters,
        top_k=request.top_k
    )
    
    return SearchResponse(query=request.query, results=results)
