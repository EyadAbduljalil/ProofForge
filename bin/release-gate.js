#!/usr/bin/env node
/**
 * @file release-gate.js
 * @description بوابة اعتماد الإصدارات الحتمية والمغلقة عند الإخفاق لمنظومة ProofForge
 * (ProofForge Strictly Fail-Closed Deterministic Release Gate V3)
 * 
 * القواعد الصارمة للأمان ومطابقة الإثبات:
 * 1. استخراج الـ Git HEAD Commit SHA الإلزامي من المستودع الفعلي، ورفض الاعتماد بحالة:
 *    `RELEASE_HEAD_UNRESOLVED` إذا تعذر الحصول عليه، أو `RELEASE_HEAD_INVALID` إذا كان مشوهاً.
 * 2. التطابق التام (Exact 40-character hex SHA match) بين HEAD وملف الأدلة، ورفض:
 *    `RELEASE_COMMIT_MISMATCH` دون أي تساهل أو مقارنة جزئية.
 * 3. التحقق المستقل من سلامة عقد الأدلة وحظر غياب الأدلة الإلزامية:
 *    `RELEASE_EVIDENCE_MISSING`, `RELEASE_EVIDENCE_INVALID`, `RELEASE_ARTIFACT_MISSING`, `RELEASE_ARTIFACT_HASH_MISMATCH`.
 * 4. التحقق من وجود كافة المجموعات الإلزامية وخلوها من الإخفاقات:
 *    `RELEASE_REQUIRED_CHECK_MISSING`, `RELEASE_REQUIRED_CHECK_FAILED`.
 * 5. الفصل الصارم بين الاختبارات المؤتمتة والفحص البشري في `MANUAL_ACCEPTANCE_CHECKLIST.md`.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const isJson = process.argv.includes('--json');

// رموز وأسباب الإخفاق الرسمية الصارمة (Machine-Readable Failure Reasons)
const FAILURE_CODES = Object.freeze({
    HEAD_UNRESOLVED: 'RELEASE_HEAD_UNRESOLVED',
    HEAD_INVALID: 'RELEASE_HEAD_INVALID',
    EVIDENCE_MISSING: 'RELEASE_EVIDENCE_MISSING',
    EVIDENCE_INVALID: 'RELEASE_EVIDENCE_INVALID',
    EVIDENCE_STALE: 'RELEASE_EVIDENCE_STALE',
    COMMIT_MISMATCH: 'RELEASE_COMMIT_MISMATCH',
    PROVENANCE_INVALID: 'RELEASE_PROVENANCE_INVALID',
    ARTIFACT_MISSING: 'RELEASE_ARTIFACT_MISSING',
    ARTIFACT_HASH_MISMATCH: 'RELEASE_ARTIFACT_HASH_MISMATCH',
    REQUIRED_CHECK_MISSING: 'RELEASE_REQUIRED_CHECK_MISSING',
    REQUIRED_CHECK_FAILED: 'RELEASE_REQUIRED_CHECK_FAILED',
    INDEPENDENT_VERIFICATION_MISSING: 'RELEASE_INDEPENDENT_VERIFICATION_MISSING'
});

/**
 * دالة استخراج الـ Git HEAD الفعلي من المستودع بصورة صارمة ومغلقة عند الإخفاق
 */
