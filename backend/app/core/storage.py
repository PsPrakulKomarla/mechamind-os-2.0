from abc import ABC, abstractmethod
import os
import aiofiles
from pathlib import Path
from fastapi import UploadFile

from app.core.config import settings

class StorageProvider(ABC):
    """Abstract Base Class for Document Storage"""
    
    @abstractmethod
    async def upload_file(self, file: UploadFile, directory: str, filename: str) -> str:
        """Uploads a file and returns the storage path/URI"""
        pass
        
    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Deletes a file from storage"""
        pass

class LocalStorageProvider(StorageProvider):
    """Local file system implementation for dev and on-prem deployments"""
    
    def __init__(self):
        self.base_dir = Path(settings.LOCAL_STORAGE_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)
        
    async def upload_file(self, file: UploadFile, directory: str, filename: str) -> str:
        target_dir = self.base_dir / directory
        target_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = target_dir / filename
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            
        return str(file_path.absolute())
        
    async def delete_file(self, file_path: str) -> bool:
        path = Path(file_path)
        if path.exists() and path.is_file():
            os.remove(path)
            return True
        return False

# Factory to get configured provider
def get_storage_provider() -> StorageProvider:
    if settings.STORAGE_BACKEND == "local":
        return LocalStorageProvider()
    # elif settings.STORAGE_BACKEND == "s3": return S3StorageProvider()
    else:
        raise ValueError(f"Unsupported storage backend: {settings.STORAGE_BACKEND}")

storage_provider = get_storage_provider()
