/**
 * @file agent-execution-adapter.js
 * @description محول ومحرك إدارة دورة حياة الوكيل الذكائي في ProofForge
 * (ProofForge Agent Execution Lifecycle Adapter & State Machine)
 * 
 * يطبق آلة الحالات الصارمة ذات الـ 12 حالة متتالية:
 * - PENDING: في انتظار بدء المهمة
 * - CONTEXT_DISCOVERY: استكشاف البنية التحتية وسياق المشروع المستهدف
 * - SKILL_LOADING: تحميل التعليمات الفعلية والمواصفات السلوكية للمهارة
 * - AGENT_RUNTIME_INITIALIZING: تهيئة مشغل الوكيل والتحقق من توفره
 * - AGENT_EXECUTING: تنفيذ الوكيل للمهمة الفعلية وتتبع الأدوات
 * - ARTIFACT_COLLECTION: جمع الملفات المادية وتتبع الفروقات وفحص الحدود
 * - INDEPENDENT_VERIFICATION: استدعاء المدقق التخصصي المستقل للمهارة
 * - VERIFIED: التحقق المستقل الناجح وتوثيق الأدلة المادية
 * - FAILED: إخفاق الوكيل أو فشل المدقق المستقل
 * - BLOCKED: تعليق التنفيذ لخلل في التبعيات أو القيود الأمنية
 * - AGENT_RUNTIME_UNAVAILABLE: عدم توفر بيئة تشغيل الوكيل الحي المعتمد
 * - CANCELLED: إلغاء المهمة أو انتهاء المهلة المحددة
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ProjectContextDiscovery = require('./project-context-discovery');
const PathLoaderGuard = require('../contracts/path-loader-guard');

const VALID_STATES = Object.freeze([
    'PENDING',
    'CONTEXT_DISCOVERY',
    'SKILL_LOADING',
    'AGENT_RUNTIME_INITIALIZING',
    'AGENT_EXECUTING',
    'ARTIFACT_COLLECTION',
    'INDEPENDENT_VERIFICATION',
    'VERIFIED',
    'FAILED',
    'BLOCKED',
    'AGENT_RUNTIME_UNAVAILABLE',
    'CANCELLED'
]);

const ERROR_CODES = Object.freeze({
    AGENT_RUNTIME_UNAVAILABLE: 'AGENT_RUNTIME_UNAVAILABLE',
    AGENT_RUNTIME_INITIALIZATION_FAILED: 'AGENT_RUNTIME_INITIALIZATION_FAILED',
    AGENT_EXECUTION_FAILED: 'AGENT_EXECUTION_FAILED',
    AGENT_EXECUTION_TIMEOUT: 'AGENT_EXECUTION_TIMEOUT',
    AGENT_EXECUTION_CANCELLED: 'AGENT_EXECUTION_CANCELLED',
    PROJECT_CONTEXT_UNAVAILABLE: 'PROJECT_CONTEXT_UNAVAILABLE',
    WORKSPACE_PERMISSION_DENIED: 'WORKSPACE_PERMISSION_DENIED',
    ARTIFACT_COLLECTION_FAILED: 'ARTIFACT_COLLECTION_FAILED',
    INDEPENDENT_VERIFICATION_FAILED: 'INDEPENDENT_VERIFICATION_FAILED',
    UNAUTHORIZED_WORKSPACE_MODIFICATION: 'UNAUTHORIZED_WORKSPACE_MODIFICATION'
});

const ALLOWED_TRANSITIONS = Object.freeze({
    'PENDING': ['CONTEXT_DISCOVERY', 'SKILL_LOADING', 'AGENT_RUNTIME_INITIALIZING', 'BLOCKED', 'FAILED', 'AGENT_RUNTIME_UNAVAILABLE', 'CANCELLED'],
    'CONTEXT_DISCOVERY': ['SKILL_LOADING', 'PLANNING', 'AGENT_RUNTIME_INITIALIZING', 'BLOCKED', 'FAILED', 'CANCELLED'],
    'PLANNING': ['READY', 'SKILL_LOADING', 'BLOCKED', 'FAILED', 'CANCELLED'],
    'READY': ['SKILL_LOADING', 'AGENT_RUNTIME_INITIALIZING', 'AGENT_EXECUTING', 'AGENT_RUNTIME_UNAVAILABLE', 'BLOCKED', 'FAILED', 'CANCELLED'],
    'SKILL_LOADING': ['AGENT_RUNTIME_INITIALIZING', 'BLOCKED', 'FAILED', 'CANCELLED'],
    'AGENT_RUNTIME_INITIALIZING': ['AGENT_EXECUTING', 'AGENT_RUNTIME_UNAVAILABLE', 'FAILED', 'BLOCKED', 'CANCELLED'],
    'AGENT_EXECUTING': ['ARTIFACT_COLLECTION', 'VERIFYING', 'FAILED', 'CANCELLED', 'BLOCKED'],
    'ARTIFACT_COLLECTION': ['INDEPENDENT_VERIFICATION', 'VERIFYING', 'FAILED', 'CANCELLED', 'BLOCKED'],
    'INDEPENDENT_VERIFICATION': ['VERIFIED', 'FAILED', 'BLOCKED'],
    'VERIFYING': ['VERIFIED', 'FAILED', 'BLOCKED'],
    'VERIFIED': [],
    'FAILED': ['ROLLED_BACK'],
    'ROLLED_BACK': [],
    'BLOCKED': ['FAILED', 'ROLLED_BACK'],
    'AGENT_RUNTIME_UNAVAILABLE': [],
    'CANCELLED': ['ROLLED_BACK']
});

class AgentExecutionAdapter {
    constructor(taskId, options = {}) {
        if (!taskId || typeof taskId !== 'string') {
            throw new Error('محظور: يجب تمرير معرّف مهمة صالح (Invalid Task ID)');
        }

        this.taskId = taskId;
        this.options = options;
        this.currentState = 'PENDING';
        this.context = null;
        this.plan = null;
        this.skill = null;
        this.runtimeInfo = null;
        this.executionResult = null;
        this.artifacts = {};
        this.changedFiles = [];
        this.history = [];
        this.error = null;
        this.errorCode = null;
        this.startTime = Date.now();
        this.endTime = null;

        this._recordHistory('INIT', 'Task initialized in PENDING state');
    }

    /**
     * الانتقال الحتمي الآمن بين حالات دورة الحياة مع التحقق المركزي الصارم
     * @param {string} targetState الحالة المستهدفة
     * @param {Object} metadata تفاصيل إضافية
     */
    transition(targetState, metadata = {}) {
        if (!VALID_STATES.includes(targetState) && targetState !== 'PLANNING' && targetState !== 'READY' && targetState !== 'VERIFYING' && targetState !== 'ROLLED_BACK') {
            throw new Error(`حالة غير معترف بها: '${targetState}'`);
        }

        const allowed = ALLOWED_TRANSITIONS[this.currentState] || [];
        if (!allowed.includes(targetState)) {
            const err = new Error(`محظور: انتقال غير قانوني في دورة حياة الوكيل من '${this.currentState}' إلى '${targetState}'`);
            err.code = 'INVALID_STATE_TRANSITION';
            throw err;
        }

        // قاعدة صارمة: يمنع منعاً باتاً الانتقال إلى VERIFIED دون المرور بالفحص المستقل
        if (targetState === 'VERIFIED' && this.currentState !== 'INDEPENDENT_VERIFICATION' && this.currentState !== 'VERIFYING') {
            const err = new Error(`محظور: لا يمكن الانتقال إلى VERIFIED إلا بعد مرحلة INDEPENDENT_VERIFICATION المكتملة`);
            err.code = 'ILLEGAL_VERIFICATION_JUMP';
            throw err;
        }

        const previousState = this.currentState;
        this.currentState = targetState;
        this._recordHistory(targetState, metadata);

        return {
            taskId: this.taskId,
            previousState,
            currentState: this.currentState,
            transitionedAt: new Date().toISOString()
        };
    }

    /**
     * تنفيذ مرحلة استكشاف السياق الهندسي للمشروع
     * @param {string} workspacePath مسار مجلد المشروع
     */
    discoverProjectContext(workspacePath) {
        this.transition('CONTEXT_DISCOVERY', { workspacePath });
        try {
            this.context = ProjectContextDiscovery.discoverContext(workspacePath);
            return this.context;
        } catch (err) {
            this.fail(ERROR_CODES.PROJECT_CONTEXT_UNAVAILABLE, err.message);
            throw err;
        }
    }

    /**
     * تحميل التعليمات الفعلية والمواصفات السلوكية للمهارة من القرص
     * @param {string} skillId معرف المهارة
     * @param {string} rootDir مسار جذر المنظومة
     */
    loadSkillInstructions(skillId, rootDir) {
        this.transition('SKILL_LOADING', { skillId });
        try {
            const skillPath = path.join(rootDir, 'skills', skillId, 'SKILL.md');
            if (!fs.existsSync(skillPath)) {
                throw new Error(`ملف تعليمات المهارة '${skillId}' غير موجود على المسار: ${skillPath}`);
            }
            const content = fs.readFileSync(skillPath, 'utf8');

            const specsPath = path.join(rootDir, 'registry/skills-behavioral-specs.json');
            let behavioralSpec = null;
            if (fs.existsSync(specsPath)) {
                const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));
                behavioralSpec = specs[skillId] || null;
            }

            this.skill = {
                skillId,
                skillPath,
                instructionLength: content.length,
                instructions: content,
                behavioralSpec
            };
            return this.skill;
        } catch (err) {
            this.fail(ERROR_CODES.AGENT_EXECUTION_FAILED, `Failed to load skill '${skillId}': ${err.message}`);
            throw err;
        }
    }

    /**
     * تسجيل خطة التنفيذ المعتمدة (للتوافق المعماري)
     * @param {Object} plan خطة التنفيذ
     */
    registerPlan(plan) {
        if (!plan || !Array.isArray(plan.steps) || plan.steps.length === 0) {
            this.fail(ERROR_CODES.AGENT_EXECUTION_FAILED, 'Invalid or empty execution plan');
            throw new Error('خطة التنفيذ غير صالحة');
        }

        this.transition('PLANNING', { planId: plan.scenarioId, stepsCount: plan.steps.length });
        this.plan = plan;
        this.transition('READY', { planId: plan.scenarioId });
        return this.currentState;
    }

    /**
     * تهيئة مشغل الوكيل والتحقق من توفره
     * @param {Object} runtimeProvider مزود بيئة التشغيل
     */
    initializeRuntime(runtimeProvider) {
        this.transition('AGENT_RUNTIME_INITIALIZING', { providerName: (runtimeProvider && runtimeProvider.name) || 'Unknown' });

        if (!runtimeProvider) {
            this.markRuntimeUnavailable('No compatible live agent runtime provided');
            return false;
        }

        try {
            const capabilities = typeof runtimeProvider.discoverCapabilities === 'function'
                ? runtimeProvider.discoverCapabilities()
                : { isLive: runtimeProvider.isLive === true };

            if (!capabilities.isLive && !this.options.isTestHarness) {
                this.markRuntimeUnavailable('Agent runtime reported inactive/non-live state');
                return false;
            }

            this.runtimeInfo = {
                providerName: runtimeProvider.name || 'CustomRuntime',
                capabilities,
                initializedAt: new Date().toISOString()
            };
            return true;
        } catch (initErr) {
            this.fail(ERROR_CODES.AGENT_RUNTIME_INITIALIZATION_FAILED, initErr.message);
            throw initErr;
        }
    }

    /**
     * إغلاق المهمة كغير منفذة عند غياب بيئة تشغيل الوكيل الحية لمنع الادعاءات الزائفة
     */
    markRuntimeUnavailable(reason = 'Live Antigravity agent runtime is unavailable') {
        this.errorCode = ERROR_CODES.AGENT_RUNTIME_UNAVAILABLE;
        this.error = reason;
        this.transition('AGENT_RUNTIME_UNAVAILABLE', { reason });
        return {
            taskId: this.taskId,
            status: 'AGENT_RUNTIME_UNAVAILABLE',
            reason,
            timestamp: new Date().toISOString()
        };
    }

    get isVerified() {
        return this.currentState === 'VERIFIED';
    }

    get isFailed() {
        return this.currentState === 'FAILED' || this.currentState === 'ROLLED_BACK';
    }

    /**
     * تسجيل فشل المهمة مع كود خطأ معتمد
     */
    fail(errorCode, errorMessage) {
        this.errorCode = errorCode || ERROR_CODES.AGENT_EXECUTION_FAILED;
        this.error = errorMessage;
        this.endTime = Date.now();
        if (this.currentState !== 'FAILED' && this.currentState !== 'ROLLED_BACK') {
            this.transition('FAILED', { errorCode: this.errorCode, error: errorMessage });
        }
    }

    /**
     * إلغاء المهمة رسمياً
     */
    cancel(reason = 'Execution cancelled by user or timeout') {
        this.errorCode = ERROR_CODES.AGENT_EXECUTION_CANCELLED;
        this.error = reason;
        this.endTime = Date.now();
        this.transition('CANCELLED', { reason });
    }

    /**
     * تسجيل التاريخ الحتمي للعملية
     */
    _recordHistory(state, metadata) {
        this.history.push({
            state,
            timestamp: new Date().toISOString(),
            metadata
        });
    }

    /**
     * استخراج تقرير التدقيق الهيكلي المعتمد دون أي مقاييس وهمية
     */
    getExecutionReport() {
        return {
            executionId: `EXEC_${this.taskId}_${this.startTime}`,
            taskId: this.taskId,
            currentState: this.currentState,
            isVerified: this.currentState === 'VERIFIED',
            isFailed: this.currentState === 'FAILED' || this.currentState === 'ROLLED_BACK',
            isRuntimeUnavailable: this.currentState === 'AGENT_RUNTIME_UNAVAILABLE',
            runtimeProvider: this.runtimeInfo ? this.runtimeInfo.providerName : null,
            modelIdentifier: (this.runtimeInfo && this.runtimeInfo.model) || null,
            tokenUsage: (this.executionResult && this.executionResult.tokenUsage) || null,
            durationMs: this.endTime ? (this.endTime - this.startTime) : (Date.now() - this.startTime),
            changedFiles: this.changedFiles,
            errorCode: this.errorCode,
            error: this.error,
            history: this.history
        };
    }
}

module.exports = {
    AgentExecutionAdapter,
    VALID_STATES,
    ALLOWED_TRANSITIONS,
    ERROR_CODES
};
