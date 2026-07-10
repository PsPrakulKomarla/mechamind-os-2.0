import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_create_department_unauthorized(async_client: AsyncClient):
    dept_data = {
        "name": "Mechanical Department",
        "factory_id": str(uuid.uuid4()),
        "department_type": "MECHANICAL"
    }
    # No Auth Token
    resp = await async_client.post(f"{settings.API_V1_STR}/departments", json=dept_data)
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_assign_user_unauthorized(async_client: AsyncClient):
    # Setup User
    reg_data = {
        "email": f"deptadmin_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Dept",
        "last_name": "Admin"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    assignment_data = {
        "user_id": str(uuid.uuid4()),
        "role_id": str(uuid.uuid4())
    }
    # Standard user doesn't have 'department.update' globally
    resp = await async_client.post(f"{settings.API_V1_STR}/departments/{uuid.uuid4()}/users", json=assignment_data, headers=headers)
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]
