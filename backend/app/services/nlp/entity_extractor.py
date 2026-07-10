from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.nlp import nlp_provider
from app.models.extraction import ExtractedContent
from app.models.entity import ExtractedEntity, EntityRelationship
from app.repositories.entity import entity_repo
from app.services.nlp.knowledge_mapper import knowledge_mapper

class EntityExtractionService:
    
    async def extract_from_document(self, db: AsyncSession, document_id: UUID) -> List[ExtractedEntity]:
        """
        Pull all raw text chunks from Phase 10.2, run them through NLP, save entities and maps.
        """
        # 1. Fetch text
        query = select(ExtractedContent).where(ExtractedContent.document_id == document_id)
        result = await db.execute(query)
        chunks = result.scalars().all()
        
        all_saved_entities = []
        
        for chunk in chunks:
            # 2. Extract Entities via NLP
            raw_entities = nlp_provider.extract_entities(chunk.text_content)
            saved_chunk_entities = []
            
            for raw in raw_entities:
                entity = ExtractedEntity(
                    document_id=document_id,
                    entity_type=raw["type"],
                    entity_name=raw["name"],
                    entity_value=raw.get("value"),
                    confidence_score=raw["confidence"],
                    metadata_payload=raw.get("metadata", {})
                )
                saved = await entity_repo.save_entity(db, entity)
                saved_chunk_entities.append(saved)
                all_saved_entities.append(saved)
                
                # 3. Fuzzy map to structured DB
                await knowledge_mapper.run_mapping(db, saved)
                
            # 4. Extract Relationships (needs the raw index to map back to DB UUIDs)
            rels = nlp_provider.extract_relationships(raw_entities, chunk.text_content)
            for r in rels:
                source_db_id = saved_chunk_entities[r["source_index"]].id
                target_db_id = saved_chunk_entities[r["target_index"]].id
                
                db_rel = EntityRelationship(
                    source_entity_id=source_db_id,
                    target_entity_id=target_db_id,
                    relationship_type=r["type"],
                    confidence_score=r["confidence"]
                )
                await entity_repo.save_relationship(db, db_rel)
                
        return all_saved_entities

entity_extractor_svc = EntityExtractionService()
