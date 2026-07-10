from fastapi import APIRouter, Depends, status, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

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
    db: AsyncSession = Depends(get_db)
    # Auth is usually via API Key for Edge Gateways, bypassing User JWT
):
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
async def websocket_live_dashboard(websocket: WebSocket, factory_id: str):
    # In production, we extract JWT from query params or headers to authorize
    await websocket_manager.connect(websocket, factory_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Just keep connection alive
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, factory_id)
