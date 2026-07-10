import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import MachineStatus, AssetCriticality

class ProductionLine(Base):
    """Grouping of machines physically within a Factory or Department"""
    __tablename__ = "production_lines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    factory_id = Column(UUID(as_uuid=True), ForeignKey("factories.id", ondelete="CASCADE"), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    machines = relationship("Machine", back_populates="production_line")

class Machine(Base):
    """The central physical asset entity"""
    __tablename__ = "machines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    factory_id = Column(UUID(as_uuid=True), ForeignKey("factories.id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    production_line_id = Column(UUID(as_uuid=True), ForeignKey("production_lines.id", ondelete="SET NULL"), nullable=True)
    machine_type_id = Column(UUID(as_uuid=True), ForeignKey("machine_types.id"), nullable=True)
    
    name = Column(String, index=True, nullable=False)
    machine_code = Column(String, unique=True, index=True, nullable=False)
    serial_number = Column(String, index=True, nullable=True)
    model_number = Column(String, nullable=True)
    
    description = Column(Text, nullable=True)
    installation_date = Column(DateTime(timezone=True), nullable=True)
    commission_date = Column(DateTime(timezone=True), nullable=True)
    
    operational_status = Column(Enum(MachineStatus), default=MachineStatus.OPERATIONAL, nullable=False)
    criticality_level = Column(Enum(AssetCriticality), default=AssetCriticality.MEDIUM, nullable=False)
    
    ai_metadata = Column(JSONB, nullable=True) # Knowledge graph, specific params

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    production_line = relationship("ProductionLine", back_populates="machines")
    manufacturers = relationship("MachineManufacturer", back_populates="machine", cascade="all, delete-orphan")
    location = relationship("MachineLocation", back_populates="machine", uselist=False, cascade="all, delete-orphan")
    status_history = relationship("MachineStatusHistory", back_populates="machine", cascade="all, delete-orphan")
    subsystems = relationship("MachineSubsystem", back_populates="machine", cascade="all, delete-orphan")
    components = relationship("Component", back_populates="machine", cascade="all, delete-orphan")

class MachineManufacturer(Base):
    """Association for Machine -> Manufacturer (e.g. Built by X, Serviced by Y)"""
    __tablename__ = "machine_manufacturers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    manufacturer_id = Column(UUID(as_uuid=True), ForeignKey("manufacturers.id", ondelete="CASCADE"), nullable=False)
    
    role = Column(String, nullable=False) # e.g., "OEM", "SERVICE_PROVIDER"

    machine = relationship("Machine", back_populates="manufacturers")

class MachineLocation(Base):
    """Spatial data for a machine"""
    __tablename__ = "machine_locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    building = Column(String, nullable=True)
    floor = Column(String, nullable=True)
    zone = Column(String, nullable=True)
    coordinates = Column(JSONB, nullable=True) # XYZ or GPS

    machine = relationship("Machine", back_populates="location")

class MachineStatusHistory(Base):
    """Append-only audit table for status changes"""
    __tablename__ = "machine_status_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    changed_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    old_status = Column(Enum(MachineStatus), nullable=True)
    new_status = Column(Enum(MachineStatus), nullable=False)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    machine = relationship("Machine", back_populates="status_history")

class MachineDocument(Base):
    """Links manuals, schemas to the Machine"""
    __tablename__ = "machine_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String, nullable=False)
    document_type = Column(String, nullable=False) # e.g. "MANUAL", "P&ID"
    url = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class MachineRiskAssessment(Base):
    """Tracking identified hazards and AI safety recommendations"""
    __tablename__ = "machine_risk_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    
    identified_hazards = Column(JSONB, nullable=False)
    mitigation_plan = Column(Text, nullable=True)
    ai_recommendations = Column(JSONB, nullable=True)
    last_assessment_date = Column(DateTime(timezone=True), server_default=func.now())
