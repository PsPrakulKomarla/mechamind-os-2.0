import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_workflow_lifecycle(async_client: AsyncClient):
    """
    Test creating a work order, AI recommendations, and requesting approval.
    """
    # 1. Register User (Manager)
    u_data = {
        "email": f"manager_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Work",
        "last_name": "Manager"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    org_id = login_resp.json()["data"]["user"]["organization_id"]
    manager_id = login_resp.json()["data"]["user"]["id"]
    
    # 2. Create Factory
    factory_resp = await async_client.post(
        f"{settings.API_V1_STR}/factories",
        json={"name": "Workflow Plant", "location": "Ohio"},
        headers=headers
    )
    factory_id = factory_resp.json()["id"]
    
    # 3. AI Recommend Technician
    ai_resp = await async_client.post(
        f"{settings.API_V1_STR}/workflow/work-orders/ai-recommend?machine_id={uuid.uuid4()}&issue_description=High vibration in pump bearing",
        headers=headers
    )
    assert ai_resp.status_code == 200
    assert "vibration" in ai_resp.json()["reasoning"].lower()
    
    # 4. Create Work Order
    wo_data = {
        "organization_id": org_id,
        "factory_id": factory_id,
        "title": "Replace Pump Bearing",
        "description": "Vibration exceeds limits. RUL is 60 hours.",
        "priority": "HIGH",
        "tasks": [{"title": "Lockout Tagout"}, {"title": "Replace Bearing"}]
    }
    
    wo_resp = await async_client.post(
        f"{settings.API_V1_STR}/workflow/work-orders",
        json=wo_data,
        headers=headers
    )
    assert wo_resp.status_code == 200
    wo_id = wo_resp.json()["id"]
    assert len(wo_resp.json()["tasks"]) == 2
    
    # 5. Request Approval
    appr_resp = await async_client.post(
        f"{settings.API_V1_STR}/workflow/work-orders/{wo_id}/approvals",
        json={"approver_id": manager_id, "step_name": "Manager Sign-off"},
        headers=headers
    )
    assert appr_resp.status_code == 200
    assert "approval_id" in appr_resp.json()
