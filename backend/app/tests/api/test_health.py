import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    response = await async_client.get(f"{settings.API_V1_STR}/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["message"] == "Operation completed successfully"
    assert data["data"]["status"] == "healthy"
    assert data["data"]["database"] == "ok"
    assert data["data"]["redis"] == "ok"
