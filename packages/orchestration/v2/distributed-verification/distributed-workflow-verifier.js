/**
 * @file distributed-workflow-verifier.js
 * @description WebForge V2.2 — Distributed Sagas, Workflows & External Integration Verifier
 * محرك التحقق من سلاسل التوزيع (Sagas)، الإجراءات التعويضية، الاتساق النهائي،
 * وتدقيق اعتماديات الخدمات الخارجية والمهل وحالات الانقطاع دون لمس الأنظمة الحية
 */

'use strict';

class DistributedWorkflowVerifier {
    constructor() {
        this.workflows = new Map();
        this.externalDependencies = new Map();
    }

    /**
     * تسجيل سير عمل موزع (Saga / Distributed Workflow)
     * @param {Object} def
     */
    registerWorkflow(def) {
        if (!def || !def.id || !Array.isArray(def.steps)) {
            throw new Error('سير العمل الموزع يتطلب معرفاً ومصفوفة خطوات.');
        }

        const wf = {
            id: String(def.id),
            name: def.name || def.id,
            consistencyModel: def.consistencyModel || 'SAGA_COMPENSATION', // SAGA_COMPENSATION, EVENTUAL_CONSISTENCY, TWO_PHASE_COMMIT
            steps: def.steps.map(s => ({
                service: s.service,
                action: s.action,
                compensationAction: s.compensationAction || null,
                timeoutMs: Number(s.timeoutMs) || 5000,
                retryPolicy: s.retryPolicy || { maxRetries: 3, backoff: 'EXPONENTIAL' }
            }))
        };

        this.workflows.set(wf.id, wf);
        return wf;
    }

    /**
     * تدقيق وتدقيق سلوك سير العمل الموزع عند حدوث إخفاق في إحدى المراحل
     * @param {string} workflowId
     * @param {Object} executionScenario
     */
    verifySagaExecution(workflowId, executionScenario = {}) {
        const wf = this.workflows.get(workflowId);
        if (!wf) {
            return { workflowId, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        const { failAtStep = null } = executionScenario;
        const executedSteps = [];
        let failed = false;

        for (let i = 0; i < wf.steps.length; i++) {
            const step = wf.steps[i];
            if (failAtStep === i + 1) {
                failed = true;
                break;
            }
            executedSteps.push(step);
        }

        if (failed) {
            // التحقق من أن كافة الخطوات المنفذة تمتلك إجراءً تعويضياً معلوماً
            const uncompensatedSteps = executedSteps.filter(s => !s.compensationAction);
            const canCompensateCleanly = uncompensatedSteps.length === 0;

            return {
                workflowId: wf.id,
                status: canCompensateCleanly ? 'VERIFIED' : 'UNCOMPENSATED_DISTRIBUTED_FAILURE',
                gate: canCompensateCleanly ? 'PASS' : 'FAIL',
                isSafe: canCompensateCleanly,
                failAtStep,
                executedCount: executedSteps.length,
                uncompensatedCount: uncompensatedSteps.length,
                reason: canCompensateCleanly
                    ? 'كافة الخطوات المنفذة مجهزة بإجراءات تعويضية متسقة (Compensating Actions).'
                    : `توجد خطوات منتهية لا تمتلك إجراءً تعويضياً: ${uncompensatedSteps.map(s => s.action).join(', ')}`
            };
        }

        return {
            workflowId: wf.id,
            status: 'VERIFIED',
            gate: 'PASS',
            isSafe: true,
            completedSuccessfully: true
        };
    }

    /**
     * تسجيل عقد اعتمادية خارجية (External Integration Dependency)
     * @param {Object} depDef
     */
    registerExternalDependency(depDef) {
        if (!depDef || !depDef.id || !depDef.name) {
            throw new Error('الاعتمادية الخارجية تتطلب معرفاً واسماً.');
        }

        const dep = {
            id: String(depDef.id),
            name: String(depDef.name),
            timeoutMs: Number(depDef.timeoutMs) || 3000,
            hasFallback: Boolean(depDef.hasFallback),
            fallbackStrategy: depDef.fallbackStrategy || 'CACHED_OR_DEFAULT',
            isCritical: Boolean(depDef.isCritical)
        };

        this.externalDependencies.set(dep.id, dep);
        return dep;
    }

    /**
     * فحص سلوك النظام عند انهيار أو تأخر الخدمة الخارجية (Synthetic Outage / Timeout Verification)
     * @param {string} depId
     * @param {Object} simulatedResponse
     */
    verifyExternalResilience(depId, simulatedResponse = {}) {
        const dep = this.externalDependencies.get(depId);
        if (!dep) {
            return { depId, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        const { isTimeout = false, isServiceDown = false, returnedFallback = false } = simulatedResponse;

        if (isTimeout || isServiceDown) {
            if (dep.isCritical && !dep.hasFallback) {
                return {
                    depId: dep.id,
                    status: 'RESILIENCE_VIOLATION',
                    gate: 'FAIL',
                    isResilient: false,
                    severity: 'CRITICAL',
                    reason: `الخدمة الخارجية (${dep.name}) خدمة حرجة تفتقر إلى آلية بديلة (Fallback) مما يعرض النظام للتعطل الكامل.`
                };
            }

            const handledSafely = dep.hasFallback && returnedFallback;
            return {
                depId: dep.id,
                status: handledSafely ? 'VERIFIED' : 'FALLBACK_FAILED',
                gate: handledSafely ? 'PASS' : 'FAIL',
                isResilient: handledSafely,
                reason: handledSafely
                    ? 'تم اعتراض انقطاع الخدمة الخارجية والتحول بسلاسة إلى الآلية البديلة (Graceful Degradation).'
                    : 'فشل تفعيل الآلية البديلة عند انقطاع الخدمة.'
            };
        }

        return {
            depId: dep.id,
            status: 'VERIFIED',
            gate: 'PASS',
            isResilient: true
        };
    }
}

module.exports = {
    DistributedWorkflowVerifier
};
