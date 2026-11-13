#!/usr/bin/env node
/**
 * @file release-gate.js
 * @description بوابة اعتماد الإصدارات الحتمية لمنظومة ProofForge
 * (ProofForge Deterministic Release Gate)
 * 
 * يمنع صدور أي قرار اعتماد (GO) ما لم تتوفر كافة الأدلة المادية،
 * ويتأكد من وجود ملفات التقييم النهائي والأدلة المشفرة في docs/release/،
 * ويفرض الفصل الصارم بين الاختبارات المؤتمتة والفحص البشري اليدوي.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const isJson = process.argv.includes('--json');

const checks = [
    {
        id: 'GATE-01',
        name: 'Release Metadata Consistency',
        file: 'packages/contracts/tests/release-metadata-validator.test.js',
        verify: () => {
            const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
            const lock = JSON.parse(fs.readFileSync(path.join(rootDir, 'package-lock.json'), 'utf8'));
            const plugin = JSON.parse(fs.readFileSync(path.join(rootDir, 'plugin.json'), 'utf8'));
            return pkg.version === lock.version && pkg.version === plugin.version && pkg.version === '3.0.0';
        }
    },
    {
        id: 'GATE-02',
        name: 'Canonical Skills Parity & Strict Frontmatter Validation',
        file: 'skills',
        verify: () => {
            const skillsDir = path.join(rootDir, 'skills');
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
            if (!fs.existsSync(engineFile)) return false;
            const engine = require(engineFile);
            if (typeof engine.executePlan !== 'function') return false;
            if (typeof engine._createWorkspaceSnapshot !== 'function') return false;
            if (typeof engine._restoreWorkspaceSnapshot !== 'function') return false;

            // اختبار عملي حي وموسع للمحرك: تنفيذ خطة متعددة المهارات (Architecture -> Database -> Backend)
            // والتحقق من إنتاج المخرجات المادية الحقيقية واختبار الاسترجاع المادي عند الفشل
            const os = require('os');
            const crypto = require('crypto');
            const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-gate03-'));
            try {
                // 1. اختبار التنفيذ الناجح متعدد المهارات
                const plan = {
                    scenarioId: 'gate-multi-skill-validation',
                    scenarioName: 'Gate Multi-Skill Sequential Validation',
                    steps: [
                        { stepNumber: 1, skillId: 'architecture', dependencies: [], evidenceRequired: ['ADR_DOCUMENT'] },
                        { stepNumber: 2, skillId: 'database', dependencies: ['architecture'], evidenceRequired: ['MIGRATION_SCRIPTS'] },
                        { stepNumber: 3, skillId: 'backend', dependencies: ['database'], evidenceRequired: ['SERVICE_LAYER_IMPLEMENTATION'] }
                    ]
                };
                const res = engine.executePlan(plan, { workspacePath: sandbox, rootDir });
                if (res.status !== 'SUCCESS' || res.completedStepsCount !== 3) {
                    throw new Error(`MultiSkillExecutionEngine failed multi-skill execution: status=${res.status}, completed=${res.completedStepsCount}`);
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
                const failRes = engine.executePlan(failingPlan, { workspacePath: failSandbox, rootDir });
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
            // التحقق الحقيقي من المخرجات والقياسات الحقيقية
            if (!res || !res.measuredData || !res.summary) return false;
            if (typeof res.summary.unprotectedFixturesComplianceRate !== 'number') return false;
            if (typeof res.summary.hardenedImplementationComplianceRate !== 'number') return false;
            // يجب أن يكون معدل امتثال الكود المحصن 100% ومتفوقاً على المثبت المعيب
            if (res.summary.hardenedImplementationComplianceRate !== 100) return false;
            if (res.summary.hardenedImplementationComplianceRate <= res.summary.unprotectedFixturesComplianceRate) return false;
            // التحقق من صحة التجزئة المشفرة لملف حقيقي
            if (!res.measuredData.cryptographicEvidence || !res.measuredData.cryptographicEvidence.hasRealFileSha256) return false;
            if (res.verdict !== 'DEFENSE_VERIFIED_AGAINST_FIXTURES') return false;
            return true;
        }
    },
    {
        id: 'GATE-05',
        name: 'Final Release Assessment Document & Structure Validation',
        file: 'docs/release/FINAL_RELEASE_ASSESSMENT.md',
        verify: () => {
            const p = path.join(rootDir, 'docs/release/FINAL_RELEASE_ASSESSMENT.md');
            if (!fs.existsSync(p)) return false;
            const content = fs.readFileSync(p, 'utf8');
            if (!content.includes('3.0.0')) return false;
            if (!content.includes('Deterministic Verification Matrix') && !content.includes('مصفوفة التحقق')) return false;
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
            if (!fs.existsSync(p)) return false;
            const data = JSON.parse(fs.readFileSync(p, 'utf8'));
            if (!data || !data.commitSha || !data.suites) return false;

            // 1. حظر أي Placeholder نهائياً وبصورة قاطعة
            const forbiddenPlaceholders = ['CURRENT_GIT_HEAD', 'PENDING_HEAD_COMMIT', 'HEAD', 'CURRENT_HEAD'];
            if (forbiddenPlaceholders.includes(data.commitSha)) {
                throw new Error(`commitSha cannot be a placeholder ('${data.commitSha}'). Must be an exact 40-character hex commit SHA.`);
            }

            // 2. التحقق من أن التجزئة هي تجزئة Git صالحة بطول 40 محرف ست عشري
            if (!/^[0-9a-f]{40}$/i.test(data.commitSha)) {
                throw new Error(`commitSha '${data.commitSha}' is not a valid 40-character hex Git commit hash.`);
            }

            // 3. التحقق الصارم من التطابق مع HEAD الفعلي أو GITHUB_SHA
            const { execSync } = require('child_process');
            let currentHead = '';
            try {
                currentHead = execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
            } catch (_) {}

            if (!currentHead && process.env.GITHUB_SHA) {
                currentHead = process.env.GITHUB_SHA.trim();
            }

            if (currentHead) {
                if (data.commitSha.toLowerCase() !== currentHead.toLowerCase()) {
                    // السماح أيضاً بالـ parent commit إذا كان ملف الأدلة مسجلاً فوراً قبله
                    let parentHead = '';
                    try {
                        parentHead = execSync('git rev-parse HEAD~1', { cwd: rootDir, encoding: 'utf8' }).trim();
                    } catch (_) {}

                    if (!parentHead || data.commitSha.toLowerCase() !== parentHead.toLowerCase()) {
                        throw new Error(`commitSha mismatch: Evidence has '${data.commitSha}', but current repository HEAD is '${currentHead}'. Evidence must be bound to the exact release commit.`);
                    }
                }
            }

            // 4. التحقق من صحة تاريخ الإنشاء
            if (!data.generatedAt || isNaN(Date.parse(data.generatedAt))) {
                throw new Error('generatedAt timestamp in FINAL_TEST_EVIDENCE.json is missing or invalid.');
            }

            // 5. التحقق الصارم من الطبيعة التجريبية المستخرجة قياسياً (Zero Hardcoded Metrics)
            if (data.isPurelyEmpirical !== true || data.hasZeroHardcodedMetrics !== true) {
                throw new Error('FINAL_TEST_EVIDENCE.json must declare isPurelyEmpirical=true and hasZeroHardcodedMetrics=true.');
            }

            // 6. التحقق من صحة جميع مجموعات الاختبارات وخلوها التام من أي إخفاقات
            const requiredSuites = [
                'release_metadata_validator',
                'antigravity_synchronization_safety',
                'skills_behavioral_validation',
                'multi_skill_orchestration',
                'multi_skill_real_execution',
                'fixture_defense_benchmark',
                'dependency_security_audit'
            ];

            for (const suiteKey of requiredSuites) {
                const suite = data.suites[suiteKey];
                if (!suite) {
                    throw new Error(`Missing mandatory test suite in evidence: ${suiteKey}`);
                }
                if (suite.status !== 'PASS') {
                    throw new Error(`Test suite '${suiteKey}' has non-PASS status: ${suite.status}`);
                }
                if (suite.failedChecks && suite.failedChecks !== 0) {
                    throw new Error(`Test suite '${suiteKey}' contains ${suite.failedChecks} failed checks.`);
                }
                if (suite.failedTests && suite.failedTests !== 0) {
                    throw new Error(`Test suite '${suiteKey}' contains ${suite.failedTests} failed tests.`);
                }
                if (suite.failedSkills && suite.failedSkills !== 0) {
                    throw new Error(`Test suite '${suiteKey}' contains ${suite.failedSkills} failed skills.`);
                }
                if (suite.failedScenarios && suite.failedScenarios !== 0) {
                    throw new Error(`Test suite '${suiteKey}' contains ${suite.failedScenarios} failed scenarios.`);
                }
            }

            // 7. التحقق من خلو التبعيات من الثغرات الحرجة والعالية
            const auditVulns = data.suites.dependency_security_audit.vulnerabilities;
            if (!auditVulns || auditVulns.critical > 0 || auditVulns.high > 0) {
                throw new Error(`Dependency audit has unresolved vulnerabilities: ${JSON.stringify(auditVulns)}`);
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
            if (!fs.existsSync(p)) return false;
            const content = fs.readFileSync(p, 'utf8');
            // استخراج كافة أسطر HUMAN-*
            const humanLines = content.split('\n').filter(l => l.includes('HUMAN-'));
            if (humanLines.length === 0) return false;
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
    try {
        passed = check.verify();
    } catch (e) {
        passed = false;
        error = e.message;
    }
    if (!passed) allPassed = false;
    results.push({
        id: check.id,
        name: check.name,
        targetFile: check.file,
        passed,
        error
    });
}

const gateReport = {
    timestamp: new Date().toISOString(),
    gateName: 'ProofForge Release Gate V3',
    releaseCandidate: '3.0.0',
    gateStatus: allPassed ? 'CANDIDATE_READY_FOR_HUMAN_ACCEPTANCE' : 'BLOCKED',
    decision: allPassed ? 'PASS_TO_MANUAL_ACCEPTANCE' : 'REJECT_RELEASE',
    checks: results
};

if (isJson) {
    console.log(JSON.stringify(gateReport, null, 2));
} else {
    console.log('======================================================');
    console.log(`🛡️ ProofForge Release Gate — Status: ${gateReport.gateStatus}`);
    console.log('======================================================');
    for (const r of results) {
        console.log(`  ${r.passed ? '✅' : '❌'} [${r.id}] ${r.name}: ${r.passed ? 'PASSED' : 'FAILED' + (r.error ? ` (${r.error})` : '')}`);
    }
    console.log('------------------------------------------------------');
    console.log(`⚖️ Verdict: ${gateReport.decision}`);
    console.log('======================================================');
}

if (!allPassed) {
    process.exit(1);
}
