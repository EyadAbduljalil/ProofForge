/**
 * @file crm-sales-verifier.js
 * @description WebForge V2.5 — CRM Customer Lifecycle, Sales Pipeline & Quote Verifier
 * محرك التحقق من دورات حياة العملاء، خطوط أنابيب المبيعات، عروض الأسعار، وحوكمة الذكاء الاصطناعي
 */

const CRM_LIFECYCLE_STATES = {
    LEAD: 'LEAD',
    QUALIFIED: 'QUALIFIED',
    OPPORTUNITY: 'OPPORTUNITY',
    CUSTOMER: 'CUSTOMER',
    LOST: 'LOST',
    DISQUALIFIED: 'DISQUALIFIED'
};

const ALLOWED_CRM_TRANSITIONS = {
    [CRM_LIFECYCLE_STATES.LEAD]: [CRM_LIFECYCLE_STATES.QUALIFIED, CRM_LIFECYCLE_STATES.DISQUALIFIED],
    [CRM_LIFECYCLE_STATES.QUALIFIED]: [CRM_LIFECYCLE_STATES.OPPORTUNITY, CRM_LIFECYCLE_STATES.DISQUALIFIED],
    [CRM_LIFECYCLE_STATES.OPPORTUNITY]: [CRM_LIFECYCLE_STATES.CUSTOMER, CRM_LIFECYCLE_STATES.LOST],
    [CRM_LIFECYCLE_STATES.CUSTOMER]: [],
    [CRM_LIFECYCLE_STATES.LOST]: [CRM_LIFECYCLE_STATES.QUALIFIED], // إعادة فتح الفرصة
    [CRM_LIFECYCLE_STATES.DISQUALIFIED]: [CRM_LIFECYCLE_STATES.LEAD]
};

const PIPELINE_STAGES = {
    DISCOVERY: 'DISCOVERY',
    PROPOSAL: 'PROPOSAL',
    NEGOTIATION: 'NEGOTIATION',
    CLOSED_WON: 'CLOSED_WON',
    CLOSED_LOST: 'CLOSED_LOST'
};

class CrmSalesVerifier {
    constructor() {
        this.registeredLeads = new Map(); // email/phone -> leadId
        this.acceptedQuotes = new Set(); // quoteId
    }

