from typing import Dict, Any, List
from app.services.brain.agent_interface import IAgent
from app.schemas.brain import AgentContribution, EvidenceItem
from app.models.enums import AgentType, IntentType

class ComplianceAgent(IAgent):
    
    @property
    def agent_type(self) -> AgentType:
        return AgentType.COMPLIANCE
        
    @property
    def capabilities(self) -> List[str]:
        return ["Check OSHA regulations", "Verify EPA emission limits", "Ensure audit compliance"]
        
    async def can_handle(self, intent: IntentType, query: str) -> bool:
        keywords = ["compliance", "osha", "regulation", "legal", "audit", "risk"]
        return intent == IntentType.RISK_ASSESSMENT or any(kw in query.lower() for kw in keywords)
        
    async def execute(self, query: str, context: Dict[str, Any]) -> AgentContribution:
        return AgentContribution(
            agent_type=self.agent_type,
            confidence_score=0.98,
            findings="Any modification to the pressure vessel requires re-certification under ASME Section VIII.",
            evidence=[
                EvidenceItem(source_type="document", source_id="ASME-VIII-Div1", description="Boiler and Pressure Vessel Code")
            ]
        )
