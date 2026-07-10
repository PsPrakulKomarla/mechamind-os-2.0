from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import AssetCriticality, ConditionStatus, MachineStatus

# === Subsystem ===
class SubsystemBase(BaseModel):
    name: str
    type: Optional[str] = None
    description: Optional[str] = None
    criticality: AssetCriticality = AssetCriticality.MEDIUM
    status: MachineStatus = MachineStatus.OPERATIONAL
    manufacturer: Optional[str] = None

class SubsystemCreate(SubsystemBase):
    pass

class SubsystemUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    criticality: Optional[AssetCriticality] = None
    status: Optional[MachineStatus] = None
    manufacturer: Optional[str] = None

class SubsystemResponse(SubsystemBase):
    id: UUID
    machine_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# === Part Definition ===
class PartDefinitionBase(BaseModel):
    part_number: str
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    expected_life_hours: Optional[str] = None
    estimated_cost: Optional[str] = None
    criticality: Optional[str] = None

class PartDefinitionCreate(PartDefinitionBase):
    manufacturer_id: Optional[UUID] = None

class PartDefinitionResponse(PartDefinitionBase):
    id: UUID
    manufacturer_id: Optional[UUID] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# === Component ===
class ComponentBase(BaseModel):
    name: str
    component_type: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    model_number: Optional[str] = None
    installation_date: Optional[datetime] = None
    expected_life: Optional[str] = None
    criticality: AssetCriticality = AssetCriticality.MEDIUM
    condition: ConditionStatus = ConditionStatus.NEW
    operational_status: MachineStatus = MachineStatus.OPERATIONAL

class ComponentCreate(ComponentBase):
    subsystem_id: Optional[UUID] = None

class ComponentUpdate(BaseModel):
    name: Optional[str] = None
    component_type: Optional[str] = None
    serial_number: Optional[str] = None
    condition: Optional[ConditionStatus] = None
    operational_status: Optional[MachineStatus] = None

class ComponentResponse(ComponentBase):
    id: UUID
    machine_id: UUID
    subsystem_id: Optional[UUID] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# === Installed Part Instance ===
class InstalledPartInstanceBase(BaseModel):
    serial_number: Optional[str] = None
    condition: ConditionStatus = ConditionStatus.NEW
    operational_status: MachineStatus = MachineStatus.OPERATIONAL

class InstalledPartInstanceCreate(InstalledPartInstanceBase):
    part_definition_id: UUID
    source_inventory_item_id: Optional[UUID] = None

class InstalledPartInstanceResponse(InstalledPartInstanceBase):
    id: UUID
    component_id: UUID
    part_definition_id: UUID
    installation_date: datetime
    replacement_date: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class PartReplacementRequest(BaseModel):
    new_part_definition_id: UUID
    new_serial_number: Optional[str] = None
    new_source_inventory_item_id: Optional[UUID] = None
    reason: Optional[str] = None

# === Hierarchy ===
class ComponentHierarchyResponse(ComponentResponse):
    installed_parts: List[InstalledPartInstanceResponse] = []

class SubsystemHierarchyResponse(SubsystemResponse):
    components: List[ComponentHierarchyResponse] = []
