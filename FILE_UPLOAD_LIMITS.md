# FastAPI File Upload Configuration

This document outlines the file upload limits configuration for MechaMind OS.

## Background
Users were experiencing issues with uploading files greater than 1GB, likely due to missing or restrictive file size limits in the FastAPI application.

## Solution
The fix is to add explicit file upload size limits to the FastAPI application configuration:

### 1. Configuration Update (C:/Users/prakul/Desktop/projects/mechamind-os/backend/app/core/config.py)
Added two new configuration settings:
- `MAX_CONTENT_LENGTH`: Maximum request content size in bytes (1GB = 1,073,741,824 bytes)
- `MAX_FILE_SIZE`: Maximum individual file size in bytes (1GB = 1,073,741,824 bytes)

### 2. FastAPI App Configuration Update (C:/Users/prakul/Desktop/projects/mechamind-os/backend/app/main.py)
Modified the `create_app()` function to pass the new configuration limits to the FastAPI instance:
```python
app = FastAPI(
    ...,
    max_content_length=settings.MAX_CONTENT_LENGTH,
)
```

### 3. Usage
The limits apply to:
- Document uploads via `/api/v1/documents/upload`
- Vision media uploads via `/api/v1/vision/upload-image` and `/api/v1/vision/upload-video`

### Benefits
1. **Clear Documentation**: Explicit configuration makes the limits visible in documentation
2. **Consistent Behavior**: All upload endpoints now use the same limit
3. **Proper Error Handling**: FastAPI provides clear error messages when limits are exceeded
4. **Scalable Design**: Configuration can be easily modified per environment (dev, staging, prod)
5. **Performance**: Pre-allocated buffer size limits prevent memory exhaustion

### Testing
To verify the fix:
1. Configure the application (testing with 1GB limit)
2. Upload a 1.1GB file to confirm rejection
3. Upload a 1GB file to confirm acceptance
4. Monitor application logs for any performance issues