import pytest
import uuid
import io
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_vision_pipeline(async_client: AsyncClient):
    """
    Test uploading an image and triggering the Vision Analyzer.
    """
    # 1. Register User
    u_data = {
        "email": f"inspector_{uuid.uuid4()}@mechamind.local",
        "password": "StrongPassword123!",
        "first_name": "Vision",
        "last_name": "Inspector"
    }
    await async_client.post(f"{settings.API_V1_STR}/auth/register", json=u_data)
    login_resp = await async_client.post(f"{settings.API_V1_STR}/auth/login", json={"email": u_data["email"], "password": u_data["password"]})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    factory_id = str(uuid.uuid4())
    
    # 2. Upload Mock Image
    mock_file = io.BytesIO(b"mock_image_data_representing_a_jpeg")
    mock_file.name = "pump_leak.jpg"
    
    files = {"file": ("pump_leak.jpg", mock_file, "image/jpeg")}
    
    upload_resp = await async_client.post(
        f"{settings.API_V1_STR}/vision/upload-image?factory_id={factory_id}",
        headers=headers,
        files=files
    )
    assert upload_resp.status_code == 200
    media_data = upload_resp.json()
    assert media_data["file_type"] == "IMAGE"
    media_id = media_data["id"]
    
    # 3. Analyze Media
    analyze_resp = await async_client.post(
        f"{settings.API_V1_STR}/vision/{media_id}/analyze",
        headers=headers
    )
    assert analyze_resp.status_code == 200
    analysis_data = analyze_resp.json()
    
    # Assert CV simulated properly
    assert analysis_data["severity"] == "HIGH"
    assert len(analysis_data["defects"]) > 0
    assert analysis_data["defects"][0]["defect_type"] == "LEAKAGE"
