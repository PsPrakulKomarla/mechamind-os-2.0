import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import AssetCriticality, ConditionStatus, MachineStatus

class MachineSubsystem(Base):
    """Grouping entity for components (e.g., Cooling System)"""
    __tablename__ = "machine_subsystems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String, nullable=False)
    type = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    criticality = Column(Enum(AssetCriticality), default=AssetCriticality.MEDIUM)
    status = Column(Enum(MachineStatus), default=MachineStatus.OPERATIONAL)
    manufacturer = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    machine = relationship("Machine", back_populates="subsystems")
    components = relationship("Component", back_populates="subsystem", cascade="all, delete-orphan")

class Component(Base):
    """Functional machine component that holds installed parts"""
    __tablename__ = "components"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    subsystem_id = Column(UUID(as_uuid=True), ForeignKey("machine_subsystems.id", ondelete="SET NULL"), nullable=True)
    
    name = Column(String, index=True, nullable=False)
    component_type = Column(String, nullable=True) # E.g., "Pump Seal Assembly"
    serial_number = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    model_number = Column(String, nullable=True)
    installation_date = Column(DateTime(timezone=True), nullable=True)
    expected_life = Column(String, nullable=True)
    
    criticality = Column(Enum(AssetCriticality), default=AssetCriticality.MEDIUM)
    condition = Column(Enum(ConditionStatus), default=ConditionStatus.NEW)
    operational_status = Column(Enum(MachineStatus), default=MachineStatus.OPERATIONAL)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    machine = relationship("Machine", back_populates="components")
    subsystem = relationship("MachineSubsystem", back_populates="components")
    installed_parts = relationship("InstalledPartInstance", back_populates="component", cascade="all, delete-orphan")

class InstalledPartInstance(Base):
    """Actual installed physical part instance (Serial Number specific)"""
    __tablename__ = "installed_part_instances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    component_id = Column(UUID(as_uuid=True), ForeignKey("components.id", ondelete="CASCADE"), nullable=False)
    part_definition_id = Column(UUID(as_uuid=True), ForeignKey("part_definitions.id", ondelete="RESTRICT"), nullable=False)
    
    serial_number = Column(String, index=True, nullable=True)
    condition = Column(Enum(ConditionStatus), default=ConditionStatus.NEW)
    operational_status = Column(Enum(MachineStatus), default=MachineStatus.OPERATIONAL)
    
    installation_date = Column(DateTime(timezone=True), server_default=func.now())
    replacement_date = Column(DateTime(timezone=True), nullable=True)
    
    # Allows tracing back to original Inventory Item if integrated later
    source_inventory_item_id = Column(UUID(as_uuid=True), nullable=True) 

    component = relationship("Component", back_populates="installed_parts")
