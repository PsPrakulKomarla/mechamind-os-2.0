import logging

logger = logging.getLogger(__name__)

def configure_telemetry(app):
    """
    Configures OpenTelemetry and Prometheus if available.
    Falls back gracefully if opentelemetry packages are not installed.
    """
    try:
        from opentelemetry import trace
        from opentelemetry.exporter.prometheus import PrometheusMetricReader
        from opentelemetry.sdk.metrics import MeterProvider
        from opentelemetry.sdk.trace import TracerProvider

        logger.info("Initializing OpenTelemetry Tracing & Prometheus Metrics...")

        tracer_provider = TracerProvider()
        trace.set_tracer_provider(tracer_provider)

        reader = PrometheusMetricReader()
        meter_provider = MeterProvider(metric_readers=[reader])

        logger.info("Telemetry configured successfully.")
    except ImportError:
        logger.info("OpenTelemetry packages not installed, telemetry disabled.")
