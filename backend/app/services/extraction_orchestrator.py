import json
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.extraction import extraction_repo
from app.models.enums import JobStatus, JobType
from app.models.extraction import ExtractedContent
from app.services.pdf_extractor import pdf_extractor, table_extractor
from app.repositories.document import document_repo

class ExtractionOrchestrator:
    """
    Coordinates the pipeline: Validation -> PDF Extract -> Table Extract -> Save DB
    This is called by the Celery worker.
    """
    async def process_document(self, db: AsyncSession, document_id: UUID, job_id: UUID):
        try:
            # 1. Update job to processing
            await extraction_repo.update_job_status(db, job_id, JobStatus.PROCESSING)
            
            doc = await document_repo.get(db, document_id)
            if not doc:
                raise ValueError(f"Document {document_id} not found")

            # 2. Extract PDF Text & Metadata
            pdf_data = pdf_extractor.extract_all(doc.file_path)
            for chunk in pdf_data.get("text_chunks", []):
                # Save normalized chunks for future embeddings
                ec = ExtractedContent(
                    document_id=document_id,
                    content_type="text",
                    text_content=chunk["content"],
                    metadata_payload={"page": chunk["page"]}
                )
                await extraction_repo.save_extracted_content(db, ec)
                
            # 3. Extract Tables
            tables = table_extractor.extract_tables(doc.file_path)
            for tb in tables:
                ec = ExtractedContent(
                    document_id=document_id,
                    content_type="table",
                    text_content=json.dumps(tb["data"]),
                    metadata_payload={"page": tb["page"], "format": "json_matrix"}
                )
                await extraction_repo.save_extracted_content(db, ec)
                
            # 4. Update job to completed
            await extraction_repo.update_job_status(db, job_id, JobStatus.COMPLETED)
            
            # Also update the Document's processing status (Phase 10.1 link)
            doc.processing_status = "COMPLETED"
            db.add(doc)
            await db.commit()
            
        except Exception as e:
            await extraction_repo.update_job_status(db, job_id, JobStatus.FAILED, str(e))
            
extraction_orchestrator = ExtractionOrchestrator()
