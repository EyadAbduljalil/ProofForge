/**
 * @file task-replanner.js
 * @description محرك تخطيط وإعادة تخطيط المهام المتكيف (Adaptive Task Planner & Replanning Engine)
 * يدير شجرة المهام، يحلل حالات الفشل، يمنع الحلقات التكرارية (Loop Protection)، ويقترح استراتيجيات إصلاح متوافقة مع الـ Stack
 */

const FAILURE_CLASSES = {
    IMPLEMENTATION_FAILURE: 'IMPLEMENTATION_FAILURE',
    TEST_FAILURE: 'TEST_FAILURE',
    SECURITY_FAILURE: 'SECURITY_FAILURE',
    PERFORMANCE_FAILURE: 'PERFORMANCE_FAILURE',
    ENVIRONMENT_FAILURE: 'ENVIRONMENT_FAILURE',
    DEPENDENCY_FAILURE: 'DEPENDENCY_FAILURE',
    CAPABILITY_MISSING: 'CAPABILITY_MISSING',
    REQUIREMENT_CONFLICT: 'REQUIREMENT_CONFLICT',
    TOOL_FAILURE: 'TOOL_FAILURE',
    UNKNOWN_FAILURE: 'UNKNOWN_FAILURE'
};

const REPLAN_DECISIONS = {
    RETRY: 'RETRY',
    REFINE: 'REFINE',
    CHANGE_STRATEGY: 'CHANGE_STRATEGY',
    SPLIT_INTO_SUBTASKS: 'SPLIT_INTO_SUBTASKS',
    ESCALATE_TO_SECURITY_GATE: 'ESCALATE_TO_SECURITY_GATE',
    ALTERNATIVE_VERIFICATION: 'ALTERNATIVE_VERIFICATION',
    ROLLBACK_AND_ESCALATE: 'ROLLBACK_AND_ESCALATE',
    REPLAN_BLOCKED: 'REPLAN_BLOCKED',
    ESCALATE: 'ESCALATE'
};

class TaskReplanner {
    constructor(options = {}) {
        this.maxAttempts = options.maxAttempts || 3;
        this.taskHistory = [];
        this.attemptSignatures = new Map(); // taskId -> array of failure signatures
    }

