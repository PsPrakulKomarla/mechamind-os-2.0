from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from uuid import UUID

from app.services.knowledge.vector_store import vector_store
from app.schemas.knowledge import SearchFilter

class ContextBuilder:
    """
    Constructs the optimized context window for the LLM by combining:
    1. Semantic search results from pgvector
    2. Explicit filters
    """
    
    async def build_context(
        self, 
        db: AsyncSession, 
        query: str, 
        organization_id: UUID, 
        factory_id: Optional[UUID],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        
        # 1. Retrieve raw vector chunks
        search_results = await vector_store.search(
            db=db,
            query=query,
            organization_id=organization_id,
            factory_id=factory_id,
            filters=None,
            top_k=top_k
        )
        
        # 2. Format for LLM consumption
        context = []
        for res in search_results:
            context.append({
                "content": res.content,
                "metadata": res.metadata_payload,
                "relevance": res.similarity_score
            })
            
        # In a full production scenario, we would also query the KnowledgeMap 
        # and inject the Machine's live sensor data or maintenance history here.
        return context

context_builder = ContextBuilder()
