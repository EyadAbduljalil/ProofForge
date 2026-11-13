/**
 * @file agent-execution-adapter.js
 * @description محول ومحرك إدارة دورة حياة الوكيل الذكائي في ProofForge
 * (ProofForge Agent Execution Lifecycle Adapter & State Machine)
 * 
 * يدير الحالات الرسمية للوكيل:
 * - PENDING: في انتظار بدء المهمة
 * - CONTEXT_DISCOVERY: استكشاف البنية التحتية والمشروع عبر ProjectContextDiscovery
 * - PLANNING: إعداد وتوجيه خطة المهارات المطلوبة
 * - READY: جاهز للتنفيذ الفعلي
 * - EXECUTING: تشغيل الأدوات والمهارات المادية
 * - VERIFYING: استدعاء المدققات التخصصية وفحص الأدلة
 * - VERIFIED: اكتمال التحقق بنجاح وربط الأدلة الحتمية
 * - FAILED: إخفاق فحص أو أداة أو خطوة برمجية
 * - BLOCKED: تعليق التنفيذ لخلل في التبعيات أو القيود الأمنية
 * - ROLLED_BACK: تنفيذ الاسترجاع المادي لحالة مساحة العمل السابقة
 * - AGENT_RUNTIME_UNAVAILABLE: عدم توفر بيئة تشغيل الوكيل الحي (Antigravity Runtime)
 */

'use strict';

const ProjectContextDiscovery = require('./project-context-discovery');

const VALID_STATES = Object.freeze([
    'PENDING',
    'CONTEXT_DISCOVERY',
    'PLANNING',
    'READY',
    'EXECUTING',
    'VERIFYING',
    'VERIFIED',
    'FAILED',
    'BLOCKED',
    'ROLLED_BACK',
    'AGENT_RUNTIME_UNAVAILABLE'
]);

const ALLOWED_TRANSITIONS = Object.freeze({
    'PENDING': ['CONTEXT_DISCOVERY', 'BLOCKED', 'FAILED', 'AGENT_RUNTIME_UNAVAILABLE'],
    'CONTEXT_DISCOVERY': ['PLANNING', 'FAILED', 'BLOCKED'],
    'PLANNING': ['READY', 'BLOCKED', 'FAILED'],
    'READY': ['EXECUTING', 'AGENT_RUNTIME_UNAVAILABLE', 'BLOCKED', 'FAILED'],
    'EXECUTING': ['VERIFYING', 'FAILED', 'BLOCKED'],
    'VERIFYING': ['VERIFIED', 'FAILED', 'BLOCKED'],
    'VERIFIED': [], // Terminal success
    'FAILED': ['ROLLED_BACK'],
    'ROLLED_BACK': [], // Terminal post-failure rollback
    'BLOCKED': ['FAILED', 'ROLLED_BACK'],
    'AGENT_RUNTIME_UNAVAILABLE': [] // Terminal without execution
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
        this.artifacts = {};
        this.history = [];
        this.error = null;

        this._recordHistory('INIT', 'Task initialized in PENDING state');
    }

    /**
     * الانتقال الحتمي الآمن بين حالات دورة الحياة
     * @param {string} targetState الحالة المستهدفة
     * @param {Object} metadata تفاصيل إضافية
     */
    transition(targetState, metadata = {}) {
        if (!VALID_STATES.includes(targetState)) {
            throw new Error(`حالة غير معترف بها: '${targetState}'`);
        }

        const allowed = ALLOWED_TRANSITIONS[this.currentState] || [];
        if (!allowed.includes(targetState)) {
            const err = new Error(`محظور: انتقال غير قانوني في دورة حياة الوكيل من '${this.currentState}' إلى '${targetState}'`);
            err.code = 'INVALID_STATE_TRANSITION';
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
            this.error = err.message;
            this.transition('FAILED', { error: err.message, phase: 'CONTEXT_DISCOVERY' });
            throw err;
        }
    }

    /**
     * تسجيل خطة التنفيذ المعتمدة
     * @param {Object} plan خطة التنفيذ
     */
    registerPlan(plan) {
        if (!plan || !Array.isArray(plan.steps) || plan.steps.length === 0) {
            this.transition('FAILED', { error: 'Invalid or empty execution plan' });
            throw new Error('خطة التنفيذ غير صالحة');
        }

        this.transition('PLANNING', { planId: plan.scenarioId, stepsCount: plan.steps.length });
        this.plan = plan;
        this.transition('READY', { planId: plan.scenarioId });
        return this.currentState;
    }

    /**
     * فحص توفر بيئة تشغيل الوكيل الذكائي المباشرة (Antigravity Runtime)
     * @returns {boolean}
     */
    isAgentRuntimeAvailable() {
        return Boolean(
            process.env.ANTIGRAVITY_AGENT_RUNTIME === 'active' ||
            (this.options.agentRuntime && this.options.agentRuntime.isLive === true)
        );
    }

    /**
     * إغلاق المهمة كغير منفذة عند غياب بيئة تشغيل الوكيل الحية لمنع الادعاءات الزائفة
     */
    markRuntimeUnavailable(reason = 'Live Antigravity agent runtime is unavailable') {
        this.transition('AGENT_RUNTIME_UNAVAILABLE', { reason });
        return {
            taskId: this.taskId,
            status: 'AGENT_RUNTIME_UNAVAILABLE',
            reason,
            timestamp: new Date().toISOString()
        };
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
     * الحصول على تقرير دورة الحياة المتكامل
     */
    getLifecycleReport() {
        return {
            taskId: this.taskId,
            currentState: this.currentState,
            isCompleted: this.currentState === 'VERIFIED',
            isFailed: this.currentState === 'FAILED' || this.currentState === 'ROLLED_BACK',
            contextDiscovered: Boolean(this.context),
            planRegistered: Boolean(this.plan),
            historyLength: this.history.length,
            history: this.history,
            error: this.error
        };
    }
}

module.exports = {
    AgentExecutionAdapter,
    VALID_STATES,
    ALLOWED_TRANSITIONS
};
