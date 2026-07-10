from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import MachineStatus, AssetCriticality

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

class MachineUpdate(BaseModel):
    name: Optional[str] = None
    operational_status: Optional[MachineStatus] = None
    criticality_level: Optional[AssetCriticality] = None
    ai_metadata: Optional[Dict[str, Any]] = None

class MachineResponse(MachineBase):
    id: UUID
    factory_id: UUID
    department_id: Optional[UUID] = None
    production_line_id: Optional[UUID] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
