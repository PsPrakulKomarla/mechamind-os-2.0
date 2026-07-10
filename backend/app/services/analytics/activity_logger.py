from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.models.analytics import UserActivityLog, FactoryTimelineEvent
from app.models.enums import ActivityType
from app.repositories.analytics import analytics_repository

class ActivityLogger:
    
    async def log_user_action(self, db: AsyncSession, user_id: UUID, org_id: UUID, activity: ActivityType, description: str, metadata: dict = None):
        log = UserActivityLog(
            user_id=user_id,
            organization_id=org_id,
            activity_type=activity,
            description=description,
            metadata_payload=metadata
        )
        return await analytics_repository.log_activity(db, log)
        
    async def log_factory_event(self, db: AsyncSession, factory_id: UUID, category: str, title: str, description: str, asset_id: UUID = None, severity: str = "INFO"):
        event = FactoryTimelineEvent(
            factory_id=factory_id,
            asset_id=asset_id,
            event_category=category,
            title=title,
            description=description,
            severity=severity
        )
        return await analytics_repository.log_factory_event(db, event)

activity_logger = ActivityLogger()
