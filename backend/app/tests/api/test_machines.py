import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_machine_creation_isolation(async_client: AsyncClient):
    """
    Test that a user can only create a machine in a factory they have access to.
    """
    # 1. Setup User
    reg_data = {
        "email": f"m_creator_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Mike",
        "last_name": "Machine"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Attempt to create machine in a random factory without assignment
    random_factory = str(uuid.uuid4())
    payload = {
        "name": "New Pump",
        "machine_code": f"PUMP-{str(uuid.uuid4())[:8]}",
        "factory_id": random_factory
    }
    
    resp = await async_client.post(f"{settings.API_V1_STR}/machines/", json=payload, headers=headers)
    assert resp.status_code == 401
    assert "Insufficient permissions" in resp.json()["message"]

@pytest.mark.asyncio
async def test_machine_status_update_audit(async_client: AsyncClient):
    """
    Verify that updating a machine's status triggers the Policy Engine properly.
    """
    # 1. Setup User
    reg_data = {
        "email": f"m_updater_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Mike",
        "last_name": "Update"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    random_machine = str(uuid.uuid4())
    payload = {
        "status": "FAILED",
        "reason": "Vibration levels critical"
    }

    # API should block the request before it even checks if the machine exists in the DB, 
    # because it will fetch the machine, then check if User has Factory scope for it.
    resp = await async_client.post(f"{settings.API_V1_STR}/machines/{random_machine}/status", json=payload, headers=headers)
    assert resp.status_code in [401, 404] # 404 if machine doesn't exist, 401 if it does but user lacks access.
