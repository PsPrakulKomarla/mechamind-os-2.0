"""
Comprehensive seed script for MechaMind OS 2.0 Demo
Populates all entities with realistic example data.
Run: python seed_all.py
"""
import asyncio
import uuid
import random
import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.organization import Organization
from app.models.factory import Factory
from app.models.department import Department
from app.models.team import Team
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.machine import Machine, ProductionLine, MachineLocation, MachineStatusHistory
from app.models.document import Document
from app.models.vision import MediaFile, VisionAnalysis, DetectedDefect
from app.models.maintenance import MaintenanceRecord, FailureEvent
from app.models.iot import IoTDevice
from app.models.enums import (
    DocumentType, ProcessingStatus, MediaType, AnalysisStatus,
    DefectType, FindingSeverity, MaintenanceType, MaintenanceStatus,
    FailureType, FailureSeverity, MachineStatus, AssetCriticality,
    DepartmentType, IndustrySector, OperationalStatus, FactorySize,
    OperationalCriticality, ProductionType, OrganizationStatus, CompanySize,
    UserStatus, ScopeType
)
from app.core.security import get_password_hash


# ─── ORGANIZATIONS ───────────────────────────────────────────────────────────

ORGANIZATIONS = [
    {
        "name": "MechaMind Industries",
        "domain": "mechamind.com",
        "industry_type": "Manufacturing",
        "company_size": CompanySize.ENTERPRISE,
        "description": "Global leader in precision manufacturing and industrial automation",
        "country": "India",
        "state": "Karnataka",
        "city": "Bengaluru",
        "address": "37, Industrial Layout, Electronic City",
        "status": OrganizationStatus.ACTIVE,
    },
    {
        "name": "AutoParts Manufacturing Co.",
        "domain": "autoparts.com",
        "industry_type": "Automotive",
        "company_size": CompanySize.LARGE,
        "description": "Tier-1 automotive parts supplier",
        "country": "India",
        "state": "Maharashtra",
        "city": "Pune",
        "address": "MIDC Industrial Area, Chakan",
        "status": OrganizationStatus.ACTIVE,
    },
]

# ─── FACTORIES ───────────────────────────────────────────────────────────────

FACTORIES = [
    {
        "name": "MechaMind Bengaluru Plant 1",
        "factory_code": "MM-BLR-01",
        "industry_sector": IndustrySector.MANUFACTURING,
        "production_type": ProductionType.DISCRETE,
        "factory_size": FactorySize.LARGE,
        "operational_criticality": OperationalCriticality.HIGH,
        "operating_hours": "24/7",
        "number_of_employees": 1200,
        "production_capacity": "500,000 units/year",
        "location": "Electronic City, Bengaluru",
        "country": "India",
        "state": "Karnataka",
        "city": "Bengaluru",
        "timezone": "Asia/Kolkata",
        "operational_status": OperationalStatus.ACTIVE,
    },
    {
        "name": "MechaMind Bengaluru Plant 2",
        "factory_code": "MM-BLR-02",
        "industry_sector": IndustrySector.ELECTRONICS,
        "production_type": ProductionType.BATCH,
        "factory_size": FactorySize.MEDIUM,
        "operational_criticality": OperationalCriticality.MEDIUM,
        "operating_hours": "16/7",
        "number_of_employees": 450,
        "production_capacity": "200,000 units/year",
        "location": "Whitefield, Bengaluru",
        "country": "India",
        "state": "Karnataka",
        "city": "Bengaluru",
        "timezone": "Asia/Kolkata",
        "operational_status": OperationalStatus.ACTIVE,
    },
]

# ─── DEPARTMENTS ─────────────────────────────────────────────────────────────

DEPARTMENTS = [
    {"name": "Production", "type": DepartmentType.PRODUCTION},
    {"name": "Mechanical Maintenance", "type": DepartmentType.MECHANICAL},
    {"name": "Electrical & Instrumentation", "type": DepartmentType.ELECTRICAL},
    {"name": "Quality Control", "type": DepartmentType.QUALITY},
    {"name": "Safety & Compliance", "type": DepartmentType.SAFETY},
    {"name": "IT & Automation", "type": DepartmentType.IT_AUTOMATION},
    {"name": "Engineering", "type": DepartmentType.ENGINEERING},
    {"name": "Operations", "type": DepartmentType.OPERATIONS},
]

# ─── TEAMS ───────────────────────────────────────────────────────────────────

