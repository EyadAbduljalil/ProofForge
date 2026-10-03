/**
 * @file financial-statement-verifier.js
 * @description WebForge V2.4 — Financial Statement, Inventory Accounting & Bank Reconciliation Verifier
 * محرك مطابقة القوائم المالية (ميزان المراجعة، قائمة الدخل، الميزانية العمومية)
 * ومطابقة حركات المخزون مع الأثر المالي والتسوية البنكية التخليقية
 */

'use strict';

class FinancialStatementVerifier {
    constructor() {}

    /**
     * مطابقة ميزان المراجعة (Trial Balance Verification)
     * إجمالي المدين يجب أن يساوي تماماً إجمالي الدائن
     * @param {Array} accountsBalance
     */
    verifyTrialBalance(accountsBalance = []) {
        let totalDebit = 0;
        let totalCredit = 0;
        const anomalies = [];

        for (const acc of accountsBalance) {
            const deb = Number(acc.debit || 0);
            const cred = Number(acc.credit || 0);

            if (deb < 0 || cred < 0) {
                anomalies.push({
                    accountId: acc.id,
                    type: 'NEGATIVE_BALANCE_FORBIDDEN',
                    message: `الحساب (${acc.id}) يحتوي على رصيد سالب غير مصرح به.`
                });
            }

            totalDebit += deb;
            totalCredit += cred;
        }

        totalDebit = Number(totalDebit.toFixed(4));
        totalCredit = Number(totalCredit.toFixed(4));
        const diff = Number(Math.abs(totalDebit - totalCredit).toFixed(4));
        const isBalanced = diff === 0 && anomalies.length === 0;

        return {
            status: isBalanced ? 'VERIFIED' : 'TRIAL_BALANCE_UNBALANCED',
            gate: isBalanced ? 'PASS' : 'FAIL',
            isBalanced,
            totalDebit,
            totalCredit,
            difference: diff,
            anomalies
        };
    }

    /**
     * مطابقة حركة المخزون مع الأثر المحاسبي العام (Inventory Valuation & Movement Reconcile)
     * التأكد من أن التغير في تقييم المخزون المادي يطابق القيود المحاسبية
     * @param {Object} physicalInventory
     * @param {Object} ledgerInventoryAccount
     */
    verifyInventoryValuation(physicalInventory = {}, ledgerInventoryAccount = {}) {
        const physicalValuation = Number((physicalInventory.quantity * physicalInventory.unitCost).toFixed(4));
        const ledgerBalance = Number(Number(ledgerInventoryAccount.balance || 0).toFixed(4));

        const discrepancy = Number(Math.abs(physicalValuation - ledgerBalance).toFixed(4));
        const isReconciled = discrepancy <= (ledgerInventoryAccount.tolerance || 0.00);

        return {
            itemId: physicalInventory.itemId,
            physicalQuantity: physicalInventory.quantity,
            unitCost: physicalInventory.unitCost,
            physicalValuation,
            ledgerBalance,
            discrepancy,
            status: isReconciled ? 'VERIFIED' : 'VALUATION_MISMATCH',
            gate: isReconciled ? 'PASS' : 'FAIL',
            isReconciled
        };
    }

    /**
     * التسوية البنكية التخليقية (Synthetic Bank Reconciliation)
     * مطابقة كشف الحساب البنكي مع دفتر الأستاذ لحساب النقدية
     * @param {Array} bankStatementEntries
     * @param {Array} cashBookEntries
     */
    verifyBankReconciliation(bankStatementEntries = [], cashBookEntries = []) {
        const cashMap = new Map();
        const unmatchedBankItems = [];
        let matchedTotal = 0;

        for (const c of cashBookEntries) {
            cashMap.set(String(c.reference), c);
        }

        for (const b of bankStatementEntries) {
            const ref = String(b.reference);
            if (cashMap.has(ref)) {
                const cItem = cashMap.get(ref);
                if (Math.abs(Number(b.amount) - Number(cItem.amount)) <= 0.001) {
                    matchedTotal += Number(b.amount);
                    cashMap.delete(ref); // تم التوفيق
                } else {
                    unmatchedBankItems.push({ reference: ref, reason: 'AMOUNT_MISMATCH', bankAmount: b.amount, cashAmount: cItem.amount });
                }
            } else {
                unmatchedBankItems.push({ reference: ref, reason: 'MISSING_IN_CASH_BOOK', bankAmount: b.amount });
            }
        }

        const unmatchedCashItems = Array.from(cashMap.values());
        const isReconciled = unmatchedBankItems.length === 0 && unmatchedCashItems.length === 0;

        return {
            status: isReconciled ? 'RECONCILED' : 'DISCREPANCIES_DETECTED',
            gate: isReconciled ? 'PASS' : 'FAIL',
            isReconciled,
            matchedTotal: Number(matchedTotal.toFixed(4)),
            unmatchedBankCount: unmatchedBankItems.length,
            unmatchedCashCount: unmatchedCashItems.length,
            unmatchedBankItems,
            unmatchedCashItems
        };
    }
}

module.exports = {
    FinancialStatementVerifier
};
