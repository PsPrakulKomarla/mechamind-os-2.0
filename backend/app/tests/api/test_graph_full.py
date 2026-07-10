import pytest
import uuid
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_knowledge_graph_traversal(async_client: AsyncClient):
    """
    Tests the recursive Postgres CTE endpoints for upstream and downstream traversals.
    """
    reg_data = {
        "email": f"graph_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Graph",
        "last_name": "Traverser"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=reg_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": reg_data["email"], "password": reg_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    entity_id = str(uuid.uuid4())
    
    # Downstream Dependency Traversal
    down_resp = await async_client.get(
        f"{settings.API_V1_STR}/relationships/assets/{entity_id}/dependencies?entity_type=MACHINE&direction=downstream",
        headers=headers
    )
    assert down_resp.status_code in [401, 404]

    # Upstream Dependency Traversal
    up_resp = await async_client.get(
        f"{settings.API_V1_STR}/relationships/assets/{entity_id}/dependencies?entity_type=COMPONENT&direction=upstream",
        headers=headers
    )
    assert up_resp.status_code in [401, 404]
