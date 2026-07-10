from typing import Dict, Any, List
from app.services.brain.agent_interface import IAgent
from app.schemas.brain import AgentContribution, EvidenceItem
from app.models.enums import AgentType, IntentType

class RCAAgent(IAgent):
    
    @property
    def agent_type(self) -> AgentType:
        return AgentType.RCA
        
    @property
    def capabilities(self) -> List[str]:
        return ["Diagnose failures", "Analyze telemetry anomalies", "Suggest root causes"]
        
    async def can_handle(self, intent: IntentType, query: str) -> bool:
        return intent == IntentType.ROOT_CAUSE or "fail" in query.lower() or "why" in query.lower()
        
    async def execute(self, query: str, context: Dict[str, Any]) -> AgentContribution:
        return AgentContribution(
            agent_type=self.agent_type,
            confidence_score=0.85,
            findings="Vibration anomalies detected in bearing housing suggest imminent failure due to lack of lubrication.",
            evidence=[
                EvidenceItem(source_type="sensor", source_id="VIB-01", description="High frequency vibration spike at 14:00")
            ]
        )
