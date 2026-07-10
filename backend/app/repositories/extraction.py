from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.extraction import DocumentExtraction, ExtractedContent, ProcessingJob
from app.models.enums import JobStatus, JobType

class ExtractionRepository:
    
    async def create_job(self, db: AsyncSession, document_id: UUID, job_type: JobType) -> ProcessingJob:
        job = ProcessingJob(document_id=document_id, job_type=job_type, status=JobStatus.QUEUED)
        db.add(job)
        await db.commit()
        await db.refresh(job)
        return job
        
    async def get_job_by_doc(self, db: AsyncSession, document_id: UUID) -> Optional[ProcessingJob]:
        query = select(ProcessingJob).where(ProcessingJob.document_id == document_id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update_job_status(self, db: AsyncSession, job_id: UUID, status: JobStatus, error: str = None) -> ProcessingJob:
        query = select(ProcessingJob).where(ProcessingJob.id == job_id)
        result = await db.execute(query)
        job = result.scalars().first()
        if job:
            job.status = status
            if error:
                job.error_message = error
            db.add(job)
            await db.commit()
        return job

    async def save_extracted_content(self, db: AsyncSession, content: ExtractedContent) -> ExtractedContent:
        db.add(content)
        await db.commit()
        return content
        
    async def get_extracted_content(self, db: AsyncSession, document_id: UUID) -> List[ExtractedContent]:
        query = select(ExtractedContent).where(ExtractedContent.document_id == document_id)
        result = await db.execute(query)
        return list(result.scalars().all())

extraction_repo = ExtractionRepository()
