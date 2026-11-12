# ProofForge Full-Stack Integration Architecture Playbook

## 1. Unified Request-Response Lifecycle
1. **Client Dispatch:**
   - Always include `Content-Type: application/json`.
   - Send `Authorization: Bearer <token>` when authenticated.
   - Attach `Idempotency-Key: <uuid>` on POST/PUT/DELETE mutations.
2. **Server Middleware Pipeline:**
   - Security Headers (CSP, HSTS, X-Content-Type-Options).
   - Sliding-window rate limiter per IP/tenant.
   - Input sanitization against prototype pollution and XSS.
   - Authentication token decoding and tenant assignment.
3. **Storage & Atomicity:**
   - Strict `tenant_id` query scoping.
   - Multi-step mutations executed within `storage.transaction()`.
4. **Response Serialization:**
   - Wrapped inside `ApiResponse.success` or `ApiResponse.error`.
