from abc import ABC, abstractmethod
from typing import Dict, Any

class IConnector(ABC):
    """
    Abstract Base Class that all Integration Plugins must implement.
    Ensures a standardized interface so the Hub can swap them interchangeably.
    """
    
    @abstractmethod
    async def test_connection(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tests credentials and reachability. Returns {success: bool, message: str}.
        """
        pass

    @abstractmethod
    async def sync_data(self, config: Dict[str, Any], mapping_rules: Dict[str, Any]) -> Dict[str, Any]:
        """
        Pulls or pushes data based on the plugin. Returns {records_processed: str, status: SyncStatus}.
        """
        pass
