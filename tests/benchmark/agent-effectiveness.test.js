/**
 * @file agent-effectiveness.test.js
 * @description اختبار تشغيل معيار المقارنة التجريبية الحقيقية A/B لفعالية الوكلاء الأذكياء
 * (ProofForge Empirical Agent A/B Benchmark Test Suite)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const AgentEffectivenessBenchmark = require('../../packages/maturity-benchmark/agent-effectiveness-benchmark');

console.log('======================================================');
console.log('📊 ProofForge — Empirical Agent A/B Effectiveness Benchmark');
console.log('======================================================');

const report = AgentEffectivenessBenchmark.runComparison({
    rootDir: path.resolve(__dirname, '../../')
});

console.log(`>>> Benchmark ID: ${report.benchmarkId}`);
console.log(`>>> Empirical Mode: ${report.isPurelyEmpirical ? '100% Measured' : 'Mocked'}`);
console.log(`>>> Zero Hardcoded Metrics: ${report.hasZeroHardcodedMetrics ? 'Verified' : 'False'}`);

assert.strictEqual(report.isPurelyEmpirical, true);
assert.strictEqual(report.hasZeroHardcodedMetrics, true);

console.log('>>> [1/4] Comparing Vulnerability Prevention...');
console.log(`  Baseline:   ${report.baseline.metrics.vulnerabilityPreventionRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.vulnerabilityPreventionRate}%`);
assert(report.proofforge.metrics.vulnerabilityPreventionRate > report.baseline.metrics.vulnerabilityPreventionRate);
console.log('  [PASS] 1. Empirical security superiority verified');

console.log('>>> [2/4] Comparing Code Completeness & Anti-Laziness...');
console.log(`  Baseline Placeholders: ${report.rawMeasurements.codeQuality.baselinePlaceholders}`);
console.log(`  ProofForge Placeholders: ${report.rawMeasurements.codeQuality.proofforgePlaceholders}`);
console.log(`  Baseline Score:   ${report.baseline.metrics.zeroPlaceholderRate}%`);
console.log(`  ProofForge Score: ${report.proofforge.metrics.zeroPlaceholderRate}%`);
assert.strictEqual(report.rawMeasurements.codeQuality.proofforgePlaceholders, 0);
assert(report.proofforge.metrics.zeroPlaceholderRate > report.baseline.metrics.zeroPlaceholderRate);
console.log('  [PASS] 2. Empirical anti-laziness & code completeness verified');

console.log('>>> [3/4] Comparing Accessibility Compliance...');
console.log(`  Baseline:   ${report.baseline.metrics.accessibilityComplianceRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.accessibilityComplianceRate}%`);
assert(report.proofforge.metrics.accessibilityComplianceRate > report.baseline.metrics.accessibilityComplianceRate);
console.log('  [PASS] 3. Empirical accessibility compliance verified');

console.log('>>> [4/4] Comparing Deterministic Evidence...');
console.log(`  Baseline:   ${report.baseline.metrics.deterministicEvidenceRate}%`);
console.log(`  ProofForge: ${report.proofforge.metrics.deterministicEvidenceRate}%`);
assert.strictEqual(report.proofforge.metrics.deterministicEvidenceRate, 100.0);
console.log('  [PASS] 4. Empirical evidence graph verified');

console.log('------------------------------------------------------');
console.log(`🏆 Measured Advantage: +${report.measuredAdvantage.percentageDelta}%`);
console.log(`⚖️ Verdict: ${report.verdict}`);
assert.strictEqual(report.verdict, 'PROOFFORGE_EMPIRICALLY_SUPERIOR');
console.log('======================================================');
console.log('>>> [SUCCESS] All Empirical Agent A/B Benchmark Tests PASSED 100%.');
console.log('======================================================');
