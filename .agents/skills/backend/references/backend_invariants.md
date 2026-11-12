# ProofForge Backend Invariants

1. **No Uncaught Exceptions:** All async controllers must be wrapped with an async error handler catching rejections.
2. **Deterministic Status Codes:** 200 (OK), 201 (Created), 400 (Bad Input), 401 (Unauthenticated), 403 (Forbidden), 404 (Not Found), 429 (Rate Limited), 500 (Internal Error).
3. **Database Resource Pools:** Connection pool limits must be strictly configured; never create unbounded connections per request.
