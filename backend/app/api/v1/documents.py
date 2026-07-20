from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import DocumentType
from app.schemas.document import DocumentResponse, DocumentPaginatedResponse
from app.services.document import document_service

router = APIRouter(tags=["Document Intelligence"])

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    document_type: Optional[DocumentType] = Form(None),
    factory_id: Optional[UUID] = Form(None),
    description: Optional[str] = Form(None),
    version: str = Form("1.0"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ingests a heterogeneous document, writes to abstract storage, and triggers the AI background pipeline.
    """
    final_title = title or file.filename or "Untitled Document"
    final_type = document_type or DocumentType.OTHER
    
    return await document_service.upload_document(
        db=db,
        file=file,
        title=final_title,
        document_type=final_type,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        description=description,
        version=version,
        factory_id=factory_id
    )

@router.get("", response_model=DocumentPaginatedResponse)
async def list_documents(
    factory_id: Optional[UUID] = None,
    doc_type: Optional[DocumentType] = None,
    page: int = 1,
    size: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve a paginated list of documents with optional factory filtering.
    """
    return await document_service.list_documents(
        db=db,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        factory_id=factory_id,
        doc_type=doc_type,
        page=page,
        size=size
    )

@router.get("/{id}", response_model=DocumentResponse)
async def get_document(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get metadata and pipeline status for a specific document."""
    return await document_service.get_document(db, id, current_user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft deletes a document record and restricts access."""
    await document_service.delete_document(db, id, current_user.id)
