from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum, Boolean
from typing import List, Optional

from app.db.base_class import BaseModel
from app.models.enums import OrganizationStatus, CompanySize

class Organization(BaseModel):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), index=True)
    domain: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=True)
    industry_type: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_size: Mapped[Optional[CompanySize]] = mapped_column(Enum(CompanySize), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    logo: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_information: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[OrganizationStatus] = mapped_column(
        Enum(OrganizationStatus), default=OrganizationStatus.ACTIVE
    )
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    users: Mapped[List["User"]] = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    factories: Mapped[List["Factory"]] = relationship("Factory", back_populates="organization", cascade="all, delete-orphan")
    roles: Mapped[List["Role"]] = relationship("Role", back_populates="organization", cascade="all, delete-orphan")
