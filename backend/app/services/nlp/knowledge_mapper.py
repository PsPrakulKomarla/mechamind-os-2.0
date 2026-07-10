import re
from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.machine import Machine
from app.models.entity import ExtractedEntity, KnowledgeMap
from app.repositories.entity import entity_repo

class KnowledgeMapper:
    """
    Responsible for linking unstructured ExtractedEntities back to structured Master DB rows
    (e.g., finding the physical Machine row for "Pump P-101").
    """
    
    async def run_mapping(self, db: AsyncSession, entity: ExtractedEntity) -> Optional[KnowledgeMap]:
        """
        Attempts to fuzzy match an extracted entity to a DB record.
        """
        # We only map machines in this prototype, but this scales to Parts/Components.
        if entity.entity_type.name != "MACHINE":
            return None
            
        # Example extracted value: "P-101"
        search_val = entity.entity_value
        if not search_val:
            return None
            
        # Clean the string for matching (strip dashes, spaces)
        clean_val = re.sub(r'[^A-Z0-9]', '', search_val.upper())
        
        # Pull all machines (In production, we filter by factory_id from the Document context)
        # For prototype simplicity we'll just scan machines
        query = select(Machine)
        result = await db.execute(query)
        machines = result.scalars().all()
        
        best_match = None
        highest_score = 0.0
        
        for m in machines:
            if not m.name and not m.tag_number:
                continue
                
            db_tag = re.sub(r'[^A-Z0-9]', '', str(m.tag_number).upper()) if m.tag_number else ""
            db_name = re.sub(r'[^A-Z0-9]', '', str(m.name).upper()) if m.name else ""
            
            # 1. Exact Tag Match (Score 1.0)
            if clean_val and clean_val == db_tag:
                highest_score = 1.0
                best_match = m
                break
                
            # 2. Fuzzy Name Match (e.g. Pump101 in string PumpP101)
            if clean_val in db_name or db_name in clean_val:
                score = 0.8
                if score > highest_score:
                    highest_score = score
                    best_match = m
                    
        if best_match and highest_score > 0.7:
            km = KnowledgeMap(
                extracted_entity_id=entity.id,
                target_table="machines",
                target_id=best_match.id,
                match_score=highest_score
            )
            await entity_repo.save_knowledge_map(db, km)
            return km
            
        return None

knowledge_mapper = KnowledgeMapper()
