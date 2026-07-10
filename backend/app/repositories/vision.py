from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.models.vision import MediaFile, VisionAnalysis, DetectedDefect

class VisionRepository:
    
    async def create_media_file(self, db: AsyncSession, media: MediaFile) -> MediaFile:
        db.add(media)
        await db.commit()
        await db.refresh(media)
        return media
        
    async def get_media_file(self, db: AsyncSession, media_id: UUID) -> MediaFile:
        return await db.get(MediaFile, media_id)
        
    async def save_analysis(self, db: AsyncSession, analysis: VisionAnalysis, defects: list[DetectedDefect]) -> VisionAnalysis:
        db.add(analysis)
        await db.flush() # Get ID
        
        for d in defects:
            d.analysis_id = analysis.id
            db.add(d)
            
        await db.commit()
        await db.refresh(analysis)
        return analysis

    async def get_vision_history_for_asset(self, db: AsyncSession, asset_id: UUID):
        query = select(VisionAnalysis).where(VisionAnalysis.asset_id == asset_id).order_by(VisionAnalysis.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

vision_repository = VisionRepository()
