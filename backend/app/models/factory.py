from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum, Float
from sqlalchemy.dialects.postgresql import UUID
from typing import List, Optional
import uuid

from app.db.base_class import BaseModel
from app.models.enums import IndustrySector, OperationalStatus

class Factory(BaseModel):
    __tablename__ = "factories"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    factory_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, unique=True, index=True)
    industry_sector: Mapped[Optional[IndustrySector]] = mapped_column(Enum(IndustrySector), nullable=True)
    factory_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    operational_status: Mapped[OperationalStatus] = mapped_column(
        Enum(OperationalStatus), default=OperationalStatus.ACTIVE, nullable=False
    )
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="factories")
    departments: Mapped[List["Department"]] = relationship("Department", back_populates="factory", cascade="all, delete-orphan")
