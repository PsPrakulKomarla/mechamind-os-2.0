from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import AssetCriticality, ConditionStatus

class ComponentBase(BaseModel):
    name: str
    component_type: Optional[str] = None
    criticality: AssetCriticality = AssetCriticality.MEDIUM

class ComponentCreate(ComponentBase):
    machine_id: UUID
    subsystem_id: Optional[UUID] = None

class ComponentResponse(ComponentBase):
    id: UUID
    machine_id: UUID
    subsystem_id: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class InstalledPartInstanceBase(BaseModel):
    serial_number: Optional[str] = None
    condition: ConditionStatus = ConditionStatus.NEW

class InstalledPartInstanceCreate(InstalledPartInstanceBase):
    component_id: UUID
    part_definition_id: UUID
    source_inventory_item_id: Optional[UUID] = None

class InstalledPartInstanceResponse(InstalledPartInstanceBase):
    id: UUID
    component_id: UUID
    part_definition_id: UUID
    installation_date: datetime

    model_config = ConfigDict(from_attributes=True)
