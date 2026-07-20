from fastapi import APIRouter, Depends, status, HTTPException, WebSocket, WebSocketDisconnect, Header
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List, Optional

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.iot import DeviceCreate, DeviceResponse, SensorReadingPayload, MachineAlertResponse
from app.services.iot.device_service import device_service
from app.services.iot.telemetry_service import telemetry_service
from app.repositories.iot import iot_repository
from app.services.iot.websocket_manager import websocket_manager
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["IoT & Real-Time Monitoring"])

def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Validate API key for edge gateway telemetry submissions."""
    from app.core.config import settings
    expected_key = getattr(settings, "IOT_API_KEY", None)
    if expected_key and x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

@router.post("/devices", response_model=DeviceResponse)
async def register_device(
    factory_id: UUID,
    request: DeviceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.update"], ScopeType.FACTORY, str(factory_id))
    return await device_service.register_device(db, current_user.organization_id, factory_id, request.model_dump())

@router.post("/telemetry")
async def send_telemetry(
    request: SensorReadingPayload,
    db: AsyncSession = Depends(get_db),
    x_api_key: Optional[str] = Header(None)
):
    verify_api_key(x_api_key)
    reading = await telemetry_service.ingest_telemetry(db, request.model_dump())
    return {"status": "success", "reading_id": reading.id}

@router.get("/factories/{factory_id}/alerts", response_model=List[MachineAlertResponse])
async def get_alerts(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
    return await iot_repository.get_alerts_for_factory(db, factory_id)

@router.websocket("/ws/factories/{factory_id}/live")
async def websocket_live_dashboard(websocket: WebSocket, factory_id: str, token: Optional[str] = None):
    """WebSocket endpoint with JWT authentication via query parameter."""
    if not token:
        await websocket.close(code=4001, reason="Missing authentication token")
        return
    try:
        from app.core.jwt import jwt_service
        await jwt_service.validate_token(token, expected_type="access")
    except Exception:
        await websocket.close(code=4003, reason="Invalid or expired token")
        return
    await websocket_manager.connect(websocket, factory_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, factory_id)
