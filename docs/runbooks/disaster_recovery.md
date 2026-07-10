# Disaster Recovery Plan
## MechaMind OS 2.0

### Objective
Provide clear protocols for recovering MechaMind OS from total availability zone failure, database corruption, or security breaches.

### Tier 1: Relational Database (PostgreSQL)
**Backup Policy:**
- Full pg_dump daily to S3/MinIO.
- Write-Ahead Logs (WAL) archiving every 5 minutes.

**Restore Procedure:**
1. Block API traffic via Ingress `mechamind-ingress`.
2. Provision new DB instance.
3. Fetch latest full dump from S3 and run `pg_restore`.
4. Replay WAL logs via `pg_wal_replay` to achieve RPO (Recovery Point Objective) of < 5 minutes.

### Tier 2: Knowledge Graph (Neo4j)
**Backup Policy:**
- `neo4j-admin database backup` ran daily as a K8s CronJob.

**Restore Procedure:**
1. Stop Neo4j Pod.
2. Run `neo4j-admin database restore --from=/backups/graph.backup`.
3. Restart Pod.

### Tier 3: Vector Database (Qdrant)
**Backup Policy:**
- Automatic snapshotting enabled within Qdrant config (uploaded to MinIO daily).

**Restore Procedure:**
- Trigger `/collections/{name}/snapshots/recover` API using the latest valid snapshot.

### Tier 4: S3 Object Storage (MinIO)
- Leverage S3 Object Versioning. In case of ransomware, revert the bucket prefix to the timestamp before the attack.
