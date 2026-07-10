import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_prediction_pipeline(async_client: AsyncClient):
    """
    Test generating a failure prediction and fetching the unified Digital Twin state.
    """
    # 1. Register User
    u_data = {
        "email": f"analyst_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Predictive",
        "last_name": "Analyst"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    org_id = login_resp.json()["data"]["user"]["organization_id"]
    
    # 2. Create Factory & Machine
    factory_resp = await async_client.post(
        f"{settings.API_V1_STR}/factories",
        json={"name": "Twin Factory", "location": "Texas"},
        headers=headers
    )
    factory_id = factory_resp.json()["id"]
    
    machine_resp = await async_client.post(
        f"{settings.API_V1_STR}/machines",
        json={"factory_id": factory_id, "name": "Pump Alpha", "asset_tag": "P-ALPHA"},
        headers=headers
    )
    machine_id = machine_resp.json()["id"]
    
    # 3. Trigger Prediction
    pred_resp = await async_client.post(
        f"{settings.API_V1_STR}/prediction/assets/{machine_id}/predict-failure",
        headers=headers
    )
    assert pred_resp.status_code == 200
    prediction = pred_resp.json()
    assert prediction["failure_type"] == "BEARING"
    assert prediction["recommended_action"] == "REPLACE"
    
    # 4. Fetch Digital Twin
    twin_resp = await async_client.get(
        f"{settings.API_V1_STR}/prediction/assets/{machine_id}/digital-twin",
        headers=headers
    )
    assert twin_resp.status_code == 200
    twin_data = twin_resp.json()
    assert twin_data["machine_id"] == machine_id
    assert twin_data["status"] == "AT_RISK"
    assert twin_data["rul_estimate"]["remaining_hours"] == 60.0
    assert len(twin_data["active_predictions"]) == 1
