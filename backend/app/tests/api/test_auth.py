import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_register_and_login(async_client: AsyncClient):
    # 1. Register
    reg_data = {
        "email": "test@example.com",
        "password": "testpassword",
        "first_name": "Test",
        "last_name": "User"
    }
    response = await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["email"] == "test@example.com"
    
    # 2. Duplicate Registration
    response2 = await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    assert response2.status_code == 422
    assert response2.json()["error_code"] == "ValidationException"

    # 3. Login
    login_data = {
        "email": "test@example.com",
        "password": "testpassword"
    }
    response3 = await async_client.post(f"{settings.API_V1_STR}/auth/login", json=login_data)
    assert response3.status_code == 200
    tokens = response3.json()["data"]
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # 4. Get Current User
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    response4 = await async_client.get(f"{settings.API_V1_STR}/auth/me", headers=headers)
    assert response4.status_code == 200
    assert response4.json()["data"]["email"] == "test@example.com"

    # 5. Logout
    response5 = await async_client.post(f"{settings.API_V1_STR}/auth/logout", headers=headers)
    assert response5.status_code == 200

    # 6. Unauthorized access after logout
    response6 = await async_client.get(f"{settings.API_V1_STR}/auth/me", headers=headers)
    assert response6.status_code == 401
