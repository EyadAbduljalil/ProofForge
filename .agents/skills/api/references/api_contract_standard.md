# ProofForge API Contract Standard

## 1. Required Headers on Mutation Endpoints
- `Content-Type: application/json`
- `Idempotency-Key: <UUIDv4>` (Required on payments and state transitions)
- `X-Request-Id: <UUIDv4>` (Generated if missing for distributed tracing)

## 2. Rate-Limiting Headers
- `RateLimit-Limit: 100`
- `RateLimit-Remaining: 95`
- `RateLimit-Reset: 1731456000`
