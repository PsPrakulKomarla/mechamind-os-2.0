from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime
from app.models.enums import ActivityType, ReportType, ExportFormat

class ExecutiveDashboardResponse(BaseModel):
    total_organizations: int
    total_factories: int
    total_machines: int
    global_health_score: float
    active_alerts: int
    compliance_score: float
    ai_usage_stats: Dict[str, Any]
    estimated_cost_savings: float

class FactoryDashboardResponse(BaseModel):
    factory_id: UUID
    name: str
    machine_status_counts: Dict[str, int]
    open_alerts: int
    recent_failures: List[Dict[str, Any]]
    compliance_score: float
    energy_consumption_kwh: float
    risk_heatmap: List[Dict[str, Any]]

class TechnicianDashboardResponse(BaseModel):
    user_id: UUID
    assigned_work_orders: int
    today_inspections: int
    recent_ai_conversations: int
    safety_alerts: int

class StartupDashboardResponse(BaseModel):
    most_repeated_issues: List[Dict[str, Any]]
    critical_unresolved_issues: List[Dict[str, Any]]
    machines_requiring_attention: List[Dict[str, Any]]
    high_risk_predictions: List[Dict[str, Any]]

class UserActivityLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    activity_type: ActivityType
    description: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReportExportRequest(BaseModel):
    report_type: ReportType
    export_format: ExportFormat
    filters: Optional[Dict[str, Any]] = None
