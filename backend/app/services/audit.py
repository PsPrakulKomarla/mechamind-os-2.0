"""Application audit service with a stable call signature for domain services."""

from typing import Any, Dict, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import AuditAction, EntityType
from app.repositories.audit import audit_repo


class AuditService:
    """Translate domain audit calls to the central audit repository."""

    async def log_action(
        self,
        db: AsyncSession,
        user_id: Optional[UUID],
        action: AuditAction,
        entity_type: EntityType,
        entity_id: Optional[UUID] = None,
        details: Optional[Dict[str, Any]] = None,
        *,
        organization_id: Optional[UUID] = None,
        ip_address: Optional[str] = None,
        changes: Optional[Dict[str, Any]] = None,
    ):
        return await audit_repo.log_action(
            db,
            organization_id=organization_id,
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            changes=changes if changes is not None else details,
            ip_address=ip_address,
        )


audit_service = AuditService()
