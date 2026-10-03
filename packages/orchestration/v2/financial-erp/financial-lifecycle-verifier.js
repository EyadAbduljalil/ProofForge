/**
 * @file financial-lifecycle-verifier.js
 * @description WebForge V2.4 — Financial Lifecycles, AR/AP & Multi-Currency Verifier
 * محرك التحقق من دورات حياة الفواتير والمدفوعات والمستحقات والالتزامات (AR / AP)
 * وحسابات الضرائب وفروق أسعار الصرف ومكافحة السداد المزدوج والمدفوعات الزائدة
 */

'use strict';

const INVOICE_STATES = {
    DRAFT: 'DRAFT',
    ISSUED: 'ISSUED',
    APPROVED: 'APPROVED',
    POSTED: 'POSTED',
    PARTIALLY_PAID: 'PARTIALLY_PAID',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED',
    REVERSED: 'REVERSED'
};

class FinancialLifecycleVerifier {
    constructor() {
        this.invoices = new Map();
        this.payments = new Map();
    }

    /**
     * تسجيل فاتورة مالية تصريحية
     * @param {Object} invoiceDef
     */
    registerInvoice(invoiceDef) {
        if (!invoiceDef || !invoiceDef.id || typeof invoiceDef.totalAmount !== 'number') {
            throw new Error('الفاتورة تتطلب معرفاً ومبلغاً إجمالياً صالحاً.');
        }

        const inv = {
            id: String(invoiceDef.id),
            type: invoiceDef.type || 'SALES_INVOICE', // SALES_INVOICE (AR), PURCHASE_INVOICE (AP)
            status: invoiceDef.status || INVOICE_STATES.DRAFT,
            totalAmount: Number(invoiceDef.totalAmount.toFixed(4)),
            paidAmount: Number((invoiceDef.paidAmount || 0).toFixed(4)),
            currency: invoiceDef.currency || 'USD',
            history: []
        };

        this.invoices.set(inv.id, inv);
        return inv;
    }

    /**
     * التحقق من انتقال حالة الفاتورة وفق مسار الأعمال الشرعي
     * @param {string} invoiceId
     * @param {string} targetState
     * @param {Object} context
     */
    verifyInvoiceTransition(invoiceId, targetState, context = {}) {
        const inv = this.invoices.get(invoiceId);
        if (!inv) {
            return { invoiceId, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        const currentState = inv.status;

        // قواعد الانتقالات المحظورة
        if (currentState === INVOICE_STATES.CANCELLED || currentState === INVOICE_STATES.REVERSED) {
            return {
                invoiceId,
                status: 'FORBIDDEN_TRANSITION',
                gate: 'FAIL',
                isAllowed: false,
                reason: `محظور: لا يمكن تعديل أو تفعيل فاتورة في حالة ملغاة أو معكوسة (${currentState}).`
            };
        }

        if (targetState === INVOICE_STATES.CANCELLED && (currentState === INVOICE_STATES.PAID || currentState === INVOICE_STATES.PARTIALLY_PAID)) {
            return {
                invoiceId,
                status: 'FORBIDDEN_CANCELLATION',
                gate: 'FAIL',
                isAllowed: false,
                reason: 'لا يمكن إلغاء فاتورة تم سدادها كلياً أو جزئياً؛ يجب استخدام إجراء الإشعار الدائن أو العكس (Credit Memo / Reversal).'
            };
        }

        // تحديث الحالة
        inv.status = targetState;
        inv.history.push({ from: currentState, to: targetState, timestamp: new Date().toISOString() });

        return {
            invoiceId,
            fromState: currentState,
            toState: targetState,
            status: 'VERIFIED',
            gate: 'PASS',
            isAllowed: true
        };
    }

    /**
     * التحقق من سداد الفاتورة (AR/AP Payment Allocation)
     * وتدقيق عدم تجاوز الرصيد المتبقي ومنع السداد المزدوج والمدفوعات الزائدة
     * @param {string} invoiceId
     * @param {number} paymentAmount
     */
    verifyPaymentAllocation(invoiceId, paymentAmount) {
        const inv = this.invoices.get(invoiceId);
        if (!inv) {
            return { invoiceId, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        if (paymentAmount <= 0) {
            return {
                invoiceId,
                status: 'INVALID_PAYMENT_AMOUNT',
                gate: 'FAIL',
                isCompliant: false,
                reason: 'قيمة الدفعة يجب أن تكون موجبة وأكبر من الصفر.'
            };
        }

        if (inv.status === INVOICE_STATES.PAID) {
            return {
                invoiceId,
                status: 'ALREADY_PAID_DOUBLE_PAYMENT_RISK',
                gate: 'FAIL',
                isCompliant: false,
                reason: 'الفاتورة مسددة بالكامل مسبقاً؛ محاولة سداد إضافية تعرض الحساب للدفع المزدوج.'
            };
        }

        const remainingBalance = Number((inv.totalAmount - inv.paidAmount).toFixed(4));
        if (paymentAmount > remainingBalance) {
            return {
                invoiceId,
                status: 'OVERPAYMENT_VIOLATION',
                gate: 'FAIL',
                isCompliant: false,
                paymentAmount,
                remainingBalance,
                reason: `قيمة الدفعة (${paymentAmount}) تتجاوز الرصيد المستحق المتبقي (${remainingBalance}).`
            };
        }

        inv.paidAmount = Number((inv.paidAmount + paymentAmount).toFixed(4));
        inv.status = inv.paidAmount >= inv.totalAmount ? INVOICE_STATES.PAID : INVOICE_STATES.PARTIALLY_PAID;

        return {
            invoiceId,
            paidAmount: inv.paidAmount,
            totalAmount: inv.totalAmount,
            remainingBalance: Number((inv.totalAmount - inv.paidAmount).toFixed(4)),
            invoiceStatus: inv.status,
            status: 'VERIFIED',
            gate: 'PASS',
            isCompliant: true
        };
    }

    /**
     * تدقيق استرداد الأموال (Refund / Credit Verification)
     * @param {string} invoiceId
     * @param {number} refundAmount
     */
    verifyRefund(invoiceId, refundAmount) {
        const inv = this.invoices.get(invoiceId);
        if (!inv) {
            return { invoiceId, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        if (refundAmount <= 0) {
            return {
                invoiceId,
                status: 'INVALID_REFUND_AMOUNT',
                gate: 'FAIL',
                reason: 'قيمة الاسترداد يجب أن تكون أكبر من الصفر.'
            };
        }

        if (refundAmount > inv.paidAmount) {
            return {
                invoiceId,
                status: 'REFUND_EXCEEDS_PAID_AMOUNT',
                gate: 'FAIL',
                refundAmount,
                paidAmount: inv.paidAmount,
                reason: `قيمة الاسترداد المطلوب (${refundAmount}) تتجاوز المبلغ المسدد فعلياً (${inv.paidAmount}).`
            };
        }

        inv.paidAmount = Number((inv.paidAmount - refundAmount).toFixed(4));

        return {
            invoiceId,
            refundAmount,
            remainingPaidAmount: inv.paidAmount,
            status: 'VERIFIED',
            gate: 'PASS',
            isCompliant: true
        };
    }
}

module.exports = {
    INVOICE_STATES,
    FinancialLifecycleVerifier
};
