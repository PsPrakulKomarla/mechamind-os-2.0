import uuid
import os
from typing import List
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.vision import MediaFile
from app.models.enums import MediaType
from app.repositories.vision import vision_repository
from app.core.config import settings
from app.schemas.vision import BulkMediaUploadItemResponse, BulkMediaUploadResponse

class MediaService:
    
    def __init__(self):
        self.upload_dir = "/tmp/mechamind/vision_uploads"
        os.makedirs(self.upload_dir, exist_ok=True)
        
    async def upload_media(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, user_id: UUID, file: UploadFile, media_type: MediaType) -> MediaFile:
        
        contents = await file.read()
        file_size = len(contents)

        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"File size {file_size} bytes exceeds limit of {settings.MAX_FILE_SIZE} bytes")
        
        file_ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "bin"
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(self.upload_dir, file_name)
        
        with open(file_path, "wb") as f:
            f.write(contents)
            
        media = MediaFile(
            organization_id=organization_id,
            factory_id=factory_id,
            uploaded_by=user_id,
            file_type=media_type,
            file_path=file_path,
            file_size=file_size
        )
        
        return await vision_repository.create_media_file(db, media)

    async def upload_media_bulk(
        self,
        db: AsyncSession,
        organization_id: UUID,
        factory_id: UUID,
        user_id: UUID,
        files: List[UploadFile],
        media_type: MediaType
    ) -> BulkMediaUploadResponse:
        results: List[BulkMediaUploadItemResponse] = []
        success_count = 0
        fail_count = 0

        for file in files:
            file_name = file.filename or f"untitled_{uuid.uuid4()}"
            try:
                contents = await file.read()
                file_size = len(contents)

                if file_size > settings.MAX_FILE_SIZE:
                    raise HTTPException(status_code=413, detail=f"File {file_name} exceeds {settings.MAX_FILE_SIZE} bytes")

                file_ext = file_name.split(".")[-1] if "." in file_name else "bin"
                safe_name = f"{uuid.uuid4()}.{file_ext}"
                file_path = os.path.join(self.upload_dir, safe_name)

                with open(file_path, "wb") as f:
                    f.write(contents)

                media = MediaFile(
                    organization_id=organization_id,
                    factory_id=factory_id,
                    uploaded_by=user_id,
                    file_type=media_type,
                    file_path=file_path,
                    file_size=file_size
                )

                created = await vision_repository.create_media_file(db, media)

                results.append(BulkMediaUploadItemResponse(
                    file_name=file_name,
                    file_size=file_size,
                    status="success",
                    media_id=created.id
                ))
                success_count += 1

            except Exception as e:
                results.append(BulkMediaUploadItemResponse(
                    file_name=file_name,
                    file_size=0,
                    status="failed",
                    error=str(e)
                ))
                fail_count += 1

        return BulkMediaUploadResponse(
            total_files=len(files),
            successful=success_count,
            failed=fail_count,
            items=results
        )

media_service = MediaService()
