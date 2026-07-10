import uuid
import os
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.vision import MediaFile
from app.models.enums import MediaType
from app.repositories.vision import vision_repository

class MediaService:
    
    def __init__(self):
        # Local mock storage for now. Easily swapped to S3 boto3 later.
        self.upload_dir = "/tmp/mechamind/vision_uploads"
        os.makedirs(self.upload_dir, exist_ok=True)
        
    async def upload_media(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, user_id: UUID, file: UploadFile, media_type: MediaType) -> MediaFile:
        
        file_ext = file.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(self.upload_dir, file_name)
        
        # Read and save file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        media = MediaFile(
            organization_id=organization_id,
            factory_id=factory_id,
            uploaded_by=user_id,
            file_type=media_type,
            file_path=file_path,
            file_size=len(contents)
        )
        
        return await vision_repository.create_media_file(db, media)

media_service = MediaService()