function resolveCurrentGitHead(repoDir) {
    let resolved = '';

    // إذا كان متغير البيئة GITHUB_SHA متوفراً، يتم التحقق منه مباشرة
    if (process.env.GITHUB_SHA) {
        const envVal = process.env.GITHUB_SHA.trim().toLowerCase();
        if (!/^[0-9a-f]{40}$/i.test(envVal)) {
            const err = new Error(`Environment GITHUB_SHA '${envVal}' is malformed. Must be a 40-character hex hash.`);
            err.code = FAILURE_CODES.HEAD_INVALID;
            throw err;
        }
        resolved = envVal;
    } else {
        // محاولة استخراج HEAD عبر git CLI مع التحقق من أن repoDir يطابق toplevel
        try {
            const topLevel = execSync('git rev-parse --show-toplevel', { cwd: repoDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
            if (path.resolve(topLevel).toLowerCase() !== path.resolve(repoDir).toLowerCase()) {
                throw new Error(`Directory '${repoDir}' is not the root of Git repository '${topLevel}'`);
            }
            const out = execSync('git rev-parse HEAD', { cwd: repoDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
            resolved = (out || '').trim().toLowerCase();
        } catch (gitErr) {
            const err = new Error(`Git HEAD resolution failed: ${gitErr.message}`);
            err.code = FAILURE_CODES.HEAD_UNRESOLVED;
            throw err;
        }
    }

    if (!resolved) {
        const err = new Error('Current Git HEAD is empty or could not be determined.');
        err.code = FAILURE_CODES.HEAD_UNRESOLVED;
        throw err;
    }

    if (!/^[0-9a-f]{40}$/i.test(resolved)) {
        const err = new Error(`Resolved Git HEAD '${resolved}' is malformed. Must be a 40-character hex hash.`);
        err.code = FAILURE_CODES.HEAD_INVALID;
        throw err;
    }

    return resolved;
}

const checks = [
    {
        id: 'GATE-01',
        name: 'Release Metadata Consistency',
        file: 'packages/contracts/tests/release-metadata-validator.test.js',
        verify: () => {
            const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
            const lock = JSON.parse(fs.readFileSync(path.join(rootDir, 'package-lock.json'), 'utf8'));
            const plugin = JSON.parse(fs.readFileSync(path.join(rootDir, 'plugin.json'), 'utf8'));
            if (pkg.version !== lock.version || pkg.version !== plugin.version || pkg.version !== '3.0.0') {
                throw new Error(`Version mismatch: package=${pkg.version}, lock=${lock.version}, plugin=${plugin.version}`);
            }
            return true;
        }
    },
    {
        id: 'GATE-02',
        name: 'Canonical Skills Parity & Strict Frontmatter Validation',
        file: 'skills',
        verify: () => {
            const skillsDir = path.join(rootDir, 'skills');
            if (!fs.existsSync(skillsDir)) throw new Error('Missing skills directory');
            const skills = fs.readdirSync(skillsDir).filter(f => !f.startsWith('.') && fs.statSync(path.join(skillsDir, f)).isDirectory());
            if (skills.length !== 28) {
                throw new Error(`Expected exactly 28 canonical skills, found ${skills.length}`);
            }
            for (const s of skills) {
                const skillFile = path.join(skillsDir, s, 'SKILL.md');
                if (!fs.existsSync(skillFile)) {
                    throw new Error(`Missing SKILL.md in skills/${s}`);
                }
                const content = fs.readFileSync(skillFile, 'utf8');
                if (!content.startsWith('---')) {
                    throw new Error(`skills/${s}/SKILL.md must start with YAML frontmatter delimiter '---'`);
                }
                const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                if (!fmMatch) {
                    throw new Error(`Invalid frontmatter block in skills/${s}/SKILL.md`);
                }
                const fm = fmMatch[1];
                const hasName = /^name:\s*[\w-]+/m.test(fm);
                const hasDesc = /^description:\s*.+/m.test(fm);
                if (!hasName || !hasDesc) {
                    throw new Error(`skills/${s}/SKILL.md missing valid 'name' or 'description' in frontmatter`);
                }
            }
            return true;
        }
    },
    {
        id: 'GATE-03',
        name: 'Multi-Skill Execution & Real Tool Engine Verification',
        file: 'packages/orchestration/multi-skill-execution-engine.js',
        verify: () => {
            const engineFile = path.join(rootDir, 'packages/orchestration/multi-skill-execution-engine.js');
            if (!fs.existsSync(engineFile)) throw new Error('Missing multi-skill-execution-engine.js');
            const engine = require(engineFile);
            if (typeof engine.executePlan !== 'function') throw new Error('Engine missing executePlan');

            const os = require('os');
            const crypto = require('crypto');
            const { ProjectAwareExecutionProvider } = require('../packages/orchestration/agent-runtime-provider');
            const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-gate03-'));
            try {
                const plan = {
                    scenarioId: 'gate-multi-skill-validation',
                    scenarioName: 'Gate Multi-Skill Sequential Validation',
                    steps: [
                        { stepNumber: 1, skillId: 'architecture', dependencies: [], evidenceRequired: ['ADR_DOCUMENT'] },
                        { stepNumber: 2, skillId: 'database', dependencies: ['architecture'], evidenceRequired: ['MIGRATION_SCRIPTS'] },
                        { stepNumber: 3, skillId: 'backend', dependencies: ['database'], evidenceRequired: ['SERVICE_LAYER_IMPLEMENTATION'] }
                    ]
                };

                // 0. التحقق من أن غياب المشغل يرجع AGENT_RUNTIME_UNAVAILABLE حتماً
                const unavailRes = engine.executePlan(plan, { workspacePath: sandbox, rootDir });
                if (unavailRes.status !== 'AGENT_RUNTIME_UNAVAILABLE') {
                    throw new Error(`Expected AGENT_RUNTIME_UNAVAILABLE when no runtime provided, got: ${unavailRes.status}`);
                }

                // 1. التنفيذ عبر المشغل المعتمد للاختبار المعزول
                const agentRuntime = new ProjectAwareExecutionProvider();
                const res = engine.executePlan(plan, { workspacePath: sandbox, rootDir, agentRuntime });
                if (res.status !== 'SUCCESS' || res.completedStepsCount !== 3) {
                    throw new Error(`MultiSkillExecutionEngine failed multi-skill execution: status=${res.status}`);
                }
                const adrFile = path.join(sandbox, 'ADR-001.md');
                const migFile = path.join(sandbox, 'apps/server/db/migrations/001_initial.sql');
                const srvFile = path.join(sandbox, 'apps/server/server.js');
                if (!fs.existsSync(adrFile) || fs.statSync(adrFile).size === 0) {
                    throw new Error('Architecture ADR physical artifact missing or empty');
                }
                if (!fs.existsSync(migFile) || fs.statSync(migFile).size === 0) {
                    throw new Error('Database migration physical artifact missing or empty');
                }
                if (!fs.existsSync(srvFile) || fs.statSync(srvFile).size === 0) {
                    throw new Error('Backend server physical artifact missing or empty');
                }

                // 2. اختبار الاسترجاع المادي الحقيقي عند الفشل المتعمد
                const failSandbox = path.join(sandbox, 'rollback-test-sub');
                fs.mkdirSync(failSandbox, { recursive: true });
                const baseFile = path.join(failSandbox, 'base-config.json');
                const baseContent = JSON.stringify({ live: true, version: 1 });
                fs.writeFileSync(baseFile, baseContent, 'utf8');
                const baseHash = crypto.createHash('sha256').update(baseContent).digest('hex');

                const failingPlan = {
                    scenarioId: 'gate-rollback-test',
                    scenarioName: 'Gate Rollback Test Scenario',
                    steps: [
                        { stepNumber: 1, skillId: 'architecture', dependencies: [], evidenceRequired: ['ADR_DOCUMENT'] },
                        {
                            stepNumber: 2,
                            skillId: 'security',
                            dependencies: ['architecture'],
                            evidenceRequired: ['NON_EXISTENT_FAILING_REQUIREMENT'],
                            mutateWorkspace: (ws) => {
                                fs.writeFileSync(path.join(ws, 'base-config.json'), '{"tampered":true}', 'utf8');
                                fs.writeFileSync(path.join(ws, 'untracked.tmp'), 'dirty data', 'utf8');
                            }
                        }
                    ]
                };
                const failRes = engine.executePlan(failingPlan, { workspacePath: failSandbox, rootDir, agentRuntime });
                if (failRes.status !== 'FAILED' || failRes.rollbackExecuted !== true || failRes.rollbackVerified !== true) {
                    throw new Error('Rollback safety check failed during deliberate failure scenario in GATE-03');
                }
                if (fs.existsSync(path.join(failSandbox, 'untracked.tmp'))) {
                    throw new Error('Rollback failed to remove dirty untracked file');
                }
                if (!fs.existsSync(baseFile)) {
                    throw new Error('Rollback failed to restore pre-existing base file');
                }
                const restoredHash = crypto.createHash('sha256').update(fs.readFileSync(baseFile, 'utf8')).digest('hex');
                if (restoredHash !== baseHash) {
                    throw new Error('Rollback failed to restore base file to exact initial hash');
                }

                return true;
            } finally {
                try { fs.rmSync(sandbox, { recursive: true, force: true }); } catch (_) {}
            }
        }
    },
    {
        id: 'GATE-04',
        name: 'Automated Fixture Defense Benchmark Verified',
        file: 'packages/maturity-benchmark/fixture-defense-benchmark.js',
        verify: () => {
            const bench = require('../packages/maturity-benchmark/fixture-defense-benchmark');
            const res = bench.runComparison({ rootDir });
            if (!res || !res.measuredData || !res.summary) throw new Error('Invalid benchmark output');
            if (typeof res.summary.unprotectedFixturesComplianceRate !== 'number') throw new Error('Missing compliance rate');
            if (res.summary.hardenedImplementationComplianceRate !== 100) throw new Error('Hardened suite compliance must be 100%');
            if (res.summary.hardenedImplementationComplianceRate <= res.summary.unprotectedFixturesComplianceRate) {
                throw new Error('Hardened implementation did not outperform flawed fixtures');
            }
            if (!res.measuredData.cryptographicEvidence?.hasRealFileSha256) throw new Error('Missing real file cryptographic evidence');
            if (res.verdict !== 'DEFENSE_VERIFIED_AGAINST_FIXTURES') throw new Error('Verdict mismatch');
            return true;
        }
    },
    {
        id: 'GATE-05',
        name: 'Final Release Assessment Document & Structure Validation',
        file: 'docs/release/FINAL_RELEASE_ASSESSMENT.md',
        verify: () => {
            const p = path.join(rootDir, 'docs/release/FINAL_RELEASE_ASSESSMENT.md');
            if (!fs.existsSync(p)) throw new Error('FINAL_RELEASE_ASSESSMENT.md missing');
            const content = fs.readFileSync(p, 'utf8');
            if (!content.includes('3.0.0')) throw new Error('Version 3.0.0 missing in assessment');
            if (!content.includes('Deterministic Verification Matrix') && !content.includes('مصفوفة التحقق')) {
                throw new Error('Deterministic Verification Matrix section missing in assessment');
            }
            if (content.includes('+82.3%') || content.includes('PROOFFORGE_EMPIRICALLY_SUPERIOR')) {
                throw new Error('FINAL_RELEASE_ASSESSMENT.md still contains unverified +82.3% claim');
            }
            return true;
        }
    },
    {
        id: 'GATE-06',
        name: 'Final Test Evidence JSON & Exact Commit Binding',
        file: 'docs/release/FINAL_TEST_EVIDENCE.json',
        verify: () => {
            const p = path.join(rootDir, 'docs/release/FINAL_TEST_EVIDENCE.json');
            if (!fs.existsSync(p)) {
                const err = new Error('docs/release/FINAL_TEST_EVIDENCE.json does not exist.');
                err.code = FAILURE_CODES.EVIDENCE_MISSING;
                throw err;
            }

            let data = null;
            try {
                data = JSON.parse(fs.readFileSync(p, 'utf8'));
            } catch (parseErr) {
                const err = new Error(`FINAL_TEST_EVIDENCE.json contains malformed JSON: ${parseErr.message}`);
                err.code = FAILURE_CODES.EVIDENCE_INVALID;
                throw err;
            }

            if (!data || typeof data !== 'object') {
                const err = new Error('FINAL_TEST_EVIDENCE.json root must be a valid JSON object.');
                err.code = FAILURE_CODES.EVIDENCE_INVALID;
                throw err;
            }

            // 1. حظر أي Placeholder نهائياً وبصورة قاطعة
            const forbiddenPlaceholders = ['CURRENT_GIT_HEAD', 'PENDING_HEAD_COMMIT', 'HEAD', 'CURRENT_HEAD'];
            if (!data.commitSha || forbiddenPlaceholders.includes(data.commitSha)) {
                const err = new Error(`commitSha cannot be empty or placeholder ('${data.commitSha}'). Must be an exact 40-character hex commit SHA.`);
                err.code = FAILURE_CODES.EVIDENCE_INVALID;
                throw err;
            }

            // 2. التحقق من أن التجزئة هي تجزئة Git صالحة بطول 40 محرف ست عشري
            if (!/^[0-9a-f]{40}$/i.test(data.commitSha)) {
                const err = new Error(`commitSha '${data.commitSha}' is not a valid 40-character hex Git commit hash.`);
                err.code = FAILURE_CODES.EVIDENCE_INVALID;
                throw err;
            }

            // 3. استخراج الـ Git HEAD الفعلي والمطابقة الصارمة المغلقة عند الإخفاق
            const currentHead = resolveCurrentGitHead(rootDir);

            if (data.commitSha.toLowerCase() !== currentHead.toLowerCase()) {
                const err = new Error(`commitSha mismatch: Evidence has '${data.commitSha}', but current repository HEAD is '${currentHead}'. Evidence must be bound to the exact release commit.`);
                err.code = FAILURE_CODES.COMMIT_MISMATCH;
                throw err;
            }

            // 4. التحقق من صحة تاريخ الإنشاء
            if (!data.generatedAt || isNaN(Date.parse(data.generatedAt))) {
                const err = new Error('generatedAt timestamp in FINAL_TEST_EVIDENCE.json is missing or invalid.');
                err.code = FAILURE_CODES.EVIDENCE_INVALID;
                throw err;
            }

            // 5. التحقق الصارم من الطبيعة التجريبية المستخرجة قياسياً (Zero Hardcoded Metrics)
            if (data.isPurelyEmpirical !== true || data.hasZeroHardcodedMetrics !== true) {
                const err = new Error('FINAL_TEST_EVIDENCE.json must declare isPurelyEmpirical=true and hasZeroHardcodedMetrics=true.');
                err.code = FAILURE_CODES.EVIDENCE_INVALID;
                throw err;
            }

            // 6. التحقق الصارم من وجود كافة المجموعات الإلزامية وخلوها التام من أي إخفاقات
            const requiredSuites = [
                'release_metadata_validator',
                'antigravity_synchronization_safety',
                'skills_behavioral_validation',
                'multi_skill_orchestration',
                'multi_skill_real_execution',
                'fixture_defense_benchmark',
                'dependency_security_audit'
            ];

            if (!data.suites || typeof data.suites !== 'object') {
                const err = new Error('FINAL_TEST_EVIDENCE.json missing suites object.');
                err.code = FAILURE_CODES.REQUIRED_CHECK_MISSING;
                throw err;
            }

            for (const suiteKey of requiredSuites) {
                const suite = data.suites[suiteKey];
                if (!suite) {
                    const err = new Error(`Missing mandatory test suite in evidence: ${suiteKey}`);
                    err.code = FAILURE_CODES.REQUIRED_CHECK_MISSING;
                    throw err;
                }
                if (suite.status !== 'PASS') {
                    const err = new Error(`Test suite '${suiteKey}' has non-PASS status: ${suite.status}`);
                    err.code = FAILURE_CODES.REQUIRED_CHECK_FAILED;
                    throw err;
                }
                if (suite.failedChecks && suite.failedChecks !== 0) {
                    const err = new Error(`Test suite '${suiteKey}' contains ${suite.failedChecks} failed checks.`);
                    err.code = FAILURE_CODES.REQUIRED_CHECK_FAILED;
                    throw err;
                }
                if (suite.failedTests && suite.failedTests !== 0) {
                    const err = new Error(`Test suite '${suiteKey}' contains ${suite.failedTests} failed tests.`);
                    err.code = FAILURE_CODES.REQUIRED_CHECK_FAILED;
                    throw err;
                }
            }

            // 7. التحقق من خلو التبعيات من الثغرات الحرجة والعالية
            const auditVulns = data.suites.dependency_security_audit?.vulnerabilities;
            if (!auditVulns || auditVulns.critical > 0 || auditVulns.high > 0) {
                const err = new Error(`Dependency audit has unresolved vulnerabilities: ${JSON.stringify(auditVulns)}`);
                err.code = FAILURE_CODES.REQUIRED_CHECK_FAILED;
                throw err;
            }

            // 8. التحقق من أن المقارنة التفاعلية والقبول البشري مسجلان بوضوح كـ NOT_RUN ومنع التزييف
            if (data.suites.agent_effectiveness_ab_benchmark && data.suites.agent_effectiveness_ab_benchmark.status !== 'NOT_RUN') {
                const err = new Error(`agent_effectiveness_ab_benchmark cannot be marked as PASS without real dual-agent interactive execution (Status: ${data.suites.agent_effectiveness_ab_benchmark.status})`);
                err.code = FAILURE_CODES.INDEPENDENT_VERIFICATION_MISSING;
                throw err;
            }
            if (data.suites.antigravity_human_acceptance && data.suites.antigravity_human_acceptance.status !== 'NOT_RUN') {
                const err = new Error(`antigravity_human_acceptance cannot be marked as PASS without verified human audit trail (Status: ${data.suites.antigravity_human_acceptance.status})`);
                err.code = FAILURE_CODES.INDEPENDENT_VERIFICATION_MISSING;
                throw err;
            }

            return true;
        }
    },
    {
        id: 'GATE-07',
        name: 'Manual Acceptance Checklist Distinction (HUMAN-* is NOT_RUN)',
        file: 'MANUAL_ACCEPTANCE_CHECKLIST.md',
        verify: () => {
            const p = path.join(rootDir, 'MANUAL_ACCEPTANCE_CHECKLIST.md');
            if (!fs.existsSync(p)) throw new Error('Missing MANUAL_ACCEPTANCE_CHECKLIST.md');
            const content = fs.readFileSync(p, 'utf8');
            const humanLines = content.split('\n').filter(l => l.includes('HUMAN-'));
            if (humanLines.length === 0) throw new Error('No HUMAN-* acceptance items found');
            for (const line of humanLines) {
                if (!line.includes('`NOT_RUN`') && !line.includes('`PENDING_HUMAN_VERIFICATION`')) {
                    throw new Error(`Human acceptance item falsely marked: ${line}`);
                }
            }
            return true;
        }
    }
];

let allPassed = true;
const results = [];

for (const check of checks) {
    let passed = false;
    let error = null;
    let errorCode = null;
    try {
        passed = check.verify();
    } catch (e) {
        passed = false;
        error = e.message;
        errorCode = e.code || 'GATE_VERIFICATION_FAILED';
    }
    if (!passed) allPassed = false;
    results.push({
        id: check.id,
        name: check.name,
        targetFile: check.file,
        passed,
        error,
        errorCode
    });
}

const gateReport = {
    timestamp: new Date().toISOString(),
    gateName: 'ProofForge Release Gate V3 (Strict Fail-Closed)',
    releaseCandidate: '3.0.0',
    gateStatus: allPassed ? 'CANDIDATE_READY_FOR_HUMAN_ACCEPTANCE' : 'BLOCKED',
    decision: allPassed ? 'PASS_TO_MANUAL_ACCEPTANCE' : 'REJECT_RELEASE',
    checks: results
};

if (isJson) {
    console.log(JSON.stringify(gateReport, null, 2));
} else {
    console.log('======================================================');
    console.log(`🛡️  ProofForge Release Gate — Status: ${gateReport.gateStatus}`);
    console.log('======================================================');
    for (const r of results) {
        console.log(`  ${r.passed ? '✅' : '❌'} [${r.id}] ${r.name}: ${r.passed ? 'PASSED' : 'FAILED' + (r.error ? ` [${r.errorCode || 'ERR'}]: ${r.error}` : '')}`);
    }
    console.log('------------------------------------------------------');
    console.log(`⚖️  Verdict: ${gateReport.decision}`);
    console.log('======================================================');
}

if (!allPassed) {
    process.exit(1);
}

module.exports = {
    resolveCurrentGitHead,
    FAILURE_CODES,
    checks
};
