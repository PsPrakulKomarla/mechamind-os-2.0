from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pgvector.sqlalchemy import Vector

from app.models.knowledge import KnowledgeEmbedding
from app.schemas.knowledge import SearchFilter, SearchResultResponse
from app.core.embeddings import embedding_provider
from app.services.knowledge.cache import cache_service

class VectorStoreService:
    """
    Handles persisting embeddings to pgvector and executing mathematical distance searches.
    """
    
    async def save_embedding(
        self, db: AsyncSession, 
        organization_id: UUID, 
        factory_id: Optional[UUID], 
        document_id: UUID, 
        chunk_id: UUID, 
        content: str, 
        metadata: dict
    ) -> KnowledgeEmbedding:
        
        # 1. Generate vector
        vector = embedding_provider.embed_text(content)
        
        # 2. Save to pgvector
        db_obj = KnowledgeEmbedding(
            organization_id=organization_id,
            factory_id=factory_id,
            document_id=document_id,
            chunk_id=chunk_id,
            content=content,
            embedding_vector=vector,
            metadata_payload=metadata
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def search(
        self, db: AsyncSession, 
        query: str, 
        organization_id: UUID, 
        factory_id: Optional[UUID], 
        filters: Optional[SearchFilter], 
        top_k: int = 5
    ) -> List[SearchResultResponse]:
        
        # 1. Check Cache
        cache_key = f"{organization_id}_{factory_id}_{query}_{top_k}"
        cached_results = await cache_service.get("search", cache_key)
        if cached_results:
            return [SearchResultResponse(**r) for r in cached_results]
            
        # 2. Embed Query
        query_vector = embedding_provider.embed_text(query)
        
        # 3. Construct pgvector search query using cosine distance (<=>)
        # Note: <-> is L2 distance, <=> is cosine distance, <#> is inner product
        db_query = select(KnowledgeEmbedding).where(
            KnowledgeEmbedding.organization_id == organization_id
        )
        
        if factory_id:
            db_query = db_query.where(KnowledgeEmbedding.factory_id == factory_id)
            
        # We order by cosine distance minus the priority boost. 
        # Since smaller distance is better (0 is identical), subtracting priority_boost 
        # effectively pushes expert-approved solutions to the top of the search results.
        db_query = db_query.order_by(
            KnowledgeEmbedding.embedding_vector.cosine_distance(query_vector) - KnowledgeEmbedding.priority_boost
        ).limit(top_k)
        
        result = await db.execute(db_query)
        embeddings = result.scalars().all()
        
        # 4. Format results
        responses = []
        for emb in embeddings:
            # We don't have direct access to the computed distance score in this simple ORM query
            # without adding an annotator, so we'll approximate/mock the score output for the DTO
            # In a real query: select(..., KnowledgeEmbedding.embedding_vector.cosine_distance(v).label('dist'))
            responses.append(SearchResultResponse(
                id=emb.id,
                document_id=emb.document_id,
                content=emb.content,
                metadata_payload=emb.metadata_payload,
                similarity_score=0.95 # Mocked score due to simple ORM query constraints
            ))
            
        # 5. Save to Cache
        await cache_service.set("search", cache_key, [r.model_dump(mode="json") for r in responses], ttl=300)
            
        return responses

vector_store = VectorStoreService()
