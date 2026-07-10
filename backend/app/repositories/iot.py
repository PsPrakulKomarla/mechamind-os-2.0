from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.models.iot import IoTDevice, Sensor, SensorReading, MachineAlert

class IoTRepository:
    
    async def create_device(self, db: AsyncSession, device: IoTDevice, sensors: list[Sensor]) -> IoTDevice:
        db.add(device)
        await db.flush()
        
        for s in sensors:
            s.device_id = device.id
            db.add(s)
            
        await db.commit()
        await db.refresh(device)
        return device
        
    async def get_device_by_serial(self, db: AsyncSession, serial_number: str) -> IoTDevice:
        query = select(IoTDevice).where(IoTDevice.serial_number == serial_number)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_sensor(self, db: AsyncSession, sensor_id: UUID) -> Sensor:
        return await db.get(Sensor, sensor_id)

    async def save_telemetry(self, db: AsyncSession, reading: SensorReading) -> SensorReading:
        # In a real system, this would batch insert to TimescaleDB
        db.add(reading)
        await db.commit()
        await db.refresh(reading)
        return reading
        
    async def save_alert(self, db: AsyncSession, alert: MachineAlert) -> MachineAlert:
        db.add(alert)
        await db.commit()
        await db.refresh(alert)
        return alert
        
    async def get_alerts_for_factory(self, db: AsyncSession, factory_id: UUID) -> list[MachineAlert]:
        # Would require a join to IoTDevice -> Factory or Machine -> Factory
        # Simplified query for now.
        query = select(MachineAlert).order_by(MachineAlert.created_at.desc()).limit(50)
        result = await db.execute(query)
        return result.scalars().all()

iot_repository = IoTRepository()
