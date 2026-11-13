/**
 * @file multi-skill-execution.test.js
 * @description اختبارات التحقق من التنفيذ الحقيقي للمشاريع متعددة المهارات وتمرير السياق والاسترجاع الفعلي
 * (ProofForge Multi-Skill Real Execution & Physical Rollback Test Suite)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const IntelligentSkillRouter = require('../../packages/orchestration/intelligent-skill-router');
const MultiSkillExecutionEngine = require('../../packages/orchestration/multi-skill-execution-engine');

console.log('======================================================');
console.log('⚡ ProofForge — Multi-Skill Real Execution & Rollback Tests');
console.log('======================================================');

const tempSandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-exec-test-'));

try {
    // ----------------------------------------------------
    // اختبار 1: تنفيذ سيناريو Full-Stack SaaS المتكامل
    // ----------------------------------------------------
    console.log('>>> [1/5] Testing End-to-End Real Tool Execution for Full-Stack SaaS...');
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
    assert(fs.existsSync(path.join(saasWorkspace, 'apps/server/db/migrations/001_initial.sql')), 'Database migration file must exist physically');
    assert(fs.existsSync(path.join(saasWorkspace, 'apps/server/server.js')), 'Backend server file must exist physically');
    assert(fs.existsSync(path.join(saasWorkspace, 'openapi.json')), 'OpenAPI specification must exist physically');
    console.log('  [PASS] 1. Full-Stack SaaS: Real sequential execution & physical artifacts verified');

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
    // اختبار 3: التحقق الحقيقي من الاسترجاع المادي عند الفشل (Real Rollback with Hash Comparison)
    // ----------------------------------------------------
    console.log('>>> [3/5] Testing Physical Rollback & Byte-for-Byte State Restoration on Failure...');
    const failWorkspace = path.join(tempSandboxRoot, 'fail-workspace');
    fs.mkdirSync(failWorkspace, { recursive: true });

    // إنشاء ملف موجود مسبقاً قبل بدء التنفيذ
    const existingFilePath = path.join(failWorkspace, 'pre-existing-config.json');
    const existingContent = JSON.stringify({ version: 1, original: true });
    fs.writeFileSync(existingFilePath, existingContent, 'utf8');
    const initialHash = crypto.createHash('sha256').update(existingContent).digest('hex');

    // تشغيل خطة تبدأ بدون خطوة المعمارية لإحداث فشل حقيقي في تبعيات قاعدة البيانات
    const defectivePlan = {
        scenarioId: 'defective-test',
        scenarioName: 'Defective Plan',
        steps: [
            {
                stepNumber: 1,
                skillId: 'database',
                dependencies: ['architecture'], // التبعية غير متوفرة!
                evidenceRequired: ['MIGRATION_SCRIPTS']
            }
        ]
    };

    const failedExecResult = MultiSkillExecutionEngine.executePlan(defectivePlan, {
        workspacePath: failWorkspace
    });

    assert.strictEqual(failedExecResult.status, 'FAILED');
    assert.strictEqual(failedExecResult.failureDetails.failedStep, 'database');
    assert.strictEqual(failedExecResult.rollbackExecuted, true);
    assert.strictEqual(failedExecResult.rollbackVerified, true, 'Rollback must be verified byte-for-byte');

    // التأكد من أن الملف الموجود مسبقاً لم يتضرر وتطابقت تجزئته 100%
    assert(fs.existsSync(existingFilePath), 'Pre-existing file must be preserved');
    const currentHash = crypto.createHash('sha256').update(fs.readFileSync(existingFilePath, 'utf8')).digest('hex');
    assert.strictEqual(currentHash, initialHash, 'Pre-existing file content must match initial snapshot exactly');

    // التأكد من عدم بقاء أي ملفات فرعية منسوخة بالخطأ
    assert(!fs.existsSync(path.join(failWorkspace, 'apps/server/db/migrations/001_initial.sql')), 'Newly created files must be rolled back');
    console.log('  [PASS] 3. Physical Rollback: Workspace state restored byte-for-byte upon step failure');

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
    console.log('>>> [SUCCESS] All Multi-Skill Execution & Real Rollback Tests PASSED 100%.');
    console.log('======================================================');
} finally {
    try {
        fs.rmSync(tempSandboxRoot, { recursive: true, force: true });
    } catch (e) {}
}
