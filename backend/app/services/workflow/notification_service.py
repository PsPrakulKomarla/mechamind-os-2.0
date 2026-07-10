import logging
from uuid import UUID

logger = logging.getLogger(__name__)

class NotificationService:
    """
    Abstracted trigger service for sending alerts.
    In production, this interfaces with SendGrid, Twilio, or Firebase Cloud Messaging.
    """
    
    async def send_notification(self, user_id: UUID, title: str, message: str, channels: list[str] = ["IN_APP"]):
        """
        Stub method.
        """
        if "EMAIL" in channels:
            logger.info(f"[STUB] Sending EMAIL to user {user_id}: {title} - {message}")
            
        if "SMS" in channels:
            logger.info(f"[STUB] Sending SMS to user {user_id}: {title} - {message}")
            
        if "IN_APP" in channels:
            logger.info(f"[STUB] Creating IN_APP notification for user {user_id}: {title}")
            # Here we would persist an InAppNotification row.

notification_service = NotificationService()
