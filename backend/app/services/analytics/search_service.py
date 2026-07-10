from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

class SearchService:
    """
    Global search service traversing Factories, Machines, Documents, and Users.
    """
    
    async def global_search(self, db: AsyncSession, org_id: UUID, query: str) -> dict:
        """
        Mock implementation. In production, this would use Elasticsearch or 
        PostgreSQL Full Text Search (tsvector).
        """
        # Mocking a hit on a machine
        if "pump" in query.lower() or "101" in query:
            return {
                "machines": [{"id": "uuid-mock", "name": "Pump P-101", "type": "Machine"}],
                "documents": [],
                "users": [],
                "factories": []
            }
            
        return {"machines": [], "documents": [], "users": [], "factories": []}

search_service = SearchService()
