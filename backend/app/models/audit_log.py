from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from typing import Dict, Any, Optional
import uuid

from app.db.base_class import BaseModel
from app.models.enums import AuditAction, EntityType

class AuditLog(BaseModel):
    __tablename__ = "audit_logs"

    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), index=True, nullable=True)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    action: Mapped[AuditAction] = mapped_column(Enum(AuditAction), index=True)
    entity_type: Mapped[EntityType] = mapped_column(Enum(EntityType), index=True)
    entity_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), index=True, nullable=True)
    changes: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