TEAMS = [
    {"name": "Shift A - Production", "description": "Day shift production team"},
    {"name": "Shift B - Production", "description": "Night shift production team"},
    {"name": "Mechanical Repair Crew", "description": "On-call mechanical maintenance"},
    {"name": "Electrical Response Team", "description": "Electrical troubleshooting"},
    {"name": "Quality Inspectors", "description": "QA/QC inspection team"},
    {"name": "Safety Wardens", "description": "Safety compliance patrol"},
    {"name": "Automation Engineers", "description": "PLC and SCADA support"},
]

# ─── USERS ───────────────────────────────────────────────────────────────────

USERS = [
    {"email": "admin@gmail.com", "password": "qwertyuiop", "first_name": "Factory", "last_name": "Owner", "role": "SUPER_ADMIN"},
    {"email": "plant.manager@mechamind.com", "password": "password123", "first_name": "Rajesh", "last_name": "Kumar", "role": "PLANT_MANAGER"},
    {"email": "eng.lead@mechamind.com", "password": "password123", "first_name": "Priya", "last_name": "Sharma", "role": "ENGINEER"},
    {"email": "maintenance@mechamind.com", "password": "password123", "first_name": "Arun", "last_name": "Venkatesh", "role": "MAINTENANCE_TECH"},
    {"email": "operator1@mechamind.com", "password": "password123", "first_name": "Suresh", "last_name": "Rao", "role": "OPERATOR"},
    {"email": "operator2@mechamind.com", "password": "password123", "first_name": "Manoj", "last_name": "Patil", "role": "OPERATOR"},
    {"email": "inspector@mechamind.com", "password": "password123", "first_name": "Anita", "last_name": "Desai", "role": "QUALITY_INSPECTOR"},
    {"email": "safety@mechamind.com", "password": "password123", "first_name": "Vikram", "last_name": "Singh", "role": "SAFETY_OFFICER"},
]

# ─── PRODUCTION LINES ────────────────────────────────────────────────────────

PRODUCTION_LINES = [
    {"name": "Assembly Line 1", "description": "Main product assembly line"},
    {"name": "Assembly Line 2", "description": "Secondary assembly line"},
    {"name": "Packaging Line", "description": "Automated packaging and labeling"},
    {"name": "Raw Material Processing", "description": "Incoming material prep"},
]

# ─── MACHINES ────────────────────────────────────────────────────────────────

MACHINES = [
    {"name": "Centrifugal Pump P-101", "code": "PMP-101", "serial": "SN-P101-2024", "model": "Grundfos CR 45-3", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.HIGH, "dept": "Production", "line": "Raw Material Processing"},
    {"name": "Centrifugal Pump P-102", "code": "PMP-102", "serial": "SN-P102-2024", "model": "Grundfos CR 32-2", "status": MachineStatus.MAINTENANCE, "criticality": AssetCriticality.HIGH, "dept": "Production", "line": "Raw Material Processing"},
    {"name": "Rotary Screw Compressor C-401", "code": "CMP-401", "serial": "SN-C401-2023", "model": "Atlas Copco GA 75", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.CRITICAL, "dept": "Mechanical Maintenance", "line": "Assembly Line 1"},
    {"name": "Industrial Boiler B-601", "code": "BLR-601", "serial": "SN-B601-2023", "model": "Thermax 8TPH", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.CRITICAL, "dept": "Mechanical Maintenance", "line": "Raw Material Processing"},
    {"name": "CNC Milling Machine M-500", "code": "CNC-500", "serial": "SN-M500-2024", "model": "Haas VF-4", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.HIGH, "dept": "Production", "line": "Assembly Line 1"},
    {"name": "CNC Lathe L-200", "code": "CNC-200", "serial": "SN-L200-2024", "model": "DMG Mori NLX 2500", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.HIGH, "dept": "Production", "line": "Assembly Line 2"},
    {"name": "Conveyor Belt CV-301", "code": "CVY-301", "serial": "SN-CV301-2024", "model": "FlexLink X85", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.MEDIUM, "dept": "Production", "line": "Packaging Line"},
    {"name": "Hydraulic Press HP-801", "code": "HPR-801", "serial": "SN-HP801-2023", "model": "Beckwood 150T", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.HIGH, "dept": "Production", "line": "Assembly Line 2"},
    {"name": "Cooling Tower CT-501", "code": "CLT-501", "serial": "SN-CT501-2023", "model": "BAC VXC-250", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.MEDIUM, "dept": "Electrical & Instrumentation", "line": None},
    {"name": "Transformer TF-701 (11kV/415V)", "code": "TFR-701", "serial": "SN-TF701-2022", "model": "Crompton 2.5MVA", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.CRITICAL, "dept": "Electrical & Instrumentation", "line": None},
    {"name": "Robot Welder RW-901", "code": "RBT-901", "serial": "SN-RW901-2024", "model": "Fanuc Arc Mate 100iD", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.HIGH, "dept": "Production", "line": "Assembly Line 1"},
    {"name": "AGV Fleet - Unit 01", "code": "AGV-001", "serial": "SN-AGV01-2024", "model": "MiR 600", "status": MachineStatus.OPERATIONAL, "criticality": AssetCriticality.MEDIUM, "dept": "Operations", "line": "Packaging Line"},
]

