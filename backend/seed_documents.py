import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.document import Document
from app.models.enums import DocumentType, ProcessingStatus
from app.services.document_processing import document_processor

documents_to_seed = [
    {
        "title": "OSHA Safety Guidelines 2026",
        "description": "Standard safety protocols for manufacturing environments",
        "type": DocumentType.SAFETY_DOCUMENT,
        "filename": "osha_safety.txt",
        "content": """
MECHAMIND FACTORY SAFETY PROTOCOL - OSHA COMPLIANT

1. HAZMAT HANDLING
All hazardous materials must be stored in Class-1 certified containers. In case of a spill, immediately contact the safety officer and use the neutralizing agent located at Station B.

2. FIRE SAFETY
In the event of a fire, do NOT use water on electrical equipment. Use CO2 extinguishers only. The assembly point is at the North Parking Lot.

3. CONFINED SPACE ENTRY
No personnel may enter a confined space without a signed permit from the floor supervisor. A spotter must be present outside the space at all times. Air quality must be tested every 30 minutes.

4. EMERGENCY SHUTDOWN
If an uncontrolled mechanical failure occurs, hit the primary Emergency Stop (E-Stop) button located on the main control panel. Do not attempt to physically block moving machinery.
"""
    },
    {
        "title": "CNC Milling Machine M-500 Manual",
        "description": "Operation and troubleshooting guide for the CNC Machine",
        "type": DocumentType.MAINTENANCE_MANUAL,
        "filename": "cnc_manual.txt",
        "content": """
M-500 CNC MILLING MACHINE - OPERATOR MANUAL

1. DAILY CALIBRATION
Before running any batch, the spindle must be calibrated to a tolerance of +/- 0.005mm. Use the laser alignment tool provided in the toolkit.

2. TROUBLESHOOTING
Issue: Spindle Stalling
If the spindle stalls during operation, check the coolant flow. Insufficient coolant causes overheating, triggering the auto-stall safety mechanism. Clean the coolant filter.

Issue: Axis Misalignment
If the X or Y axis drifts, inspect the servo motor encoders. Dust buildup can interfere with the optical sensors. Clean gently with compressed air.

3. MAINTENANCE SCHEDULE
- Weekly: Check hydraulic fluid levels.
- Monthly: Inspect and replace cutting tool inserts if wear exceeds 15%.
"""
    }
]

async def seed_documents():
    async with AsyncSessionLocal() as db:
        from app.models.organization import Organization
        from app.models.user import User
        from sqlalchemy import select
        
        org_result = await db.execute(select(Organization).limit(1))
        org = org_result.scalar_one_or_none()
        
        user_result = await db.execute(select(User).limit(1))
        user = user_result.scalar_one_or_none()
        
        if not org or not user:
            print("No organization or user found in DB. Cannot seed document.")
            return

        for doc_info in documents_to_seed:
            file_path = doc_info["filename"]
            with open(file_path, "w") as f:
                f.write(doc_info["content"])

            doc = Document(
                organization_id=org.id,
                uploaded_by_id=user.id,
                title=doc_info["title"],
                description=doc_info["description"],
                document_type=doc_info["type"],
                version='1.0',
                file_name=doc_info["filename"],
                file_path=file_path,
                file_size=len(doc_info["content"]),
                mime_type='text/plain',
                processing_status=ProcessingStatus.UPLOADED
            )
            db.add(doc)
            await db.commit()
            await db.refresh(doc)
            
            print(f"Processing: {doc.title}...")
            await document_processor.run_pipeline(db, doc)
            print(f"Finished: {doc.title}")

if __name__ == "__main__":
    asyncio.run(seed_documents())
