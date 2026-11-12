# Structured Tool Calling Example in ProofForge

```javascript
const AISecurityGuard = require('../../../packages/security/ai-security-guard');

// 1. Initialize guard with strict tool allowlist
const guard = new AISecurityGuard({
    toolAllowlist: ['queryDatabase', 'readSourceFile'],
    maxActionsPerSession: 10,
    tenantId: 'tenant_enterprise_01'
});

// 2. Scan user prompt before LLM ingestion
const promptCheck = AISecurityGuard.detectPromptInjection(userPrompt);
if (promptCheck.detected) {
    throw new Error(`Security Exception: Prohibited prompt injection attack detected: ${promptCheck.rule}`);
}

// 3. Execute approved tool through security boundary
const result = await guard.executeTool('queryDatabase', { table: 'audit_logs' }, async (params) => {
    return await db.query(params.table);
});
```
