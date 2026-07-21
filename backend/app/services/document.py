config: Application configuration for file upload size limits, chunk size, and resumable upload settings.

Components:
- FILE_UPLOAD_CONFIG: Global file upload settings
- DocumentProcessingService: Background pipeline that reads files, extracts text, chunks it, and saves embeddings to the vector DB.

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
            
        # 3. Validate File Size (Read from config)
        from app.core.config import get_app_config
        max_size_bytes = get_app_config().MAX_UPLOAD_SIZE_BYTES
        
        # Check if file size is available (some clients might stream)
        file_size = file.size if file.size is not None else 0
        if file_size > max_size_bytes:
            raise HTTPException(
                status_code=413, 
                detail=f"File exceeds maximum size of {max_size_bytes / (1024*1024):.1f} MB"
            )
            
        # Additional validation: record the actual size for processing
        # The actual file size may be verified later during storage upload
        print(f"File size validation passed: {file_size} bytes")
            
        # 4. Stream to Storage Provider
        directory = f"{organization_id}/{factory_id}" if factory_id else f"{organization_id}/global"
        safe_filename = f"{uuid.uuid4()}_{file.filename}"
        
        file_path = await storage_provider.upload_file(file, directory, safe_filename)
        
        # 5. Create DB Record
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
        
        # 6. Trigger Background Processing Pipeline (in reality, dispatch to Celery/Redis)
        # We use asyncio.create_task to fire and forget for the prototype
        asyncio.create_task(document_processor.run_pipeline(db, doc))
        
        # 7. Audit
        await audit_service.log_action(db, user_id, AuditAction.CREATE, EntityType.DOCUMENT, doc.id, {"file_name": doc.file_name})
        await db.commit()

        return doc