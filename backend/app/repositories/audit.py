from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.audit_log import AuditLog
from app.models.enums import AuditAction, EntityType
from app.models.login_history import LoginHistory


class AuditRepository:
    async def log_action(
        self, db: AsyncSession, *, 
        organization_id: Optional[UUID] = None,
        user_id: Optional[UUID] = None,
        action: AuditAction,
        entity_type: EntityType,
        entity_id: Optional[UUID] = None,
        changes: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """Add an audit log entry. Caller is responsible for committing."""
        audit = AuditLog(
            organization_id=organization_id,
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            changes=changes,
            ip_address=ip_address
        )
        db.add(audit)
        return audit

    async def log_login(
        self, db: AsyncSession, *, 
        user_id: Optional[UUID] = None, 
        success: bool, 
        ip_address: Optional[str] = None, 
        user_agent: Optional[str] = None,
        failure_reason: Optional[str] = None
    ) -> LoginHistory:
        """Add a login history entry. Caller is responsible for committing."""
        history = LoginHistory(
            user_id=user_id,
            success=success,
            ip_address=ip_address,
            user_agent=user_agent,
            failure_reason=failure_reason
        )
        db.add(history)
        return history


audit_repo = AuditRepository()
