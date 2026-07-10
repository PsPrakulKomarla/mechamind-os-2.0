from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.compliance import RegulationCreate, RegulationResponse, ComplianceCheckResponse, AuditPackageResponse
from app.services.compliance.regulation_service import regulation_service
from app.services.compliance.compliance_analyzer import compliance_analyzer
from app.services.compliance.audit_service import audit_service
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Compliance & Regulatory Agent"])

@router.post("/regulations", response_model=RegulationResponse)
async def create_regulation(
    request: RegulationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["document.update"], ScopeType.ORGANIZATION, str(current_user.organization_id))
    return await regulation_service.create_regulation(db, current_user.organization_id, request.model_dump())

@router.get("/regulations", response_model=List[RegulationResponse])
async def list_regulations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await regulation_service.list_regulations(db)

@router.post("/factories/{factory_id}/check", response_model=ComplianceCheckResponse)
async def run_compliance_check(
    factory_id: UUID,
    regulation_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.read", "document.read"], ScopeType.FACTORY, str(factory_id))
    return await compliance_analyzer.run_assessment(db, current_user.organization_id, factory_id, regulation_code)

@router.post("/factories/{factory_id}/audit-package", response_model=AuditPackageResponse)
async def generate_audit_package(
    factory_id: UUID,
    regulation_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.read", "document.read"], ScopeType.FACTORY, str(factory_id))
    return await audit_service.generate_audit_package(db, current_user.organization_id, factory_id, regulation_code)
