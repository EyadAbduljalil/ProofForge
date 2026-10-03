/**
 * @file accounting-invariants.js
 * @description WebForge V2 — Accounting Invariants, Double-Entry & Ledger Reconciliation
 * يدير التحقق الحتمي من موازنة القيد المزدوج، مطابقة سجلات الأستاذ، التحويل بين العملات،
 * وحوكمة الفترات المالية وحسابات الضرائب والفواتير.
 */

class DoubleEntryValidator {
    /**
     * التحقق الصارم من توازن القيد المزدوج: Total Debits == Total Credits
     */
    static validateJournalEntry(entry = {}) {
        const lines = Array.isArray(entry.lines) ? entry.lines : [];
        if (lines.length < 2) {
            return {
                valid: false,
                reason: 'قيد اليومية يجب أن يحتوي على سطرين على الأقل (طرف مدين وطرف دائن).',
                totalDebit: 0,
                totalCredit: 0,
                discrepancy: 0
            };
        }

        let totalDebit = 0;
        let totalCredit = 0;

        for (const line of lines) {
            const debit = parseFloat(line.debit || 0);
            const credit = parseFloat(line.credit || 0);

            if (isNaN(debit) || isNaN(credit) || debit < 0 || credit < 0) {
                return {
                    valid: false,
                    reason: 'قيم المدين والدائن يجب أن تكون أرقاماً موجبة صالحة.',
                    totalDebit,
                    totalCredit,
                    discrepancy: Math.abs(totalDebit - totalCredit)
                };
            }

            if (debit > 0 && credit > 0) {
                return {
                    valid: false,
                    reason: 'لا يمكن أن يحتوي سطر واحد على قيمة مدينة وقيمة دائنة معاً.',
                    totalDebit,
                    totalCredit,
                    discrepancy: 0
                };
            }

            totalDebit += debit;
            totalCredit += credit;
        }

        // التقريب لأقرب 4 خانات عشرية لتجنب أخطاء الفاصلة العائمة
        const roundedDebit = Math.round(totalDebit * 10000) / 10000;
        const roundedCredit = Math.round(totalCredit * 10000) / 10000;
        const discrepancy = Math.abs(roundedDebit - roundedCredit);

        if (roundedDebit === 0 && roundedCredit === 0) {
            return {
                valid: false,
                reason: 'قيد صفري غير مقبول في النظام المحاسبي.',
                totalDebit: roundedDebit,
                totalCredit: roundedCredit,
                discrepancy: 0
            };
        }

        const isBalanced = discrepancy < 0.0001;

        return {
            valid: isBalanced,
            reason: isBalanced ? 'القيد المحاسبي متوازن بنجاح (Total Debits = Total Credits).' : 'القيد غير متوازن، يوجد فارق بين المدين والدائن.',
            totalDebit: roundedDebit,
            totalCredit: roundedCredit,
            discrepancy
        };
    }
}

class LedgerReconciliationEngine {
    /**
     * مطابقة سلسلة الترحيل: المعاملة -> دفتر الأستاذ المساعد -> قيود اليومية -> الأستاذ العام
     */
    static reconcileLedger(sourceTransactions = [], generalLedgerEntries = []) {
        const glTransactionIds = new Set(generalLedgerEntries.map(e => e.transactionId || e.id));
        const sourceIds = new Set(sourceTransactions.map(t => t.id));

        const missingInGL = sourceTransactions.filter(t => !glTransactionIds.has(t.id));
        const orphanInGL = generalLedgerEntries.filter(e => !sourceIds.has(e.transactionId));

        const reconciled = missingInGL.length === 0 && orphanInGL.length === 0;

        return {
            reconciled,
            sourceCount: sourceTransactions.length,
            glCount: generalLedgerEntries.length,
            missingInGLCount: missingInGL.length,
            orphanInGLCount: orphanInGL.length,
            missingTransactions: missingInGL.map(t => t.id),
            orphanEntries: orphanInGL.map(e => e.id)
        };
    }
}

class MultiCurrencyValidator {
    /**
     * التحقق من سلامة التحويل بين العملات وفروقات الصرف
     */
    static validateConversion({ foreignAmount, exchangeRate, baseAmount, precision = 2 }) {
        if (!foreignAmount || !exchangeRate || exchangeRate <= 0) {
            return { valid: false, reason: 'سعر الصرف أو المبلغ الأجنبي غير صالح.' };
        }

        const expectedBase = foreignAmount * exchangeRate;
        const factor = Math.pow(10, precision);
        const roundedExpected = Math.round(expectedBase * factor) / factor;
        const roundedActual = Math.round(baseAmount * factor) / factor;

        const diff = Math.abs(roundedExpected - roundedActual);
        const valid = diff <= (1 / factor); // تسامح التقريب

        return {
            valid,
            expectedBase: roundedExpected,
            actualBase: roundedActual,
            diff,
            reason: valid ? 'التحويل بين العملات صحيح حسابياً.' : 'يوجد تباين حسابي في قيمة الصرف للعملة الأساسية.'
        };
    }
}

class FiscalPeriodLock {
    constructor(periods = []) {
        this.periods = new Map(periods.map(p => [p.id, p]));
    }

    canPostToPeriod(periodId) {
        const period = this.periods.get(periodId);
        if (!period) {
            return { allowed: false, reason: `الفترة المالية ${periodId} غير موجودة.` };
        }
        if (period.status === 'CLOSED' || period.status === 'LOCKED') {
            return {
                allowed: false,
                reason: `الفترة المالية ${periodId} مقفلة (${period.status})، يُحظر الترحيل إليها قطعياً.`
            };
        }
        return { allowed: true, reason: 'الفترة المالية مفتوحة وصالحة للترحيل.' };
    }
}

class TaxInvoicingValidator {
    /**
     * التحقق من حسابات الفاتورة والضرائب والخصومات
     */
    static validateInvoice(invoice = {}) {
        const items = Array.isArray(invoice.items) ? invoice.items : [];
        let calculatedSubtotal = 0;
        let calculatedTax = 0;

        for (const item of items) {
            const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
            const lineTax = lineTotal * ((item.taxRate || 0) / 100);
            calculatedSubtotal += lineTotal;
            calculatedTax += lineTax;
        }

        const discount = invoice.discount || 0;
        const expectedTotal = Math.round((calculatedSubtotal - discount + calculatedTax) * 100) / 100;
        const actualTotal = Math.round((invoice.totalAmount || 0) * 100) / 100;

        const valid = Math.abs(expectedTotal - actualTotal) < 0.01;

        return {
            valid,
            expectedTotal,
            actualTotal,
            subtotal: calculatedSubtotal,
            tax: calculatedTax,
            reason: valid ? 'حسابات الفاتورة والضريبة متطابقة 100%.' : 'تباين في إجمالي الفاتورة والضرائب المحتسبة.'
        };
    }
}

module.exports = {
    DoubleEntryValidator,
    LedgerReconciliationEngine,
    MultiCurrencyValidator,
    FiscalPeriodLock,
    TaxInvoicingValidator
};
