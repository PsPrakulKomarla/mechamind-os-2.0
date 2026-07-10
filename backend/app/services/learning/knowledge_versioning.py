from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
import json

from app.models.learning import KnowledgeVersion, SolutionProposal
from app.models.knowledge import KnowledgeEmbedding
from app.core.embeddings import embedding_provider

class KnowledgeVersioningService:
    """
    Handles creating a new KnowledgeVersion audit trail and injecting the 
    new solution into the pgvector database to improve future RAG retrieval.
    """
    
    async def create_knowledge_version(
        self, db: AsyncSession, expert_id: UUID, proposal: SolutionProposal, reason: str
    ):
        # 1. Create the Audit Trail
        version = KnowledgeVersion(
            solution_proposal_id=proposal.id,
            changed_by=expert_id,
            reason=reason,
            new_knowledge_metadata={
                "problem": proposal.problem_description,
                "solution": proposal.suggested_solution
            }
        )
        db.add(version)
        
        # 2. Vectorize the new solution
        text_content = f"Problem: {proposal.problem_description}\nVerified Solution: {proposal.suggested_solution}"
        vector = embedding_provider.embed_text(text_content)
        
        # 3. Create a highly boosted Vector Embedding so this explicitly approved
        #    solution outranks standard manual PDFs during AI retrieval.
        emb = KnowledgeEmbedding(
            organization_id=proposal.organization_id,
            factory_id=proposal.factory_id,
            document_id=proposal.id, # We reuse document_id to store the proposal ID for tracking
            chunk_id=proposal.id,
            content=text_content,
            embedding_vector=vector,
            priority_boost=0.5, # Massive boost to ensure retrieval
            metadata_payload={"source": "expert_approved_solution"}
        )
        db.add(emb)
        
        await db.commit()

knowledge_versioning_service = KnowledgeVersioningService()
