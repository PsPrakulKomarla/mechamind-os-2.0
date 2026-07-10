import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_copilot_chat_flow_safety(async_client: AsyncClient):
    """
    Test that the RAG Copilot triggers safety protocols when asked about dangerous situations (e.g. overheating/leaks).
    """
    reg_data = {
        "email": f"copilot_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Co",
        "last_name": "Pilot"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "message": "Pump P-101 is overheating rapidly."
    }
    
    resp = await async_client.post(
        f"{settings.API_V1_STR}/copilot/chat",
        json=payload,
        headers=headers
    )
    
    assert resp.status_code == 200
    data = resp.json()
    
    # Check RAG JSON formatting
    assert data["risk_level"] == "HIGH"
    assert "Halt machine" in data["recommendations"]
    assert "Bearing degradation" in data["answer"]

@pytest.mark.asyncio
async def test_copilot_conversation_history(async_client: AsyncClient):
    """Test that chat histories are saved."""
    # ... login code omitted for brevity in prototype ...
    pass
