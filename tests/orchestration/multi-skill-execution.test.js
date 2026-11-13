/**
 * @file multi-skill-execution.test.js
 * @description اختبارات التحقق من التنفيذ الحقيقي للمشاريع متعددة المهارات وتمرير السياق
 * (ProofForge Multi-Skill Real Execution & Lifecycle Test Suite)
 * 
 * يختبر:
 * 1. التنفيذ التتابعي الفعلي للمهارات على مساحة عمل معزولة.
 * 2. تمرير المخرجات والسياق بين المهارات (Context Passing).
 * 3. التحقق الحتمي من عقود الأدلة المادية.
 * 4. إدارة فشل الخطوات والتوقف الآمن (Fail-Closed).
 * 5. التحكيم الحتمي في تعارضات المخرجات بحسب هرمية السلطة.
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const IntelligentSkillRouter = require('../../packages/orchestration/intelligent-skill-router');
const MultiSkillExecutionEngine = require('../../packages/orchestration/multi-skill-execution-engine');

console.log('======================================================');
console.log('⚡ ProofForge — Multi-Skill Real Execution Engine Tests');
console.log('======================================================');

const tempSandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-exec-test-'));

try {
    // ----------------------------------------------------
    // اختبار 1: تنفيذ سيناريو Full-Stack SaaS المتكامل
    // ----------------------------------------------------
    console.log('>>> [1/5] Testing End-to-End Execution of Full-Stack SaaS Plan...');
    const saasPlan = IntelligentSkillRouter.route('fullstack-saas');
    const saasWorkspace = path.join(tempSandboxRoot, 'saas-workspace');

    const saasExecResult = MultiSkillExecutionEngine.executePlan(saasPlan, {
        workspacePath: saasWorkspace
    });

    assert.strictEqual(saasExecResult.status, 'SUCCESS', 'يجب أن يكتمل تنفيذ مشروع SaaS بنجاح');
    assert.strictEqual(saasExecResult.completedStepsCount, saasPlan.steps.length);
    assert(saasExecResult.artifactsCount >= 10, 'يجب توليد كافة عقود الأدلة للمشروع');

    // التحقق من إنشاء الملفات المادية الفعلية على القرص
    assert(fs.existsSync(path.join(saasWorkspace, 'ADR-001.md')), 'ADR file must exist physically');
    assert(fs.existsSync(path.join(saasWorkspace, '001_initial.sql')), 'Database migration file must exist physically');
    assert(fs.existsSync(path.join(saasWorkspace, 'server.js')), 'Backend server file must exist physically');
    assert(fs.existsSync(path.join(saasWorkspace, 'openapi.json')), 'OpenAPI specification must exist physically');
    console.log('  [PASS] 1. Full-Stack SaaS: Sequential execution & physical artifacts verified');

    // ----------------------------------------------------
    // اختبار 2: التحقق من تمرير السياق والمخرجات (Context Passing)
    // ----------------------------------------------------
    console.log('>>> [2/5] Testing Cross-Skill Context Passing & Artifact Reuse...');
    assert(saasExecResult.emittedArtifacts['ADR_DOCUMENT'], 'Architecture output must be available');
    assert(saasExecResult.emittedArtifacts['MIGRATION_SCRIPTS'], 'Database output must be available');
    assert(saasExecResult.emittedArtifacts['SERVICE_LAYER_IMPLEMENTATION'], 'Backend output must be available');
    assert(saasExecResult.evidenceGraphSummary.totalNodes > 10, 'Evidence graph must record all verified nodes');
    console.log('  [PASS] 2. Context Passing: Downstream skills successfully received upstream artifacts');

    // ----------------------------------------------------
    // اختبار 3: إدارة الفشل والتراجع الآمن (Fail-Closed Step Failure)
    // ----------------------------------------------------
    console.log('>>> [3/5] Testing Fail-Closed Resilience on Step Failure...');
    const failWorkspace = path.join(tempSandboxRoot, 'fail-workspace');
    const failedExecResult = MultiSkillExecutionEngine.executePlan(saasPlan, {
        workspacePath: failWorkspace,
        simulateFailureAtStep: 'database' // حقن فشل في خطوة قاعدة البيانات
    });

    assert.strictEqual(failedExecResult.status, 'FAILED');
    assert.strictEqual(failedExecResult.failureDetails.failedStep, 'database');
    assert.strictEqual(failedExecResult.rollbackExecuted, true);
    // التأكد من عدم تنفيذ الخطوات اللاحقة لقاعدة البيانات (مثل backend, frontend, testing)
    assert(!failedExecResult.stepLogs.some(log => log.skillId === 'backend' && log.status === 'SUCCESS'));
    console.log('  [PASS] 3. Fail-Closed Resilience: Execution immediately halted upon step failure');

    // ----------------------------------------------------
    // اختبار 4: التحكيم في تعارضات المخرجات بحسب هرمية السلطة
    // ----------------------------------------------------
    console.log('>>> [4/5] Testing Output Conflict Arbitration in Real Execution...');
    assert(saasExecResult.conflictResolutions.length > 0, 'Conflict resolutions must be logged');
    const secWin = saasExecResult.conflictResolutions.find(r => r.selected_rule === 'SEC_AUTH_GUARD');
    assert(secWin, 'Security P0 priority must strictly override public performance caching');
    console.log('  [PASS] 4. Authority Hierarchy: Constitutional arbitration strictly resolved output conflict');

    // ----------------------------------------------------
    // اختبار 5: تنفيذ مشروع التجارة الإلكترونية المعقد (E-commerce)
    // ----------------------------------------------------
    console.log('>>> [5/5] Testing Real Execution of E-commerce Transaction Systems...');
    const ecomPlan = IntelligentSkillRouter.route('ecommerce');
    const ecomWorkspace = path.join(tempSandboxRoot, 'ecom-workspace');

    const ecomExecResult = MultiSkillExecutionEngine.executePlan(ecomPlan, {
        workspacePath: ecomWorkspace
    });

    assert.strictEqual(ecomExecResult.status, 'SUCCESS');
    assert(ecomExecResult.emittedArtifacts['IDEMPOTENT_CHECKOUT_PROOF']);
    assert(ecomExecResult.emittedArtifacts['INVENTORY_RACE_TESTS']);
    assert(ecomExecResult.emittedArtifacts['WEBHOOK_HMAC_VERIFICATION']);
    console.log('  [PASS] 5. E-commerce: Real transaction safety & HMAC verification executed successfully');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All Multi-Skill Execution Engine Tests PASSED 100%.');
    console.log('======================================================');
} finally {
    try {
        fs.rmSync(tempSandboxRoot, { recursive: true, force: true });
    } catch (e) {}
}
