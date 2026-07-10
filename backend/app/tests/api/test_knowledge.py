import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_semantic_search_cross_tenant_rejection(async_client: AsyncClient):
    """
    Test that a user from Factory A cannot perform a semantic search targeting Factory B's knowledge base.
    """
    reg_data = {
        "email": f"vec_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Vec",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    target_factory_id = str(uuid.uuid4())
    
    # 1. Execute Search against an unauthorized factory
    payload = {
        "query": "pump failure",
        "factory_id": target_factory_id,
        "top_k": 5
    }
    
    resp = await async_client.post(
        f"{settings.API_V1_STR}/knowledge/search",
        json=payload,
        headers=headers
    )
    # The EntityScopeResolver should block this because the user does not have RBAC access to the mock target_factory_id.
    assert resp.status_code in [401, 403, 404]
