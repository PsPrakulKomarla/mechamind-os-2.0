from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.llm import llm_provider
from app.services.copilot.context_builder import context_builder
from app.repositories.maintenance import maintenance_repository

class RcaEngine:
    """
    Root Cause Analysis AI Agent.
    Orchestrates Vector search, historical maintenance data, and LLM reasoning.
    """
    
    async def generate_rca(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, machine_id: UUID, issue_description: str) -> dict:
        
        # 1. Fetch RAG Context (Manuals, Approved Solutions) via Vector DB
        context_chunks = await context_builder.build_context(db, organization_id, factory_id, issue_description)
        context_text = "\n".join(context_chunks)
        
        # 2. Fetch Historical Context
        history = await maintenance_repository.get_failures_by_machine(db, machine_id, limit=3)
        history_text = "\n".join([f"- Past Failure: {h.description} (Resolved: {h.resolution})" for h in history])
        
        # 3. Construct RCA System Prompt
        system_prompt = f"""
        You are an elite Industrial Root Cause Analysis Agent.
        Analyze the failure based on the provided technical manuals and past failures.
        Return your answer as structured JSON matching the RCA schema.
        
        KNOWLEDGE BASE:
        {context_text}
        
        MACHINE HISTORY:
        {history_text}
        """
        
        # 4. Invoke LLM
        # The MockLlmProvider is programmed to intercept 'root cause analysis' and return the `rca_payload` dict.
        llm_response = await llm_provider.generate_response(system_prompt, issue_description)
        
        return llm_response.get("rca_payload", {})

rca_engine = RcaEngine()
