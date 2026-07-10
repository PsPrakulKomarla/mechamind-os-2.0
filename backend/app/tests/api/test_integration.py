import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_integration_hub(async_client: AsyncClient):
    """
    Test registering a connector, testing the connection, and triggering a sync.
    """
    # 1. Register User (IT Admin)
    u_data = {
        "email": f"it_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "IT",
        "last_name": "Admin"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    org_id = login_resp.json()["data"]["user"]["organization_id"]
    
    # 2. Register SAP Connector
    connector_data = {
        "organization_id": org_id,
        "name": "Global SAP S/4HANA",
        "connector_type": "ERP",
        "plugin_id": "sap_s4hana",
        "configuration_payload": {
            "base_url": "https://sap.internal.mechamind.local",
            "api_key": "mocked_key"
        }
    }
    
    conn_resp = await async_client.post(
        f"{settings.API_V1_STR}/integration/connectors",
        json=connector_data,
        headers=headers
    )
    assert conn_resp.status_code == 200
    connector_id = conn_resp.json()["id"]
    
    # 3. Test Connection via Hub
    test_resp = await async_client.post(
        f"{settings.API_V1_STR}/integration/connectors/{connector_id}/test",
        headers=headers
    )
    assert test_resp.status_code == 200
    assert test_resp.json()["success"] is True
    assert "SAP" in test_resp.json()["message"]
    
    # 4. Trigger Sync
    sync_resp = await async_client.post(
        f"{settings.API_V1_STR}/integration/connectors/{connector_id}/sync",
        headers=headers
    )
    assert sync_resp.status_code == 200
    assert sync_resp.json()["status"] == "SUCCESS"
    assert "1,245 Assets" in sync_resp.json()["records_processed"]
