/**
 * @file agent-effectiveness.test.js
 * @description اختبار تشغيل معيار المقارنة التجريبية A/B لفعالية الوكلاء الأذكياء
 * (ProofForge Agent A/B Effectiveness Benchmark Test Suite)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const AgentEffectivenessBenchmark = require('../../packages/maturity-benchmark/agent-effectiveness-benchmark');

console.log('======================================================');
console.log('📊 ProofForge — Agent A/B Effectiveness Benchmark Runner');
console.log('======================================================');

const report = AgentEffectivenessBenchmark.runComparison({
    rootDir: path.resolve(__dirname, '../../')
});

console.log(`>>> Benchmark ID: ${report.benchmarkId}`);
console.log(`>>> Suites Evaluated: ${report.suitesEvaluated}`);

console.log('>>> [1/4] Comparing Vulnerability Detection & Prevention...');
console.log(`  Baseline:   ${report.baseline.metrics.vulnerabilityDetectionRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.vulnerabilityDetectionRate}%`);
console.log(`  Improvement: ${report.improvements.securityMultiplier}`);
assert(report.proofforge.metrics.vulnerabilityDetectionRate > 95, 'ProofForge must achieve >95% security detection');
assert(report.proofforge.metrics.vulnerabilityDetectionRate > report.baseline.metrics.vulnerabilityDetectionRate);
console.log('  [PASS] 1. Security detection superiority verified');

console.log('>>> [2/4] Comparing Code Completeness & Anti-Laziness...');
console.log(`  Baseline:   ${report.baseline.metrics.zeroPlaceholderRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.zeroPlaceholderRate}%`);
console.log(`  Improvement: ${report.improvements.completenessMultiplier}`);
assert.strictEqual(report.proofforge.metrics.zeroPlaceholderRate, 100.0, 'ProofForge must enforce 100% zero placeholder policy');
console.log('  [PASS] 2. Code completeness & anti-laziness verified');

console.log('>>> [3/4] Comparing Accessibility & RTL Compliance...');
console.log(`  Baseline:   ${report.baseline.metrics.accessibilityComplianceRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.accessibilityComplianceRate}%`);
console.log(`  Improvement: ${report.improvements.accessibilityMultiplier}`);
assert(report.proofforge.metrics.accessibilityComplianceRate > 95);
console.log('  [PASS] 3. Accessibility & RTL compliance verified');

console.log('>>> [4/4] Comparing Deterministic Evidence & Grounding...');
console.log(`  Baseline:   ${report.baseline.metrics.deterministicEvidenceRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.deterministicEvidenceRate}%`);
assert.strictEqual(report.proofforge.metrics.deterministicEvidenceRate, 100.0);
console.log('  [PASS] 4. Deterministic evidence & grounding contract verified');

console.log('------------------------------------------------------');
console.log(`🏆 Overall Advantage: +${report.improvements.overallAdvantage}`);
console.log(`⚖️ Verdict: ${report.verdict}`);
console.log('======================================================');
console.log('>>> [SUCCESS] All Agent A/B Effectiveness Benchmark Tests PASSED 100%.');
console.log('======================================================');
