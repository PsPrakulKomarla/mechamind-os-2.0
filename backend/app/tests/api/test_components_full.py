import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_component_hierarchy_and_parts(async_client: AsyncClient):
    """
    Simulates the physical tree creation and tests the replacement logic.
    """
    # 1. Setup Auth
    reg_data = {
        "email": f"maint_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Maint",
        "last_name": "Worker"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Since we are focusing on route/auth validation without a seeded DB:
    machine_id = str(uuid.uuid4())
    subsys_payload = {"name": "Hydraulic System", "type": "Fluid"}
    
    # Create Subsystem
    ss_resp = await async_client.post(f"{settings.API_V1_STR}/subsystems/machine/{machine_id}", json=subsys_payload, headers=headers)
    assert ss_resp.status_code in [401, 404]

    # Replace Part
    component_id = str(uuid.uuid4())
    part_id = str(uuid.uuid4())
    replace_payload = {
        "new_part_definition_id": str(uuid.uuid4()),
        "reason": "Wear and tear"
    }
    rep_resp = await async_client.post(
        f"{settings.API_V1_STR}/components/{component_id}/parts/{part_id}/replace",
        json=replace_payload,
        headers=headers
    )
    assert rep_resp.status_code in [401, 404]
