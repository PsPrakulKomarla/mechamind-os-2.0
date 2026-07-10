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
    TEAM = "TEAM"

class IndustrySector(str, Enum):
    AUTOMOTIVE = "AUTOMOTIVE"
    AEROSPACE = "AEROSPACE"
    MANUFACTURING = "MANUFACTURING"
    PHARMACEUTICAL = "PHARMACEUTICAL"
    ELECTRONICS = "ELECTRONICS"
    OTHER = "OTHER"

class OperationalStatus(str, Enum):
    ACTIVE = "ACTIVE"
    MAINTENANCE = "MAINTENANCE"
    INACTIVE = "INACTIVE"
    CLOSED = "CLOSED"

class CompanySize(str, Enum):
    SMALL = "SMALL"       # 1-50
    MEDIUM = "MEDIUM"     # 51-200
    LARGE = "LARGE"       # 201-1000
    ENTERPRISE = "ENTERPRISE" # 1000+

class FactorySize(str, Enum):
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"

class OperationalCriticality(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ProductionType(str, Enum):
    DISCRETE = "DISCRETE"
    PROCESS = "PROCESS"
    BATCH = "BATCH"
    CONTINUOUS = "CONTINUOUS"
    MIXED = "MIXED"

class DepartmentType(str, Enum):
    MECHANICAL = "MECHANICAL"
    ELECTRICAL = "ELECTRICAL"
    INSTRUMENTATION = "INSTRUMENTATION"
    PRODUCTION = "PRODUCTION"
    OPERATIONS = "OPERATIONS"
    MAINTENANCE = "MAINTENANCE"
    SAFETY = "SAFETY"
    QUALITY = "QUALITY"
    INSPECTION = "INSPECTION"
    ENGINEERING = "ENGINEERING"
    IT_AUTOMATION = "IT_AUTOMATION"
    CUSTOM = "CUSTOM"

class ScopeType(str, Enum):
    GLOBAL = "GLOBAL"
    ORGANIZATION = "ORGANIZATION"
    FACTORY = "FACTORY"
    DEPARTMENT = "DEPARTMENT"
    TEAM = "TEAM"

class MachineStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    MAINTENANCE = "MAINTENANCE"
    STOPPED = "STOPPED"
    FAILED = "FAILED"
    RETIRED = "RETIRED"

class AssetCriticality(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ConditionStatus(str, Enum):
    NEW = "NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    POOR = "POOR"
    CRITICAL = "CRITICAL"
