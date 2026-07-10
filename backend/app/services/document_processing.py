import asyncio
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document
from app.models.enums import ProcessingStatus
import datetime

class DocumentProcessingService:
    """
    Simulates the background pipeline that prepares documents for the Knowledge Graph / RAG.
    In Phase 10.2, this will interface directly with OCR and Vector DB pipelines.
    """
    
    async def extract_metadata(self, file_name: str, mime_type: str, file_size: int) -> Dict[str, Any]:
        """
        Synchronous-like extraction (wrapper).
        Later this parses PDF headers, reads EXIF, etc.
        """
        return {
            "original_filename": file_name,
            "detected_mime": mime_type,
            "byte_size": file_size,
            "extraction_timestamp": datetime.datetime.now(datetime.UTC).isoformat()
        }
        
    async def run_pipeline(self, db: AsyncSession, document: Document):
        """
        Simulates an asynchronous background pipeline moving the document 
        through the ProcessingStatus states.
        """
        try:
            # 1. Validation Phase
            document.processing_status = ProcessingStatus.VALIDATING
            db.add(document)
            await db.commit()
            
            # Simulate work
            await asyncio.sleep(0.5) 
            
            # 2. Extract Metadata Phase
            document.processing_status = ProcessingStatus.EXTRACTING
            metadata = await self.extract_metadata(document.file_name, document.mime_type, document.file_size)
            document.extracted_metadata = metadata
            db.add(document)
            await db.commit()
            
            # 3. OCR Simulation Phase
            document.processing_status = ProcessingStatus.OCR_PROCESSING
            db.add(document)
            await db.commit()
            
            await asyncio.sleep(0.5)
            
            # 4. Completed
            document.processing_status = ProcessingStatus.COMPLETED
            db.add(document)
            await db.commit()
            
        except Exception as e:
            document.processing_status = ProcessingStatus.FAILED
            db.add(document)
            await db.commit()
            # Log error internally

document_processor = DocumentProcessingService()
