import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_rbac_flow(async_client: AsyncClient):
    # Setup test user
    reg_data = {
        "email": "rbac_admin@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "RBAC",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Unauthorized Access (Missing 'permission.manage')
    perm_data = {"action": "read", "resource": "machine", "description": "Read machine data"}
    create_perm_resp = await async_client.post(f"{settings.API_V1_STR}/permissions", json=perm_data, headers=headers)
    assert create_perm_resp.status_code == 401
    assert "Insufficient permissions" in create_perm_resp.json()["message"]

    # 2. Unauthorized Role Creation (Missing 'role.manage')
    role_data = {"name": "TestRole", "description": "A test role"}
    create_role_resp = await async_client.post(f"{settings.API_V1_STR}/roles", json=role_data, headers=headers)
    assert create_role_resp.status_code == 401

    # 3. Check Access utility endpoint
    check_data = {"action": "read", "resource": "machine"}
    check_resp = await async_client.post(f"{settings.API_V1_STR}/permissions/check", json=check_data, headers=headers)
    assert check_resp.status_code == 200
    assert check_resp.json()["data"] is False  # User does not have access
