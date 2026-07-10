import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_mlops_model_promotion(async_client: AsyncClient):
    """
    Test registering an AI model, creating versions, and promoting one to production.
    """
    # 1. Register User (Data Scientist)
    u_data = {
        "email": f"ds_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Data",
        "last_name": "Scientist"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    org_id = login_resp.json()["data"]["user"]["organization_id"]
    
    # 2. Register Model
    model_data = {
        "organization_id": org_id,
        "name": "Predictive Maintenance Random Forest",
        "task_type": "classification"
    }
    m_resp = await async_client.post(
        f"{settings.API_V1_STR}/mlops/models",
        json=model_data,
        headers=headers
    )
    assert m_resp.status_code == 200
    model_id = m_resp.json()["id"]
    
    # 3. Create Version v1.0
    v1_data = {
        "model_id": model_id,
        "version_tag": "v1.0.0",
        "artifact_uri": "s3://mechamind-models/rf_v1.pkl",
        "evaluation_metrics": {"accuracy": 0.88, "f1_score": 0.85}
    }
    v1_resp = await async_client.post(f"{settings.API_V1_STR}/mlops/models/versions", json=v1_data, headers=headers)
    v1_id = v1_resp.json()["id"]
    
    # Promote v1.0 to Prod
    p1_resp = await async_client.post(f"{settings.API_V1_STR}/mlops/models/{model_id}/versions/{v1_id}/promote", headers=headers)
    assert p1_resp.json()["status"] == "PRODUCTION"
    
    # 4. Create Version v1.1
    v2_data = {
        "model_id": model_id,
        "version_tag": "v1.1.0",
        "artifact_uri": "s3://mechamind-models/rf_v1_1.pkl",
        "evaluation_metrics": {"accuracy": 0.92, "f1_score": 0.91}
    }
    v2_resp = await async_client.post(f"{settings.API_V1_STR}/mlops/models/versions", json=v2_data, headers=headers)
    v2_id = v2_resp.json()["id"]
    
    # Promote v1.1 to Prod
    p2_resp = await async_client.post(f"{settings.API_V1_STR}/mlops/models/{model_id}/versions/{v2_id}/promote", headers=headers)
    assert p2_resp.json()["status"] == "PRODUCTION"
    
    # Fetch all versions, verify v1.0 is ARCHIVED and v1.1 is PRODUCTION
    list_resp = await async_client.get(f"{settings.API_V1_STR}/mlops/models/{model_id}/versions", headers=headers)
    versions = list_resp.json()
    
    for v in versions:
        if v["id"] == v1_id:
            assert v["status"] == "ARCHIVED"
        elif v["id"] == v2_id:
            assert v["status"] == "PRODUCTION"
