import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Float, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import WorkOrderStatus, WorkOrderPriority, ApprovalStatus

class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    department_id = Column(UUID(as_uuid=True), nullable=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True)
    
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(Enum(WorkOrderPriority), default=WorkOrderPriority.MEDIUM)
    status = Column(Enum(WorkOrderStatus), default=WorkOrderStatus.DRAFT)
    
    estimated_cost = Column(Float, nullable=True)
    estimated_duration_hours = Column(Float, nullable=True)
    actual_cost = Column(Float, nullable=True)
    actual_duration_hours = Column(Float, nullable=True)
    
    opened_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)

class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    work_order_id = Column(UUID(as_uuid=True), ForeignKey("work_orders.id"), nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    title = Column(String, nullable=False)
    checklist_payload = Column(JSONB, nullable=True) # E.g., pass/fail steps
    status = Column(String, default="OPEN") # OPEN, IN_PROGRESS, COMPLETED
    
    due_date = Column(DateTime(timezone=True), nullable=True)

class WorkflowApproval(Base):
    __tablename__ = "workflow_approvals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    work_order_id = Column(UUID(as_uuid=True), ForeignKey("work_orders.id"), nullable=False)
    requested_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    approver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    step_name = Column(String, nullable=False) # E.g., "Supervisor Approval"
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    comments = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

class TechnicianProfile(Base):
    __tablename__ = "technician_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    
    skills = Column(JSONB, nullable=True) # E.g., ["Electrical", "Hydraulics"]
    certifications = Column(JSONB, nullable=True) # E.g., ["OSHA-30", "Level 2 Vibration"]
    availability_status = Column(String, default="AVAILABLE") # AVAILABLE, BUSY, OFF_SHIFT
    shift_name = Column(String, nullable=True)