    /**
     * معالجة فشل مهمة وتحديد الاستراتيجية البديلة المناسبة مع منع الحلقات
     * @param {Object} task كائن المهمة
     * @param {Object} failureContext سياق وتفاصيل الفشل
     * @param {Object} capabilityModel نموذج القدرات (اختياري)
     */
    replanOnFailure(task = {}, failureContext = {}, capabilityModel = null) {
        task = task || {};
        failureContext = failureContext || {};
        const taskId = task.id || 'unnamed_task';
        const attemptCount = (task.attempts || 0) + 1;
        task.attempts = attemptCount;

        const failureType = this.classifyFailure(failureContext.error || failureContext.message || '', failureContext);
        const failureSignature = `${failureType}_${this._hashString(failureContext.error || failureContext.message || '')}`;

        // 1. فحص حماية الحلقات التكرارية (Replanning Loop Protection)
        const previousSignatures = this.attemptSignatures.get(taskId) || [];
        const isRepeatedFailure = previousSignatures.filter(sig => sig === failureSignature).length >= 2;
        previousSignatures.push(failureSignature);
        this.attemptSignatures.set(taskId, previousSignatures);

        let decision = REPLAN_DECISIONS.RETRY;
        let newStrategy = task.strategy || 'DEFAULT';
        let rootCauseHypothesis = 'فشل تشغيلي أو برمجي يحتاج لمعالجة متكيفة';
        let risk = 'LOW';

        if (isRepeatedFailure) {
            decision = REPLAN_DECISIONS.REPLAN_BLOCKED;
            rootCauseHypothesis = 'تكرار نفس نمط الفشل بنفس الاستراتيجية دون تقدم؛ تم حظر المحاولة لمنع حلقة لا نهائية.';
            risk = 'HIGH';
        } else if (attemptCount >= this.maxAttempts) {
            decision = REPLAN_DECISIONS.ROLLBACK_AND_ESCALATE;
            rootCauseHypothesis = 'استنفاد الحد الأقصى للمحاولات المسموح بها للمهمة.';
            risk = 'HIGH';
        } else {
            // اختيار الاستراتيجية المتكيفة حسب نوع الفشل
            switch (failureType) {
                case FAILURE_CLASSES.SECURITY_FAILURE:
                    decision = REPLAN_DECISIONS.ESCALATE_TO_SECURITY_GATE;
                    newStrategy = 'STRICT_AUTHORIZATION_FIX';
                    rootCauseHypothesis = 'انتهاك لقواعد الأمان أو الصلاحيات يتطلب معالجة أمنية فورية.';
                    risk = 'CRITICAL';
                    break;

                case FAILURE_CLASSES.REQUIREMENT_CONFLICT:
                    decision = REPLAN_DECISIONS.ESCALATE;
                    newStrategy = 'ARBITRATE_CONSTITUTION_RULE';
                    rootCauseHypothesis = 'تعارض في المتطلبات يستلزم تحكيم هرمية السلطة (AuthorityHierarchy).';
                    risk = 'HIGH';
                    break;

                case FAILURE_CLASSES.CAPABILITY_MISSING:
                case FAILURE_CLASSES.ENVIRONMENT_FAILURE:
                    decision = REPLAN_DECISIONS.ALTERNATIVE_VERIFICATION;
                    newStrategy = 'FALLBACK_STATIC_AUDIT';
                    rootCauseHypothesis = 'القدرة المطلوبة غير متوفرة أو هناك قيد بيئي؛ التحول للبديل الساكن/المحاكى.';
                    risk = 'LOW';
                    break;

                case FAILURE_CLASSES.CONCURRENCY_OR_RACE:
                case 'CONCURRENCY_OR_RACE': // للتوافق العكسي
                    decision = REPLAN_DECISIONS.CHANGE_STRATEGY;
                    newStrategy = 'ATOMIC_MUTEX_LOCK';
                    rootCauseHypothesis = 'تضارب في الوصول المتزامن يتطلب قفلاً ذرياً أو معالجة تسلسلية.';
                    risk = 'MEDIUM';
                    break;

                case FAILURE_CLASSES.PERFORMANCE_FAILURE:
                    decision = REPLAN_DECISIONS.CHANGE_STRATEGY;
                    newStrategy = 'DEBOUNCED_ASYNC_THROTTLE';
                    rootCauseHypothesis = 'تجاوز حدود الأداء أو ضغط الموارد؛ التحول للتنفيذ المخفف.';
                    risk = 'MEDIUM';
                    break;

                case FAILURE_CLASSES.DEPENDENCY_FAILURE:
                    decision = REPLAN_DECISIONS.REFINE;
                    newStrategy = 'PINNED_VERSION_FALLBACK';
                    rootCauseHypothesis = 'تعذر استدعاء أو توافق الاعتمادية الخارجية.';
                    risk = 'MEDIUM';
                    break;

                case FAILURE_CLASSES.TEST_FAILURE:
                    decision = REPLAN_DECISIONS.REFINE;
                    newStrategy = 'REGRESSION_DRIVEN_REPAIR';
                    rootCauseHypothesis = 'إخفاق في تأكيدات الاختبارات الآلية يتطلب ضبط الشروط الحدية.';
                    risk = 'MEDIUM';
                    break;

                case FAILURE_CLASSES.TOOL_FAILURE:
                    decision = REPLAN_DECISIONS.ALTERNATIVE_VERIFICATION;
                    newStrategy = 'INTERNAL_NORMALIZER_FALLBACK';
                    rootCauseHypothesis = 'فشل أداة الفحص الخارجية؛ الاعتماد على التحليل الداخلي الموحد.';
                    risk = 'LOW';
                    break;

                case FAILURE_CLASSES.IMPLEMENTATION_FAILURE:
                default:
                    decision = REPLAN_DECISIONS.REFINE;
                    newStrategy = 'STRICT_TYPE_COMPLIANCE';
                    rootCauseHypothesis = 'خطأ نحوي أو منطقي في كتابة الكود يتطلب تصحيحاً هيكلياً.';
                    risk = 'LOW';
                    break;
            }
        }

        // بناء مقترح الإصلاح الآمن (Repair Proposal)
        const repairProposal = {
            taskId,
            reason: rootCauseHypothesis,
            target: task.target || 'affected_code_component',
            proposed_change: newStrategy,
            risk,
            verification_plan: `verify_${taskId}_with_${newStrategy.toLowerCase()}`,
            rollback_plan: `rollback_to_${failureContext.checkpointId || 'initial_checkpoint'}`
        };

        const replanResult = {
            taskId,
            attempt: attemptCount,
            failureType,
            failureSignature,
            decision,
            newStrategy,
            rootCauseHypothesis,
            risk,
            repairProposal,
            rollbackPoint: failureContext.checkpointId || null,
            timestamp: new Date().toISOString()
        };

        this.taskHistory.push(replanResult);
        return replanResult;
    }

