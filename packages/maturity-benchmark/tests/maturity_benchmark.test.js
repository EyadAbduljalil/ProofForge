/**
 * @file maturity_benchmark.test.js
 * @description اختبارات تقييم النضج وحزمة المشاريع الذهبية
 */

const assert = require('assert');
const MaturityEvaluator = require('../maturity-evaluator');
const GoldenProjectsBenchmark = require('../golden-projects');

console.log('======================================================');
console.log('📊 Testing WebForge Maturity & Golden Projects...');
console.log('======================================================');

// 1. اختبار تقييم النضج
const maturity = MaturityEvaluator.evaluateMaturity();
assert(maturity.capabilitiesCount >= 8);
assert(maturity.overallMaturityLevel.includes('L4+'));
console.log('  [PASS] System Maturity Assessment Verified (L4+ Enforced & Self-Verified)');

// 2. اختبار المشاريع الذهبية
const golden = GoldenProjectsBenchmark.runAllGoldenProjects();
assert.strictEqual(golden.totalDomainsTested, 4);
assert.strictEqual(golden.overallScore, 100);
console.log('  [PASS] Golden Projects Domain Benchmarks Verified');

console.log('>>> [SUCCESS] Maturity & Golden Projects Tests PASSED 100%.');
