from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.risk_health import AssetRiskAssessment, AssetHealthScore, CriticalityHistory
from app.models.machine import Machine
from app.models.enums import RiskLevel

class RiskHealthRepository:
    
    async def create_risk_assessment(self, db: AsyncSession, **kwargs) -> AssetRiskAssessment:
        db_obj = AssetRiskAssessment(**kwargs)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_latest_risk(self, db: AsyncSession, asset_id: UUID) -> Optional[AssetRiskAssessment]:
        query = select(AssetRiskAssessment).where(
            AssetRiskAssessment.asset_id == asset_id
        ).order_by(desc(AssetRiskAssessment.calculated_at)).limit(1)
        result = await db.execute(query)
        return result.scalars().first()

    async def create_health_score(self, db: AsyncSession, **kwargs) -> AssetHealthScore:
        db_obj = AssetHealthScore(**kwargs)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_latest_health(self, db: AsyncSession, asset_id: UUID) -> Optional[AssetHealthScore]:
        query = select(AssetHealthScore).where(
            AssetHealthScore.asset_id == asset_id
        ).order_by(desc(AssetHealthScore.calculated_at)).limit(1)
        result = await db.execute(query)
        return result.scalars().first()

    async def log_criticality_change(self, db: AsyncSession, **kwargs) -> CriticalityHistory:
        db_obj = CriticalityHistory(**kwargs)
        db.add(db_obj)
        await db.commit()
        return db_obj
        
    async def get_factory_high_risks(self, db: AsyncSession, factory_id: UUID) -> List[tuple]:
        """
        Returns a list of tuples: (Machine, AssetRiskAssessment) for CRITICAL/HIGH risks.
        """
        query = select(Machine, AssetRiskAssessment).join(
            AssetRiskAssessment, Machine.id == AssetRiskAssessment.asset_id
        ).where(
            Machine.factory_id == factory_id,
            AssetRiskAssessment.risk_level.in_([RiskLevel.CRITICAL, RiskLevel.HIGH])
        ).order_by(desc(AssetRiskAssessment.calculated_at))
        # Note: In a real prod environment, you'd want a DISTINCT ON (asset_id) 
        # or a subquery to ensure only the *latest* assessment per machine is returned.
        # This is a simplified fetch for the prototype.
        result = await db.execute(query)
        return list(result.all())

risk_health_repo = RiskHealthRepository()
