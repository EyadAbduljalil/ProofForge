# ProofForge AI Engineering & Agent Architecture Specification

## 1. Tool Governance Matrix
1. **Deterministic Input Schemas:** All tool parameters must be defined using strict JSON Schema types.
2. **Execution Sandboxing:** Tools that execute filesystem writes or shell commands must run in constrained sub-processes.
3. **Audit Ledger:** Every tool call and its resulting output must be recorded in `AgentAuditRecorder`.

## 2. Prompt Injection Mitigation
- Incoming text must pass through regex heuristic scanning for jailbreaks and role overrides.
- Model system prompts must be protected by explicit delimiter blocks (`<SYSTEM_INSTRUCTION>`).
- Untrusted external documents (e.g. from RAG searches) must be tagged with explicit untrusted boundary wrappers.
