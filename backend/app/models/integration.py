import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import ConnectorType, ConnectorStatus, SyncStatus

class IntegrationConnector(Base):
    __tablename__ = "integration_connectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    name = Column(String, nullable=False)
    connector_type = Column(Enum(ConnectorType), nullable=False)
    plugin_id = Column(String, nullable=False) # e.g., "sap_s4hana", "opcua_client"
    
    status = Column(Enum(ConnectorStatus), default=ConnectorStatus.INACTIVE)
    
    # Store credentials and hosts. In production, KMS handles this logic.
    configuration_payload = Column(JSONB, nullable=False)
    field_mapping_rules = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SynchronizationJob(Base):
    __tablename__ = "synchronization_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    connector_id = Column(UUID(as_uuid=True), ForeignKey("integration_connectors.id"), nullable=False)
    
    schedule_cron = Column(String, nullable=True) # e.g., "0 0 * * *"
    is_active = Column(Boolean, default=True)
    
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    last_status = Column(Enum(SyncStatus), nullable=True)

class SynchronizationLog(Base):
    __tablename__ = "synchronization_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    connector_id = Column(UUID(as_uuid=True), ForeignKey("integration_connectors.id"), nullable=False)
    
    status = Column(Enum(SyncStatus), nullable=False)
    records_processed = Column(String, nullable=True) # E.g. "Fetched 450 assets"
    error_message = Column(String, nullable=True)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

class WebhookEndpoint(Base):
    __tablename__ = "webhook_endpoints"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    name = Column(String, nullable=False)
    secret_key = Column(String, nullable=False) # Used for HMAC signature verification
    target_action = Column(String, nullable=False) # E.g., "TRIGGER_ALERT", "UPDATE_TELEMETRY"
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
