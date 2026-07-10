from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.integration import SynchronizationLog, IntegrationConnector
from app.models.enums import SyncStatus
from app.repositories.integration import integration_repository
from app.services.integration.integration_hub import integration_hub

class SyncManager:
    """
    Orchestrates the synchronization jobs, triggering the Hub and logging the results.
    """
    
    async def run_synchronization(self, db: AsyncSession, connector_id: UUID) -> SynchronizationLog:
        connector = await integration_repository.get_connector(db, connector_id)
        if not connector:
            raise ValueError("Connector not found")
            
        plugin = integration_hub.get_plugin(connector.plugin_id)
        
        # In a real app, this might be wrapped in a Celery Task. We run it inline for architecture demo.
        try:
            result = await plugin.sync_data(connector.configuration_payload, connector.field_mapping_rules or {})
            
            log = SynchronizationLog(
                connector_id=connector_id,
                status=result["status"],
                records_processed=result.get("records_processed", "")
            )
            return await integration_repository.create_sync_log(db, log)
            
        except Exception as e:
            log = SynchronizationLog(
                connector_id=connector_id,
                status=SyncStatus.FAILED,
                error_message=str(e)
            )
            return await integration_repository.create_sync_log(db, log)

sync_manager = SyncManager()
