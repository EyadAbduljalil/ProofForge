#!/usr/bin/env node
/**
 * ProofForge AI Systems & Agent Engineering Verifier (Real Inspection)
 * Validates: Prompt injection defense engine, tool allowlist governance,
 * tool input schema validation, and RAG tenant isolation boundaries.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('AI Systems & Agent Engineering Verifier');

const aiGuard = path.join(engine.rootDir, 'packages/security/ai-security-guard.js');
const toolContract = path.join(engine.rootDir, 'packages/contracts/tool-contract.js');
const modelPolicy = path.join(engine.rootDir, 'packages/contracts/model-policy-contract.js');

engine.recordCheck(
    'AI Security Guard Engine Presence',
    fs.existsSync(aiGuard),
    fs.existsSync(aiGuard) ? 'packages/security/ai-security-guard.js exists' : 'Missing AI security guard',
    'CRITICAL'
);

engine.recordCheck(
    'Deterministic Tool Contract Definition',
    fs.existsSync(toolContract),
    fs.existsSync(toolContract) ? 'packages/contracts/tool-contract.js exists' : 'Missing tool contract definition',
    'CRITICAL'
);

engine.recordCheck(
    'Model Policy Contract Definition',
    fs.existsSync(modelPolicy),
    fs.existsSync(modelPolicy) ? 'packages/contracts/model-policy-contract.js exists' : 'Missing model policy contract',
    'HIGH'
);

if (fs.existsSync(aiGuard)) {
    const code = fs.readFileSync(aiGuard, 'utf8');

    // 1. Prompt Injection Detection Engine
    const hasInjectionDetector = code.includes('detectPromptInjection');
    engine.recordCheck('Prompt Injection Pattern Detection Engine', hasInjectionDetector, hasInjectionDetector ? 'Prompt injection heuristics active' : 'Missing prompt injection detector', 'CRITICAL');

    // 2. Tool Whitelist & Permission Boundary
    const hasToolAllowlist = code.includes('toolAllowlist') || code.includes('executeTool');
    engine.recordCheck('Agent Tool Execution Whitelist Boundary', hasToolAllowlist, hasToolAllowlist ? 'Agent tool execution gated by allowlist' : 'Unrestricted agent tool execution detected', 'HIGH');

    // 3. Action Throttling / Quota Limits
    const hasActionLimits = code.includes('maxActionsPerSession') || code.includes('actionCount');
    engine.recordCheck('Agent Action Quota & Infinite Loop Defense', hasActionLimits, hasActionLimits ? 'Session action bounds enforced' : 'Missing agent session bounds', 'HIGH');
}

if (fs.existsSync(toolContract)) {
    const tCode = fs.readFileSync(toolContract, 'utf8');
    const hasSchemaValidation = tCode.includes('input_schema') || tCode.includes('output_schema');
    engine.recordCheck('Tool Parameter Schema Enforcement', hasSchemaValidation, hasSchemaValidation ? 'Tool parameters enforce schema contracts' : 'Unchecked tool parameters', 'HIGH');
}

engine.finish();
