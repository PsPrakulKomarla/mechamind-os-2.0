# Expose all models here so Alembic can import them from a single place
from .enums import UserStatus, OrganizationStatus, AuditAction, EntityType
from .organization import Organization
from .factory import Factory
from .department import Department
from .user import User
from .role import Role
from .permission import Permission
from .role_permission import RolePermission
from .user_role import UserRole
from .user_session import UserSession
from .refresh_token import RefreshToken
from .login_history import LoginHistory
from .password_reset import PasswordReset
from .email_verification import EmailVerification
from .audit_log import AuditLog
from .team import Team
from .user_org_role import UserOrganizationRole
from .user_factory_role import UserFactoryRole
from .user_dept_role import UserDepartmentRole
from .user_team import UserTeam

from .asset_master import Manufacturer, MachineCategory, MachineType, PartDefinition, OrganizationManufacturerProfile, OrganizationMachineType
from .machine import ProductionLine, Machine, MachineManufacturer, MachineLocation, MachineStatusHistory, MachineDocument, MachineRiskAssessment
from .component import MachineSubsystem, Component, InstalledPartInstance
from .relationship import AssetRelationship
from .risk_health import AssetRiskAssessment, AssetHealthScore, CriticalityHistory
from .document import Document
from app.models.extraction import DocumentExtraction, ExtractedContent, ProcessingJob
from app.models.entity import ExtractedEntity, EntityRelationship, KnowledgeMap
from app.models.knowledge import KnowledgeEmbedding
from app.models.copilot import CopilotConversation, CopilotMessage, CopilotResponseMetadata
from app.models.learning import AIResponseFeedback, SolutionProposal, KnowledgeVersion
from app.models.maintenance import MaintenanceRecord, FailureEvent
from app.models.compliance import Regulation, ComplianceRequirement, ComplianceAssessment, ComplianceFinding, CorrectiveAction

__all__ = [
    "UserStatus",
    "OrganizationStatus",
    "AuditAction",
    "EntityType",
    "Organization",
    "Factory",
    "Department",
    "User",
    "Role",
    "Permission",
    "RolePermission",
    "UserRole",
    "UserSession",
    "RefreshToken",
    "LoginHistory",
    "PasswordReset",
    "EmailVerification",
    "AuditLog",
    "Team",
    "UserOrganizationRole",
    "UserFactoryRole",
    "UserDepartmentRole",
    "UserTeam",
    "Manufacturer",
    "MachineCategory",
    "MachineType",
    "PartDefinition",
    "OrganizationManufacturerProfile",
    "OrganizationMachineType",
    "ProductionLine",
    "Machine",
    "MachineManufacturer",
    "MachineLocation",
    "MachineStatusHistory",
    "MachineDocument",
    "MachineRiskAssessment",
    "MachineSubsystem",
    "Component",
    "InstalledPartInstance",
    "AssetRelationship",
    "AssetRiskAssessment",
    "AssetHealthScore",
    "CriticalityHistory",
    "Document",
    "DocumentExtraction",
    "ExtractedContent",
    "ProcessingJob",
    "ExtractedEntity",
    "EntityRelationship",
    "KnowledgeMap",
    "KnowledgeEmbedding",
    "CopilotConversation",
    "CopilotMessage",
    "CopilotResponseMetadata",
    "AIResponseFeedback",
    "SolutionProposal",
    "KnowledgeVersion",
    "MaintenanceRecord",
    "FailureEvent",
    "Regulation",
    "ComplianceRequirement",
    "ComplianceAssessment",
    "ComplianceFinding",
    "CorrectiveAction"
]
