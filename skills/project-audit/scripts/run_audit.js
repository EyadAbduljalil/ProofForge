#!/usr/bin/env node
/**
 * ProofForge Lead Technical Auditor & Project Diagnostic Engine (Real Inspection)
 * Computes a genuine composite audit score by executing all domain verifiers,
 * collecting actual findings, and enforcing zero-tolerance on security and resilience regressions.
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Project Audit & Diagnostic Engine');
const isJson = process.argv.includes('--json');

if (!isJson) {
    console.log('======================================================');
    console.log('📋 [ProofForge Project Audit] Executing Real Multi-Domain Diagnostic Suite');
    console.log('======================================================');
}

const root = engine.rootDir;

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

for (const v of verifiers) {
    totalWeight += v.weight;
    // ابحث أولاً في مساحة العمل المحلية، ثم في الجذر الرئيسي لـ ProofForge كمرجع قياسي
    let scriptPath = path.join(engine.rootDir, v.script);
    if (!fs.existsSync(scriptPath)) {
        scriptPath = path.resolve(__dirname, '../../../', v.script);
    }

    if (!fs.existsSync(scriptPath)) {
        engine.recordCheck(v.name, false, `Verifier script not found: ${v.script}`, v.critical ? 'CRITICAL' : 'HIGH');
        continue;
    }

    const res = spawnSync(process.execPath, [scriptPath, '--json'], {
        cwd: engine.rootDir,
        encoding: 'utf8',
        timeout: 10000
    });

    const passed = (res.status === 0);
    if (passed) {
        earnedWeight += v.weight;
    }

    engine.recordCheck(
        v.name,
        passed,
        passed ? 'Sub-verifier completed successfully' : `Sub-verifier failed with exit code ${res.status}`,
        v.critical ? 'CRITICAL' : 'HIGH'
    );
}

const compositeScore = Math.round((earnedWeight / totalWeight) * 100);

if (!isJson) {
    console.log('======================================================');
    console.log(`📊 Composite Diagnostic Score: ${compositeScore} / 100`);
    console.log('======================================================');
}

engine.recordCheck(
    'Composite Quality Score Threshold (>= 90%)',
    compositeScore >= 90,
    `Calculated composite diagnostic score: ${compositeScore}% (required >= 90%)`,
    'CRITICAL'
);

engine.finish();
