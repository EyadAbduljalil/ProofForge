# ProofForge 10-Point Adversarial Code Review Rubric

1. **Authentication & Authorization:** Are endpoint permissions verified on the server? Is ownership strictly checked?
2. **Input Validation:** Are all request params, bodies, and headers validated via schemas before execution?
3. **Data Integrity:** Are database mutations atomic? Are transactions rolled back on failure?
4. **Idempotency:** Can this operation be safely retried without side effects (double-charging, duplicate records)?
5. **Resource Cleanup:** Are file handles, database connections, and event listeners safely released in `finally` blocks?
6. **Error Hygiene:** Are raw stack traces stripped from client responses? Is error logging contextual?
7. **Type Rigor:** Are types strict? Are null/undefined checks exhaustive?
8. **Concurrency:** Are race conditions mitigated via locks, database constraints, or atomic operations?
9. **Backward Compatibility:** Does this change break existing API clients or database schemas?
10. **Evidence:** Has every claimed fix been verified by a terminal command execution outputting code 0?
