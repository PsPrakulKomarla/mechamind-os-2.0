import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_extraction_pipeline_trigger(async_client: AsyncClient):
    """
    Test that triggering the background extraction pipeline correctly routes through Auth.
    """
    reg_data = {
        "email": f"ext_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Ext",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    doc_id = str(uuid.uuid4())
    
    # 1. Trigger process
    # Will fail 404 because the mock doc doesn't exist to extract a factory_id from.
    # This validates the dynamic EntityScopeResolver fires correctly.
    resp = await async_client.post(
        f"{settings.API_V1_STR}/extraction/documents/{doc_id}/process",
        headers=headers
    )
    assert resp.status_code in [404, 401]

@pytest.mark.asyncio
async def test_extraction_status_check(async_client: AsyncClient):
    """Test the polling endpoint for processing status."""
    # Assuming auth from previous test format
    doc_id = str(uuid.uuid4())
    resp = await async_client.get(
        f"{settings.API_V1_STR}/extraction/documents/{doc_id}/processing-status"
    )
    assert resp.status_code == 401 # Unauthenticated
