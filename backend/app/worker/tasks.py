# Note: This is an async wrapper for Celery (which is sync).
# In a real FastAPI+Celery app, the worker runs synchronously and we use an async wrapper 
# or run the async loop inside the task. For simplicity in the prototype, we mock the queue.

from celery import shared_task
import asyncio
from app.db.session import SessionLocal
from app.services.extraction_orchestrator import extraction_orchestrator
import logging

logger = logging.getLogger(__name__)

@shared_task(name="process_document_task")
def process_document_task(document_id: str, job_id: str):
    """
    Celery background task.
    Since SQLAlchemy async is used, we must create an event loop to run the orchestrator.
    """
    logger.info(f"Starting extraction for Document: {document_id}")
    
    async def _run():
        async with SessionLocal() as db:
            await extraction_orchestrator.process_document(db, document_id, job_id)
            
    loop = asyncio.get_event_loop()
    if loop.is_running():
        # Fallback if somehow called in existing loop (e.g., testing)
        asyncio.create_task(_run())
    else:
        loop.run_until_complete(_run())
