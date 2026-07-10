from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.workflow import WorkOrderCreate, WorkOrderResponse, ApprovalRequestCreate, AIRecommendationResponse
from app.services.workflow.work_order_service import work_order_service
from app.services.workflow.approval_service import approval_service
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Smart Workflow Automation"])

@router.post("/work-orders", response_model=WorkOrderResponse)
async def create_work_order(
    request: WorkOrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["maintenance.update"], ScopeType.FACTORY, str(request.factory_id))
    return await work_order_service.create_work_order(db, current_user.id, request)

@router.post("/work-orders/{work_order_id}/approvals")
async def request_approval(
    work_order_id: UUID,
    request: ApprovalRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In a real scenario, we check if current_user is assigned_to
    approval = await approval_service.request_approval(db, work_order_id, current_user.id, request.approver_id, request.step_name)
    return {"status": "Approval requested", "approval_id": approval.id}

@router.post("/work-orders/ai-recommend", response_model=AIRecommendationResponse)
async def get_ai_recommendation(
    machine_id: UUID,
    issue_description: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await work_order_service.get_ai_recommendations(db, machine_id, issue_description)
