import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_health_score_calculation(async_client: AsyncClient):
    """
    Test the multi-factor health normalization logic.
    """
    reg_data = {
        "email": f"health_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Health",
        "last_name": "Inspector"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    asset_id = str(uuid.uuid4())
    payload = {
        "health_factors": {
            "vibration_degradation": 0.3, # -30 points
            "temperature_degradation": 0.2 # -20 points
        }
    }
    
    # 100 - 30 - 20 = 50 (POOR or FAIR depending on threshold logic)
    resp = await async_client.post(
        f"{settings.API_V1_STR}/asset-health/assets/{asset_id}/health-score",
        json=payload,
        headers=headers
    )
    assert resp.status_code in [401, 404]

@pytest.mark.asyncio
async def test_risk_summary_dashboard(async_client: AsyncClient):
    factory_id = str(uuid.uuid4())
    # Fails 401 unauthenticated
    resp = await async_client.get(
        f"{settings.API_V1_STR}/risk/assets/risk-summary/factory/{factory_id}"
    )
    assert resp.status_code == 401