# ─── LOCATIONS ────────────────────────────────────────────────────────────────

MACHINE_LOCATIONS = {
    "PMP-101": {"building": "A", "floor": "1", "zone": "Utility Section"},
    "PMP-102": {"building": "A", "floor": "1", "zone": "Utility Section"},
    "CMP-401": {"building": "B", "floor": "1", "zone": "Compressor Room"},
    "BLR-601": {"building": "B", "floor": "0", "zone": "Boiler House"},
    "CNC-500": {"building": "A", "floor": "1", "zone": "Machining Bay"},
    "CNC-200": {"building": "A", "floor": "1", "zone": "Machining Bay"},
    "CVY-301": {"building": "A", "floor": "2", "zone": "Packaging Area"},
    "HPR-801": {"building": "A", "floor": "1", "zone": "Press Shop"},
    "CLT-501": {"building": "C", "floor": "0", "zone": "Utility Yard"},
    "TFR-701": {"building": "C", "floor": "0", "zone": "Electrical Substation"},
    "RBT-901": {"building": "A", "floor": "1", "zone": "Welding Station"},
    "AGV-001": {"building": "A", "floor": "2", "zone": "Logistics Corridor"},
}

# ─── DOCUMENTS ────────────────────────────────────────────────────────────────

DOCUMENTS = [
    {
        "title": "OSHA Safety Guidelines 2026",
        "description": "Standard safety protocols for manufacturing environments",
        "type": DocumentType.SAFETY_DOCUMENT, "filename": "osha_safety_2026.txt",
        "content": """MECHAMIND FACTORY SAFETY PROTOCOL - OSHA COMPLIANT

1. HAZMAT HANDLING: All hazardous materials must be stored in Class-1 certified containers. In case of a spill, immediately contact the safety officer and use the neutralizing agent at Station B.

2. FIRE SAFETY: In the event of a fire, do NOT use water on electrical equipment. Use CO2 extinguishers only. Assembly point: North Parking Lot.

3. CONFINED SPACE ENTRY: No personnel may enter a confined space without a signed permit from the floor supervisor. A spotter must be present outside the space. Air quality must be tested every 30 minutes.

4. EMERGENCY SHUTDOWN: If an uncontrolled mechanical failure occurs, hit the primary E-Stop on the main control panel. Do not attempt to physically block moving machinery."""
    },
    {
        "title": "CNC Milling Machine M-500 Manual",
        "description": "Operation and troubleshooting guide for Haas VF-4 CNC Machine",
        "type": DocumentType.MAINTENANCE_MANUAL, "filename": "cnc_m500_manual.txt",
        "content": """M-500 CNC MILLING MACHINE - OPERATOR MANUAL

1. DAILY CALIBRATION: Before running any batch, spindle must be calibrated to +/- 0.005mm tolerance. Use the laser alignment tool.

2. TROUBLESHOOTING:
  Spindle Stalling: Check coolant flow. Insufficient coolant causes overheating triggering auto-stall safety. Clean coolant filter.
  Axis Misalignment: If X or Y drifts, inspect servo motor encoders. Dust can interfere with optical sensors. Clean with compressed air.

3. MAINTENANCE SCHEDULE:
  Weekly: Check hydraulic fluid levels.
  Monthly: Inspect and replace cutting inserts if wear exceeds 15%."""
    },
    {
        "title": "Industrial Boiler B-601 Operations Guide",
        "description": "SOP and emergency handling for Thermax 8TPH boiler",
        "type": DocumentType.SOP, "filename": "boiler_b601_sop.txt",
        "content": """B-601 INDUSTRIAL BOILER - OPERATIONS GUIDE

1. STARTUP: Ensure blowdown valves closed. Open main water feed valve. Verify water level sight glass shows at least 50%. Ignite pilot via automated sequence.

2. PRESSURE REGULATION: Nominal operating pressure 150 PSI. If pressure exceeds 180 PSI, automated PRV engages. If it fails, manually open emergency blowoff valve.

3. TROUBLESHOOTING - Water Level Dropping Rapidly: Check feedwater pump P-302. If pump is cavitating, it may have lost prime. Stop boiler immediately to prevent dry firing.

4. ROUTINE MAINTENANCE: Daily: Blow down boiler to remove sludge. Quarterly: Inspect refractory lining for cracks."""
    },
    {
        "title": "Compressor C-401 Service Manual",
        "description": "Service guidelines for Atlas Copco GA 75 rotary screw compressor",
        "type": DocumentType.MAINTENANCE_MANUAL, "filename": "compressor_c401_service.txt",
        "content": """C-401 ROTARY SCREW COMPRESSOR - SERVICE MANUAL

1. OPERATING PARAMETERS: 3600 RPM, 120 CFM at 100 PSI. Optimal oil temperature: 185°F (85°C).

2. OIL CHANGES: Change synthetic compressor oil every 8,000 running hours. Also replace oil filter and air/oil separator element.

3. TROUBLESHOOTING:
  High Discharge Temperature (>220°F): Unit will trip. Check thermal valve. Stuck valve prevents oil flow through cooler.
  Excessive Oil Carryover: Separator element ruptured or scavenge line blocked. Inspect clear scavenge line for oil flow."""
    },
    {
        "title": "Pump P-101 Maintenance Procedure",
        "description": "Maintenance and alignment for Grundfos CR 45-3 centrifugal pump",
        "type": DocumentType.MAINTENANCE_MANUAL, "filename": "pump_p101_maintenance.txt",
        "content": """P-101 CENTRIFUGAL PUMP - MAINTENANCE PROCEDURE

1. ALIGNMENT: Laser align pump and motor shafts to within 0.002 inches. Misalignment is leading cause of bearing and seal failure.

2. MECHANICAL SEAL REPLACEMENT: Isolate pump and drain casing. Remove coupling and seal gland. Use soapy water on O-rings. Do NOT touch carbon seal faces.

3. VIBRATION ANALYSIS: Baseline vibration < 0.15 in/sec. 1x RPM spike = unbalance. 2x RPM spike = misalignment.

4. LUBRICATION: Grease motor bearings every 3 months with Polyurea grease. Do not over-grease."""
    },
    {
        "title": "Hydraulic Press HP-801 Inspection Report",
        "description": "Quarterly inspection findings for Beckwood 150T press",
        "type": DocumentType.INSPECTION_REPORT, "filename": "hp801_inspection_q1.txt",
        "content": """HP-801 HYDRAULIC PRESS - Q1 2026 INSPECTION REPORT

Inspected by: Arun Venkatesh
Date: 2026-01-15

FINDINGS:
1. Hydraulic fluid level - OK (within range)
2. Pressure gauge calibration - OK
3. Safety guards - OK
4. Ram seals - SLIGHT WEAR detected, estimated 3 months remaining
5. Emergency stop - Functional

RECOMMENDATIONS:
- Schedule seal replacement by April 2026
- Monitor hydraulic pressure during full-load cycles"""
    },
    {
        "title": "Incident Report: Pump P-102 Seal Failure",
        "description": "Root cause analysis of mechanical seal failure on P-102",
        "type": DocumentType.INCIDENT_REPORT, "filename": "p102_seal_failure.txt",
        "content": """INCIDENT REPORT - PUMP P-102 MECHANICAL SEAL FAILURE

Date: 2026-06-20 | Reported by: Operator Suresh Rao
Severity: HIGH

DESCRIPTION: At 14:30 hrs, operator observed fluid leaking from pump P-102. Leak rate estimated at 5 L/min. Pump was immediately isolated.

ROOT CAUSE: Mechanical seal failure due to dry running. Investigation revealed the suction strainer was clogged with debris, causing cavitation and seal face damage.

ACTION TAKEN: Pump isolated, spare seal installed. Strainer cleaned. System back online at 17:45 hrs.

RECOMMENDATIONS: Install differential pressure gauge across strainer. Add strainer cleaning to weekly PM schedule."""
    },
    {
        "title": "Energy Audit Report - Q2 2026",
        "description": "Factory-wide energy consumption analysis and recommendations",
        "type": DocumentType.OTHER, "filename": "energy_audit_q2_2026.txt",
        "content": """ENERGY AUDIT REPORT - Q2 2026

Total Consumption: 2.45 MWh
Top Consumers:
1. Compressor C-401: 28% of total - RECOMMEND: Install VFD
2. Boiler B-601: 22% of total - RECOMMEND: Optimize burn sequence
3. CNC Machines: 18% of total - RECOMMEND: Standby mode after 15min idle

Cost Savings Identified: ₹12.5 Lakhs/year
Payback Period: 14 months"""
    },
]

