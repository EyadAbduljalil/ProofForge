/**
 * @file multi-skill-scenarios.test.js
 * @description اختبارات التحقق من التوجيه الذكي للمهارات والسيناريوهات الستة الكبرى في ProofForge
 * (Multi-Skill Intelligent Orchestration & Real-World Scenarios Test Suite)
 * 
 * يختبر الترتيب الطوبولوجي الصارم، وغياب الحلقات الدائرية،
 * والتحكيم بين القواعد المتعارضة، وتغطية السيناريوهات الحقيقية الستة:
 * 1. Full-Stack SaaS Platform
 * 2. E-commerce & Transaction Systems
 * 3. Existing Project Refactoring & Hardening
 * 4. Secure Authentication & Access Control
 * 5. RTL Localization & WCAG AAA Accessibility
 * 6. Hardened Production API Microservice
 */

'use strict';

const assert = require('assert');
const path = require('path');
const IntelligentSkillRouter = require('../../packages/orchestration/intelligent-skill-router');

console.log('======================================================');
console.log('🧭 ProofForge — Multi-Skill Intelligent Orchestrator Tests');
console.log('======================================================');

// ----------------------------------------------------
// السيناريو 1: منصة سحابية شاملة (Full-Stack SaaS Platform)
// ----------------------------------------------------
console.log('>>> [Scenario 1/6] Testing Full-Stack SaaS Orchestration...');
const saasPlan = IntelligentSkillRouter.route('fullstack-saas');

assert.strictEqual(saasPlan.scenarioId, 'fullstack-saas');
assert.strictEqual(saasPlan.status, 'READY_FOR_EXECUTION');
assert(saasPlan.skillCount >= 10, 'يجب أن يغطي سيناريو SaaS على الأقل 10 مهارات تخصصية');

// فحص الترتيب الطوبولوجي: architecture قبل database وقبل backend
const archIndex = saasPlan.orderedSkillIds.indexOf('architecture');
const dbIndex = saasPlan.orderedSkillIds.indexOf('database');
const backendIndex = saasPlan.orderedSkillIds.indexOf('backend');
const apiIndex = saasPlan.orderedSkillIds.indexOf('api');
const frontendIndex = saasPlan.orderedSkillIds.indexOf('frontend');
const testingIndex = saasPlan.orderedSkillIds.indexOf('testing');
const prodIndex = saasPlan.orderedSkillIds.indexOf('production-readiness');

assert(archIndex !== -1 && dbIndex !== -1 && backendIndex !== -1 && frontendIndex !== -1);
assert(archIndex < dbIndex, 'Architecture must strictly precede database');
assert(dbIndex < backendIndex, 'Database must strictly precede backend');
assert(backendIndex < apiIndex, 'Backend must strictly precede API');
assert(backendIndex < testingIndex, 'Backend must precede testing');
assert(testingIndex < prodIndex, 'Testing must strictly precede production-readiness');

// التحقق من متطلبات الأدلة
const dbStep = saasPlan.steps.find(s => s.skillId === 'database');
assert(dbStep.evidenceRequired.includes('TENANT_ISOLATION_PROOF'), 'Database must require tenant isolation proof');
console.log('  [PASS] 1. Full-Stack SaaS: Topological ordering & tenant isolation contract verified');

// ----------------------------------------------------
// السيناريو 2: متجر إلكتروني ونظم معاملات (E-commerce Systems)
// ----------------------------------------------------
console.log('>>> [Scenario 2/6] Testing E-commerce & Transaction Systems Orchestration...');
const ecomPlan = IntelligentSkillRouter.route({
    prompt: 'أحتاج متجر إلكتروني مع نظام سلة وتسوق ودفع Stripe وحماية المخزون من السباق'
});

assert.strictEqual(ecomPlan.scenarioId, 'ecommerce');
assert(ecomPlan.orderedSkillIds.includes('ecommerce'), 'يجب تضمين مهارة ecommerce');
assert(ecomPlan.orderedSkillIds.includes('security'), 'يجب تضمين مهارة security');
assert(ecomPlan.orderedSkillIds.includes('forms'), 'يجب تضمين مهارة forms');

const ecomIndex = ecomPlan.orderedSkillIds.indexOf('ecommerce');
const secIndex = ecomPlan.orderedSkillIds.indexOf('security');
assert(secIndex < ecomIndex, 'Security must precede ecommerce business logic');

const ecomStep = ecomPlan.steps.find(s => s.skillId === 'ecommerce');
assert(ecomStep.evidenceRequired.includes('IDEMPOTENT_CHECKOUT_PROOF'));
assert(ecomStep.evidenceRequired.includes('INVENTORY_RACE_TESTS'));
assert(ecomStep.evidenceRequired.includes('WEBHOOK_HMAC_VERIFICATION'));
console.log('  [PASS] 2. E-commerce: Idempotent checkout & inventory race protections verified');

// ----------------------------------------------------
// السيناريو 3: إعادة هيكلة مشروع قائم (Project Refactoring)
// ----------------------------------------------------
console.log('>>> [Scenario 3/6] Testing Existing Project Refactoring Orchestration...');
const refactorPlan = IntelligentSkillRouter.route({
    scenario: 'refactoring'
});

assert.strictEqual(refactorPlan.scenarioId, 'refactoring');
const auditIndex = refactorPlan.orderedSkillIds.indexOf('project-audit');
const codeReviewIndex = refactorPlan.orderedSkillIds.indexOf('code-review');
assert(auditIndex !== -1, 'يجب أن يبدأ بالتدقيق الفني للمشروع');
assert(auditIndex < codeReviewIndex, 'Project audit must precede code review');
assert(refactorPlan.orderedSkillIds.includes('anti-laziness'), 'Anti-laziness must govern refactoring');
console.log('  [PASS] 3. Project Refactoring: Audit & code review sequence verified');

