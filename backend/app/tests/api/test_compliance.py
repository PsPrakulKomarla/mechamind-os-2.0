import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_compliance_and_safety_checks(async_client: AsyncClient):
    """
    Test that an authorized user can trigger the Compliance Analyzer and Safety Analyzer.
    """
    # 1. Register User
    u_data = {
        "email": f"auditor_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Audit",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    factory_id = str(uuid.uuid4())
    
    # 2. Trigger Compliance Check
    check_resp = await async_client.post(
        f"{settings.API_V1_STR}/compliance/factories/{factory_id}/check?regulation_code=ISO%2045001",
        headers=headers
    )
    assert check_resp.status_code == 200
    check_data = check_resp.json()
    assert check_data["score"] == 85.0
    assert len(check_data["findings"]) > 0
    assert "Missing operator training certificates" in check_data["findings"][0]["issue"]
    
    # 3. Trigger Safety Scan
    safety_resp = await async_client.get(
        f"{settings.API_V1_STR}/safety/factories/{factory_id}/risks",
        headers=headers
    )
    assert safety_resp.status_code == 200
    safety_data = safety_resp.json()
    assert len(safety_data) > 0
    assert "CRITICAL" in [r["severity"] for r in safety_data]
    assert "Unmitigated slip risk" in safety_data[0]["hazard"]
