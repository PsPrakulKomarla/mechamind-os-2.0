import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_cross_organization_data_leakage(async_client: AsyncClient):
    """
    Tests that a user belonging to Company A cannot access Company B.
    """
    # 1. Setup User for Company A
    reg_data = {
        "email": f"user_compa_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Alice",
        "last_name": "Smith"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Attempt to access a random organization UUID (simulating Company B)
    random_org_id = str(uuid.uuid4())
    
    # User shouldn't even have global 'organization.read' by default
    resp = await async_client.get(f"{settings.API_V1_STR}/organizations/{random_org_id}", headers=headers)
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]

@pytest.mark.asyncio
async def test_privilege_escalation_attempt(async_client: AsyncClient):
    """
    Tests that a user cannot modify an organization's settings without 'organization.update'.
    """
    reg_data = {
        "email": f"hacker_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Eve",
        "last_name": "Hacker"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    random_org_id = str(uuid.uuid4())
    settings_payload = {
        "country": "Hacked Country"
    }
    
    resp = await async_client.put(f"{settings.API_V1_STR}/organizations/{random_org_id}/settings", json=settings_payload, headers=headers)
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]
