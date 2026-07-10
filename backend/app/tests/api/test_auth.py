import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_auth_registration(async_client: AsyncClient):
    reg_data = {
        "email": "test_auth@example.com",
        "password": "StrongPassword123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    # 1. Successful Registration
    resp = await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    assert resp.status_code == 200
    assert resp.json()["data"]["email"] == reg_data["email"]

    # 2. Duplicate Email Registration
    resp_dup = await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    assert resp_dup.status_code == 422
    assert "already exists" in resp_dup.json()["message"]

    # 3. Weak Password Registration
    weak_reg = reg_data.copy()
    weak_reg["email"] = "weak@example.com"
    weak_reg["password"] = "weak"
    resp_weak = await async_client.post(f"{settings.API_V1_STR}/auth/register", json=weak_reg)
    assert resp_weak.status_code == 422
    assert "ValidationException" in resp_weak.json()["error_code"]

@pytest.mark.asyncio
async def test_auth_login_and_brute_force(async_client: AsyncClient):
    login_data = {"email": "test_auth@example.com", "password": "StrongPassword123!"}
    
    # 1. Successful Login
    resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json=login_data)
    assert resp.status_code == 200
    tokens = resp.json()["data"]
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # 2. Brute Force Protection
    wrong_login = {"email": "test_auth@example.com", "password": "WrongPassword!"}
    for _ in range(settings.MAX_LOGIN_ATTEMPTS):
        await async_client.post(f"{settings.API_V1_STR}/auth/login", json=wrong_login)
        
    # The 6th attempt should return a locked out message
    resp_locked = await async_client.post(f"{settings.API_V1_STR}/auth/login", json=wrong_login)
    assert resp_locked.status_code == 401
    assert "Account temporarily locked" in resp_locked.json()["message"]

@pytest.mark.asyncio
async def test_auth_logout_and_session(async_client: AsyncClient):
    # Needs a new user since the previous one is locked out
    reg_data = {
        "email": "logout@example.com",
        "password": "StrongPassword123!",
        "first_name": "Logout",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    
    login_data = {"email": "logout@example.com", "password": "StrongPassword123!"}
    resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json=login_data)
    token = resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify session active
    me_resp = await async_client.get(f"{settings.API_V1_STR}/auth/me", headers=headers)
    assert me_resp.status_code == 200

    # Logout
    logout_resp = await async_client.post(f"{settings.API_V1_STR}/auth/logout", headers=headers)
    assert logout_resp.status_code == 200

    # Verify session revoked (Token Blacklist)
    me_resp_after = await async_client.get(f"{settings.API_V1_STR}/auth/me", headers=headers)
    assert me_resp_after.status_code == 401
    assert "revoked" in me_resp_after.json()["message"].lower()
