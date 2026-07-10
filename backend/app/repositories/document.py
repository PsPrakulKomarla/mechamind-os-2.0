from uuid import UUID
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.document import Document
from app.models.enums import DocumentType

class DocumentRepository:
    
    async def create(self, db: AsyncSession, **kwargs) -> Document:
        db_obj = Document(**kwargs)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: UUID) -> Optional[Document]:
        query = select(Document).where(
            Document.id == id,
            Document.is_active == True
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, organization_id: UUID, factory_id: Optional[UUID] = None, 
                        doc_type: Optional[DocumentType] = None, skip: int = 0, limit: int = 100) -> Tuple[List[Document], int]:
        
        query = select(Document).where(
            Document.organization_id == organization_id,
            Document.is_active == True
        )
        
        if factory_id:
            query = query.where(Document.factory_id == factory_id)
            
        if doc_type:
            query = query.where(Document.document_type == doc_type)
            
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.execute(count_query)
        total_count = total.scalar_one()
        
        # Fetch items
        query = query.order_by(desc(Document.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        
        return list(result.scalars().all()), total_count
        
    async def soft_delete(self, db: AsyncSession, id: UUID) -> bool:
        doc = await self.get(db, id)
        if doc:
            doc.is_active = False
            db.add(doc)
            await db.commit()
            return True
        return False

document_repo = DocumentRepository()
