from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request
import logging

from app.models.security import SecurityEventLog
from app.schemas.security import SecurityEventLogCreate
from app.repositories.security import security_repository

logger = logging.getLogger(__name__)

class AuditService:
    """
    Centralized service for writing SOC/Audit logs to the database.
    """
    
    async def log_security_event(self, db: AsyncSession, event: SecurityEventLogCreate) -> SecurityEventLog:
        """
        Records a high-severity security event (e.g. prompt injection, unauthorized access).
        """
        logger.warning(f"Security Event Logged: {event.event_type} | User: {event.user_id} | IP: {event.ip_address}")
        
        log_entry = SecurityEventLog(
            organization_id=event.organization_id,
            user_id=event.user_id,
            event_type=event.event_type,
            ip_address=event.ip_address,
            user_agent=event.user_agent,
            payload=event.payload
        )
        return await security_repository.create_event_log(db, log_entry)
        
    def extract_request_meta(self, request: Request) -> tuple[str, str]:
        """
        Helper to pull IP and User-Agent from a FastAPI request.
        """
        ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
        user_agent = request.headers.get("User-Agent", "unknown")
        return ip, user_agent

audit_service = AuditService()
