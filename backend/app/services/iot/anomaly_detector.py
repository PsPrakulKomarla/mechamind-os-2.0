from app.models.iot import Sensor, SensorReading

class AnomalyDetector:
    """
    Abstraction layer for Anomaly Detection.
    Initial implementation: Rule-based static thresholds.
    Future: Inject Machine Learning forecasting models here.
    """
    
    def detect_anomalies(self, sensor: Sensor, reading: SensorReading) -> dict:
        """
        Evaluates the reading against thresholds.
        Returns a dictionary if an anomaly is detected, else None.
        """
        
        if sensor.max_threshold is not None and reading.value > sensor.max_threshold:
            diff_percent = ((reading.value - sensor.max_threshold) / sensor.max_threshold) * 100
            
            # Simple severity escalation logic
            if diff_percent > 20:
                severity = "CRITICAL"
            else:
                severity = "HIGH"
                
            return {
                "alert_type": "HIGH_THRESHOLD_BREACH",
                "severity": severity,
                "message": f"Sensor {sensor.sensor_type.name} exceeded max threshold ({sensor.max_threshold}). Reading: {reading.value}"
            }
            
        if sensor.min_threshold is not None and reading.value < sensor.min_threshold:
            return {
                "alert_type": "LOW_THRESHOLD_BREACH",
                "severity": "HIGH",
                "message": f"Sensor {sensor.sensor_type.name} dropped below min threshold ({sensor.min_threshold}). Reading: {reading.value}"
            }
            
        return None

anomaly_detector = AnomalyDetector()
