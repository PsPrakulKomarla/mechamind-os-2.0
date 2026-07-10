import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_strict_factory_isolation(async_client: AsyncClient):
    """
    Test that an engineer from Factory A cannot access Factory B APIs.
    We simulate this by verifying that without explicit scoped 'factory.read' on Factory B,
    the user is blocked by the Policy Engine.
    """
    # 1. Setup User
    reg_data = {
        "email": f"engineer_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Bob",
        "last_name": "Builder"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Assume Factory B exists and User tries to read its settings
    factory_b_id = str(uuid.uuid4())
    
    # 3. Request hits RequirePermissions(["factory.read"], ScopeType.FACTORY, "factory_id")
    resp = await async_client.get(f"{settings.API_V1_STR}/factories/{factory_b_id}/settings", headers=headers)
    
    # Policy Engine Default Deny should catch this instantly because User lacks the role map
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]

@pytest.mark.asyncio
async def test_factory_creation_org_isolation(async_client: AsyncClient):
    """
    Test that a user cannot create a factory in an organization they don't own.
    """
    reg_data = {
        "email": f"creator_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Charlie",
        "last_name": "Create"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    factory_payload = {
        "name": "Malicious Factory",
        "organization_id": str(uuid.uuid4()),  # Random Organization
        "industry_sector": "AEROSPACE"
    }
    
    # Creating a factory requires global 'factory.create' or 'organization.update' on that specific org.
    # User has neither.
    resp = await async_client.post(f"{settings.API_V1_STR}/factories", json=factory_payload, headers=headers)
    assert resp.status_code == 401
