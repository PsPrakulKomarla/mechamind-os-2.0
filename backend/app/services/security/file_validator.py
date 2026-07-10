import filetype
from fastapi import UploadFile, HTTPException, status
import logging

logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
    "text/csv"
}

MAX_FILE_SIZE_MB = 10

class FileValidator:
    """
    Validates incoming files to prevent malware uploads.
    """
    
    async def validate_file(self, file: UploadFile):
        # 1. Check file size
        file.file.seek(0, 2)
        size_bytes = file.file.tell()
        file.file.seek(0)
        
        size_mb = size_bytes / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB."
            )
            
        # 2. Check Magic Bytes (MIME Type)
        header = file.file.read(2048)
        file.file.seek(0)
        
        kind = filetype.guess(header)
        mime = kind.mime if kind else file.content_type
        
        if mime not in ALLOWED_MIME_TYPES:
            # We will trigger a security audit log upstream when this is caught
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"File type {mime} is not permitted."
            )
            
        # 3. Stub for ClamAV / Malware scanning integration
        # if await self._run_virus_scan(file):
        #    raise MalwareDetectedException()
        
        return True

file_validator = FileValidator()
