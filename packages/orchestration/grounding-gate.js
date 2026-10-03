/**
 * @file grounding-gate.js
 * @description بوابة التأصيل الإدراكي (C3 Grounding Gate)
 * WebForge Master Orchestration - Cognitive Verification Layer (Stage C3)
 * 
 * المبادئ الحاكمة:
 * Generated Output !== Verified Truth
 * Memory !== Evidence
 * Citation !== Verification
 * Tool / MCP Result !== Evidence
 * Abstention !== Falsehood
 * 
 * ليس بيئة تشغيل runtime وليس مولد أكواد
 */

const GROUNDING_VERDICTS = {
    GROUNDED: 'GROUNDED',
    GROUNDED_WITH_LIMITATIONS: 'GROUNDED_WITH_LIMITATIONS',
    INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
    CONFLICTED: 'CONFLICTED',
    STALE_EVIDENCE: 'STALE_EVIDENCE',
    UNVERIFIED: 'UNVERIFIED',
    ENVIRONMENT_LIMITATION: 'ENVIRONMENT_LIMITATION',
    REJECTED: 'REJECTED'
};

const GATE_DECISIONS = {
    PERMIT: 'PERMIT',
    QUALIFY: 'QUALIFY',
    ABSTAIN: 'ABSTAIN',
    BLOCK: 'BLOCK'
};

class GroundingGate {
    constructor(options = {}) {
        this.evidenceGraph = options.evidenceGraph || null;
        this.auditRecorder = options.auditRecorder || null;
    }

