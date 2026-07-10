from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.mlops import AiModel, ModelVersion
from app.models.enums import ModelStatus
from app.schemas.mlops import AiModelCreate, ModelVersionCreate
from app.repositories.mlops import mlops_repository

class ModelRegistryService:
    
    async def register_model(self, db: AsyncSession, request: AiModelCreate) -> AiModel:
        model = AiModel(
            organization_id=request.organization_id,
            name=request.name,
            task_type=request.task_type
        )
        return await mlops_repository.create_model(db, model)
        
    async def register_model_version(self, db: AsyncSession, request: ModelVersionCreate) -> ModelVersion:
        version = ModelVersion(
            model_id=request.model_id,
            version_tag=request.version_tag,
            artifact_uri=request.artifact_uri,
            evaluation_metrics=request.evaluation_metrics
        )
        return await mlops_repository.create_model_version(db, version)
        
    async def promote_to_production(self, db: AsyncSession, model_id: UUID, version_id: UUID) -> ModelVersion:
        # 1. Demote current production version
        current_prod = await mlops_repository.get_production_version(db, model_id)
        if current_prod:
            current_prod.status = ModelStatus.ARCHIVED
            await mlops_repository.update_model_version(db, current_prod)
            
        # 2. Promote new version
        new_prod = await mlops_repository.get_model_version(db, version_id)
        if not new_prod:
            raise ValueError("Model version not found.")
            
        new_prod.status = ModelStatus.PRODUCTION
        return await mlops_repository.update_model_version(db, new_prod)

model_registry_service = ModelRegistryService()
