/**
 * @file engineering_graph.test.js
 * @description اختبارات محرك الرسم البياني الهندسي
 */

const assert = require('assert');
const EngineeringGraph = require('../engineering-graph');

console.log('======================================================');
console.log('🌐 Testing WebForge Engineering Graph Engine...');
console.log('======================================================');

const graph = new EngineeringGraph();

// 1. إضافة العقد
graph.addNode('REQ-001', 'requirement', 'User Authentication')
     .addNode('MOD-AUTH', 'component', 'Auth Service')
     .addNode('CTRL-SEC', 'security_control', 'Session Rotation Control')
     .addNode('TEST-AUTH', 'test', 'Auth Automated Test Suite')
     .addNode('EVID-001', 'evidence', 'Test Pass Output Log');

// 2. ربط العلاقات
graph.addEdge('REQ-001', 'MOD-AUTH', 'implements')
     .addEdge('MOD-AUTH', 'CTRL-SEC', 'protects')
     .addEdge('CTRL-SEC', 'TEST-AUTH', 'tests')
     .addEdge('TEST-AUTH', 'EVID-001', 'verifies');

// 3. فحص مساحة التأثير
const blast = graph.getBlastRadius('REQ-001');
assert(blast.affectedNodeIds.includes('MOD-AUTH'));
assert(blast.affectedNodeIds.length >= 2);
console.log('  [PASS] Engineering Blast Radius Analysis Verified');

// 4. فحص مسار التتبع
const trace = graph.traceRequirement('REQ-001');
assert.strictEqual(trace.complete, true);
console.log('  [PASS] Requirement-to-Evidence Path Trace Verified');

console.log('>>> [SUCCESS] Engineering Graph Tests PASSED 100%.');
