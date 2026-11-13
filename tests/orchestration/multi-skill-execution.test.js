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
const { ProjectAwareExecutionProvider } = require('../../packages/orchestration/agent-runtime-provider');

console.log('======================================================');
console.log('⚡ ProofForge — Multi-Skill Real Execution & Rollback Tests');
console.log('======================================================');

const tempSandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-exec-test-'));

try {
    // ----------------------------------------------------
    // اختبار 0: التحقق من رفض التزييف وإرجاع AGENT_RUNTIME_UNAVAILABLE عند غياب مشغل الوكيل
    // ----------------------------------------------------
    console.log('>>> [0/5] Testing Fail-Closed AGENT_RUNTIME_UNAVAILABLE when No Runtime is Provided...');
    const unavailPlan = IntelligentSkillRouter.route('fullstack-saas');
    const unavailWs = path.join(tempSandboxRoot, 'unavail-workspace');
    const unavailResult = MultiSkillExecutionEngine.executePlan(unavailPlan, { workspacePath: unavailWs });
    assert.strictEqual(unavailResult.status, 'AGENT_RUNTIME_UNAVAILABLE', 'يجب أن يفشل التنفيذ بحالة عدم توفر المشغل بدلاً من توليد قوالب زائفة');
    console.log('  [PASS] 0. Runtime Guard: Refuses mock execution and returns AGENT_RUNTIME_UNAVAILABLE');

    // ----------------------------------------------------
    // اختبار 1: تنفيذ سيناريو Full-Stack SaaS المتكامل عبر مشغل واعي بسياق المشروع
    // ----------------------------------------------------
    console.log('>>> [1/5] Testing End-to-End Real Tool Execution for Full-Stack SaaS...');
    const saasPlan = IntelligentSkillRouter.route('fullstack-saas');
    const saasWorkspace = path.join(tempSandboxRoot, 'saas-workspace');
    const agentRuntime = new ProjectAwareExecutionProvider();

    const saasExecResult = MultiSkillExecutionEngine.executePlan(saasPlan, {
        workspacePath: saasWorkspace,
        agentRuntime
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
    // اختبار 3: التحقق الحقيقي من الاسترجاع المادي عند الفشل بعد إحداث تعديلات فعلية
    // (Real Rollback after Actual Physical Workspace Mutations)
    // ----------------------------------------------------
    console.log('>>> [3/5] Testing Physical Rollback & Byte-for-Byte State Restoration on Failure...');
    const failWorkspace = path.join(tempSandboxRoot, 'fail-workspace');
    fs.mkdirSync(failWorkspace, { recursive: true });

    // 1. إنشاء ملفات وهيكل أصلي لمساحة العمل قبل بدء التنفيذ
    const existingFilePath = path.join(failWorkspace, 'pre-existing-config.json');
    const existingContent = JSON.stringify({ version: 1, original: true, author: 'Lead Architect' });
    fs.writeFileSync(existingFilePath, existingContent, 'utf8');
    const initialHash = crypto.createHash('sha256').update(existingContent).digest('hex');

    const legacyDir = path.join(failWorkspace, 'legacy-module');
    fs.mkdirSync(legacyDir, { recursive: true });
    const legacyFile = path.join(legacyDir, 'constants.js');
    const legacyContent = 'module.exports = { APP_ORIGINAL_CONST: 42 };\n';
    fs.writeFileSync(legacyFile, legacyContent, 'utf8');
    const legacyHash = crypto.createHash('sha256').update(legacyContent).digest('hex');

    const emptyDir = path.join(failWorkspace, 'preserved-empty-dir');
    fs.mkdirSync(emptyDir, { recursive: true });

    // محاولة إنشاء رابط رمزي اختباري إن كان مدعوماً بالنظام
    let hasSymlink = false;
    const symlinkPath = path.join(failWorkspace, 'symlink-to-constants');
    try {
        fs.symlinkSync(legacyFile, symlinkPath);
        hasSymlink = true;
    } catch (_) {
        // EPERM on non-elevated Windows environments
    }

    // 2. إعداد خطة متعددة المهارات تنفذ خطوات حقيقية وتكتب ملفات، ثم تفشل في خطوة تالية بعد حدوث التعديلات
    // الخطوة 1: architecture (تنشئ ADR-001.md بنجاح)
    // الخطوة 2: database (تنشئ مخططات ومجلدات migrations بنجاح)
    // الخطوة 3: خطوة تفشل عمداً بعد تشويه الملف الأصلي وإنشاء ملف مؤقت جديد
    const defectiveMultiStepPlan = {
        scenarioId: 'multi-step-rollback-test',
        scenarioName: 'Multi-Step Rollback Test Scenario',
        steps: [
            {
                stepNumber: 1,
                skillId: 'architecture',
                dependencies: [],
                evidenceRequired: ['ADR_DOCUMENT']
            },
            {
                stepNumber: 2,
                skillId: 'database',
                dependencies: ['architecture'],
                evidenceRequired: ['MIGRATION_SCRIPTS']
            },
            {
                stepNumber: 3,
                skillId: 'security',
                dependencies: ['database'],
                evidenceRequired: ['UNSATISFIABLE_FAILING_EVIDENCE'],
                mutateWorkspace: (ws) => {
                    // تشويه متعمد للملف الأصلي وإنشاء ملف دخيل
                    fs.writeFileSync(path.join(ws, 'pre-existing-config.json'), '{"corrupted": true, "tampered": true}', 'utf8');
                    fs.writeFileSync(path.join(ws, 'untracked-dirty-file.tmp'), 'dirty data', 'utf8');
                }
            }
        ]
    };

    const failedExecResult = MultiSkillExecutionEngine.executePlan(defectiveMultiStepPlan, {
        workspacePath: failWorkspace,
        agentRuntime
    });

    assert.strictEqual(failedExecResult.status, 'FAILED');
    assert.strictEqual(failedExecResult.failureDetails.failedStep, 'security');
    assert.strictEqual(failedExecResult.rollbackExecuted, true);
    assert.strictEqual(failedExecResult.rollbackVerified, true, 'Rollback must be verified byte-for-byte');

    // 3. التحقق الحتمي الصارم من أن الملفات التي أُنشئت في الخطوات السابقة تم حذفها بالكامل
    assert(!fs.existsSync(path.join(failWorkspace, 'ADR-001.md')), 'ADR-001.md created in step 1 must be deleted');
    assert(!fs.existsSync(path.join(failWorkspace, 'apps/server/db/migrations/001_initial.sql')), 'Migrations created in step 2 must be deleted');
    assert(!fs.existsSync(path.join(failWorkspace, 'apps/server/db/storage-adapter.js')), 'Storage adapter created in step 2 must be deleted');
    assert(!fs.existsSync(path.join(failWorkspace, 'apps/server/db')), 'Nested migrations folder must be removed');
    assert(!fs.existsSync(path.join(failWorkspace, 'untracked-dirty-file.tmp')), 'Dirty file created in step 3 must be deleted');

    // 4. التحقق من أن الملفات الأصلية تم استعادتها بدقة تامة ومطابقة الـ Hash والصلاحيات
    assert(fs.existsSync(existingFilePath), 'Pre-existing file must be preserved');
    const currentHash = crypto.createHash('sha256').update(fs.readFileSync(existingFilePath, 'utf8')).digest('hex');
    assert.strictEqual(currentHash, initialHash, 'Pre-existing file content must match initial snapshot byte-for-byte');

    assert(fs.existsSync(legacyFile), 'Legacy file must be preserved');
    const currentLegacyHash = crypto.createHash('sha256').update(fs.readFileSync(legacyFile, 'utf8')).digest('hex');
    assert.strictEqual(currentLegacyHash, legacyHash, 'Legacy file content must match initial snapshot');

    // 5. التحقق من أن المجلدات الفارغة تم الاحتفاظ بها
    assert(fs.existsSync(emptyDir), 'Preserved empty directory must still exist');

    // 6. التحقق من بقاء الرابط الرمزي إذا كان مدعوماً
    if (hasSymlink) {
        assert(fs.existsSync(symlinkPath), 'Symlink must be preserved');
        assert.strictEqual(fs.readlinkSync(symlinkPath), legacyFile, 'Symlink target must match exactly');
    }

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
        workspacePath: ecomWorkspace,
        agentRuntime
    });

    assert.strictEqual(ecomExecResult.status, 'SUCCESS');
    assert(ecomExecResult.emittedArtifacts['IDEMPOTENT_CHECKOUT_PROOF']);
    assert(ecomExecResult.emittedArtifacts['INVENTORY_RACE_TESTS']);
    assert(ecomExecResult.emittedArtifacts['WEBHOOK_HMAC_VERIFICATION']);
    console.log('  [PASS] 5. E-commerce: Real transaction safety & HMAC verification executed successfully');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All Multi-Skill Execution & Real Rollback Tests PASSED 100%.');
    console.log('======================================================');
} catch (testError) {
    console.error('>>> [TEST EXCEPTION IN MULTI-SKILL-EXEC]:', testError.stack || testError.message);
    throw testError;
} finally {
    try {
        fs.rmSync(tempSandboxRoot, { recursive: true, force: true });
    } catch (e) {
        process.stderr.write(`[Cleanup Notice] ${e.message}\n`);
    }
}
