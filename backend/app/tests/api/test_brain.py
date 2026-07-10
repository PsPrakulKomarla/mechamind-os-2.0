import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_brain_orchestration(async_client: AsyncClient):
    """
    Test the multi-agent orchestrator logic.
    """
    # 1. Register User
    u_data = {
        "email": f"brain_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Brain",
        "last_name": "User"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Ask a complex question to trigger multiple agents (RCA and Compliance)
    req_data = {
        "query": "Why did the boiler fail and are there any compliance risks associated with fixing it?"
    }
    
    resp = await async_client.post(f"{settings.API_V1_STR}/brain/orchestrate", json=req_data, headers=headers)
    assert resp.status_code == 200
    
    data = resp.json()
    assert "decision" in data
    assert "reasoning_summary" in data
    assert data["confidence_score"] > 0.5
    assert len(data["evidence_list"]) >= 2  # RCA evidence + Compliance evidence
    assert "RCA" in data["agents_invoked"]
    assert "COMPLIANCE" in data["agents_invoked"]
    
    # Store memory ID for verification
    conv_id = data["conversation_id"]
    assert conv_id is not None
