/**
 * @file ai-financial-governor.js
 * @description WebForge V2.4 — AI-Financial Workflow Governor
 * محرك حوكمة تفاعل الذكاء الاصطناعي مع العمليات المالية الحساسة
 * يفرض مسار (Model -> Validation -> Authorization -> HITL -> Action)
 * ويمنع تحويل مخرجات النماذج إلى حالات محاسبية معتمدة بصورة آلية غير منضبطة
 */

'use strict';

class AiFinancialGovernor {
    constructor() {}

    /**
     * تدقيق قرار مالي صادر عن نموذج ذكاء اصطناعي (مثل قراءة فاتورة أو اقتراح سداد)
     * @param {Object} proposal
     */
    verifyAiFinancialProposal(proposal = {}) {
        const {
            modelOutput,
            extractedTotal,
            lineItems = [],
            actionType = 'INVOICE_POSTING',
            humanApproval = null
        } = proposal;

        const violations = [];

        // 1. تدقيق رياضي صارم لحسابات النموذج
        if (Array.isArray(lineItems) && lineItems.length > 0) {
            const calculatedTotal = lineItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0);
            const diff = Math.abs(calculatedTotal - Number(extractedTotal));

            if (diff > 0.01) {
                violations.push({
                    type: 'AI_CALCULATION_DISCREPANCY',
                    severity: 'CRITICAL',
                    extractedTotal,
                    calculatedTotal,
                    difference: diff,
                    message: `تضارب في حسابات النموذج: الإجمالي المستخرج (${extractedTotal}) لا يطابق مجموع البنود (${calculatedTotal}).`
                });
            }
        }

        // 2. فرض الموافقة البشرية (HITL) للعمليات المالية المؤثرة
        const highImpactActions = ['INVOICE_POSTING', 'PAYMENT_DISBURSEMENT', 'LEDGER_ADJUSTMENT'];
        if (highImpactActions.includes(actionType)) {
            if (!humanApproval || !humanApproval.isApproved) {
                violations.push({
                    type: 'HUMAN_APPROVAL_MANDATORY_FOR_FINANCIAL_ACTION',
                    severity: 'CRITICAL',
                    actionType,
                    message: `العملية المالية (${actionType}) تتطلب اعتماداً ومراجعة بشرية صريحة قبل التأثير على الدفاتر.`
                });
            }
        }

        const isCompliant = violations.length === 0;
        return {
            status: isCompliant ? 'VERIFIED' : 'GOVERNANCE_BLOCKED',
            gate: isCompliant ? 'PASS' : 'FAIL',
            isCompliant,
            violationsCount: violations.length,
            violations
        };
    }
}

module.exports = {
    AiFinancialGovernor
};
