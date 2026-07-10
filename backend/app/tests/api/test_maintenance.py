import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_failure_report_and_rca(async_client: AsyncClient):
    """
    Test that a user can report a failure and immediately trigger the RCA agent.
    """
    # 1. Register User
    u_data = {
        "email": f"maint_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Maintenance",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    factory_id = str(uuid.uuid4())
    machine_id = str(uuid.uuid4())
    
    # 2. Report Failure
    failure_payload = {
        "machine_id": machine_id,
        "failure_type": "VIBRATION",
        "severity": "HIGH",
        "description": "Pump P-101 is vibrating out of spec.",
        "detected_date": "2026-07-10T12:00:00Z"
    }
    fail_resp = await async_client.post(f"{settings.API_V1_STR}/failures/?factory_id={factory_id}", json=failure_payload, headers=headers)
    assert fail_resp.status_code == 200
    failure_id = fail_resp.json()["id"]
    
    # 3. Trigger RCA
    rca_resp = await async_client.post(
        f"{settings.API_V1_STR}/failures/{failure_id}/analyze?machine_id={machine_id}&issue_description=Pump P-101 is vibrating out of spec.&factory_id={factory_id}",
        headers=headers
    )
    assert rca_resp.status_code == 200
    rca_data = rca_resp.json()
    
    # Validate structured RCA Output
    assert "problem_summary" in rca_data
    assert len(rca_data["possible_causes"]) > 0
    assert "Bearing wear" in rca_data["possible_causes"][0]["cause"]
    assert rca_data["possible_causes"][0]["probability"] == "85%"
    assert "immediate" in rca_data["recommended_actions"]
