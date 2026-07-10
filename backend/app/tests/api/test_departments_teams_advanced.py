import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_nested_creation_constraints(async_client: AsyncClient):
    """
    Test that users cannot bypass the top-down hierarchy.
    """
    reg_data = {
        "email": f"deptuser_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Diana",
        "last_name": "Dept"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Trying to assign user to a non-existent department without permissions
    assignment_payload = {
        "user_id": str(uuid.uuid4()),
        "role_id": str(uuid.uuid4())
    }
    
    random_dept = str(uuid.uuid4())
    resp = await async_client.post(f"{settings.API_V1_STR}/departments/{random_dept}/users", json=assignment_payload, headers=headers)
    
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]

@pytest.mark.asyncio
async def test_team_assignment_boundaries(async_client: AsyncClient):
    reg_data = {
        "email": f"teamuser_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Tom",
        "last_name": "Team"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    random_team = str(uuid.uuid4())
    assignment_payload = {"user_id": str(uuid.uuid4())}
    
    resp = await async_client.post(f"{settings.API_V1_STR}/teams/{random_team}/users", json=assignment_payload, headers=headers)
    assert resp.status_code == 401
