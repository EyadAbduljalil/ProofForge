/**
 * @file transaction-governance.js
 * @description WebForge V2 — Financial Transaction Governance, Atomicity, Idempotency & SoD
 * يدير ذرية المعاملات المالية، منع التكرار، فصل المهام المحاسبية (Maker-Checker)،
 * وحراسة الأرصدة السالبة وسجل التدقيق المالي المشفر.
 */

const crypto = require('crypto');

class FinancialAtomicitySimulator {
    /**
     * محاكاة تنفيذ معاملة مالية متعددة المراحل والتحقق من التراجع التام عند الفشل
     */
    static async executeAtomicPosting(transaction, stepsConfig = {}) {
        const state = {
            step1_created: false,
            step2_subledger: false,
            step3_gl_posted: false,
            step4_balance_updated: false,
            step5_audit_logged: false,
            rolledBack: false
        };

        try {
            // Step 1: Create transaction record
            if (stepsConfig.failAtStep === 1) throw new Error('فشل محاكاة في الخطوة 1: إنشاء المعاملة');
            state.step1_created = true;

            // Step 2: Subledger Entry
            if (stepsConfig.failAtStep === 2) throw new Error('فشل محاكاة في الخطوة 2: إنشاء قيد الأستاذ المساعد');
            state.step2_subledger = true;

            // Step 3: General Ledger Posting
            if (stepsConfig.failAtStep === 3) throw new Error('فشل محاكاة في الخطوة 3: الترحيل للأستاذ العام');
            state.step3_gl_posted = true;

            // Step 4: Balance Update
            if (stepsConfig.failAtStep === 4) throw new Error('فشل محاكاة في الخطوة 4: تحديث الرصيد');
            state.step4_balance_updated = true;

            // Step 5: Audit Log Event
            if (stepsConfig.failAtStep === 5) throw new Error('فشل محاكاة في الخطوة 5: تسجيل حدث التدقيق');
            state.step5_audit_logged = true;

            return {
                success: true,
                status: 'COMMITTED',
                state
            };
        } catch (err) {
            // Rollback mechanism
            state.rolledBack = true;
            state.step1_created = false;
            state.step2_subledger = false;
            state.step3_gl_posted = false;
            state.step4_balance_updated = false;
            state.step5_audit_logged = false;

            return {
                success: false,
                status: 'ROLLED_BACK',
                error: err.message,
                state
            };
        }
    }
}

class FinancialIdempotencyGuard {
    constructor() {
        this.processedKeys = new Map();
    }

    /**
     * فحص وتأمين مفتاح التطابق لمنع تكرار ترحيل القيود أو المدفوعات
     */
    processTransaction(idempotencyKey, transactionPayload) {
        if (!idempotencyKey) {
            return {
                allowed: false,
                reason: 'مفتاح التطابق (Idempotency Key) إلزامي للعمليات المالية لمنع التكرار.'
            };
        }

        if (this.processedKeys.has(idempotencyKey)) {
            const previous = this.processedKeys.get(idempotencyKey);
            return {
                allowed: false,
                replayed: true,
                reason: 'تم اكتشاف محاولة إعادة تنفيذ مكررة لنفس المعاملة المالية.',
                cachedResult: previous
            };
        }

        const result = {
            transactionId: `TXN-${Date.now()}`,
            processedAt: new Date().toISOString(),
            status: 'POSTED'
        };

        this.processedKeys.set(idempotencyKey, result);
        return {
            allowed: true,
            replayed: false,
            result
        };
    }
}

class SegregationOfDutiesGuard {
    /**
     * التحقق من فصل المهام (Maker-Checker / SoD) ومنع اعتماد المستخدم لقيوده الخاصة
     */
    static validateApproval(creatorId, approverId, requiredRole = 'FINANCIAL_CONTROLLER') {
        if (!creatorId || !approverId) {
            return {
                valid: false,
                reason: 'معرف المنشئ ومعرف المعتمد إلزاميان للتحقق من فصل المهام.'
            };
        }

        if (creatorId === approverId) {
            return {
                valid: false,
                violation: 'SELF_APPROVAL_PROHIBITED',
                reason: 'انتهاك صارم لقاعدة فصل المهام SoD: يحظر على منشئ القيد المالي اعتماده بنفسه.'
            };
        }

        return {
            valid: true,
            reason: 'تم التحقق من تطبيق مبدأ الصانع والمدقق (Maker-Checker) بنجاح.'
        };
    }
}

class NegativeBalanceGuard {
    /**
     * فحص وكشف شذوذ الأرصدة السالبة غير المصرح بها
     */
    static checkBalance(currentBalance, deductionAmount, allowOverdraft = false, overdraftLimit = 0) {
        const resultingBalance = currentBalance - deductionAmount;

        if (resultingBalance < 0 && !allowOverdraft) {
            return {
                allowed: false,
                resultingBalance,
                reason: 'رصيد غير كافٍ، ويُحظر السحب على المكشوف للحساب.'
            };
        }

        if (resultingBalance < -overdraftLimit && allowOverdraft) {
            return {
                allowed: false,
                resultingBalance,
                reason: `تجاوز الحد الأقصى المسموح به للسحب على المكشوف (${overdraftLimit}).`
            };
        }

        return {
            allowed: true,
            resultingBalance,
            reason: 'الرصيد كافٍ والعملية مصرح بها مالياً.'
        };
    }
}

class FinancialAuditTrail {
    constructor() {
        this.ledgerEvents = [];
    }

    appendEvent(eventType, details = {}) {
        const prevHash = this.ledgerEvents.length > 0 
            ? this.ledgerEvents[this.ledgerEvents.length - 1].hash 
            : 'FINANCIAL_GENESIS_HASH_00000000';

        const timestamp = new Date().toISOString();
        const payload = JSON.stringify({
            sequence: this.ledgerEvents.length,
            prevHash,
            eventType,
            details,
            timestamp
        });

        const hash = crypto.createHash('sha256').update(payload).digest('hex');
        const event = {
            sequence: this.ledgerEvents.length,
            prevHash,
            eventType,
            details,
            timestamp,
            hash
        };

        this.ledgerEvents.push(event);
        return event;
    }

    verifyTrailIntegrity() {
        for (let i = 0; i < this.ledgerEvents.length; i++) {
            const current = this.ledgerEvents[i];
            const expectedPrev = i === 0 ? 'FINANCIAL_GENESIS_HASH_00000000' : this.ledgerEvents[i - 1].hash;

            if (current.prevHash !== expectedPrev) {
                return { intact: false, tamperedIndex: i, reason: 'انقطاع في تسلسل هاش التدقيق المالي' };
            }

            const payload = JSON.stringify({
                sequence: current.sequence,
                prevHash: current.prevHash,
                eventType: current.eventType,
                details: current.details,
                timestamp: current.timestamp
            });
            const recomputed = crypto.createHash('sha256').update(payload).digest('hex');

            if (recomputed !== current.hash) {
                return { intact: false, tamperedIndex: i, reason: 'تعديل غير مصرح به في محتوى السجل المالي' };
            }
        }

        return { intact: true, totalEvents: this.ledgerEvents.length };
    }
}

module.exports = {
    FinancialAtomicitySimulator,
    FinancialIdempotencyGuard,
    SegregationOfDutiesGuard,
    NegativeBalanceGuard,
    FinancialAuditTrail
};
