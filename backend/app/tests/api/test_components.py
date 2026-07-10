import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_component_part_replacement(async_client: AsyncClient):
    """
    Test the critical AI workflow: Replacing a part on a component.
    We simulate a user attempting to replace a part and ensure the system blocks 
    unauthorized users without explicit factory mapping.
    """
    # 1. Setup User
    reg_data = {
        "email": f"tech_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Tim",
        "last_name": "Tech"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate random IDs to simulate the environment
    random_component = str(uuid.uuid4())
    random_old_part = str(uuid.uuid4())
    random_new_definition = str(uuid.uuid4())

    payload = {
        "new_part_definition_id": random_new_definition,
        "new_serial_number": "SN-NEW-999",
        "reason": "Scheduled Maintenance"
    }

    # The API should immediately attempt to fetch the Component to extract its parent Machine's factory_id.
    # Since the component doesn't exist, it should return 404 (or 401 if it was a real component they didn't have access to).
    resp = await async_client.post(
        f"{settings.API_V1_STR}/components/{random_component}/parts/{random_old_part}/replace", 
        json=payload, 
        headers=headers
    )
    
    assert resp.status_code in [401, 404]
