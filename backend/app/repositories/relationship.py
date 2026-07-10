from uuid import UUID
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.models.relationship import AssetRelationship
from app.schemas.relationship import RelationshipCreate
from app.models.enums import RelationshipType

class RelationshipRepository:
    async def create(self, db: AsyncSession, *, obj_in: RelationshipCreate, user_id: UUID) -> AssetRelationship:
        db_obj = AssetRelationship(
            **obj_in.model_dump(),
            created_by_id=user_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: UUID) -> Optional[AssetRelationship]:
        query = select(AssetRelationship).where(
            AssetRelationship.id == id,
            AssetRelationship.is_active == True
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_neighbors(self, db: AsyncSession, entity_id: UUID) -> List[AssetRelationship]:
        query = select(AssetRelationship).where(
            (AssetRelationship.source_entity_id == entity_id) | (AssetRelationship.target_entity_id == entity_id),
            AssetRelationship.is_active == True
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def check_circular_dependency(self, db: AsyncSession, source_id: UUID, target_id: UUID) -> bool:
        """
        Check if traversing downstream from `target_id` eventually leads back to `source_id`.
        We use a raw SQL Recursive CTE for performance.
        """
        query = text("""
            WITH RECURSIVE graph AS (
                SELECT target_entity_id 
                FROM asset_relationships 
                WHERE source_entity_id = :start_id AND is_active = true
                
                UNION
                
                SELECT ar.target_entity_id 
                FROM asset_relationships ar
                INNER JOIN graph g ON ar.source_entity_id = g.target_entity_id
                WHERE ar.is_active = true
            )
            SELECT EXISTS (SELECT 1 FROM graph WHERE target_entity_id = :target_id);
        """)
        result = await db.execute(query, {"start_id": target_id, "target_id": source_id})
        return result.scalar()

    async def traverse_dependencies(self, db: AsyncSession, start_id: UUID, direction: str = "downstream") -> List[Dict[str, Any]]:
        """
        Traverse the graph infinitely deep using PostgreSQL Recursive CTE.
        Returns flattened tree edges with depth and path calculation.
        """
        if direction == "downstream":
            initial_join = "source_entity_id = :start_id"
            recurse_join = "ar.source_entity_id = g.target_entity_id"
        else: # upstream
            initial_join = "target_entity_id = :start_id"
            recurse_join = "ar.target_entity_id = g.source_entity_id"
            
        # We project the target or source depending on direction
        # Path array prevents infinite loops natively
        query_str = f"""
            WITH RECURSIVE graph AS (
                -- Base Case
                SELECT 
                    id,
                    source_entity_id,
                    target_entity_id,
                    target_entity_type,
                    source_entity_type,
                    relationship_type,
                    1 as depth,
                    ARRAY[id] as path
                FROM asset_relationships 
                WHERE {initial_join} AND is_active = true
                
                UNION
                
                -- Recursive Step
                SELECT 
                    ar.id,
                    ar.source_entity_id,
                    ar.target_entity_id,
                    ar.target_entity_type,
                    ar.source_entity_type,
                    ar.relationship_type,
                    g.depth + 1,
                    g.path || ar.id
                FROM asset_relationships ar
                INNER JOIN graph g ON {recurse_join}
                WHERE ar.is_active = true 
                AND NOT (ar.id = ANY(g.path)) -- Prevent cycles if any exist
            )
            SELECT * FROM graph ORDER BY depth ASC;
        """
        query = text(query_str)
        result = await db.execute(query, {"start_id": start_id})
        
        # Format output
        rows = []
        for r in result.mappings():
            # For downstream, the 'child' is the target. For upstream, the 'parent' is the source.
            entity_id = r["target_entity_id"] if direction == "downstream" else r["source_entity_id"]
            entity_type = r["target_entity_type"] if direction == "downstream" else r["source_entity_type"]
            
            rows.append({
                "entity_id": entity_id,
                "entity_type": entity_type,
                "relationship_type": r["relationship_type"],
                "depth": r["depth"],
                "path": r["path"]
            })
        return rows

    async def soft_delete(self, db: AsyncSession, id: UUID) -> None:
        db_obj = await self.get(db, id)
        if db_obj:
            db_obj.is_active = False
            db.add(db_obj)
            await db.commit()

relationship_repo = RelationshipRepository()
