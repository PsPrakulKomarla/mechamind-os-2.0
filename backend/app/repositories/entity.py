from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.entity import ExtractedEntity, EntityRelationship, KnowledgeMap

class EntityRepository:
    
    async def save_entity(self, db: AsyncSession, entity: ExtractedEntity) -> ExtractedEntity:
        db.add(entity)
        await db.commit()
        await db.refresh(entity)
        return entity

    async def save_relationship(self, db: AsyncSession, rel: EntityRelationship) -> EntityRelationship:
        db.add(rel)
        await db.commit()
        await db.refresh(rel)
        return rel
        
    async def save_knowledge_map(self, db: AsyncSession, km: KnowledgeMap) -> KnowledgeMap:
        db.add(km)
        await db.commit()
        await db.refresh(km)
        return km

    async def get_document_entities(self, db: AsyncSession, document_id: UUID) -> List[ExtractedEntity]:
        query = select(ExtractedEntity).where(ExtractedEntity.document_id == document_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_entity_relationships(self, db: AsyncSession, entity_id: UUID) -> List[EntityRelationship]:
        query = select(EntityRelationship).where(
            (EntityRelationship.source_entity_id == entity_id) | 
            (EntityRelationship.target_entity_id == entity_id)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

entity_repo = EntityRepository()
