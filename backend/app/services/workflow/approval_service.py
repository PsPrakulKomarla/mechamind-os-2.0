from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime

from app.models.workflow import WorkflowApproval, WorkOrder
from app.models.enums import ApprovalStatus, WorkOrderStatus
from app.repositories.workflow import workflow_repository
from app.services.workflow.notification_service import notification_service

class ApprovalService:
    
    async def request_approval(self, db: AsyncSession, work_order_id: UUID, requester_id: UUID, approver_id: UUID, step_name: str) -> WorkflowApproval:
        approval = WorkflowApproval(
            work_order_id=work_order_id,
            requested_by=requester_id,
            approver_id=approver_id,
            step_name=step_name
        )
        
        # Change WO status
        wo = await workflow_repository.get_work_order(db, work_order_id)
        if wo:
            wo.status = WorkOrderStatus.WAITING_FOR_APPROVAL
            await workflow_repository.update_work_order_status(db, wo)
            
        await workflow_repository.create_approval(db, approval)
        
        # Notify approver
        await notification_service.send_notification(
            user_id=approver_id,
            title="Approval Required",
            message=f"Work Order {wo.title if wo else 'Unknown'} requires your approval for step: {step_name}.",
            channels=["IN_APP", "EMAIL"]
        )
        
        return approval

approval_service = ApprovalService()