    /**
     * تقييم وتدقيق التأصيل لمجموعة ادعاءات أو مخرجات
     * @param {Array<Object>} verifiedClaims الادعاءات المفحوصة عبر C2
     * @param {Object} options خيارات التقييم والسياق
     */
    evaluateGrounding(verifiedClaims = [], options = {}) {
        if (!Array.isArray(verifiedClaims) || verifiedClaims.length === 0) {
            return {
                verdict: GROUNDING_VERDICTS.INSUFFICIENT_EVIDENCE,
                decision: GATE_DECISIONS.ABSTAIN,
                grounded: false,
                reason: 'لا توجد أي ادعاءات محققة أو أدلة داعمة مقدمة لبوابة التأصيل (Missing Evidence Base).',
                claimsSummary: { total: 0, grounded: 0, ungrounded: 0, conflicted: 0, stale: 0 },
                limitations: ['غياب تام للأدلة الداعمة']
            };
        }

        const safeClaims = verifiedClaims.filter(c => c && typeof c === 'object');
        if (safeClaims.length === 0) {
            return {
                verdict: GROUNDING_VERDICTS.INSUFFICIENT_EVIDENCE,
                decision: GATE_DECISIONS.ABSTAIN,
                grounded: false,
                reason: 'الادعاءات المقدمة مشوهة أو غير صالحة هيكلياً (Malformed Claims Input).',
                claimsSummary: { total: 0, grounded: 0, ungrounded: 0, conflicted: 0, stale: 0 },
                limitations: ['مدخلات غير صالحة']
            };
        }

        let groundedCount = 0;
        let conflictedCount = 0;
        let staleCount = 0;
        let insufficientCount = 0;
        let rejectedCount = 0;
        let envLimitCount = 0;
        const limitations = [];

        for (const claim of safeClaims) {
            const status = claim.status || (claim.verified ? 'VERIFIED' : 'UNVERIFIED');

            if (status === 'VERIFIED') {
                groundedCount++;
            } else if (status === 'CONFLICTED') {
                conflictedCount++;
                limitations.push(`الادعاء '${claim.claim_id || 'unspecified'}' يشهد نزاعاً وتعارضاً مباشراً بين الأدلة.`);
            } else if (status === 'INVALIDATED' || status === 'STALE_OR_INVALIDATED') {
                staleCount++;
                limitations.push(`أدلة الادعاء '${claim.claim_id || 'unspecified'}' متقادمة أو تحورت الشيفرة الخاصة بها.`);
            } else if (status === 'ENVIRONMENT_LIMITATION') {
                envLimitCount++;
                limitations.push(`تعذر التحقق من الادعاء '${claim.claim_id || 'unspecified'}' نظراً لقيود بيئة الاختبار.`);
            } else if (status === 'FAIL' || claim.threatDetected) {
                rejectedCount++;
                limitations.push(`تم رفض الادعاء '${claim.claim_id || 'unspecified'}' لاحتوائه على مؤشرات تزييف أو حقن أو تسميم أدلة.`);
            } else {
                insufficientCount++;
                limitations.push(`الادعاء '${claim.claim_id || 'unspecified'}' غير مدعوم بأدلة كافية (${status}).`);
            }
        }

        const total = verifiedClaims.length;
        const claimsSummary = {
            total,
            grounded: groundedCount,
            conflicted: conflictedCount,
            stale: staleCount,
            insufficient: insufficientCount,
            rejected: rejectedCount,
            environmentLimitation: envLimitCount
        };

        // 1. حالة الرفض الأمني التام (Security Hard Floor / Poisoning / Fail)
        if (rejectedCount > 0) {
            const result = {
                verdict: GROUNDING_VERDICTS.REJECTED,
                decision: GATE_DECISIONS.BLOCK,
                grounded: false,
                reason: 'تم حظر المخرجات قطعياً لاحتوائها على ادعاءات منتهكة للأمان أو محاولات تسميم أدلة.',
                claimsSummary,
                limitations
            };
            this._recordAudit(result, options);
            return result;
        }

        // 2. حالة النزاع في الأدلة (Conflicted Evidence)
        if (conflictedCount > 0) {
            const result = {
                verdict: GROUNDING_VERDICTS.CONFLICTED,
                decision: GATE_DECISIONS.ABSTAIN,
                grounded: false,
                reason: 'توقف واستنكاف إلزامي: توجد أدلة متناقضة حول الادعاءات المقدمة. لا يمكن تصنيع إجماع وهمي.',
                claimsSummary,
                limitations
            };
            this._recordAudit(result, options);
            return result;
        }

        // 3. حالة تقادم الأدلة وتحور الشيفرة
        if (staleCount > 0 && groundedCount === 0) {
            const result = {
                verdict: GROUNDING_VERDICTS.STALE_EVIDENCE,
                decision: GATE_DECISIONS.ABSTAIN,
                grounded: false,
                reason: 'توقف واستنكاف إلزامي: كافة الأدلة المقدمة متقادمة أو تحورت الشيفرة المستهدفة بعد اختبارها.',
                claimsSummary,
                limitations
            };
            this._recordAudit(result, options);
            return result;
        }

        // 4. حالة غياب الأدلة الكافية بالكامل
        if (groundedCount === 0) {
            const result = {
                verdict: envLimitCount > 0 ? GROUNDING_VERDICTS.ENVIRONMENT_LIMITATION : GROUNDING_VERDICTS.INSUFFICIENT_EVIDENCE,
                decision: GATE_DECISIONS.ABSTAIN,
                grounded: false,
                reason: envLimitCount > 0 
                    ? 'استنكاف إدراكي مبرر نظراً لقيود البيئة البرمجية وعدم توفر محرك تشغيل الاختبارات.'
                    : 'استنكاف إدراكي مبرر: الأدلة المتاحة غير كافية لإثبات الادعاءات. المبدأ: الاستنكاف لا يعني كذب الادعاء.',
                claimsSummary,
                limitations
            };
            this._recordAudit(result, options);
            return result;
        }

        // 5. حالة التأصيل الجزئي (Partial Grounding)
        if (groundedCount < total) {
            const result = {
                verdict: GROUNDING_VERDICTS.GROUNDED_WITH_LIMITATIONS,
                decision: GATE_DECISIONS.QUALIFY,
                grounded: true,
                isPartiallyGrounded: true,
                coverageRatio: Number((groundedCount / total).toFixed(2)),
                reason: `تأصيل جزئي مشروط: تم تأصيل ${groundedCount} من أصل ${total} ادعاءات. يجب إبراز القيود صراحة.`,
                claimsSummary,
                limitations
            };
            this._recordAudit(result, options);
            return result;
        }

        // 6. حالة التأصيل الكامل التام (Fully Grounded)
        const result = {
            verdict: GROUNDING_VERDICTS.GROUNDED,
            decision: GATE_DECISIONS.PERMIT,
            grounded: true,
            isPartiallyGrounded: false,
            coverageRatio: 1.0,
            reason: 'المخرجات مؤصلة بالكامل وموثقة بأدلة تجريبية قطعية صالحة زمنياً وغير متناقضة.',
            claimsSummary,
            limitations: []
        };
        this._recordAudit(result, options);
        return result;
    }

    _recordAudit(result, options = {}) {
        if (this.auditRecorder && typeof this.auditRecorder.recordAgentAction === 'function') {
            this.auditRecorder.recordAgentAction({
                action: 'GROUNDING_GATE_EVALUATION',
                verdict: result.verdict,
                decision: result.decision,
                grounded: result.grounded,
                reason: result.reason,
                task_id: options.taskId || 'TASK_GROUNDING_EVAL',
                intent: 'Evaluate cognitive grounding gate constraints',
                metadata: result.claimsSummary
            });
        }
    }
}

GroundingGate.GROUNDING_VERDICTS = GROUNDING_VERDICTS;
GroundingGate.GATE_DECISIONS = GATE_DECISIONS;

module.exports = GroundingGate;
