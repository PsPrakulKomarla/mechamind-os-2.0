from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime
from app.models.enums import WorkOrderStatus, WorkOrderPriority, ApprovalStatus

class MaintenanceTaskCreate(BaseModel):
    title: str
    checklist_payload: Optional[Dict[str, Any]] = None
    due_date: Optional[datetime] = None

class WorkOrderCreate(BaseModel):
    organization_id: UUID
    factory_id: UUID
    department_id: Optional[UUID] = None
    machine_id: Optional[UUID] = None
    assigned_to: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    priority: WorkOrderPriority = WorkOrderPriority.MEDIUM
    estimated_cost: Optional[float] = None
    estimated_duration_hours: Optional[float] = None
    tasks: Optional[List[MaintenanceTaskCreate]] = []

class MaintenanceTaskResponse(BaseModel):
    id: UUID
    title: str
    status: str
    due_date: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)

class WorkOrderResponse(BaseModel):
    id: UUID
    title: str
    status: WorkOrderStatus
    priority: WorkOrderPriority
    assigned_to: Optional[UUID]
    opened_at: datetime
    tasks: List[MaintenanceTaskResponse] = []
    model_config = ConfigDict(from_attributes=True)

class ApprovalRequestCreate(BaseModel):
    approver_id: UUID
    step_name: str

class AIRecommendationResponse(BaseModel):
    recommended_technician_id: Optional[UUID]
    reasoning: str
    estimated_duration_hours: float
    suggested_priority: WorkOrderPriority
    checklist_template_id: Optional[UUID] = None