# ─── MAINTENANCE RECORDS ─────────────────────────────────────────────────────

MAINTENANCE_RECORDS = [
    {"machine": "PMP-101", "type": MaintenanceType.INSPECTION, "desc": "Monthly vibration analysis and alignment check", "hours": 2.0, "cost": 5000},
    {"machine": "PMP-101", "type": MaintenanceType.LUBRICATION, "desc": "Motor bearing greasing - quarterly", "hours": 1.0, "cost": 2000},
    {"machine": "CMP-401", "type": MaintenanceType.PREVENTIVE, "desc": "Oil change + filter replacement - 8000 hrs service", "hours": 3.0, "cost": 45000},
    {"machine": "CMP-401", "type": MaintenanceType.INSPECTION, "desc": "Weekly belt tension check and condensate drain", "hours": 0.5, "cost": 800},
    {"machine": "BLR-601", "type": MaintenanceType.INSPECTION, "desc": "Daily blowdown and water level verification", "hours": 0.5, "cost": 500},
    {"machine": "BLR-601", "type": MaintenanceType.CALIBRATION, "desc": "Pressure relief valve calibration", "hours": 2.0, "cost": 12000},
    {"machine": "CNC-500", "type": MaintenanceType.PREVENTIVE, "desc": "Weekly coolant system check and filter clean", "hours": 1.0, "cost": 3000},
    {"machine": "CNC-500", "type": MaintenanceType.INSPECTION, "desc": "Daily spindle warmup and calibration verification", "hours": 0.5, "cost": 1500},
    {"machine": "HPR-801", "type": MaintenanceType.INSPECTION, "desc": "Hydraulic fluid level and pressure check", "hours": 1.0, "cost": 2500},
    {"machine": "TFR-701", "type": MaintenanceType.INSPECTION, "desc": "Transformer oil sampling and DGA analysis", "hours": 2.0, "cost": 8500},
    {"machine": "PMP-102", "type": MaintenanceType.CORRECTIVE, "desc": "Emergency mechanical seal replacement after failure", "hours": 4.0, "cost": 35000},
]