    /**
     * التحقق من دورة حياة العميل في نظام CRM
     */
    verifyCrmTransition(currentStage, nextStage, context = {}) {
        const findings = [];
        const allowed = ALLOWED_CRM_TRANSITIONS[currentStage];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_CRM_STAGE',
                severity: 'CRITICAL',
                stage: currentStage,
                message: `مرحلة العميل الحالية غير معروفة: ${currentStage}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextStage)) {
            findings.push({
                code: 'ILLEGAL_CRM_LIFECYCLE_TRANSITION',
                severity: 'CRITICAL',
                from: currentStage,
                to: nextStage,
                allowedTransitions: allowed,
                message: `انتقال محظور في دورة حياة العميل من ${currentStage} إلى ${nextStage}`
            });
        }

        // فحص وجود مالك مخصص للمسار (Lead/Opportunity Owner)
        if (!context.ownerId) {
            findings.push({
                code: 'MISSING_CRM_RECORD_OWNER',
                severity: 'HIGH',
                message: 'لا يجوز نقل مرحلة العميل دون تعيين مالك معتمد (Sales Rep / Account Owner)'
            });
        }

        return {
            valid: findings.length === 0,
            currentStage,
            nextStage,
            findings
        };
    }

    /**
     * التحقق من سلامة العميل المتوقع (Lead) ومنع التكرار
     */
    verifyLead(lead) {
        const findings = [];
        const { id, email, phone, source, ownerId } = lead;

        if (!id || !source) {
            findings.push({
                code: 'INCOMPLETE_LEAD_DATA',
                severity: 'HIGH',
                message: 'العميل المتوقع يفتقد إلى معرف أو مصدر استقطاب (Lead Source)'
            });
        }

        // كشف تكرار العملاء المتوقعين
        const deduplicationKey = (email || phone || '').toLowerCase().trim();
        if (deduplicationKey) {
            if (this.registeredLeads.has(deduplicationKey) && this.registeredLeads.get(deduplicationKey) !== id) {
                findings.push({
                    code: 'DUPLICATE_LEAD_DETECTED',
                    severity: 'HIGH',
                    deduplicationKey,
                    existingLeadId: this.registeredLeads.get(deduplicationKey),
                    newLeadId: id,
                    message: `تم اكتشاف عميل متوقع مكرر بنفس بيانات الاتصال: ${deduplicationKey}`
                });
            } else {
                this.registeredLeads.set(deduplicationKey, id);
            }
        }

        return {
            valid: findings.length === 0,
            leadId: id,
            findings
        };
    }

    /**
     * التحقق من فرص البيع (Sales Opportunity Verification)
     */
    verifyOpportunity(opportunity) {
        const findings = [];
        const { id, customerId, stage, expectedValue, probability, expectedCloseDate, isClosed } = opportunity;

        if (expectedValue < 0) {
            findings.push({
                code: 'NEGATIVE_OPPORTUNITY_VALUE',
                severity: 'CRITICAL',
                expectedValue,
                message: `قيمة الفرصة البيعية لا يمكن أن تكون سالبة: ${expectedValue}`
            });
        }

        if (probability !== undefined && (probability < 0 || probability > 100)) {
            findings.push({
                code: 'INVALID_OPPORTUNITY_PROBABILITY',
                severity: 'HIGH',
                probability,
                message: `نسبة احتمالية إغلاق الفرصة يجب أن تتراوح بين 0% و 100%: ${probability}%`
            });
        }

        // فحص تعديل الفرص المغلقة دون إذن إعادة فتح
        if (isClosed && opportunity.modificationAttempt && !opportunity.reopenApproved) {
            findings.push({
                code: 'MODIFICATION_OF_CLOSED_OPPORTUNITY_FORBIDDEN',
                severity: 'CRITICAL',
                opportunityId: id,
                stage,
                message: 'محاولة تعديل فرصة بيعية مغلقة نهائياً (Closed-Won / Closed-Lost) دون ترخيص معتمد'
            });
        }

        return {
            valid: findings.length === 0,
            opportunityId: id,
            findings
        };
    }

    /**
     * التحقق من عروض الأسعار (Quote Verification)
     */
    verifyQuote(quote, customerContext = {}) {
        const findings = [];
        const { id: quoteId, items = [], discountAmount = 0, taxAmount = 0, grandTotal, expiryDate, status } = quote;

        // 1. فحص تاريخ انتهاء صلاحية عرض السعر (Expired Quote Boundary)
        if (expiryDate && new Date(expiryDate) < new Date()) {
            findings.push({
                code: 'EXPIRED_QUOTE_ACCEPTANCE_FORBIDDEN',
                severity: 'CRITICAL',
                quoteId,
                expiryDate,
                message: `عرض السعر منتهي الصلاحية بتاريخ ${expiryDate} ولا يمكن اعتماده أو قبوله`
            });
        }

        // 2. منع القبول المكرر لنفس العرض
        if (this.acceptedQuotes.has(quoteId)) {
            findings.push({
                code: 'DUPLICATE_QUOTE_ACCEPTANCE',
                severity: 'CRITICAL',
                quoteId,
                message: `تم قبول عرض السعر مسبقاً ولا يجوز إعادة قبوله لإنشاء طلبات مبيعات مكررة: ${quoteId}`
            });
        }

        // 3. التحقق من مطابقة الحسابات الرياضية لعرض السعر
        let computedSubtotal = 0;
        for (const item of items) {
            if (item.unitPrice <= 0 || item.quantity <= 0) {
                findings.push({
                    code: 'INVALID_QUOTE_ITEM',
                    severity: 'HIGH',
                    sku: item.sku,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    message: `بند غير قانوني في عرض السعر: ${item.sku}`
                });
            }
            computedSubtotal += (item.unitPrice || 0) * (item.quantity || 0);
        }

        const expectedTotal = Math.max(0, computedSubtotal - discountAmount + taxAmount);
        if (Math.abs(expectedTotal - grandTotal) > 0.01) {
            findings.push({
                code: 'QUOTE_TOTAL_CALCULATION_MISMATCH',
                severity: 'HIGH',
                expectedTotal,
                claimedTotal: grandTotal,
                message: `تضارب في حساب إجمالي عرض السعر: المتوقع ${expectedTotal} والمسجل ${grandTotal}`
            });
        }

        return {
            valid: findings.length === 0,
            expectedTotal,
            findings
        };
    }

    /**
     * التحقق من تطابق تحويل عرض السعر إلى أمر بيع (Quote -> Sales Order Consistency)
     */
    verifyQuoteToSalesOrder(quote, salesOrder) {
        const findings = [];

        if (quote.id !== salesOrder.sourceQuoteId) {
            findings.push({
                code: 'QUOTE_ORDER_LINK_MISMATCH',
                severity: 'CRITICAL',
                quoteId: quote.id,
                sourceQuoteId: salesOrder.sourceQuoteId,
                message: 'أمر البيع يشير إلى معرف عرض سعر غير مطابق'
            });
        }

        if (Math.abs(quote.grandTotal - salesOrder.grandTotal) > 0.01) {
            findings.push({
                code: 'QUOTE_ORDER_TOTAL_MISMATCH',
                severity: 'CRITICAL',
                quoteTotal: quote.grandTotal,
                orderTotal: salesOrder.grandTotal,
                message: `عدم تطابق في إجمالي القيمة بين عرض السعر المعتمد (${quote.grandTotal}) وأمر البيع المُنشأ (${salesOrder.grandTotal})`
            });
        }

        return {
            valid: findings.length === 0,
            findings
        };
    }

    /**
     * حوكمة أعمال الذكاء الاصطناعي في بيئة المبيعات (AI-Assisted Business Workflow Verification)
     * Invariant: AI Output -> Validation -> Human Approval (HITL) -> Action
     */
    verifyAiBusinessAction(aiProposal, policy = {}) {
        const findings = [];
        const { actionType, proposedDiscountPercent = 0, proposedValue = 0, hasHumanApproval, approverRole } = aiProposal;
        const { maxAutonomousDiscount = 10, highValueThreshold = 10000 } = policy;

        // تدقيق الخصومات التي يقترحها الذكاء الاصطناعي
        if (proposedDiscountPercent > maxAutonomousDiscount && !hasHumanApproval) {
            findings.push({
                code: 'AI_DISCOUNT_EXCEEDS_AUTONOMOUS_LIMIT',
                severity: 'CRITICAL',
                proposedDiscountPercent,
                maxAutonomousDiscount,
                message: `اقتراح الذكاء الاصطناعي لخصم بنسبة (${proposedDiscountPercent}%) يتجاوز الحد الذاتي المسموح به (${maxAutonomousDiscount}%) ويتطلب موافقة بشرية صريحة (HITL)`
            });
        }

        // تدقيق الصفقات عالية القيمة
        if (proposedValue >= highValueThreshold && !hasHumanApproval) {
            findings.push({
                code: 'AI_HIGH_VALUE_ACTION_MISSING_HITL',
                severity: 'CRITICAL',
                proposedValue,
                highValueThreshold,
                message: `محاولة اعتماد إجراء تجاري للذكاء الاصطناعي بقيمة عالية (${proposedValue}) بدون توقيع وموافقة بشرية معتمدة`
            });
        }

        return {
            approved: findings.length === 0,
            requiresHumanApproval: proposedDiscountPercent > maxAutonomousDiscount || proposedValue >= highValueThreshold,
            findings
        };
    }
}

module.exports = {
    CRM_LIFECYCLE_STATES,
    PIPELINE_STAGES,
    CrmSalesVerifier
};
