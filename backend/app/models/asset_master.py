import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

# ==========================================
# GLOBAL MASTER DATA
# ==========================================

class Manufacturer(Base):
    """Global Manufacturer master list (e.g. Siemens, ABB)"""
    __tablename__ = "manufacturers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    global_website = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    org_profiles = relationship("OrganizationManufacturerProfile", back_populates="manufacturer")


class MachineCategory(Base):
    """Global Category (e.g. Rotating Equipment, Static Equipment)"""
    __tablename__ = "machine_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    types = relationship("MachineType", back_populates="category")


class MachineType(Base):
    """Global Machine Type (e.g. Centrifugal Pump, CNC Lathe)"""
    __tablename__ = "machine_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("machine_categories.id"), nullable=False)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    category = relationship("MachineCategory", back_populates="types")
    org_extensions = relationship("OrganizationMachineType", back_populates="global_type")


class PartDefinition(Base):
    """Logical Part Definition for future Inventory architecture"""
    __tablename__ = "part_definitions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    manufacturer_id = Column(UUID(as_uuid=True), ForeignKey("manufacturers.id"), nullable=True)
    part_number = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    specifications = Column(JSONB, nullable=True)
    expected_life_hours = Column(String, nullable=True) # E.g., "10000" or metadata
    estimated_cost = Column(String, nullable=True)
    criticality = Column(String, nullable=True) # E.g. "CRITICAL", "HIGH"

    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ==========================================
# ORGANIZATION EXTENSIONS
# ==========================================

class OrganizationManufacturerProfile(Base):
    """Tenant-specific data for a Global Manufacturer (Vendor contacts, contracts)"""
    __tablename__ = "organization_manufacturer_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    manufacturer_id = Column(UUID(as_uuid=True), ForeignKey("manufacturers.id", ondelete="CASCADE"), nullable=False)
    
    vendor_contact_details = Column(JSONB, nullable=True)
    service_agreement_ref = Column(String, nullable=True)
    internal_rating = Column(String, nullable=True)
    preferred_supplier = Column(String, nullable=True) # Could be Boolean

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    manufacturer = relationship("Manufacturer", back_populates="org_profiles")
    # organization relationship can be added here if needed


class OrganizationMachineType(Base):
    """Tenant-specific customizations for a Global Machine Type"""
    __tablename__ = "organization_machine_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    global_type_id = Column(UUID(as_uuid=True), ForeignKey("machine_types.id", ondelete="CASCADE"), nullable=False)
    
    internal_naming = Column(String, nullable=True)
    custom_specifications = Column(JSONB, nullable=True)
    maintenance_standards = Column(JSONB, nullable=True)

    global_type = relationship("MachineType", back_populates="org_extensions")
