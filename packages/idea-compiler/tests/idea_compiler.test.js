/**
 * @file idea_compiler.test.js
 * @description اختبارات محرك تجميع الأفكار واستكشاف المتطلبات
 */

const assert = require('assert');
const IdeaCompiler = require('../idea-compiler');

console.log('======================================================');
console.log('💡 Testing WebForge Idea Compiler & Intake Engine...');
console.log('======================================================');

const compiler = new IdeaCompiler();

// 1. اختبار كشف التناقضات
const contradictionAnalysis = compiler.analyzeInitialIdea({
    idea: 'تطبيق إدارة مهام شخصي',
    noAuthRequired: true,
    hasPersonalDashboard: true
});
assert.strictEqual(contradictionAnalysis.status, 'CONTRADICTIONS_DETECTED');
assert(contradictionAnalysis.contradictionsCount > 0);
console.log('  [PASS] Contradiction Detection Verified');

// 2. اختبار تجميع فكرة مكتملة
const cleanCompiler = new IdeaCompiler();
const cleanAnalysis = cleanCompiler.analyzeInitialIdea({
    idea: 'منصة بيع دورات تدريبية',
    problem: 'صعوبة وصول الطلاب للمحتوى التقني',
    solution: 'منصة فيديو تفاعلية مع شهادات إتمام',
    roles: ['student', 'instructor', 'admin'],
    features: [
        { name: 'استعراض الدورات', priority: 'MUST', criteria: 'Given published courses When browsing Then display course cards.' },
        { name: 'شراء الدورة', priority: 'MUST', criteria: 'Given valid card When payment completed Then grant access.' }
    ]
});
assert.strictEqual(cleanAnalysis.status, 'READY_TO_COMPILE');

const compiledPackage = cleanCompiler.compileToExecutionPackage();
assert(compiledPackage.executionPackage.includes('WEBFORGE EXECUTION PACKAGE'));
assert(compiledPackage.executionPackage.includes('منصة بيع دورات تدريبية'));
console.log('  [PASS] Idea Compilation to Execution Package Verified');

console.log('>>> [SUCCESS] Idea Compiler Tests PASSED 100%.');
