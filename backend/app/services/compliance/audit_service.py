from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.llm import llm_provider
from app.services.copilot.context_builder import context_builder

class AuditService:
    """
    Generates Audit Packages summarizing compliance readiness.
    """
    
    async def generate_audit_package(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, regulation_code: str) -> dict:
        
        context_chunks = await context_builder.build_context(db, organization_id, factory_id, f"Audit package for {regulation_code}")
        
        system_prompt = f"Generate an Audit Package for {regulation_code}. Return structured JSON."
        
        llm_response = await llm_provider.generate_response(system_prompt, f"Generate audit package for {regulation_code}")
        
        return llm_response.get("audit_payload", {})

audit_service = AuditService()