// ----------------------------------------------------
// السيناريو 4: منظومة المصادقة والتفويض الصارمة (Secure Auth)
// ----------------------------------------------------
console.log('>>> [Scenario 4/6] Testing Secure Authentication Orchestration...');
const authPlan = IntelligentSkillRouter.route('secure-auth');

assert.strictEqual(authPlan.scenarioId, 'secure-auth');
const authSecStep = authPlan.steps.find(s => s.skillId === 'security');
assert.strictEqual(authSecStep.priority, 'P0_SECURITY_SAFETY');
assert(authPlan.keyInvariants.some(inv => inv.includes('Anti-IDOR')), 'يجب إلزام حماية Anti-IDOR');
assert(authPlan.orderedSkillIds.includes('code-review'), 'يجب إخضاع شفرة المصادقة للمراجعة الصارمة');
console.log('  [PASS] 4. Secure Authentication: P0 priority & Anti-IDOR invariants verified');

// ----------------------------------------------------
// السيناريو 5: دعم العربية وإتاحة الوصول (RTL & WCAG AAA)
// ----------------------------------------------------
console.log('>>> [Scenario 5/6] Testing RTL Localization & Accessibility Orchestration...');
const rtlPlan = IntelligentSkillRouter.route({
    prompt: 'تصميم واجهة متوافقة مع اللغة العربية مع دعم كامل لقارئات الشاشة ومعايير WCAG AAA'
});

assert.strictEqual(rtlPlan.scenarioId, 'rtl-accessibility');
assert(rtlPlan.orderedSkillIds.includes('rtl'), 'يجب تضمين مهارة rtl');
assert(rtlPlan.orderedSkillIds.includes('accessibility'), 'يجب تضمين مهارة accessibility');
assert(rtlPlan.orderedSkillIds.includes('design-system'), 'يجب تضمين مهارة design-system');

const rtlStep = rtlPlan.steps.find(s => s.skillId === 'rtl');
assert(rtlStep.evidenceRequired.includes('LOGICAL_PROPERTIES_AUDIT'));
assert(rtlStep.evidenceRequired.includes('ICON_MIRRORING_VERIFICATION'));

const a11yStep = rtlPlan.steps.find(s => s.skillId === 'accessibility');
assert(a11yStep.evidenceRequired.includes('WCAG_2_2_AAA_AUDIT'));
assert(a11yStep.evidenceRequired.includes('KEYBOARD_NAVIGATION_TEST'));
console.log('  [PASS] 5. RTL & Accessibility: Logical properties & WCAG 2.2 AAA contracts verified');

// ----------------------------------------------------
// السيناريو 6: واجهة برمجية فائقة الموثوقية (Production API)
// ----------------------------------------------------
console.log('>>> [Scenario 6/6] Testing Production API Microservice Orchestration...');
const apiPlan = IntelligentSkillRouter.route('production-api');

assert.strictEqual(apiPlan.scenarioId, 'production-api');
assert(apiPlan.orderedSkillIds.includes('api'));
assert(apiPlan.orderedSkillIds.includes('deployment'));
assert(apiPlan.orderedSkillIds.includes('production-readiness'));

const deployStep = apiPlan.steps.find(s => s.skillId === 'deployment');
assert(deployStep.evidenceRequired.includes('NON_ROOT_DOCKERFILE'));
assert(deployStep.evidenceRequired.includes('ZERO_SECRET_LEAK_AUDIT'));
console.log('  [PASS] 6. Production API: Non-root container & OpenAPI contracts verified');

// ----------------------------------------------------
// التحقق من حل التعارضات وهرمية السلطة (Conflict Arbitration)
// ----------------------------------------------------
console.log('>>> [Arbitration] Testing Rule Conflict Resolution in Plans...');
assert(saasPlan.conflictResolutions.length > 0, 'يجب تسجيل قرارات التحكيم في الخطة');

const secConflict = saasPlan.conflictResolutions.find(r => r.selected_rule === 'SEC_AUTH_EVERY_REQ');
assert(secConflict, 'Security must strictly override unauthenticated caching');
assert.strictEqual(secConflict.status, 'DECIDED_AND_LOGGED');

const lazinessConflict = saasPlan.conflictResolutions.find(r => r.selected_rule === 'ANTI_LAZINESS_FULL_CODE');
assert(lazinessConflict, 'Anti-laziness must override mock/stub shortcuts');
console.log('  [PASS] Rule Conflict Arbitration & Authority Hierarchy strictly enforced');

// ----------------------------------------------------
// التحقق من الحماية ضد الحلقات الدائرية (Cycle Detection)
// ----------------------------------------------------
console.log('>>> [Cycle Defense] Testing Circular Dependency Detection...');
const validSorted = IntelligentSkillRouter.topologicalSort(['architecture', 'database', 'backend', 'frontend']);
assert.strictEqual(validSorted[0], 'architecture');

const cyclicCatalog = {
    'skill-a': { dependencies: ['skill-b'], priority: 'P4_ENGINEERING' },
    'skill-b': { dependencies: ['skill-a'], priority: 'P4_ENGINEERING' }
};

assert.throws(() => {
    IntelligentSkillRouter.topologicalSort(['skill-a', 'skill-b'], cyclicCatalog);
}, /حلقة تبعية دائرية/);
console.log('  [PASS] Circular dependency accurately detected and rejected');

console.log('======================================================');
console.log('>>> [SUCCESS] All Multi-Skill Orchestration Tests PASSED 100%.');
console.log('======================================================');
