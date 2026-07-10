import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_create_team_unauthorized(async_client: AsyncClient):
    team_data = {
        "name": "Rotating Equipment Team",
        "department_id": str(uuid.uuid4())
    }
    # No Auth Token
    resp = await async_client.post(f"{settings.API_V1_STR}/teams", json=team_data)
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_team_assignment_unauthorized(async_client: AsyncClient):
    # Setup User
    reg_data = {
        "email": f"teamadmin_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Team",
        "last_name": "Admin"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    assignment_data = {
        "user_id": str(uuid.uuid4())
    }
    
    # Standard user doesn't have 'team.update' globally
    resp = await async_client.post(f"{settings.API_V1_STR}/teams/{uuid.uuid4()}/users", json=assignment_data, headers=headers)
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]
