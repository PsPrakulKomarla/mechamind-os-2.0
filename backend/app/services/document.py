import uuid
import asyncio
from typing import Optional, List, Tuple
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document
from app.models.enums import DocumentType, ScopeType, AuditAction, EntityType
from app.schemas.document import DocumentPaginatedResponse, DocumentResponse
from app.repositories.document import document_repo
from app.core.storage import storage_provider
from app.services.authorization import AuthorizationService
from app.services.audit import audit_service
from app.services.document_processing import document_processor

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
        asyncio.create_task(document_processor.run_pipeline(db, doc))
        
        # 6. Audit
        await audit_service.log_action(db, user_id, AuditAction.CREATE, EntityType.DOCUMENT, doc.id, {"file_name": doc.file_name})
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
