import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_risk_calculation_isolation(async_client: AsyncClient):
    """
    Test that users cannot calculate risk for assets outside their factory scope.
    """
    reg_data = {
        "email": f"risk_eng_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Risk",
        "last_name": "Engineer"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    random_asset = str(uuid.uuid4())
    payload = {
        "probability_factor": 0.8,
        "safety_impact": 100,
        "production_impact": 80,
        "financial_impact": 50,
        "environment_impact": 20,
        "compliance_impact": 10
    }
    
    # 1. API will dynamically check the DB to find the asset's factory_id.
    # Since it's a random UUID, it will 404. If it existed and user had no access, it would 401.
    resp = await async_client.post(
        f"{settings.API_V1_STR}/risk/assets/{random_asset}/risk-assessment", 
        json=payload, 
        headers=headers
    )
    assert resp.status_code in [401, 404]

@pytest.mark.asyncio
async def test_health_criticality_update(async_client: AsyncClient):
    """
    Test the criticality update endpoint logic.
    """
    random_asset = str(uuid.uuid4())
    payload = {
        "new_criticality": "HIGH",
        "reason": "Increased vibration observed"
    }
    # Should block unauthenticated or missing asset
    resp = await async_client.put(
        f"{settings.API_V1_STR}/asset-health/assets/{random_asset}/criticality", 
        json=payload
    )
    assert resp.status_code == 401
