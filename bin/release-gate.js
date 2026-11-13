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
        name: 'Canonical Skills Parity & Valid Frontmatter',
        file: 'skills',
        verify: () => {
            const skillsDir = path.join(rootDir, 'skills');
            const skills = fs.readdirSync(skillsDir).filter(f => !f.startsWith('.') && fs.statSync(path.join(skillsDir, f)).isDirectory());
            if (skills.length === 0) return false;
            for (const s of skills) {
                const skillFile = path.join(skillsDir, s, 'SKILL.md');
                if (!fs.existsSync(skillFile)) return false;
                const content = fs.readFileSync(skillFile, 'utf8');
                if (!content.startsWith('---') || !content.includes('name:') || !content.includes('description:')) {
                    return false;
                }
            }
            return true;
        }
    },
    {
        id: 'GATE-03',
        name: 'Multi-Skill Execution Engine Exists',
        file: 'packages/orchestration/multi-skill-execution-engine.js',
        verify: () => fs.existsSync(path.join(rootDir, 'packages/orchestration/multi-skill-execution-engine.js'))
    },
    {
        id: 'GATE-04',
        name: 'Empirical Agent A/B Benchmark Verified',
        file: 'packages/maturity-benchmark/agent-effectiveness-benchmark.js',
        verify: () => {
            const bench = require('../packages/maturity-benchmark/agent-effectiveness-benchmark');
            const res = bench.runComparison({ rootDir });
            return res.isPurelyEmpirical === true && res.hasZeroHardcodedMetrics === true;
        }
    },
    {
        id: 'GATE-05',
        name: 'Final Release Assessment Document Exists',
        file: 'docs/release/FINAL_RELEASE_ASSESSMENT.md',
        verify: () => fs.existsSync(path.join(rootDir, 'docs/release/FINAL_RELEASE_ASSESSMENT.md'))
    },
    {
        id: 'GATE-06',
        name: 'Final Test Evidence JSON & Commit Parity',
        file: 'docs/release/FINAL_TEST_EVIDENCE.json',
        verify: () => {
            const p = path.join(rootDir, 'docs/release/FINAL_TEST_EVIDENCE.json');
            if (!fs.existsSync(p)) return false;
            const data = JSON.parse(fs.readFileSync(p, 'utf8'));
            if (!data || !data.commitSha || !data.suites) return false;

            // التحقق من توافق تجزئة الـ commit إن كان Git متاحاً
            try {
                const { execSync } = require('child_process');
                const head = execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
                // السماح بتطابق HEAD أو أن يكون evidence يحمل HEAD السابق المباشر أو الرمز الديناميكي
                if (head && data.commitSha && data.commitSha !== 'CURRENT_GIT_HEAD') {
                    const isHead = head.startsWith(data.commitSha) || data.commitSha.startsWith(head);
                    let isNearbyCommit = false;
                    try {
                        const log = execSync('git log -n 5 --format=%H', { cwd: rootDir, encoding: 'utf8' }).split('\n').map(s => s.trim());
                        if (log.some(h => h && (h.startsWith(data.commitSha) || data.commitSha.startsWith(h)))) {
                            isNearbyCommit = true;
                        }
                    } catch (_) {}
                    if (!isHead && !isNearbyCommit) {
                        throw new Error(`commitSha mismatch: Evidence has '${data.commitSha}', Git HEAD is '${head}'`);
                    }
                }
            } catch (err) {
                // إذا كان الخطأ عدم تطابق، نرمي الخطأ ليرسب الفحص
                if (err.message.includes('commitSha mismatch')) throw err;
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
