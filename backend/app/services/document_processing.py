import asyncio
import uuid
import datetime
import traceback
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document
from app.models.enums import ProcessingStatus
from app.services.knowledge.vector_store import vector_store

class DocumentProcessingService:
    """
    Background pipeline that reads files, extracts text, chunks it, and saves embeddings to the vector DB.
    """
    
    def extract_text(self, file_path: str, mime_type: str) -> str:
        text = ""
        try:
            if mime_type == "application/pdf":
                from pypdf import PdfReader
                reader = PdfReader(file_path)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            elif mime_type == "text/plain" or mime_type == "text/csv":
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
            else:
                text = f"Unsupported file type for text extraction: {mime_type}"
        except Exception as e:
            text = f"Error extracting text: {str(e)}"
        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        chunks = []
        start = 0
        text_len = len(text)
        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunks.append(text[start:end])
            if end == text_len:
                break
            start = end - overlap
        return chunks

    async def extract_metadata(self, file_name: str, mime_type: str, file_size: int) -> Dict[str, Any]:
        return {
            "original_filename": file_name,
            "detected_mime": mime_type,
            "byte_size": file_size,
            "extraction_timestamp": datetime.datetime.now(datetime.UTC).isoformat()
        }
        
    async def run_pipeline(self, db: AsyncSession, document: Document):
        try:
            # 1. Validation
            document.processing_status = ProcessingStatus.VALIDATING
            db.add(document)
            await db.commit()
            
            # 2. Extract Metadata
            document.processing_status = ProcessingStatus.EXTRACTING
            metadata = await self.extract_metadata(document.file_name, document.mime_type, document.file_size)
            document.extracted_metadata = metadata
            db.add(document)
            await db.commit()
            
            # 3. Text Extraction (OCR/PDF Parsing)
            document.processing_status = ProcessingStatus.OCR_PROCESSING
            db.add(document)
            await db.commit()
            
            # Run blocking I/O in thread pool
            raw_text = await asyncio.to_thread(self.extract_text, document.file_path, document.mime_type)
            
            # 4. Chunking and Embedding
            document.processing_status = ProcessingStatus.PROCESSING
            db.add(document)
            await db.commit()

            chunks = self.chunk_text(raw_text)
            
            for chunk in chunks:
                if not chunk.strip():
                    continue
                
                # 1. Insert ExtractedContent
                chunk_id = uuid.uuid4()
                from app.models.extraction import ExtractedContent
                extracted_content = ExtractedContent(
                    id=chunk_id,
                    document_id=document.id,
                    content_type='paragraph',
                    text_content=chunk,
                    metadata_payload={"file_name": document.file_name}
                )
                db.add(extracted_content)
                await db.commit()

                # 2. Insert into pgvector
                chunk_meta = {
                    "document_name": document.title,
                    "file_name": document.file_name
                }
                await vector_store.save_embedding(
                    db=db,
                    organization_id=document.organization_id,
                    factory_id=document.factory_id,
                    document_id=document.id,
                    chunk_id=chunk_id,
                    content=chunk,
                    metadata=chunk_meta
                )
            
            # 5. Completed
            document.processing_status = ProcessingStatus.COMPLETED
            db.add(document)
            await db.commit()
            
        except Exception as e:
            traceback.print_exc()
            document.processing_status = ProcessingStatus.FAILED
            db.add(document)
            await db.commit()

document_processor = DocumentProcessingService()
