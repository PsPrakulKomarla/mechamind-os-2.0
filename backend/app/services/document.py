import uuid
import asyncio
import zipfile
import io
import httpx
import os
from typing import Optional, List, Tuple
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document
from app.models.enums import DocumentType, ScopeType, AuditAction, EntityType
from app.schemas.document import DocumentPaginatedResponse, DocumentResponse, BulkUploadItemResponse, BulkUploadResponse
from app.repositories.document import document_repo
from app.core.storage import storage_provider
from app.services.authorization import AuthorizationService
from app.services.audit import audit_service
from app.services.document_processing import document_processor
from app.core.config import settings

class DocumentService:
    
    ALLOWED_MIME_TYPES = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "text/csv",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo"
    ]

    def _get_file_ext(self, filename: str) -> str:
        return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    
    async def upload_document(
        self, db: AsyncSession, 
        file: UploadFile, 
        title: str, 
        document_type: DocumentType, 
        organization_id: uuid.UUID,
        user_id: uuid.UUID,
        description: Optional[str] = None,
        version: str = "1.0",
        factory_id: Optional[uuid.UUID] = None
    ) -> Document:
        
        # 1. Authorize Upload
        if factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.FACTORY, str(factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.ORGANIZATION, str(organization_id))

        # 2. Validate MIME Type
        if file.content_type not in self.ALLOWED_MIME_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
            
        # 3. Stream to Storage Provider
        file_size = file.size if file.size else 0 # Warning: UploadFile.size is not always populated depending on client
        # Let's seek to end to get exact size if needed, but for prototype we accept it might be 0 until processed
        
        directory = f"{organization_id}/{factory_id}" if factory_id else f"{organization_id}/global"
        safe_filename = f"{uuid.uuid4()}_{file.filename}"
        
        file_path = await storage_provider.upload_file(file, directory, safe_filename)
        
        # 4. Create DB Record
        doc = await document_repo.create(
            db=db,
            organization_id=organization_id,
            factory_id=factory_id,
            uploaded_by_id=user_id,
            title=title,
            description=description,
            document_type=document_type,
            version=version,
            file_name=file.filename,
            file_path=file_path,
            file_size=file_size,
            mime_type=file.content_type
        )
        
        # 5. Trigger Background Processing Pipeline (in reality, dispatch to Celery/Redis)
        # We use asyncio.create_task to fire and forget for the prototype
        asyncio.create_task(document_processor.run_pipeline(doc.id))
        
        # 6. Audit
        await audit_service.log_action(db, user_id, AuditAction.CREATE, EntityType.DOCUMENT, doc.id, {"file_name": doc.file_name})
        await db.commit()

        return doc

    async def upload_bulk(
        self,
        db: AsyncSession,
        files: List[UploadFile],
        document_type: Optional[DocumentType],
        organization_id: uuid.UUID,
        user_id: uuid.UUID,
        factory_id: Optional[uuid.UUID] = None,
    ) -> BulkUploadResponse:
        if factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.FACTORY, str(factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.ORGANIZATION, str(organization_id))

        directory = f"{organization_id}/{factory_id}" if factory_id else f"{organization_id}/global"
        results: List[BulkUploadItemResponse] = []
        success_count = 0
        fail_count = 0

        for file in files:
            file_name = file.filename or f"untitled_{uuid.uuid4()}"
            try:
                content = await file.read()
                file_size = len(content)
                safe_filename = f"{uuid.uuid4()}_{file_name}"
                file_path = await storage_provider.upload_bytes(content, directory, safe_filename)

                doc = await document_repo.create(
                    db=db,
                    organization_id=organization_id,
                    factory_id=factory_id,
                    uploaded_by_id=user_id,
                    title=file_name,
                    description=None,
                    document_type=document_type or DocumentType.OTHER,
                    version="1.0",
                    file_name=file_name,
                    file_path=file_path,
                    file_size=file_size,
                    mime_type=file.content_type or "application/octet-stream"
                )
                asyncio.create_task(document_processor.run_pipeline(doc.id))
                results.append(BulkUploadItemResponse(file_name=file_name, file_size=file_size, status="success", document_id=doc.id))
                success_count += 1
            except Exception as e:
                results.append(BulkUploadItemResponse(file_name=file_name, file_size=0, status="failed", error=str(e)))
                fail_count += 1

        return BulkUploadResponse(total_files=len(files), successful=success_count, failed=fail_count, items=results)

    async def upload_zip(
        self,
        db: AsyncSession,
        file: UploadFile,
        document_type: Optional[DocumentType],
        organization_id: uuid.UUID,
        user_id: uuid.UUID,
        factory_id: Optional[uuid.UUID] = None,
    ) -> BulkUploadResponse:
        if factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.FACTORY, str(factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.ORGANIZATION, str(organization_id))

        content = await file.read()
        if not zipfile.is_zipfile(io.BytesIO(content)):
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid zip archive")

        directory = f"{organization_id}/{factory_id}" if factory_id else f"{organization_id}/global"
        results: List[BulkUploadItemResponse] = []
        success_count = 0
        fail_count = 0

        with zipfile.ZipFile(io.BytesIO(content), 'r') as zf:
            for entry in zf.namelist():
                if entry.endswith("/") or entry.startswith("__MACOSX"):
                    continue
                basename = os.path.basename(entry)
                if not basename:
                    continue
                ext = self._get_file_ext(basename)
                mime_type = f"application/{ext}" if ext else "application/octet-stream"
                try:
                    file_data = zf.read(entry)
                    file_size = len(file_data)
                    safe_filename = f"{uuid.uuid4()}_{basename}"
                    file_path = await storage_provider.upload_bytes(file_data, directory, safe_filename)
                    doc = await document_repo.create(
                        db=db, organization_id=organization_id, factory_id=factory_id,
                        uploaded_by_id=user_id, title=basename,
                        description=f"Extracted from zip: {file.filename}",
                        document_type=document_type or DocumentType.OTHER, version="1.0",
                        file_name=basename, file_path=file_path, file_size=file_size, mime_type=mime_type
                    )
                    asyncio.create_task(document_processor.run_pipeline(doc.id))
                    results.append(BulkUploadItemResponse(file_name=basename, file_size=file_size, status="success", document_id=doc.id))
                    success_count += 1
                except Exception as e:
                    results.append(BulkUploadItemResponse(file_name=basename, file_size=0, status="failed", error=str(e)))
                    fail_count += 1

        return BulkUploadResponse(total_files=len(results), successful=success_count, failed=fail_count, items=results)

    async def upload_from_link(
        self,
        db: AsyncSession,
        url: str,
        title: Optional[str],
        document_type: Optional[DocumentType],
        organization_id: uuid.UUID,
        user_id: uuid.UUID,
        description: Optional[str] = None,
        version: str = "1.0",
        factory_id: Optional[uuid.UUID] = None,
    ) -> Document:
        if factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.FACTORY, str(factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.create"], ScopeType.ORGANIZATION, str(organization_id))

        try:
            async with httpx.AsyncClient(timeout=120.0, follow_redirects=True) as client:
                response = await client.get(url)
                response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch URL: HTTP {e.response.status_code}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")

        content_type = response.headers.get("content-type", "application/octet-stream")
        file_size = len(response.content)
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"File size {file_size} bytes exceeds limit of {settings.MAX_FILE_SIZE} bytes")

        filename = title or url.rsplit("/", 1)[-1] or "downloaded_file"
        if "." not in filename:
            ext = content_type.split(";")[0].split("/")[-1]
            if ext:
                filename = f"{filename}.{ext}"

        directory = f"{organization_id}/{factory_id}" if factory_id else f"{organization_id}/global"
        safe_filename = f"{uuid.uuid4()}_{filename}"
        file_path = await storage_provider.upload_bytes(response.content, directory, safe_filename)

        doc = await document_repo.create(
            db=db, organization_id=organization_id, factory_id=factory_id,
            uploaded_by_id=user_id, title=title or filename,
            description=description or f"Downloaded from: {url}",
            document_type=document_type or DocumentType.OTHER, version=version,
            file_name=filename, file_path=file_path, file_size=file_size, mime_type=content_type
        )
        asyncio.create_task(document_processor.run_pipeline(doc.id))
        await audit_service.log_action(db, user_id, AuditAction.CREATE, EntityType.DOCUMENT, doc.id, {"file_name": doc.file_name, "source_url": url})
        await db.commit()
        return doc

    async def get_document(self, db: AsyncSession, id: uuid.UUID, user_id: uuid.UUID) -> Document:
        doc = await document_repo.get(db, id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
            
        if doc.factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.read"], ScopeType.FACTORY, str(doc.factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.read"], ScopeType.ORGANIZATION, str(doc.organization_id))
            
        return doc

    async def list_documents(
        self, db: AsyncSession, organization_id: uuid.UUID, user_id: uuid.UUID,
        factory_id: Optional[uuid.UUID] = None, doc_type: Optional[DocumentType] = None,
        page: int = 1, size: int = 50
    ) -> DocumentPaginatedResponse:
        
        if factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.read"], ScopeType.FACTORY, str(factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.read"], ScopeType.ORGANIZATION, str(organization_id))
            
        skip = (page - 1) * size
        items, total = await document_repo.get_multi(
            db, organization_id=organization_id, factory_id=factory_id, 
            doc_type=doc_type, skip=skip, limit=size
        )
        
        return DocumentPaginatedResponse(
            items=[DocumentResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            size=size
        )

    async def delete_document(self, db: AsyncSession, id: uuid.UUID, user_id: uuid.UUID):
        doc = await document_repo.get(db, id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
            
        if doc.factory_id:
            await AuthorizationService.authorize(db, user_id, ["document.delete"], ScopeType.FACTORY, str(doc.factory_id))
        else:
            await AuthorizationService.authorize(db, user_id, ["document.delete"], ScopeType.ORGANIZATION, str(doc.organization_id))
            
        # Soft delete DB
        await document_repo.soft_delete(db, id)
        
        # We can optionally trigger storage_provider.delete_file here, but for compliance
        # we usually keep the binary if it's a soft delete, or run a sweep cron job.
        
        await audit_service.log_action(db, user_id, AuditAction.DELETE, EntityType.DOCUMENT, id, {})
        await db.commit()

document_service = DocumentService()
