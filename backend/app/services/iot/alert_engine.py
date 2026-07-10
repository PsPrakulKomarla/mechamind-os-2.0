from sqlalchemy.ext.asyncio import AsyncSession

from app.models.iot import Sensor, SensorReading, MachineAlert, IoTDevice
from app.models.enums import FindingSeverity
from app.repositories.iot import iot_repository
from app.services.iot.anomaly_detector import anomaly_detector
from app.services.maintenance.rca_engine import rca_engine

class AlertEngine:
    """
    Evaluates sensor readings, generates alerts, and links directly to RCA Engine.
    """
    
    async def evaluate_reading(self, db: AsyncSession, device: IoTDevice, sensor: Sensor, reading: SensorReading):
        anomaly = anomaly_detector.detect_anomalies(sensor, reading)
        
        if anomaly:
            # 1. Create Machine Alert
            alert = MachineAlert(
                machine_id=device.machine_id,
                alert_type=anomaly["alert_type"],
                severity=FindingSeverity(anomaly["severity"]),
                message=anomaly["message"],
                sensor_data={"sensor_id": str(sensor.id), "value": reading.value}
            )
            await iot_repository.save_alert(db, alert)
            
            # 2. If Critical, immediately trigger the AI RCA Engine
            if alert.severity == FindingSeverity.CRITICAL:
                # Fire and forget / background task in production. 
                # For this phase, we await it.
                await rca_engine.analyze_failure(
                    db=db,
                    machine_id=str(device.machine_id),
                    problem_description=f"CRITICAL IoT ALERT: {alert.message}"
                )
                
            return alert
            
        return None

alert_engine = AlertEngine()
