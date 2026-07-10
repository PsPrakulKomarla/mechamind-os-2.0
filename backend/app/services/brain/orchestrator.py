import asyncio
from typing import List, Dict, Any
from uuid import UUID
import uuid

from app.schemas.brain import OrchestrationRequest, OrchestrationResponse, EvidenceItem
from app.models.enums import IntentType, AgentType
from app.services.brain.agent_interface import IAgent
from app.services.brain.agents.maintenance_agent import MaintenanceAgent
from app.services.brain.agents.rca_agent import RCAAgent
from app.services.brain.agents.compliance_agent import ComplianceAgent

class AIOrchestrator:
    """
    The central Brain of MechaMind OS. Routes queries to multiple specialized AI agents,
    runs them in parallel, aggregates findings, and resolves conflicts.
    """
    def __init__(self):
        # Register available agents
        self.registry: List[IAgent] = [
            MaintenanceAgent(),
            RCAAgent(),
            ComplianceAgent()
        ]
        
    def _detect_intent(self, query: str) -> IntentType:
        """
        Task Planner: Very naive intent detection for structural representation.
        In production, this would be a fast classifier model.
        """
        query_lower = query.lower()
        if "why" in query_lower or "fail" in query_lower:
            return IntentType.ROOT_CAUSE
        if "compliance" in query_lower or "risk" in query_lower:
            return IntentType.RISK_ASSESSMENT
        return IntentType.GENERAL_QUERY

    async def orchestrate(self, request: OrchestrationRequest) -> OrchestrationResponse:
        intent = self._detect_intent(request.query)
        
        # 1. Identify required agents
        active_agents = []
        for agent in self.registry:
            if await agent.can_handle(intent, request.query):
                active_agents.append(agent)
                
        # Fallback to general maintenance if none picked up
        if not active_agents:
            active_agents.append(self.registry[0]) 
            
        # 2. Execute agents in parallel
        context = request.context_filters or {}
        tasks = [agent.execute(request.query, context) for agent in active_agents]
        contributions = await asyncio.gather(*tasks)
        
        # 3. Aggregate Evidence & Resolve Conflicts
        all_evidence = []
        reasoning_parts = []
        total_confidence = 0.0
        
        for c in contributions:
            all_evidence.extend(c.evidence)
            reasoning_parts.append(f"[{c.agent_type.value}] {c.findings}")
            total_confidence += c.confidence_score
            
        avg_confidence = total_confidence / len(contributions) if contributions else 0.0
        
        # 4. Generate Recommendation (Decision Engine)
        # Mock logic combining the findings
        decision = "Immediate action required based on multi-agent consensus."
        reasoning_summary = " ".join(reasoning_parts)
        
        return OrchestrationResponse(
            decision=decision,
            reasoning_summary=reasoning_summary,
            confidence_score=avg_confidence,
            evidence_list=all_evidence,
            agents_invoked=[c.agent_type for c in contributions],
            conversation_id=request.conversation_id or uuid.uuid4()
        )

ai_orchestrator = AIOrchestrator()
