# Production Readiness Checklist
## MechaMind OS 2.0

### Security
- [ ] Database passwords migrated from `docker-compose` to K8s Secrets / HashiCorp Vault.
- [ ] JWT keys rotated and signed via asymmetric RSA (RS256).
- [ ] Redis protected by password and strict NetworkPolicy (only API can access).
- [ ] S3 / MinIO buckets restricted so `public` cannot read OCR documents.

### Availability & Resilience
- [ ] K8s Deployments set to min `replicas: 3`.
- [ ] Horizontal Pod Autoscaler (HPA) configured to trigger on 70% CPU utilization.
- [ ] Liveness and Readiness probes actively pinging `/api/v1/health/liveness`.
- [ ] Rate Limit parameters (e.g., 100 requests / 60 seconds) configured via env variables.

### Observability
- [ ] Grafana Dashboards imported for PostgreSQL connections, Redis hit rates, and API Latency.
- [ ] OpenTelemetry exporting Spans to Jaeger/Tempo.
- [ ] Alerts configured for "500 Error Spike" and "High AI Latency (>5s)".
