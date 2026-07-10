from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.iot import IoTDevice, Sensor
from app.repositories.iot import iot_repository

class DeviceService:
    
    async def register_device(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, data: dict) -> IoTDevice:
        
        device = IoTDevice(
            organization_id=organization_id,
            factory_id=factory_id,
            machine_id=data["machine_id"],
            device_name=data["device_name"],
            device_type=data["device_type"],
            serial_number=data["serial_number"]
        )
        
        sensors = []
        for s_data in data.get("sensors", []):
            sensors.append(Sensor(
                sensor_type=s_data["sensor_type"],
                measurement_unit=s_data["measurement_unit"],
                min_threshold=s_data.get("min_threshold"),
                max_threshold=s_data.get("max_threshold")
            ))
            
        return await iot_repository.create_device(db, device, sensors)

device_service = DeviceService()
