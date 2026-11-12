#!/usr/bin/env node
/**
 * ProofForge Lead Technical Auditor & Project Diagnostic Engine (Real Inspection)
 * Computes a genuine composite audit score by executing all domain verifiers,
 * collecting actual findings, and enforcing zero-tolerance on security and resilience regressions.
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

console.log('======================================================');
console.log('📋 [ProofForge Project Audit] Executing Real Multi-Domain Diagnostic Suite');
console.log('======================================================');

const root = path.resolve(__dirname, '../../../');

const verifiers = [
    { name: 'Security & ASVS Invariants', script: 'skills/security/scripts/verify_security.js', weight: 20, critical: true },
    { name: 'Anti-Laziness & Zero-Truncation', script: 'skills/anti-laziness/scripts/scan_laziness.js', weight: 15, critical: true },
    { name: 'Backend Systems & Lifecycle', script: 'skills/backend/scripts/verify_backend.js', weight: 10, critical: true },
    { name: 'API Contract & Idempotency', script: 'skills/api/scripts/verify_api.js', weight: 10, critical: true },
    { name: 'Database & Multi-Tenant Isolation', script: 'skills/database/scripts/verify_database.js', weight: 10, critical: true },
    { name: 'Frontend Architecture & Resilience', script: 'skills/frontend/scripts/verify_frontend.js', weight: 5, critical: false },
    { name: 'Accessibility & WCAG Compliance', script: 'skills/accessibility/scripts/audit_a11y.js', weight: 5, critical: false },
    { name: 'Performance & Web Vitals', script: 'skills/performance/scripts/audit_performance.js', weight: 5, critical: false },
    { name: 'Design System & Tokens', script: 'skills/design-system/scripts/verify_tokens.js', weight: 5, critical: false },
    { name: 'RTL & Bidirectional Localization', script: 'skills/rtl/scripts/verify_rtl.js', weight: 5, critical: false },
    { name: 'Motion & GPU Acceleration', script: 'skills/motion/scripts/audit_motion.js', weight: 5, critical: false },
    { name: 'AI Systems & Tool Governance', script: 'skills/ai-engineering/scripts/verify_ai_engineering.js', weight: 10, critical: true },
    { name: 'Full-Stack Systems & E2E Integration', script: 'skills/fullstack/scripts/verify_fullstack.js', weight: 10, critical: true },
    { name: 'Adversarial Code Review', script: 'skills/code-review/scripts/review_code.js', weight: 5, critical: true }
];

let earnedWeight = 0;
let totalWeight = 0;
let criticalFailures = 0;
const results = [];

for (const v of verifiers) {
    totalWeight += v.weight;
    const scriptPath = path.join(root, v.script);

    if (!fs.existsSync(scriptPath)) {
        results.push({ name: v.name, status: 'MISSING', passed: false, weight: v.weight });
        if (v.critical) criticalFailures++;
        continue;
    }

    const res = spawnSync(process.execPath, [scriptPath, '--json'], {
        cwd: root,
        encoding: 'utf8'
    });

    let passed = false;
    let details = '';

    if (res.status === 0) {
        passed = true;
        earnedWeight += v.weight;
        details = 'PASSED';
    } else {
        if (v.critical) criticalFailures++;
        details = `FAILED (Exit code: ${res.status})`;
    }

    results.push({
        name: v.name,
        passed,
        details,
        weight: v.weight
    });

    console.log(`  ${passed ? '✅' : '❌'} [${v.name.padEnd(35)}] -> ${passed ? 'VERIFIED' : 'FAILED'}`);
}

const compositeScore = Math.round((earnedWeight / totalWeight) * 100);

console.log('======================================================');
console.log(`📊 Composite Diagnostic Score: ${compositeScore} / 100`);
console.log(`Critical Failures: ${criticalFailures}`);
console.log('======================================================');

if (criticalFailures > 0 || compositeScore < 90) {
    console.error('❌ [ProofForge Project Audit] Audit failed due to unresolved issues or critical failures.');
    process.exit(1);
} else {
    console.log('✅ [ProofForge Project Audit] Project satisfies all verified production standards.');
    process.exit(0);
}
