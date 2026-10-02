/**
 * @file task-replanner.js
 * @description محرك تخطيط وإعادة تخطيط المهام المتكيف (Adaptive Task Planner & Replanning Engine)
 * يدير شجرة المهام، يحلل حالات الفشل، ويعيد التخطيط بتغيير الاستراتيجية، التقسيم، أو التراجع الآمن
 */

class TaskReplanner {
    constructor(options = {}) {
        this.maxAttempts = options.maxAttempts || 3;
        this.taskHistory = [];
    }

    /**
     * معالجة فشل مهمة وتحديد الاستراتيجية البديلة المناسبة
     */
    replanOnFailure(task, failureContext = {}) {
        const attemptCount = (task.attempts || 0) + 1;
        task.attempts = attemptCount;

        const failureType = this._classifyFailure(failureContext.error || failureContext.message || '');
        
        let decision = 'RETRY';
        let newStrategy = task.strategy || 'DEFAULT';

        if (attemptCount >= this.maxAttempts) {
            decision = 'ROLLBACK_AND_ESCALATE';
        } else if (failureType === 'SYNTAX_OR_TYPE_ERROR') {
            decision = 'REFINE';
            newStrategy = 'STRICT_TYPE_COMPLIANCE';
        } else if (failureType === 'CONCURRENCY_OR_RACE') {
            decision = 'CHANGE_STRATEGY';
            newStrategy = 'ATOMIC_MUTEX_LOCK';
        } else if (failureType === 'TIMEOUT_OR_NETWORK') {
            decision = 'SPLIT_INTO_SUBTASKS';
            newStrategy = 'BATCHED_EXECUTION';
        } else if (failureType === 'PERMISSION_OR_AUTH') {
            decision = 'ESCALATE_TO_SECURITY_GATE';
        }

        const replanResult = {
            taskId: task.id,
            attempt: attemptCount,
            failureType,
            decision,
            newStrategy,
            rollbackPoint: failureContext.checkpointId || null,
            timestamp: new Date().toISOString()
        };

        this.taskHistory.push(replanResult);
        return replanResult;
    }

    _classifyFailure(errorMessage) {
        const msg = errorMessage.toLowerCase();
        if (msg.includes('syntax') || msg.includes('typeerror') || msg.includes('undefined')) return 'SYNTAX_OR_TYPE_ERROR';
        if (msg.includes('race') || msg.includes('deadlock') || msg.includes('lock')) return 'CONCURRENCY_OR_RACE';
        if (msg.includes('timeout') || msg.includes('econnrefused') || msg.includes('network')) return 'TIMEOUT_OR_NETWORK';
        if (msg.includes('permission') || msg.includes('unauthorized') || msg.includes('forbidden') || msg.includes('idor')) return 'PERMISSION_OR_AUTH';
        return 'GENERIC_RUNTIME_ERROR';
    }
}

module.exports = TaskReplanner;
