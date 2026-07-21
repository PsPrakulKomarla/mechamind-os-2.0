from .health import router as health
from .auth import router as auth
from .roles import router as roles
from .permissions import router as permissions
from .organizations import router as organizations
from .factories import router as factories
from .departments import router as departments
from .teams import router as teams
from .machines import router as machines
from .subsystems import router as subsystems
from .components import router as components
from .parts import router as parts
from .relationships import router as relationships
from .risk import router as risk
from .asset_health import router as asset_health
from .documents import router as documents
from .extraction import router as extraction
from .entities import router as entities
from .knowledge import router as knowledge
from .copilot import router as copilot
from .learning import router as learning
from .maintenance import router as maintenance
from .failures import router as failures
from .compliance import router as compliance
from .safety import router as safety
from .vision import router as vision
from .iot import router as iot
from .prediction import router as prediction
from .analytics import router as analytics
from .workflow import router as workflow
from .integration import router as integration
from .mlops import router as mlops
from .security import router as security
from .brain import router as brain
from .admin import router as admin

__all__ = [
    "health", "auth", "roles", "permissions", "organizations", "factories", "departments", "teams", "machines",
    "subsystems", "components", "parts", "relationships", "risk", "asset_health", "documents", "extraction", "entities", "knowledge", "copilot", "learning", "maintenance", "failures", "compliance", "safety", "vision", "iot", "prediction", "analytics", "workflow", "integration", "mlops", "security", "brain", "admin"
]
