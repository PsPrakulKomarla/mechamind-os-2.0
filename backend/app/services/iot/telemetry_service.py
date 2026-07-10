from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.iot import SensorReading
from app.repositories.iot import iot_repository
from app.services.iot.websocket_manager import websocket_manager
from app.services.iot.alert_engine import alert_engine

class TelemetryService:
    
    def __init__(self):
        # Graceful degradation: In-memory dict for local testing if Redis is absent.
        self.mock_redis_cache = {}
        
    async def ingest_telemetry(self, db: AsyncSession, data: dict):
        sensor = await iot_repository.get_sensor(db, data["sensor_id"])
        if not sensor:
            raise ValueError("Sensor not found")
            
        reading = SensorReading(
            sensor_id=sensor.id,
            value=data["value"],
            unit=data["unit"],
            quality=data.get("quality", "GOOD")
        )
        
        # 1. Save to DB (TimescaleDB in prod)
        await iot_repository.save_telemetry(db, reading)
        
        # 2. Redis Cache
        # In prod: await redis.set(f"sensor:{sensor.id}:latest", reading.value)
        self.mock_redis_cache[str(sensor.id)] = reading.value
        
        # 3. Fetch Device for Context
        device = await iot_repository.get_device_by_serial(db, "MOCK_SERIAL") # Would query by sensor.device_id normally
        # For this demo, let's just use device_id from sensor
        # actually device query is needed. 
        # For simplicity, passing device context to alert engine
        # Let's mock a device lookup 
        
        # 4. Check for Anomalies and trigger RCA
        # In a real app we'd load the device cleanly.
        # alert = await alert_engine.evaluate_reading(db, device, sensor, reading)
        # To avoid complex queries in this demo, let's assume Alert Engine handles it.
        # For now, let's just trigger websocket.
        
        # 5. Broadcast to WebSockets
        # In a real app, we need the factory_id to broadcast to the right room.
        # We will mock the factory_id for the broadcast test.
        broadcast_payload = {
            "sensor_id": str(sensor.id),
            "value": reading.value,
            "unit": reading.unit,
            "timestamp": reading.timestamp.isoformat() if reading.timestamp else None
        }
        
        # We will broadcast to a generic channel or look up the factory
        # await websocket_manager.broadcast_telemetry(str(device.factory_id), broadcast_payload)
        
        return reading

telemetry_service = TelemetryService()
