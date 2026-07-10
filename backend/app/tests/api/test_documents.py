import pytest
import uuid
import io
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_document_upload_and_mime_rejection(async_client: AsyncClient):
    """
    Test uploading a valid document and verifying MIME type rejection.
    """
    reg_data = {
        "email": f"doc_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Doc",
        "last_name": "Manager"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    org_id = str(uuid.uuid4())
    
    # Test valid PDF (will fail 401/404 because user doesn't have permission to the mock org, but 
    # we want to ensure it passes the MIME check and hits auth)
    files = {'file': ('test.pdf', io.BytesIO(b'dummy pdf content'), 'application/pdf')}
    data = {
        'title': 'Test SOP',
        'document_type': 'SOP',
        'organization_id': org_id
    }
    
    resp_valid = await async_client.post(
        f"{settings.API_V1_STR}/documents/upload",
        files=files,
        data=data,
        headers=headers
    )
    # Reaches Policy Engine and is denied because mock org doesn't exist for this user
    assert resp_valid.status_code in [401, 403, 404]

    # Test invalid MIME type (exe file) - Should be blocked immediately by DocumentService
    files_invalid = {'file': ('malware.exe', io.BytesIO(b'bad stuff'), 'application/x-msdownload')}
    
    resp_invalid = await async_client.post(
        f"{settings.API_V1_STR}/documents/upload",
        files=files_invalid,
        data=data,
        headers=headers
    )
    assert resp_invalid.status_code == 400
    assert "Unsupported file type" in resp_invalid.json()["detail"]
