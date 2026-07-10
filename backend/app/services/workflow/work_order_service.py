from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.workflow import WorkOrder, MaintenanceTask
from app.schemas.workflow import WorkOrderCreate
from app.repositories.workflow import workflow_repository
from app.services.workflow.notification_service import notification_service
from app.services.workflow.technician_service import technician_service

class WorkOrderService:
    
    async def create_work_order(self, db: AsyncSession, creator_id: UUID, request: WorkOrderCreate) -> WorkOrder:
        
        wo = WorkOrder(
            organization_id=request.organization_id,
            factory_id=request.factory_id,
            department_id=request.department_id,
            machine_id=request.machine_id,
            created_by=creator_id,
            assigned_to=request.assigned_to,
            title=request.title,
            description=request.description,
            priority=request.priority,
            estimated_cost=request.estimated_cost,
            estimated_duration_hours=request.estimated_duration_hours
        )
        
        # Sub-tasks
        tasks = []
        for t in request.tasks:
            tasks.append(MaintenanceTask(
                title=t.title,
                checklist_payload=t.checklist_payload,
                due_date=t.due_date
            ))
            
        saved_wo = await workflow_repository.create_work_order(db, wo, tasks)
        
        # Notify assigned tech
        if saved_wo.assigned_to:
            await notification_service.send_notification(
                user_id=saved_wo.assigned_to,
                title="New Work Order Assigned",
                message=f"You have been assigned: {saved_wo.title}",
                channels=["IN_APP"]
            )
            
        return saved_wo
        
    async def get_ai_recommendations(self, db: AsyncSession, machine_id: UUID, issue_description: str):
        return await technician_service.recommend_technician(db, machine_id, issue_description)

work_order_service = WorkOrderService()
