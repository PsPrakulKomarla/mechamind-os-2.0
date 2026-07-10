from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType, ActivityType
from app.schemas.analytics import ExecutiveDashboardResponse, FactoryDashboardResponse, TechnicianDashboardResponse, StartupDashboardResponse, ReportExportRequest
from app.services.analytics.dashboard_service import dashboard_service
from app.services.analytics.reporting_service import reporting_service
from app.services.analytics.activity_logger import activity_logger
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Factory Analytics & Executive Dashboards"])

@router.get("/dashboards/executive", response_model=ExecutiveDashboardResponse)
async def get_executive_dash(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only Org Admins or Executives
    await AuthorizationService.authorize(db, current_user.id, ["organization.update"], ScopeType.ORGANIZATION, str(current_user.organization_id))
    
    await activity_logger.log_user_action(db, current_user.id, current_user.organization_id, ActivityType.LOGIN, "Viewed Executive Dashboard")
    return await dashboard_service.get_executive_dashboard(db, current_user.organization_id)

@router.get("/dashboards/factory/{factory_id}", response_model=FactoryDashboardResponse)
async def get_factory_dash(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
    return await dashboard_service.get_factory_dashboard(db, factory_id)

@router.get("/dashboards/technician", response_model=TechnicianDashboardResponse)
async def get_technician_dash(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Any authenticated user with basic permissions can see their own
    return await dashboard_service.get_technician_dashboard(db, current_user.id)

@router.get("/dashboards/startup", response_model=StartupDashboardResponse)
async def get_startup_dash(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await dashboard_service.get_startup_dashboard(db, current_user.organization_id)

@router.post("/reports/export")
async def request_report_export(
    request: ReportExportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await activity_logger.log_user_action(db, current_user.id, current_user.organization_id, ActivityType.EXPORT_REPORT, f"Exported {request.report_type.value} report in {request.export_format.value}")
    
    payload = await reporting_service.export_report(request.report_type, request.export_format, request.filters or {})
    return payload

@router.get("/search")
async def global_search(
    q: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.analytics.search_service import search_service
    return await search_service.global_search(db, current_user.organization_id, q)