    classifyFailure(errorMessage = '', context = {}) {
        const msg = String(errorMessage).toLowerCase();
        
        if (context.category === 'SECURITY' || msg.includes('unauthorized') || msg.includes('forbidden') || msg.includes('idor') || msg.includes('injection') || msg.includes('permission')) {
            return FAILURE_CLASSES.SECURITY_FAILURE;
        }
        if (msg.includes('conflict') || msg.includes('contradiction') || msg.includes('rule conflict')) {
            return FAILURE_CLASSES.REQUIREMENT_CONFLICT;
        }
        if (msg.includes('missing capability') || msg.includes('not supported in stack') || msg.includes('not_applicable')) {
            return FAILURE_CLASSES.CAPABILITY_MISSING;
        }
        if (msg.includes('environment') || msg.includes('econnrefused') || msg.includes('enotfound') || msg.includes('missing binary')) {
            return FAILURE_CLASSES.ENVIRONMENT_FAILURE;
        }
        if (msg.includes('module not found') || msg.includes('cannot find package') || msg.includes('lockfile')) {
            return FAILURE_CLASSES.DEPENDENCY_FAILURE;
        }
        if (msg.includes('race') || msg.includes('deadlock') || msg.includes('lock') || msg.includes('concurrent')) {
            return 'CONCURRENCY_OR_RACE'; // يحافظ على التوافق مع الاختبارات
        }
        if (msg.includes('timeout') || msg.includes('performance') || msg.includes('latency') || msg.includes('thrashing')) {
            return FAILURE_CLASSES.PERFORMANCE_FAILURE;
        }
        if (msg.includes('assert') || msg.includes('test failed') || /\bexpect(?:ed|s)?\b/i.test(msg)) {
            return FAILURE_CLASSES.TEST_FAILURE;
        }
        if (msg.includes('syntax') || msg.includes('typeerror') || msg.includes('referenceerror') || msg.includes('undefined') || msg.includes('unexpected')) {
            return FAILURE_CLASSES.IMPLEMENTATION_FAILURE;
        }
        if (msg.includes('tool failed') || msg.includes('parser error') || msg.includes('sarif invalid')) {
            return FAILURE_CLASSES.TOOL_FAILURE;
        }

        return FAILURE_CLASSES.UNKNOWN_FAILURE;
    }

    _hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }

    getHistory() {
        return [...this.taskHistory];
    }
}

TaskReplanner.FAILURE_CLASSES = FAILURE_CLASSES;
TaskReplanner.REPLAN_DECISIONS = REPLAN_DECISIONS;
TaskReplanner.TaskReplanner = TaskReplanner;

module.exports = TaskReplanner;


