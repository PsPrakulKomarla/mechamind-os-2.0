from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.schemas.brain import AgentContribution
from app.models.enums import AgentType, IntentType

class IAgent(ABC):
    """
    The base interface for all specialized AI agents in the MechaMind Brain.
    """
    
    @property
    @abstractmethod
    def agent_type(self) -> AgentType:
        pass
        
    @property
    @abstractmethod
    def capabilities(self) -> List[str]:
        """Description of what this agent can do."""
        pass
        
    @abstractmethod
    async def can_handle(self, intent: IntentType, query: str) -> bool:
        """
        Returns True if this agent believes it has relevant information for the query.
        """
        pass
        
    @abstractmethod
    async def execute(self, query: str, context: Dict[str, Any]) -> AgentContribution:
        """
        Executes the specialized task. Returns an AgentContribution with findings and evidence.
        """
        pass
