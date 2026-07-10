from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.models.prediction import FailurePrediction
from app.models.machine import Machine

class PredictionRepository:
    
    async def get_machine(self, db: AsyncSession, machine_id: UUID) -> Machine:
        return await db.get(Machine, machine_id)
        
    async def save_prediction(self, db: AsyncSession, prediction: FailurePrediction) -> FailurePrediction:
        db.add(prediction)
        await db.commit()
        await db.refresh(prediction)
        return prediction
        
    async def get_active_predictions(self, db: AsyncSession, machine_id: UUID) -> list[FailurePrediction]:
        # Simple query for active predictions (e.g. predicted_time > now)
        # Mocking generic fetch for demo
        query = select(FailurePrediction).where(FailurePrediction.asset_id == machine_id).order_by(FailurePrediction.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

prediction_repository = PredictionRepository()
