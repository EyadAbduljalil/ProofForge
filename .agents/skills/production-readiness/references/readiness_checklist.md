# Production Readiness 12-Factor Checklist

1. **Config in Environment:** Zero hardcoded hosts, credentials, or ports.
2. **Backing Services:** Treat databases and queues as attached resources via connection URIs.
3. **Stateless Processes:** Share nothing; store state in Redis/Postgres, not local server memory.
4. **Port Binding:** Export HTTP service by binding to the assigned `$PORT`.
5. **Concurrency:** Scale out via process model (PM2, Kubernetes pods, Docker).
6. **Disposability:** Fast startup (< 5s) and graceful shutdown on `SIGTERM`.
7. **Logs as Event Streams:** Write unbuffered JSON stdout/stderr; let container runtime handle aggregation.
