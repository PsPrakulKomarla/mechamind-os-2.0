from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List, Optional

from app.models.workflow import WorkOrder, MaintenanceTask, WorkflowApproval, TechnicianProfile

class WorkflowRepository:
    
    async def create_work_order(self, db: AsyncSession, work_order: WorkOrder, tasks: List[MaintenanceTask]) -> WorkOrder:
        db.add(work_order)
        await db.flush() # get ID
        for task in tasks:
            task.work_order_id = work_order.id
            db.add(task)
        await db.commit()
        await db.refresh(work_order)
        return work_order
        
    async def list_work_orders(self, db: AsyncSession, factory_id: Optional[UUID] = None, status: Optional[str] = None) -> List[WorkOrder]:
        query = select(WorkOrder)
        if factory_id:
            query = query.where(WorkOrder.factory_id == factory_id)
        if status:
            query = query.where(WorkOrder.status == status)
        query = query.order_by(WorkOrder.opened_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

    async def get_work_order(self, db: AsyncSession, work_order_id: UUID) -> Optional[WorkOrder]:
        return await db.get(WorkOrder, work_order_id)
        
    async def update_work_order_status(self, db: AsyncSession, work_order: WorkOrder) -> WorkOrder:
        db.add(work_order)
        await db.commit()
        await db.refresh(work_order)
        return work_order
        
    async def create_approval(self, db: AsyncSession, approval: WorkflowApproval) -> WorkflowApproval:
        db.add(approval)
        await db.commit()
        await db.refresh(approval)
        return approval

workflow_repository = WorkflowRepository()
