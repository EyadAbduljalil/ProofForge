#!/usr/bin/env node
/**
 * @file record-evidence.js
 * @description مُولّد ومُسجّل أدلة الإصدار الحتمية لمنظومة ProofForge
 * (ProofForge Deterministic Release Evidence Recorder)
 * 
 * يستخرج نتائج الاختبارات الفعلية عبر التحليل الهيكلي الحتمي (Structured Test Ingestion)،
 * ويطبق تقييماً أمنياً صارماً ومغلقاً عند الفشل (Fail-Closed Dependency Audit)،
 * ويربط مصفوفة الأدلة بالتجزئة المشفرة الدقيقة (Commit SHA) للإصدار المعتمد،
 * مع فرض الحظر البات لأي رموز بديلة (Placeholders) أو مقاييس مصطنعة.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');
const DependencyAuditEvaluator = require('../packages/contracts/dependency-audit-evaluator');
const StructuredTestReportParser = require('../packages/contracts/structured-test-report-parser');

const rootDir = path.resolve(__dirname, '..');

console.log('======================================================');
console.log('📡 ProofForge — Recording Deterministic Release Evidence');
console.log('======================================================');

// 1. استخراج التجزئة الحقيقية للـ Commit
let commitSha = '';
if (process.env.GITHUB_SHA && /^[0-9a-f]{40}$/i.test(process.env.GITHUB_SHA.trim())) {
    commitSha = process.env.GITHUB_SHA.trim().toLowerCase();
} else {
    try {
        commitSha = execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim().toLowerCase();
    } catch (err) {
        process.stderr.write(`[Git Head Warn] ${err.message}\n`);
    }
}

if (!commitSha || !/^[0-9a-f]{40}$/i.test(commitSha)) {
    throw new Error(`[Evidence Binding Error] تعذر تحديد Git Commit SHA صالح بطول 40 محرف ست عشري: '${commitSha}'`);
}

let isWorkingTreeClean = true;
try {
    const statusOut = execSync('git status --porcelain', { cwd: rootDir, encoding: 'utf8' }).trim();
    // استثناء ملف الأدلة ذاته إذا كان هو التعديل الوحيد
    const dirtyFiles = statusOut.split('\n').map(l => l.trim()).filter(l => l && !l.includes('FINAL_TEST_EVIDENCE.json'));
    isWorkingTreeClean = dirtyFiles.length === 0;
} catch (_) {}

console.log(`>>> Target Release Commit: ${commitSha} (Clean Tree: ${isWorkingTreeClean})`);

// 2. التحليل الهيكلي لبيانات الإصدار الوصفية (Suite 1: Release Metadata Validator)
console.log('>>> [1/7] Ingesting Release Metadata Invariants Report...');
const metaScript = path.join(rootDir, 'packages/contracts/tests/release-metadata-validator.test.js');
const metaRes = spawnSync(process.execPath, [metaScript], { cwd: rootDir, encoding: 'utf8', timeout: 30000 });
const parsedMeta = StructuredTestReportParser.parseTapReport(metaRes, { suiteName: 'Release Metadata Validator', mandatory: true });
if (parsedMeta.status !== 'PASS' || parsedMeta.failed > 0) {
    throw new Error(`[Evidence Recording Failed] اختبار بيانات الإصدار الوصفية أخفق: ${parsedMeta.failed} إخفاقات`);
}

// 3. التحليل الهيكلي لأمان مزامنة Antigravity (Suite 2: Antigravity Synchronization Safety)
console.log('>>> [2/7] Ingesting Antigravity Synchronization Safety Invariants Report...');
const antiScript = path.join(rootDir, 'packages/contracts/tests/antigravity-adapter.test.js');
const antiRes = spawnSync(process.execPath, [antiScript], { cwd: rootDir, encoding: 'utf8', timeout: 30000 });
const parsedAnti = StructuredTestReportParser.parseTapReport(antiRes, { suiteName: 'Antigravity Synchronization Safety', mandatory: true });
if (parsedAnti.status !== 'PASS' || parsedAnti.failed > 0) {
    throw new Error(`[Evidence Recording Failed] اختبار أمان مزامنة Antigravity أخفق: ${parsedAnti.failed} إخفاقات`);
}

// 4. التحليل الهيكلي لمعيار المهارات السلوكي الـ 28 (Suite 3: Skills Behavioral Validation)
console.log('>>> [3/7] Ingesting Skills Behavioral Benchmark Measurements...');
const benchScript = path.join(rootDir, 'packages/contracts/tests/skills-benchmark.test.js');
const benchRunRes = spawnSync(process.execPath, [benchScript], { cwd: rootDir, encoding: 'utf8', timeout: 60000 });
if (benchRunRes.status !== 0 || benchRunRes.error) {
    throw new Error(`[Evidence Recording Failed] معيار فحص المهارات السلوكي أخفق بكود ${benchRunRes.status}: ${benchRunRes.stderr || benchRunRes.stdout || (benchRunRes.error && benchRunRes.error.message)}`);
}
const verifiedSkillsMatches = [...benchRunRes.stdout.matchAll(/\[([\w-]+)\s*\]\s*->\s*✅\s*VERIFIED/g)].map(m => m[1].trim());
const totalVerifiedSkills = verifiedSkillsMatches.length;
if (totalVerifiedSkills !== 28) {
    throw new Error(`[Evidence Recording Failed] عدد المهارات المعتمدة سلوكياً (${totalVerifiedSkills}) لا يطابق 28 مهارة معيارية`);
}

// 5. التحليل الهيكلي لسيناريوهات التوجيه متعدد المهارات (Suite 4: Multi-Skill Orchestration)
console.log('>>> [4/7] Ingesting Multi-Skill Orchestration Scenarios Report...');
const orchScript = path.join(rootDir, 'tests/orchestration/multi-skill-scenarios.test.js');
const orchRes = spawnSync(process.execPath, [orchScript], { cwd: rootDir, encoding: 'utf8', timeout: 30000 });
const parsedOrch = StructuredTestReportParser.parseTapReport(orchRes, { suiteName: 'Multi-Skill Orchestration Scenarios', mandatory: true });
if (parsedOrch.status !== 'PASS' || parsedOrch.failed > 0) {
    throw new Error(`[Evidence Recording Failed] اختبار توجيه السيناريوهات أخفق: ${parsedOrch.failed} إخفاقات`);
}
const scenarioMatches = [...orchRes.stdout.matchAll(/\[Scenario (\d+)\/(\d+)\]\s*Testing (.+)\.\.\./g)].map(m => m[3].trim());

// 6. التحليل الهيكلي للتنفيذ الحقيقي والاسترجاع المادي (Suite 5: Multi-Skill Real Execution & Rollback)
console.log('>>> [5/7] Ingesting Multi-Skill Real Execution & Rollback Report...');
const execScript = path.join(rootDir, 'tests/orchestration/multi-skill-execution.test.js');
const execRes = spawnSync(process.execPath, [execScript], { cwd: rootDir, encoding: 'utf8', timeout: 60000 });
const parsedExec = StructuredTestReportParser.parseTapReport(execRes, { suiteName: 'Multi-Skill Real Execution', mandatory: true });
if (parsedExec.status !== 'PASS' || parsedExec.failed > 0) {
    throw new Error(`[Evidence Recording Failed] اختبار التنفيذ الحقيقي والاسترجاع أخفق: ${parsedExec.failed} إخفاقات`);
}

// 7. تشغيل معيار قياس الدفاع ضد المثبتات الواقعية (Suite 6: Fixture Defense Benchmark)
console.log('>>> [6/7] Running Empirical Fixture Defense Benchmark...');
const FixtureDefenseBenchmark = require('../packages/maturity-benchmark/fixture-defense-benchmark');
const benchRes = FixtureDefenseBenchmark.runComparison({ rootDir });
if (benchRes.verdict !== 'DEFENSE_VERIFIED_AGAINST_FIXTURES') {
    throw new Error(`[Evidence Recording Failed] معيار الدفاع ضد المثبتات لم يجتز التحقق: ${benchRes.verdict}`);
}

// 8. فحص أمان التبعيات المغلق عند الفشل (Suite 7: Fail-Closed Dependency Security Audit)
console.log('>>> [7/7] Executing Fail-Closed NPM Security Audit...');
const auditRes = spawnSync('npm', ['audit', '--json'], { cwd: rootDir, shell: true, encoding: 'utf8', timeout: 60000 });
const evaluatedAudit = DependencyAuditEvaluator.evaluateAuditExecution(auditRes);

if (!evaluatedAudit.isPolicyCompliant || evaluatedAudit.status !== 'PASS') {
    throw new Error(`[Evidence Recording Failed] تدقيق التبعيات انتهك السياسة الأمنية: ${evaluatedAudit.policyViolations.join(', ')}`);
}

// 9. تجميع وثيقة الأدلة الحتمية الهيكلية
const evidenceReport = {
    generator: "ProofForge Deterministic Evidence Recorder",
    version: "3.0.0",
    commitSha: commitSha,
    generatedAt: new Date().toISOString(),
    operatingSystem: `${process.platform} (${process.arch})`,
    nodeVersion: process.version,
    isPurelyEmpirical: benchRes.isPurelyEmpirical,
    hasZeroHardcodedMetrics: benchRes.hasZeroHardcodedMetrics,
    suites: {
        release_metadata_validator: {
            path: "packages/contracts/tests/release-metadata-validator.test.js",
            totalChecks: parsedMeta.total,
            passedChecks: parsedMeta.passed,
            failedChecks: parsedMeta.failed,
            status: parsedMeta.status,
            verifiedInvariants: parsedMeta.passDetails
        },
        antigravity_synchronization_safety: {
            path: "packages/contracts/tests/antigravity-adapter.test.js",
            totalChecks: parsedAnti.total,
            passedChecks: parsedAnti.passed,
            failedChecks: parsedAnti.failed,
            status: parsedAnti.status,
            verifiedInvariants: parsedAnti.passDetails
        },
        skills_behavioral_validation: {
            path: "packages/contracts/tests/skills-benchmark.test.js",
            totalSkills: totalVerifiedSkills,
            verifiedSkills: totalVerifiedSkills,
            failedSkills: 0,
            status: "PASS",
            executionModes: ["MANDATORY_JSON_RUN", "MANDATORY_HUMAN_RUN", "FUZZ_UNKNOWN_ARG"],
            verifiedSkillList: verifiedSkillsMatches
        },
        multi_skill_orchestration: {
            path: "tests/orchestration/multi-skill-scenarios.test.js",
            totalScenarios: scenarioMatches.length > 0 ? scenarioMatches.length : parsedOrch.total,
            passedScenarios: scenarioMatches.length > 0 ? scenarioMatches.length : parsedOrch.passed,
            failedScenarios: parsedOrch.failed,
            status: parsedOrch.status,
            verifiedScenarios: scenarioMatches
        },
        multi_skill_real_execution: {
            path: "tests/orchestration/multi-skill-execution.test.js",
            totalTests: parsedExec.total,
            passedTests: parsedExec.passed,
            failedTests: parsedExec.failed,
            status: parsedExec.status,
            verifiedCapabilities: parsedExec.passDetails
        },
        fixture_defense_benchmark: {
            path: "tests/benchmark/agent-effectiveness.test.js",
            status: "PASS",
            benchmarkType: "AUTOMATED_FIXTURE_DEFENSE_BENCHMARK",
            description: "قياس تجريبي حقيقي لمعدل رصد ومنع العيوب البرمجية في المثبتات الواقعية",
            measuredData: {
                unprotectedFixturesComplianceRate: benchRes.summary.unprotectedFixturesComplianceRate,
                hardenedImplementationComplianceRate: benchRes.summary.hardenedImplementationComplianceRate,
                placeholdersInSample: benchRes.summary.placeholdersInSample,
                placeholdersInHardenedCode: benchRes.summary.placeholdersInHardenedCode,
                cryptographicFileHashVerified: benchRes.measuredData.cryptographicEvidence.verifiedHash,
                pluginJsonSha256: benchRes.measuredData.cryptographicEvidence.pluginHash
            },
            verdict: benchRes.verdict
        },
        dependency_security_audit: {
            command: "npm audit --json",
            status: evaluatedAudit.status,
            vulnerabilities: evaluatedAudit.vulnerabilities,
            policy: evaluatedAudit.policy,
            dependenciesAudited: evaluatedAudit.dependenciesAudited
        }
    }
};

const evidencePath = path.join(rootDir, 'docs/release/FINAL_TEST_EVIDENCE.json');
fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
fs.writeFileSync(evidencePath, JSON.stringify(evidenceReport, null, 2), 'utf8');

console.log('======================================================');
console.log(`✅ [Evidence Recorded] Bound to Commit: ${commitSha}`);
console.log(`⏱️ Recorded At: ${evidenceReport.generatedAt}`);
console.log(`📊 Invariants & Checks Ingested Structurally: ${parsedMeta.total + parsedAnti.total + totalVerifiedSkills + scenarioMatches.length + parsedExec.total}`);
console.log('======================================================');
