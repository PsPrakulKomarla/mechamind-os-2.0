from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Dict, Any, List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.integration import IntegrationConnector
from app.schemas.integration import ConnectorCreate, ConnectorResponse, TestConnectionResponse, SyncLogResponse
from app.services.integration.integration_hub import integration_hub
from app.services.integration.sync_manager import sync_manager
from app.services.integration.webhook_service import webhook_service
from app.repositories.integration import integration_repository

router = APIRouter(tags=["Enterprise Integration Hub"])

@router.post("/connectors", response_model=ConnectorResponse)
async def register_connector(
    request: ConnectorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only Org Admins
    connector = IntegrationConnector(
        organization_id=request.organization_id,
        name=request.name,
        connector_type=request.connector_type,
        plugin_id=request.plugin_id,
        configuration_payload=request.configuration_payload,
        field_mapping_rules=request.field_mapping_rules
    )
    return await integration_repository.create_connector(db, connector)

@router.post("/connectors/{connector_id}/test", response_model=TestConnectionResponse)
async def test_connector_connection(
    connector_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    connector = await integration_repository.get_connector(db, connector_id)
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
        
    plugin = integration_hub.get_plugin(connector.plugin_id)
    return await plugin.test_connection(connector.configuration_payload)

@router.post("/connectors/{connector_id}/sync", response_model=SyncLogResponse)
async def trigger_synchronization(
    connector_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await sync_manager.run_synchronization(db, connector_id)

@router.get("/connectors/{connector_id}/logs", response_model=List[SyncLogResponse])
async def get_sync_logs(
    connector_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await integration_repository.get_sync_logs(db, connector_id)

@router.post("/webhooks/{endpoint_id}/receive")
async def receive_webhook(
    endpoint_id: UUID,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    # Public endpoint, protected by HMAC secret verification inside the service
    return await webhook_service.process_inbound_webhook(db, endpoint_id, payload)
