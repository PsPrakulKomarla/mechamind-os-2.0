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
    },
    {
        "title": "Industrial Boiler B-601 Operations Guide",
        "description": "Standard operating procedures and emergency handling for the high-pressure boiler.",
        "type": DocumentType.SOP,
        "filename": "boiler_manual.txt",
        "content": """
B-601 INDUSTRIAL BOILER - OPERATIONS GUIDE

1. STARTUP PROCEDURE
Ensure all blowdown valves are closed. Open the main water feed valve and verify the water level sight glass shows at least 50% capacity. Ignite the pilot using the automated ignition sequence.

2. PRESSURE REGULATION
Nominal operating pressure is 150 PSI. If pressure exceeds 180 PSI, the automated pressure relief valve (PRV) should engage. If it fails, manually open the emergency blowoff valve.

3. TROUBLESHOOTING
Issue: Water Level Dropping Rapidly
Check the feedwater pump P-302. If the pump is cavitating, it may have lost prime. Stop the boiler immediately to prevent dry firing, which can cause catastrophic tube failure.

4. ROUTINE MAINTENANCE
- Daily: Blow down the boiler to remove sludge.
- Quarterly: Inspect refractory lining for cracks.
"""
    },
    {
        "title": "Compressor C-401 Service Manual",
        "description": "Service guidelines for the rotary screw air compressor.",
        "type": DocumentType.MAINTENANCE_MANUAL,
        "filename": "compressor_manual.txt",
        "content": """
C-401 ROTARY SCREW COMPRESSOR - SERVICE MANUAL

1. OPERATING PARAMETERS
The compressor operates at 3600 RPM delivering 120 CFM at 100 PSI. Optimal oil temperature is 185°F (85°C).

2. OIL CHANGES
Change the synthetic compressor oil every 8,000 running hours. When changing the oil, also replace the oil filter and the air/oil separator element.

3. TROUBLESHOOTING
Issue: High Discharge Temperature
If the discharge temperature exceeds 220°F (105°C), the unit will trip. Check the thermal valve. A stuck thermal valve prevents oil from flowing through the cooler.

Issue: Excessive Oil Carryover
If oil is found in the downstream air lines, the separator element has ruptured or the scavenge line is blocked. Inspect the clear scavenge line for oil flow.
"""
    },
    {
        "title": "Centrifugal Pump P-101 Maintenance",
        "description": "Maintenance procedures for the main water cooling pump.",
        "type": DocumentType.MAINTENANCE_MANUAL,
        "filename": "mock_pump_manual.txt",
        "content": """
P-101 CENTRIFUGAL PUMP - MAINTENANCE PROCEDURE

1. ALIGNMENT
Laser align the pump and motor shafts to within 0.002 inches. Misalignment is the leading cause of bearing and mechanical seal failure.

2. MECHANICAL SEAL REPLACEMENT
Isolate the pump and drain the casing. Remove the coupling and the seal gland. When installing the new seal, use soapy water to lubricate the O-rings. Do NOT touch the carbon seal faces with bare hands.

3. VIBRATION ANALYSIS
Baseline vibration should not exceed 0.15 in/sec. If vibration spikes at 1x RPM, suspect unbalance. If it spikes at 2x RPM, suspect misalignment.

4. LUBRICATION
Grease the motor bearings every 3 months with Polyurea based grease. Do not over-grease, as this will blow out the bearing seals.
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
