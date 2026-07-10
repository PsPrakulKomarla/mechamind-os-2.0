from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.llm import llm_provider
from app.services.copilot.context_builder import context_builder

class SafetyAnalyzer:
    """
    AI Agent focused strictly on identifying physical safety hazards from Incident Reports and RAG Context.
    """
    
    async def get_safety_risks(self, db: AsyncSession, organization_id: UUID, factory_id: UUID) -> list:
        context_chunks = await context_builder.build_context(db, organization_id, factory_id, "Find safety hazards, near misses, and incident reports")
        
        system_prompt = "Perform a safety analysis. Identify safety hazards and missing controls. Return structured JSON safety payload."
        
        llm_response = await llm_provider.generate_response(system_prompt, "Find safety risks")
        
        return llm_response.get("safety_payload", [])

safety_analyzer = SafetyAnalyzer()
