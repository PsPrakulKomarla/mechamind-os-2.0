from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.prediction import FailurePrediction
from app.models.enums import FailurePredictionType, FindingSeverity, ActionRecommendation
from app.repositories.prediction import prediction_repository
from app.services.prediction.rul_service import rul_service

class FailurePredictionEngine:
    """
    AI Abstraction Layer for predicting failures and optimizing costs.
    """
    
    async def predict_failure(self, db: AsyncSession, machine_id: UUID) -> FailurePrediction:
        # 1. Fetch RUL and Trends
        rul_data = await rul_service.estimate_rul(machine_id)
        
        # 2. In a real system, we would query the RCA engine, past maintenance logs, and IoT alerts.
        # Here we mock the decision logic based on the RUL data.
        
        failure_type = FailurePredictionType.BEARING
        risk_level = FindingSeverity.CRITICAL if rul_data["remaining_hours"] < 100 else FindingSeverity.MINOR
        
        # 3. Cost Optimization Logic (Mocked)
        # If we fix it now, it costs ₹500. If it fails, downtime costs ₹15,000.
        estimated_savings = 15000.0 if risk_level == FindingSeverity.CRITICAL else 0.0
        
        action = ActionRecommendation.REPLACE if risk_level == FindingSeverity.CRITICAL else ActionRecommendation.MONITOR
        
        prediction = FailurePrediction(
            asset_id=machine_id,
            failure_type=failure_type,
            probability=rul_data["confidence"],
            predicted_time=rul_data["estimated_failure_date"],
            confidence=rul_data["confidence"],
            risk_level=risk_level,
            recommended_action=action,
            estimated_cost_saving=estimated_savings,
            context_used={"source": "vibration_trend_analysis", "rul_hours": rul_data["remaining_hours"]}
        )
        
        return await prediction_repository.save_prediction(db, prediction)

failure_prediction_engine = FailurePredictionEngine()
