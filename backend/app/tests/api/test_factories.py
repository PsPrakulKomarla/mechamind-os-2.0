import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_create_factory_unauthorized(async_client: AsyncClient):
    factory_data = {
        "name": "Unauthorized Plant",
        "organization_id": str(uuid.uuid4())
    }
    # No Auth Token
    resp = await async_client.post(f"{settings.API_V1_STR}/factories", json=factory_data)
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_factory_creation_and_settings(async_client: AsyncClient):
    # 1. Setup User
    reg_data = {
        "email": f"facadmin_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Fac",
        "last_name": "Admin"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # As with Organizations, this standard user won't have 'factory.create' inherently without seeding.
    # Therefore, we test the isolation constraints of the RBAC layer.
    
    factory_data = {
        "name": "Pune Plant A1",
        "organization_id": str(uuid.uuid4()),
        "industry_sector": "AUTOMOTIVE",
        "factory_size": "LARGE",
        "production_type": "MIXED"
    }
    
    create_resp = await async_client.post(f"{settings.API_V1_STR}/factories", json=factory_data, headers=headers)
    assert create_resp.status_code == 401
    assert "Insufficient permissions" in create_resp.json()["message"]

    # Test settings update without permission
    settings_data = {
        "settings": {
            "ai_settings": {"max_agents": 5},
            "safety_settings": {"strict_mode": True}
        }
    }
    set_resp = await async_client.put(f"{settings.API_V1_STR}/factories/{uuid.uuid4()}/settings", json=settings_data, headers=headers)
    assert set_resp.status_code == 401
