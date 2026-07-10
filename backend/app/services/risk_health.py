from uuid import UUID
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.risk_health import RiskAssessmentCreate, HealthScoreCreate, CriticalityUpdate, RiskSummaryItem
from app.models.risk_health import AssetRiskAssessment, AssetHealthScore
from app.models.enums import AuditAction, EntityType, ScopeType, RiskLevel, AssetCriticality
from app.repositories.risk_health import risk_health_repo
from app.repositories.machine import machine_repo
from app.repositories.component import component_repo
from app.services.audit import audit_service
from app.services.authorization import AuthorizationService

class RiskHealthService:
    
    async def _resolve_entity_factory(self, db: AsyncSession, entity_id: UUID) -> UUID:
        """Dynamically finds the factory_id of the entity to enforce tenant isolation."""
        machine = await machine_repo.get(db, entity_id)
        if machine: return machine.factory_id
            
        component = await component_repo.get_component(db, entity_id)
        if component: return component.machine.factory_id
        
        raise HTTPException(status_code=404, detail="Asset not found")

    async def calculate_risk(self, db: AsyncSession, asset_id: UUID, payload: RiskAssessmentCreate, user_id: UUID) -> AssetRiskAssessment:
        factory_id = await self._resolve_entity_factory(db, asset_id)
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(factory_id))

        # Core logic: Risk Score = Probability * Severity
        prob = payload.probability_factor
        s_score = prob * payload.safety_impact
        p_score = prob * payload.production_impact
        f_score = prob * payload.financial_impact
        e_score = prob * payload.environment_impact
        c_score = prob * payload.compliance_impact
        
        overall = sum([s_score, p_score, f_score, e_score, c_score])
        
        level = RiskLevel.LOW
        if overall > 80: level = RiskLevel.CRITICAL
        elif overall > 50: level = RiskLevel.HIGH
        elif overall > 20: level = RiskLevel.MEDIUM

        assessment = await risk_health_repo.create_risk_assessment(
            db=db,
            asset_id=asset_id,
            safety_score=s_score,
            production_score=p_score,
            financial_score=f_score,
            environment_score=e_score,
            compliance_score=c_score,
            overall_risk_score=overall,
            risk_level=level,
            calculated_by_id=user_id
        )
        
        await audit_service.log_action(db=db, user_id=user_id, action=AuditAction.CREATE, entity_type=EntityType.MACHINE, entity_id=asset_id, details={"event": "RISK_CALCULATED", "score": overall})
        return assessment

    async def get_latest_risk(self, db: AsyncSession, asset_id: UUID, user_id: UUID) -> AssetRiskAssessment:
        factory_id = await self._resolve_entity_factory(db, asset_id)
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
        
        risk = await risk_health_repo.get_latest_risk(db, asset_id)
        if not risk: raise HTTPException(status_code=404, detail="No risk assessment found")
        return risk

    async def calculate_health(self, db: AsyncSession, asset_id: UUID, payload: HealthScoreCreate, user_id: UUID) -> AssetHealthScore:
        factory_id = await self._resolve_entity_factory(db, asset_id)
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(factory_id))

        # Core logic: Base 100 - (Sum of degradation factors)
        score = 100.0
        for factor_val in payload.health_factors.values():
            score -= (factor_val * 100) # Assuming factor is 0.0 to 1.0 degradation
        
        score = max(0.0, score)
        
        condition = "EXCELLENT"
        if score < 20: condition = "CRITICAL"
        elif score < 50: condition = "POOR"
        elif score < 80: condition = "FAIR"
        elif score < 90: condition = "GOOD"

        health = await risk_health_repo.create_health_score(
            db=db,
            asset_id=asset_id,
            health_score=score,
            condition_status=condition,
            health_factors=payload.health_factors
        )
        return health

    async def get_latest_health(self, db: AsyncSession, asset_id: UUID, user_id: UUID) -> AssetHealthScore:
        factory_id = await self._resolve_entity_factory(db, asset_id)
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
        
        health = await risk_health_repo.get_latest_health(db, asset_id)
        if not health: raise HTTPException(status_code=404, detail="No health score found")
        return health

    async def update_criticality(self, db: AsyncSession, asset_id: UUID, payload: CriticalityUpdate, user_id: UUID):
        factory_id = await self._resolve_entity_factory(db, asset_id)
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(factory_id))

        machine = await machine_repo.get(db, asset_id)
        if not machine: raise HTTPException(status_code=400, detail="Only machines support criticality currently")
        
        old_crit = machine.criticality_level
        if old_crit == payload.new_criticality: return machine

        machine.criticality_level = payload.new_criticality
        db.add(machine)
        await db.commit()
        
        await risk_health_repo.log_criticality_change(
            db=db, asset_id=asset_id, previous_criticality=old_crit, 
            new_criticality=payload.new_criticality, reason=payload.reason, changed_by_id=user_id
        )
        
        await audit_service.log_action(db=db, user_id=user_id, action=AuditAction.UPDATE, entity_type=EntityType.MACHINE, entity_id=asset_id, details={"event": "CRITICALITY_CHANGED", "new": payload.new_criticality})
        return machine
        
    async def get_risk_summary(self, db: AsyncSession, factory_id: UUID, user_id: UUID) -> List[RiskSummaryItem]:
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
        
        raw_items = await risk_health_repo.get_factory_high_risks(db, factory_id)
        
        # Deduplicate to just show latest per machine
        seen = set()
        summary = []
        for machine, assessment in raw_items:
            if machine.id not in seen:
                seen.add(machine.id)
                summary.append(
                    RiskSummaryItem(
                        asset_id=machine.id,
                        asset_name=machine.name,
                        risk_level=assessment.risk_level,
                        overall_risk_score=assessment.overall_risk_score,
                        criticality=machine.criticality_level
                    )
                )
        return summary

risk_health_service = RiskHealthService()
