from typing import Dict, Any, List
from app.services.brain.agent_interface import IAgent
from app.schemas.brain import AgentContribution, EvidenceItem
from app.models.enums import AgentType, IntentType

class MaintenanceAgent(IAgent):
    
    @property
    def agent_type(self) -> AgentType:
        return AgentType.MAINTENANCE
        
    @property
    def capabilities(self) -> List[str]:
        return ["Fetch work order history", "Analyze maintenance schedules", "Check technician availability"]
        
    async def can_handle(self, intent: IntentType, query: str) -> bool:
        return intent in [IntentType.MAINTENANCE_PLANNING, IntentType.GENERAL_QUERY] or "maintenance" in query.lower()
        
    async def execute(self, query: str, context: Dict[str, Any]) -> AgentContribution:
        # Stub: In a real scenario, this queries the MaintenanceService/Vector DB
        return AgentContribution(
            agent_type=self.agent_type,
            confidence_score=0.92,
            findings="The asset requires a Level 2 PM inspection based on meter readings.",
            evidence=[
                EvidenceItem(source_type="database", source_id="WO-1029", description="Last maintenance was 6 months ago.")
            ]
        )
