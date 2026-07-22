import asyncio
import uuid
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text

from app.db.session import AsyncSessionLocal
from app.models.organization import Organization
from app.models.factory import Factory
from app.models.department import Department
from app.models.building import Building
from app.models.machine import ProductionLine, Machine
from app.models.component import Component
from app.models.iot import Sensor, SensorReading
from app.models.supplier import Supplier
from app.models.inventory import InventoryItem
from app.models.purchase_order import PurchaseOrder, PurchaseOrderItem
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.maintenance import MaintenanceRecord
from app.models.document import Document
from app.models.enums import (
    IndustrySector, OperationalStatus, FactorySize, MachineStatus, AssetCriticality,
    SensorType, MaintenanceType, MaintenanceStatus, DocumentType
)
from app.core.security import get_password_hash

fake = Faker()
Faker.seed(42)
random.seed(42)

async def clear_db(db: AsyncSession):
    # Optional clear logic; since user said 'append', we don't clear.
    pass

def generate_telemetry(sensor_id, days=30):
    readings = []
    base_val = random.uniform(20.0, 80.0)
    for i in range(days * 24): # hourly
        ts = datetime.now() - timedelta(days=30) + timedelta(hours=i)
        # add some noise
        val = base_val + random.uniform(-5.0, 5.0)
        # introduce anomalies
        if random.random() < 0.01:
            val += random.uniform(20.0, 50.0)
        readings.append(SensorReading(
            sensor_id=sensor_id,
            value=val,
            timestamp=ts
        ))
    return readings

async def run():
    async with AsyncSessionLocal() as db:
        print("Starting massive enterprise data generation...")
        
        print("Generating Organizations...")
        orgs = []
        for _ in range(2):
            org = Organization(
                name=fake.company(),
                status="ACTIVE",
                industry=random.choice(list(IndustrySector))
            )
            db.add(org)
            orgs.append(org)
        await db.flush()

        for org in orgs:
            print(f"Generating data for Org: {org.name}")
            
            # Suppliers
            suppliers = []
            for _ in range(5):
                sup = Supplier(
                    organization_id=org.id,
                    name=fake.company() + " Supply",
                    contact_email=fake.company_email(),
                    lead_time_days=random.uniform(2, 14),
                    rating=random.uniform(3.5, 5.0)
                )
                db.add(sup)
                suppliers.append(sup)
            await db.flush()

            # Factories
            factories = []
            for _ in range(3):
                fac = Factory(
                    organization_id=org.id,
                    name=f"{fake.city()} Manufacturing Plant",
                    factory_code=fake.bothify(text='FAC-####'),
                    country=fake.country(),
                    city=fake.city(),
                    operational_status=OperationalStatus.ACTIVE,
                    factory_size=random.choice(list(FactorySize)),
                    timezone=fake.timezone()
                )
                db.add(fac)
                factories.append(fac)
            await db.flush()
            
            # Users
            users = []
            roles = ["Technician", "Plant Manager", "Operator", "Quality Inspector"]
            for _ in range(10):
                u = User(
                    organization_id=org.id,
                    email=fake.unique.email(),
                    hashed_password=get_password_hash("password123"),
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    is_active=True
                )
                db.add(u)
                users.append(u)
            await db.flush()

            for fac in factories:
                print(f"  Generating layout for Factory: {fac.name}")
                # Buildings
                buildings = []
                for b_name in ["Production Hall A", "Production Hall B", "Warehouse", "Utilities"]:
                    b = Building(factory_id=fac.id, name=b_name, purpose=b_name.split()[0].upper())
                    db.add(b)
                    buildings.append(b)
                await db.flush()
                
                # Departments
                depts = []
                for d_name in ["Maintenance", "Production", "Quality Assurance", "Logistics"]:
                    d = Department(factory_id=fac.id, name=d_name)
                    db.add(d)
                    depts.append(d)
                await db.flush()
                
                # Production Lines
                lines = []
                for i in range(3):
                    pl = ProductionLine(
                        factory_id=fac.id, 
                        department_id=depts[1].id, # Production
                        name=f"Assembly Line {i+1}"
                    )
                    db.add(pl)
                    lines.append(pl)
                await db.flush()
                
                # Inventory Items
                inventory = []
                for sup in suppliers:
                    for _ in range(5):
                        inv = InventoryItem(
                            factory_id=fac.id,
                            supplier_id=sup.id,
                            building_id=buildings[2].id, # Warehouse
                            sku=fake.bothify(text='SKU-########'),
                            name=fake.word().capitalize() + " Part",
                            quantity=random.randint(50, 500)
                        )
                        db.add(inv)
                        inventory.append(inv)
                await db.flush()
                
                # Machines
                for line in lines:
                    for _ in range(4):
                        m = Machine(
                            factory_id=fac.id,
                            department_id=depts[1].id,
                            production_line_id=line.id,
                            name=fake.catch_phrase(),
                            machine_code=fake.bothify(text='MAC-######'),
                            serial_number=fake.bothify(text='SN-########'),
                            operational_status=MachineStatus.OPERATIONAL,
                            criticality_level=random.choice(list(AssetCriticality))
                        )
                        db.add(m)
                        await db.flush()
                        
                        # Components
                        for c_name in ["Primary Motor", "Hydraulic Pump", "Conveyor Belt"]:
                            c = Component(
                                machine_id=m.id,
                                name=c_name,
                                component_type=c_name.split()[-1],
                                serial_number=fake.bothify(text='CMP-######')
                            )
                            db.add(c)
                        await db.flush()
                        
                        # Sensors
                        sensors = []
                        for s_type in [SensorType.TEMPERATURE, SensorType.VIBRATION]:
                            s = Sensor(
                                factory_id=fac.id,
                                machine_id=m.id,
                                sensor_id=fake.bothify(text='SNS-########'),
                                name=f"{s_type.value} Sensor",
                                sensor_type=s_type,
                                is_active=True
                            )
                            db.add(s)
                            sensors.append(s)
                        await db.flush()
                        
                        # Readings
                        for s in sensors:
                            readings = generate_telemetry(s.id, days=5) # Reduced to 5 days to save generation time
                            db.add_all(readings)
                        
                        # Maintenance Records
                        for _ in range(3):
                            mr = MaintenanceRecord(
                                machine_id=m.id,
                                title=fake.sentence(),
                                description=fake.text(),
                                maintenance_type=random.choice(list(MaintenanceType)),
                                status=MaintenanceStatus.COMPLETED,
                                scheduled_date=datetime.now() - timedelta(days=random.randint(1, 30)),
                                completion_date=datetime.now() - timedelta(days=random.randint(1, 30)),
                                assigned_to_id=random.choice(users).id,
                                cost=random.uniform(100.0, 5000.0)
                            )
                            db.add(mr)
                        
                        # Documents
                        doc = Document(
                            organization_id=org.id,
                            factory_id=fac.id,
                            title=f"{m.name} Operation Manual",
                            document_type=DocumentType.MAINTENANCE_MANUAL,
                            file_name=f"{m.machine_code}_manual.pdf",
                            file_path=f"fake/{m.machine_code}_manual.pdf",
                            file_size=102400,
                            mime_type="application/pdf",
                            processing_status="COMPLETED"
                        )
                        db.add(doc)
                await db.commit() # Commit per factory to save memory

        print("Enterprise Data Generation Complete!")

if __name__ == "__main__":
    asyncio.run(run())
