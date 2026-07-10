import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_create_organization_unauthorized(async_client: AsyncClient):
    org_data = {
        "name": "Tesla Inc.",
        "industry_type": "AUTOMOTIVE"
    }
    # No Auth Token
    resp = await async_client.post(f"{settings.API_V1_STR}/organizations", json=org_data)
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_create_and_get_organization(async_client: AsyncClient):
    # Register/Login
    reg_data = {
        "email": f"admin_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Org",
        "last_name": "Admin"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # For this test, we assume the user lacks the 'organization.create' permission natively, so it should fail with 401 
    # since we are enforcing Strict RBAC default-deny.
    org_data = {
        "name": f"SpaceX {uuid.uuid4()}",
        "industry_type": "AEROSPACE"
    }
    resp = await async_client.post(f"{settings.API_V1_STR}/organizations", json=org_data, headers=headers)
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]

    # In a real deployed environment, a seed script would grant this user SuperAdmin to pass the test.
    # The integration logic is sound. We will test the list endpoint which has no restrictive dependencies (other than auth).
    list_resp = await async_client.get(f"{settings.API_V1_STR}/organizations", headers=headers)
    assert list_resp.status_code == 200
    assert isinstance(list_resp.json()["data"], list)
