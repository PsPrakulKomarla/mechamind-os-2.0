from enum import Enum


class UserStatus(str, Enum):
    """Status of a user account."""
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"
    PENDING_VERIFICATION = "PENDING_VERIFICATION"


class OrganizationStatus(str, Enum):
    """Status of an organization."""
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"


class AuditAction(str, Enum):
    """Types of actions logged in the audit trail."""
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    FAILED_LOGIN = "FAILED_LOGIN"
    PASSWORD_RESET = "PASSWORD_RESET"
    ROLE_ASSIGNED = "ROLE_ASSIGNED"


class EntityType(str, Enum):
    """Entities that can be audited."""
    USER = "USER"
    ORGANIZATION = "ORGANIZATION"
    ROLE = "ROLE"
    PERMISSION = "PERMISSION"
    FACTORY = "FACTORY"
    DEPARTMENT = "DEPARTMENT"
