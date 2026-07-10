from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime
from app.models.enums import SensorType, DeviceStatus, AlertStatus, FindingSeverity

class SensorCreate(BaseModel):
    sensor_type: SensorType
    measurement_unit: str
    min_threshold: Optional[float] = None
    max_threshold: Optional[float] = None

class DeviceCreate(BaseModel):
    machine_id: UUID
    device_name: str
    device_type: str
    serial_number: str
    sensors: List[SensorCreate] = []

class SensorReadingPayload(BaseModel):
    sensor_id: UUID
    value: float
    unit: str
    quality: Optional[str] = "GOOD"
    timestamp: Optional[datetime] = None

class MachineAlertResponse(BaseModel):
    id: UUID
    machine_id: UUID
    alert_type: str
    severity: FindingSeverity
    message: str
    status: AlertStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DeviceResponse(BaseModel):
    id: UUID
    machine_id: UUID
    device_name: str
    status: DeviceStatus
    model_config = ConfigDict(from_attributes=True)
