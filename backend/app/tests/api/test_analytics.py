import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_analytics_dashboards(async_client: AsyncClient):
    """
    Test pulling the Startup Dashboard, Executive Dashboard, and generating a Report.
    """
    # 1. Register User
    u_data = {
        "email": f"exec_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Chief",
        "last_name": "Executive"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # We must assign OrganizationAdmin role to hit Executive dashboard. 
    # For testing, we mock that the API permits it or we assign it. 
    # Our mocked API currently just accepts the token and simulates the org check successfully since the user owns the org they just created.
    
    # 2. Startup Dashboard
    startup_resp = await async_client.get(
        f"{settings.API_V1_STR}/analytics/dashboards/startup",
        headers=headers
    )
    assert startup_resp.status_code == 200
    assert "critical_unresolved_issues" in startup_resp.json()
    
    # 3. Executive Dashboard
    exec_resp = await async_client.get(
        f"{settings.API_V1_STR}/analytics/dashboards/executive",
        headers=headers
    )
    assert exec_resp.status_code == 200
    assert exec_resp.json()["global_health_score"] > 0
    
    # 4. Global Search
    search_resp = await async_client.get(
        f"{settings.API_V1_STR}/analytics/search?q=pump",
        headers=headers
    )
    assert search_resp.status_code == 200
    assert len(search_resp.json()["machines"]) > 0
    
    # 5. Export Report
    export_resp = await async_client.post(
        f"{settings.API_V1_STR}/analytics/reports/export",
        json={"report_type": "MONTHLY", "export_format": "PDF"},
        headers=headers
    )
    assert export_resp.status_code == 200
    assert export_resp.json()["status"] == "PROCESSING"
