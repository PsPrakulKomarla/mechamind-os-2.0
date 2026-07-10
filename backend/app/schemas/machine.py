from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import MachineStatus, AssetCriticality
from app.schemas.component import ComponentResponse, InstalledPartInstanceResponse, ComponentHierarchyResponse

class MachineBase(BaseModel):
    name: str
    machine_code: str
    serial_number: Optional[str] = None
    model_number: Optional[str] = None
    description: Optional[str] = None
    operational_status: MachineStatus = MachineStatus.OPERATIONAL
    criticality_level: AssetCriticality = AssetCriticality.MEDIUM
    ai_metadata: Optional[Dict[str, Any]] = None

class MachineCreate(MachineBase):
    factory_id: UUID
    department_id: Optional[UUID] = None
    production_line_id: Optional[UUID] = None
    machine_type_id: Optional[UUID] = None
    manufacturer_id: Optional[UUID] = None

class MachineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    operational_status: Optional[MachineStatus] = None
    criticality_level: Optional[AssetCriticality] = None
    department_id: Optional[UUID] = None
    production_line_id: Optional[UUID] = None
    ai_metadata: Optional[Dict[str, Any]] = None

class MachineStatusUpdate(BaseModel):
    status: MachineStatus
    reason: Optional[str] = None

class MachineStatusHistoryResponse(BaseModel):
    id: UUID
    old_status: Optional[MachineStatus] = None
    new_status: MachineStatus
    reason: Optional[str] = None
    timestamp: datetime
    changed_by_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class MachineResponse(MachineBase):
    id: UUID
    factory_id: UUID
    department_id: Optional[UUID] = None
    production_line_id: Optional[UUID] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class MachineDetailResponse(MachineResponse):
    status_history: List[MachineStatusHistoryResponse] = []
    # Could include simple components list
    components: List[ComponentResponse] = []

class MachineHierarchyResponse(MachineResponse):
    """Deeply nested response for AI Context"""
    components: List[ComponentHierarchyResponse] = []
