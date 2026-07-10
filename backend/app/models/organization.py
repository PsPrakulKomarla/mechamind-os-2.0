from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum
from typing import List

from app.db.base_class import BaseModel
from app.models.enums import OrganizationStatus

class Organization(BaseModel):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), index=True)
    domain: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=True)
    status: Mapped[OrganizationStatus] = mapped_column(
        Enum(OrganizationStatus), default=OrganizationStatus.ACTIVE
    )
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    users: Mapped[List["User"]] = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    factories: Mapped[List["Factory"]] = relationship("Factory", back_populates="organization", cascade="all, delete-orphan")
    roles: Mapped[List["Role"]] = relationship("Role", back_populates="organization", cascade="all, delete-orphan")
