import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import SensorType, DeviceStatus, AlertStatus, FindingSeverity

class IoTDevice(Base):
    __tablename__ = "iot_devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), index=True, nullable=False)
    
    device_name = Column(String, nullable=False)
    device_type = Column(String, nullable=False) # e.g. "Edge Gateway v2"
    serial_number = Column(String, unique=True, nullable=False)
    status = Column(Enum(DeviceStatus), default=DeviceStatus.OFFLINE)
    last_connected = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Sensor(Base):
    __tablename__ = "sensors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    device_id = Column(UUID(as_uuid=True), ForeignKey("iot_devices.id"), index=True, nullable=False)
    
    sensor_type = Column(Enum(SensorType), nullable=False)
    measurement_unit = Column(String, nullable=False) # e.g. "Celsius", "Hz"
    
    min_threshold = Column(Float, nullable=True)
    max_threshold = Column(Float, nullable=True)
    
    status = Column(Enum(DeviceStatus), default=DeviceStatus.OFFLINE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    # In production, this would be a TimescaleDB hypertable
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sensor_id = Column(UUID(as_uuid=True), ForeignKey("sensors.id"), index=True, nullable=False)
    
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    quality = Column(String, nullable=True) # "GOOD", "BAD", "UNCERTAIN"
    
    timestamp = Column(DateTime(timezone=True), default=func.now(), index=True)

class MachineAlert(Base):
    __tablename__ = "machine_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), index=True, nullable=False)
    
    alert_type = Column(String, nullable=False) # e.g. "THRESHOLD_BREACH"
    severity = Column(Enum(FindingSeverity), nullable=False)
    message = Column(String, nullable=False)
    sensor_data = Column(JSONB, nullable=True) # The exact reading that triggered it
    
    status = Column(Enum(AlertStatus), default=AlertStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
