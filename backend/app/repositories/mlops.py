from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import Optional, List

from app.models.mlops import AiModel, ModelVersion
from app.models.enums import ModelStatus

class MLOpsRepository:
    
    async def create_model(self, db: AsyncSession, model: AiModel) -> AiModel:
        db.add(model)
        await db.commit()
        await db.refresh(model)
        return model
        
    async def create_model_version(self, db: AsyncSession, version: ModelVersion) -> ModelVersion:
        db.add(version)
        await db.commit()
        await db.refresh(version)
        return version

    async def get_model_versions(self, db: AsyncSession, model_id: UUID) -> List[ModelVersion]:
        query = select(ModelVersion).where(ModelVersion.model_id == model_id).order_by(ModelVersion.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()
        
    async def get_model_version(self, db: AsyncSession, version_id: UUID) -> Optional[ModelVersion]:
        return await db.get(ModelVersion, version_id)

    async def update_model_version(self, db: AsyncSession, version: ModelVersion) -> ModelVersion:
        db.add(version)
        await db.commit()
        await db.refresh(version)
        return version
        
    async def get_production_version(self, db: AsyncSession, model_id: UUID) -> Optional[ModelVersion]:
        query = select(ModelVersion).where(
            ModelVersion.model_id == model_id,
            ModelVersion.status == ModelStatus.PRODUCTION
        )
        result = await db.execute(query)
        return result.scalars().first()

mlops_repository = MLOpsRepository()
