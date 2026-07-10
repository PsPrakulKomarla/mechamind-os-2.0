from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.repositories.prediction import prediction_repository
from app.services.prediction.rul_service import rul_service
from app.schemas.prediction import DigitalTwinResponse, RulResponse, FailurePredictionResponse

class DigitalTwinService:
    """
    Aggregates data dynamically across all modules to present a unified state.
    """
    
    async def get_digital_twin_state(self, db: AsyncSession, machine_id: UUID) -> dict:
        # 1. Fetch Core Machine Data
        machine = await prediction_repository.get_machine(db, machine_id)
        if not machine:
            raise ValueError("Machine not found")
            
        # 2. Fetch Active Predictions
        db_preds = await prediction_repository.get_active_predictions(db, machine_id)
        
        # 3. Fetch RUL
        rul_data = await rul_service.estimate_rul(machine_id)
        
        # 4. In a production system, we would query:
        # - IoT Service for latest_alerts and active_sensors
        # - Maintenance Service for recent_maintenance
        # - Risk Engine for health_score
        
        # We construct the dynamic response
        health_score = 45.0 if rul_data["remaining_hours"] < 100 else 98.0
        
        twin_data = {
            "machine_id": machine.id,
            "name": machine.name,
            "status": "AT_RISK" if health_score < 50 else "HEALTHY",
            "health_score": health_score,
            "active_sensors": 4, # Mocked
            "latest_alerts": [{"alert": "High Vibration Detected", "severity": "CRITICAL"}],
            "active_predictions": [FailurePredictionResponse.model_validate(p) for p in db_preds],
            "recent_maintenance": [],
            "rul_estimate": RulResponse(**rul_data)
        }
        
        return twin_data

digital_twin_service = DigitalTwinService()
