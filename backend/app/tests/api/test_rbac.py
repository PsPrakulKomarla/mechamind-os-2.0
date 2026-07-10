import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_rbac_flow(async_client: AsyncClient):
    # 1. Register a test super admin
    reg_data = {
        "email": "admin@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Admin",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_data = {"email": "admin@mechamind.local", "password": "StrongPassword123!"}
    resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json=login_data)
    token = resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get current user ID (Admin)
    me_resp = await async_client.get(f"{settings.API_V1_STR}/auth/me", headers=headers)
    admin_id = me_resp.json()["data"]["id"]

    # Since we are not strictly seeding the DB in this test runner, the admin won't 
    # natively have the 'permission.manage' or 'role.manage' permissions unless we bypass it or mock.
    # For a real integration test, the DB should be seeded with SuperAdmin roles.
    # We will test the unauthenticated behavior here to ensure the RequirePermissions middleware blocks access.

    # 3. Test Unauthorized Access (RequirePermissions block)
    # A standard user (like our test user) trying to create a permission should get a 403 or 401.
    perm_data = {"action": "read", "resource": "machine", "description": "Read machine data"}
    create_perm_resp = await async_client.post(f"{settings.API_V1_STR}/permissions", json=perm_data, headers=headers)
    
    # It should fail because 'admin@mechamind.local' is assigned the default "USER" role on registration, 
    # which does not have "permission.manage".
    assert create_perm_resp.status_code == 401
    assert "Insufficient permissions" in create_perm_resp.json()["message"]

    # 4. Permission Check Endpoint
    check_data = {"action": "read", "resource": "machine"}
    check_resp = await async_client.post(f"{settings.API_V1_STR}/permissions/check", json=check_data, headers=headers)
    assert check_resp.status_code == 200
    assert check_resp.json()["data"] is False  # Does not have access