# ─── FAILURE EVENTS ──────────────────────────────────────────────────────────

FAILURES = [
    {"machine": "PMP-102", "type": FailureType.LEAKAGE, "severity": FailureSeverity.HIGH, "desc": "Mechanical seal failure - fluid leak", "root_cause": "Dry run due to clogged strainer", "resolution": "Seal replaced, strainer cleaned", "cost": 35000},
    {"machine": "CMP-401", "type": FailureType.OVERHEATING, "severity": FailureSeverity.MEDIUM, "desc": "High discharge temperature triggered auto-shutdown", "root_cause": "Thermal valve stuck closed", "resolution": "Thermal valve replaced, oil cooler flushed", "cost": 18000},
    {"machine": "CNC-500", "type": FailureType.MECHANICAL, "severity": FailureSeverity.MEDIUM, "desc": "X-axis servo motor encoder error", "root_cause": "Dust contamination on optical encoder", "resolution": "Encoder cleaned and recalibrated", "cost": 5000},
    {"machine": "BLR-601", "type": FailureType.PRESSURE, "severity": FailureSeverity.HIGH, "desc": "Pressure spike to 195 PSI - PRV engaged", "root_cause": "Feedwater pump surge due to air in line", "resolution": "System purged, feed pump re-primed", "cost": 12000},
]

# ─── VISION MEDIA ────────────────────────────────────────────────────────────

VISION_MEDIA = [
    {"type": MediaType.IMAGE, "file": "pump_leak_detection.jpg", "machine": "PMP-101", "size": 2450000},
    {"type": MediaType.IMAGE, "file": "conveyor_belt_inspection.jpg", "machine": "CVY-301", "size": 3100000},
    {"type": MediaType.VIDEO, "file": "robot_weld_quality.mp4", "machine": "RBT-901", "size": 15000000},
]

