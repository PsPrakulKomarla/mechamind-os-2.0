from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType, JobType, JobStatus
from app.schemas.extraction import ProcessingJobResponse, ExtractedContentResponse, RetryJobRequest
from app.repositories.extraction import extraction_repo
from app.repositories.document import document_repo
from app.services.authorization import AuthorizationService
from app.worker.tasks import process_document_task

router = APIRouter(tags=["Document Extraction Pipeline"])

async def _verify_doc_access(db: AsyncSession, document_id: UUID, user_id: UUID, permission: str):
    doc = await document_repo.get(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.factory_id:
        await AuthorizationService.authorize(db, user_id, [permission], ScopeType.FACTORY, str(doc.factory_id))
    else:
        await AuthorizationService.authorize(db, user_id, [permission], ScopeType.ORGANIZATION, str(doc.organization_id))
    return doc

@router.post("/documents/{document_id}/process", response_model=ProcessingJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def start_processing(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enqueues a document for background extraction."""
    await _verify_doc_access(db, document_id, current_user.id, "document.update")
    
    # Check if job already exists
    existing = await extraction_repo.get_job_by_doc(db, document_id)
    if existing and existing.status in [JobStatus.QUEUED, JobStatus.PROCESSING]:
        raise HTTPException(status_code=400, detail="Job already running for this document")
        
    job = await extraction_repo.create_job(db, document_id, JobType.FULL_EXTRACTION)
    
    # Dispatch Celery task
    process_document_task.delay(str(document_id), str(job.id))
    
    return job

@router.get("/documents/{document_id}/processing-status", response_model=ProcessingJobResponse)
async def get_status(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await _verify_doc_access(db, document_id, current_user.id, "document.read")
    job = await extraction_repo.get_job_by_doc(db, document_id)
    if not job:
        raise HTTPException(status_code=404, detail="No processing job found for this document")
    return job

@router.get("/documents/{document_id}/extractions", response_model=List[ExtractedContentResponse])
async def get_extractions(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns the parsed text and tables ready for AI embedding."""
    await _verify_doc_access(db, document_id, current_user.id, "document.read")
    contents = await extraction_repo.get_extracted_content(db, document_id)
    return contents

@router.post("/documents/{document_id}/retry-processing", response_model=ProcessingJobResponse)
async def retry_processing(
    document_id: UUID,
    payload: RetryJobRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await _verify_doc_access(db, document_id, current_user.id, "document.update")
    # Reset job and fire again
    existing = await extraction_repo.get_job_by_doc(db, document_id)
    if not existing:
        raise HTTPException(status_code=404, detail="No previous job found to retry")
        
    updated_job = await extraction_repo.update_job_status(db, existing.id, JobStatus.QUEUED)
    process_document_task.delay(str(document_id), str(updated_job.id))
    return updated_job