VISION_ANALYSES = [
    {"severity": FindingSeverity.MAJOR, "confidence": 0.94, "defects": [{"type": DefectType.LEAKAGE, "severity": FindingSeverity.MAJOR, "confidence": 0.94, "desc": "Fluid leak detected at pump seal area", "location": {"x": 120, "y": 85, "w": 45, "h": 30}}]},
    {"severity": FindingSeverity.MINOR, "confidence": 0.87, "defects": [{"type": DefectType.WEAR, "severity": FindingSeverity.MINOR, "confidence": 0.87, "desc": "Belt surface wear detected - 30% degradation", "location": {"x": 200, "y": 150, "w": 300, "h": 40}}]},
    {"severity": FindingSeverity.CRITICAL, "confidence": 0.96, "defects": [{"type": DefectType.CRACK, "severity": FindingSeverity.CRITICAL, "confidence": 0.96, "desc": "Weld crack detected on joint J-12 - 4mm length", "location": {"x": 450, "y": 320, "w": 15, "h": 4}}]},
]

# ─── IOT DEVICES ─────────────────────────────────────────────────────────────

IOT_DEVICES = [
    {"name": "Vibration Sensor VT-101", "code": "VT-101", "machine": "PMP-101", "type": "VIBRATION"},
    {"name": "Temperature Probe TP-201", "code": "TP-201", "machine": "CMP-401", "type": "TEMPERATURE"},
    {"name": "Pressure Transmitter PT-301", "code": "PT-301", "machine": "BLR-601", "type": "PRESSURE"},
    {"name": "Vibration Sensor VT-102", "code": "VT-102", "machine": "CNC-500", "type": "VIBRATION"},
    {"name": "Energy Meter EM-401", "code": "EM-401", "machine": "CMP-401", "type": "ENERGY"},
    {"name": "Flow Meter FM-501", "code": "FM-501", "machine": "PMP-101", "type": "FLOW"},
    {"name": "Temperature Probe TP-202", "code": "TP-202", "machine": "BLR-601", "type": "TEMPERATURE"},
]

# ═══════════════════════════════════════════════════════════════════════════════
#  SEEDING LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

async def seed_all():
    print("=" * 60)
    print("MECHAMIND OS 2.0 - SEEDING EXAMPLE DATA")
    print("=" * 60)

    async with AsyncSessionLocal() as db:
        # ── Organizations ──────────────────────────────────────────────
        print("\n1. Seeding Organizations...")
        orgs = {}
        for org_data in ORGANIZATIONS:
            org = Organization(**org_data)
            db.add(org)
            await db.flush()
            orgs[org_data["name"]] = org
            print(f"   ✓ {org.name} (ID: {org.id})")

        # ── Roles ──────────────────────────────────────────────────────
        print("\n2. Seeding Roles...")
        role_names = ["SUPER_ADMIN", "PLANT_MANAGER", "ENGINEER", "MAINTENANCE_TECH", "OPERATOR", "QUALITY_INSPECTOR", "SAFETY_OFFICER"]
        roles = {}
        for i, name in enumerate(role_names):
            role = Role(id=uuid.UUID(int=i+1), name=name, description=f"{name.replace('_', ' ').title()} role", organization_id=orgs["MechaMind Industries"].id)
            db.add(role)
            await db.flush()
            roles[name] = role
            print(f"   ✓ {name}")

        # ── Factories ──────────────────────────────────────────────────
        print("\n3. Seeding Factories...")
        factories = {}
        factory_dept_map = {}
        main_org = orgs["MechaMind Industries"]
        for fac_data in FACTORIES:
            fac = Factory(organization_id=main_org.id, **fac_data)
            db.add(fac)
            await db.flush()
            factories[fac_data["name"]] = fac
            factory_dept_map[fac.id] = []
            print(f"   ✓ {fac.name}")

        # ── Departments per Factory ────────────────────────────────────
        print("\n4. Seeding Departments...")
        departments = {}
        for fac_name, fac in factories.items():
            for dept_data in DEPARTMENTS:
                dept = Department(factory_id=fac.id, name=dept_data["name"], department_type=dept_data["type"])
                db.add(dept)
                await db.flush()
                departments[dept_data["name"]] = dept
                factory_dept_map[fac.id].append(dept)
                print(f"   ✓ {dept.name} @ {fac_name}")
                await asyncio.sleep(0.01)

        # ── Teams per Department ───────────────────────────────────────
        print("\n5. Seeding Teams...")
        prod_dept = departments["Production"]
        mech_dept = departments["Mechanical Maintenance"]
        elec_dept = departments["Electrical & Instrumentation"]
        safety_dept = departments["Safety & Compliance"]
        it_dept = departments["IT & Automation"]

        dept_team_map = {
            "Production": ["Shift A - Production", "Shift B - Production"],
            "Mechanical Maintenance": ["Mechanical Repair Crew"],
            "Electrical & Instrumentation": ["Electrical Response Team"],
            "Quality Control": ["Quality Inspectors"],
            "Safety & Compliance": ["Safety Wardens"],
            "IT & Automation": ["Automation Engineers"],
        }

        teams = {}
        for dept_name, team_names in dept_team_map.items():
            dept = departments[dept_name]
            for tname in team_names:
                team_info = next(t for t in TEAMS if t["name"] == tname)
                team = Team(department_id=dept.id, name=team_info["name"], description=team_info["description"])
                db.add(team)
                await db.flush()
                teams[tname] = team
                print(f"   ✓ {team.name} @ {dept_name}")
                await asyncio.sleep(0.01)

        # ── Users ──────────────────────────────────────────────────────
        print("\n6. Seeding Users...")
        users = {}
        for user_data in USERS:
            user = User(
                organization_id=main_org.id,
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                status=UserStatus.ACTIVE
            )
            db.add(user)
            await db.flush()

            # Assign role
            role = roles[user_data["role"]]
            ur = UserRole(user_id=user.id, role_id=role.id)
            db.add(ur)

            users[user_data["role"]] = user
            print(f"   ✓ {user.first_name} {user.last_name} ({user.email}) as {user_data['role']}")

        await db.commit()

        # ── Production Lines ───────────────────────────────────────────
        print("\n7. Seeding Production Lines...")
        main_factory = factories["MechaMind Bengaluru Plant 1"]
        lines = {}
        for pl_data in PRODUCTION_LINES:
            pl = ProductionLine(factory_id=main_factory.id, department_id=departments["Production"].id, **pl_data)
            db.add(pl)
            await db.flush()
            lines[pl_data["name"]] = pl
            print(f"   ✓ {pl.name}")

        await db.commit()

        # ── Machines ──────────────────────────────────────────────────
        print("\n8. Seeding Machines...")
        machines = {}
        for m_data in MACHINES:
            dept = departments.get(m_data["dept"], departments["Production"])
            line = lines.get(m_data["line"]) if m_data["line"] else None
            machine = Machine(
                factory_id=main_factory.id,
                department_id=dept.id,
                production_line_id=line.id if line else None,
                name=m_data["name"],
                machine_code=m_data["code"],
                serial_number=m_data["serial"],
                model_number=m_data["model"],
                operational_status=m_data["status"],
                criticality_level=m_data["criticality"],
                installation_date=datetime.datetime(2023, random.randint(1, 12), random.randint(1, 28), tzinfo=datetime.timezone.utc),
                commission_date=datetime.datetime(2024, random.randint(1, 6), random.randint(1, 28), tzinfo=datetime.timezone.utc),
            )
            db.add(machine)
            await db.flush()
            machines[m_data["code"]] = machine

            # Location
            loc_data = MACHINE_LOCATIONS[m_data["code"]]
            loc = MachineLocation(
                machine_id=machine.id,
                building=loc_data["building"],
                floor=loc_data["floor"],
                zone=loc_data["zone"],
            )
            db.add(loc)

            # Status history
            status_entry = MachineStatusHistory(
                machine_id=machine.id,
                changed_by_id=users["MAINTENANCE_TECH"].id,
                new_status=m_data["status"],
                reason="Initial commissioning / demo seed"
            )
            db.add(status_entry)
            print(f"   ✓ {machine.name} ({machine.machine_code})")

        await db.commit()

        # ── Documents ─────────────────────────────────────────────────
        print("\n9. Seeding Documents...")
        admin_user = users["SUPER_ADMIN"]
        eng_user = users["ENGINEER"]
        for doc_data in DOCUMENTS:
            file_path = f"./storage/documents/{doc_data['filename']}"
            doc = Document(
                organization_id=main_org.id,
                factory_id=main_factory.id,
                uploaded_by_id=eng_user.id,
                title=doc_data["title"],
                description=doc_data["description"],
                document_type=doc_data["type"],
                version="1.0",
                file_name=doc_data["filename"],
                file_path=file_path,
                file_size=len(doc_data["content"]),
                mime_type="text/plain",
                processing_status=ProcessingStatus.COMPLETED,
            )
            db.add(doc)
            await db.flush()
            print(f"   ✓ {doc.title}")

        await db.commit()

        # ── Maintenance Records ────────────────────────────────────────
        print("\n10. Seeding Maintenance Records...")
        tech_user = users["MAINTENANCE_TECH"]
        for m_data in MAINTENANCE_RECORDS:
            machine = machines[m_data["machine"]]
            days_ago = random.randint(1, 90)
            record = MaintenanceRecord(
                organization_id=main_org.id,
                factory_id=main_factory.id,
                machine_id=machine.id,
                maintenance_type=m_data["type"],
                status=MaintenanceStatus.COMPLETED,
                description=m_data["desc"],
                performed_by=tech_user.id,
                date=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days_ago),
                duration_hours=m_data["hours"],
                cost=m_data["cost"],
            )
            db.add(record)
            print(f"   ✓ {m_data['type'].value} on {machine.name}")

        await db.commit()

        # ── Failure Events ─────────────────────────────────────────────
        print("\n11. Seeding Failure Events...")
        for f_data in FAILURES:
            machine = machines[f_data["machine"]]
            days_ago = random.randint(10, 60)
            event = FailureEvent(
                organization_id=main_org.id,
                factory_id=main_factory.id,
                machine_id=machine.id,
                failure_type=f_data["type"],
                severity=f_data["severity"],
                description=f_data["desc"],
                detected_date=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days_ago),
                resolved_date=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days_ago - 1),
                root_cause=f_data["root_cause"],
                resolution=f_data["resolution"],
                cost_impact=f_data["cost"],
            )
            db.add(event)
            print(f"   ✓ {f_data['type'].value} on {machine.name}")

        await db.commit()

        # ── IoT Devices ───────────────────────────────────────────────
        print("\n12. Seeding IoT Devices...")
        for iot_data in IOT_DEVICES:
            machine = machines[iot_data["machine"]]
            device = IoTDevice(
                machine_id=machine.id,
                factory_id=main_factory.id,
                name=iot_data["name"],
                device_code=iot_data["code"],
                sensor_type=iot_data["type"],
                status="ONLINE",
                is_active=True,
            )
            db.add(device)
            print(f"   ✓ {iot_data['name']} on {machine.name}")

        await db.commit()

        # ── Vision Media ──────────────────────────────────────────────
        print("\n13. Seeding Vision Media...")
        for i, vm_data in enumerate(VISION_MEDIA):
            machine = machines[vm_data["machine"]]
            media = MediaFile(
                organization_id=main_org.id,
                factory_id=main_factory.id,
                uploaded_by=tech_user.id,
                asset_id=machine.id,
                file_type=vm_data["type"],
                file_path=f"/tmp/mechamind/vision_uploads/{vm_data['file']}",
                file_size=vm_data["size"],
                status=AnalysisStatus.COMPLETED,
            )
            db.add(media)
            await db.flush()

            # Vision Analysis
            analysis_data = VISION_ANALYSES[i]
            analysis = VisionAnalysis(
                media_id=media.id,
                asset_id=machine.id,
                analysis_type="YOLOv8_DEFECT_DETECTION",
                result={"model": "yolov8n", "inference_time_ms": 245, "image_resolution": "1920x1080"},
                confidence_score=analysis_data["confidence"],
                severity=analysis_data["severity"],
            )
            db.add(analysis)
            await db.flush()

            # Detected Defects
            for defect_data in analysis_data["defects"]:
                defect = DetectedDefect(
                    analysis_id=analysis.id,
                    defect_type=defect_data["type"],
                    location=defect_data["location"],
                    severity=defect_data["severity"],
                    confidence=defect_data["confidence"],
                    description=defect_data["desc"],
                )
                db.add(defect)

            print(f"   ✓ {vm_data['file']} - {len(analysis_data['defects'])} defect(s) found")

        await db.commit()

        print("\n" + "=" * 60)
        print("✅ SEEDING COMPLETE!")
        print("=" * 60)
        print(f"\nSummary:")
        print(f"  Organizations:  {len(ORGANIZATIONS)}")
        print(f"  Factories:      {len(FACTORIES)}")
        print(f"  Departments:    {len(DEPARTMENTS)}")
        print(f"  Teams:          {len(TEAMS)}")
        print(f"  Users:          {len(USERS)}")
        print(f"  Roles:          {len(role_names)}")
        print(f"  Production Ln:  {len(PRODUCTION_LINES)}")
        print(f"  Machines:       {len(MACHINES)}")
        print(f"  Documents:      {len(DOCUMENTS)}")
        print(f"  Maintenance:    {len(MAINTENANCE_RECORDS)}")
        print(f"  Failures:       {len(FAILURES)}")
        print(f"  IoT Devices:    {len(IOT_DEVICES)}")
        print(f"  Vision Media:   {len(VISION_MEDIA)}")
        print(f"\nLogin: admin@gmail.com / qwertyuiop")
        print(f"       plant.manager@mechamind.com / password123")

if __name__ == "__main__":
    asyncio.run(seed_all())
