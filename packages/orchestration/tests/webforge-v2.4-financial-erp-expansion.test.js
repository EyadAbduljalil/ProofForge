/**
 * @file webforge-v2.4-financial-erp-expansion.test.js
 * @description WebForge V2.4 — Financial & ERP Verification Expansion Test Suite
 * حزمة اختبارات شاملة تغطي دورات حياة الفواتير، مطابقة القوائم، والمخزون، وحوكمة الذكاء الاصطناعي المالي
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const v2 = require('../v2/index.js');
const {
    INVOICE_STATES,
    FinancialLifecycleVerifier,
    FinancialStatementVerifier,
    AiFinancialGovernor
} = v2.financialErp;

describe('WebForge V2.4 — Financial & ERP Verification Expansion Suite', () => {

    // 1. Invoice & Payment Lifecycle & AR/AP Allocation
    describe('1. Invoice Lifecycle, AR/AP Allocation & Anti-Overpayment', () => {
        it('should verify compliant invoice transitions and reject illegal cancellation after payment', () => {
            const verifier = new FinancialLifecycleVerifier();
            verifier.registerInvoice({
                id: 'INV-2026-001',
                totalAmount: 1000.00,
                status: INVOICE_STATES.ISSUED
            });

            // انتقال شرعي للاعتماد
            const appRes = verifier.verifyInvoiceTransition('INV-2026-001', INVOICE_STATES.APPROVED);
            assert.equal(appRes.gate, 'PASS');
            assert.equal(appRes.isAllowed, true);

            // سداد جزئي
            const payRes = verifier.verifyPaymentAllocation('INV-2026-001', 500.00);
            assert.equal(payRes.gate, 'PASS');
            assert.equal(payRes.invoiceStatus, INVOICE_STATES.PARTIALLY_PAID);

            // محاولة إلغاء غير قانونية بعد السداد الجزئي
            const cancelRes = verifier.verifyInvoiceTransition('INV-2026-001', INVOICE_STATES.CANCELLED);
            assert.equal(cancelRes.gate, 'FAIL');
            assert.equal(cancelRes.status, 'FORBIDDEN_CANCELLATION');
        });

        it('should detect overpayment and enforce refund boundaries', () => {
            const verifier = new FinancialLifecycleVerifier();
            verifier.registerInvoice({
                id: 'INV-2026-002',
                totalAmount: 200.00,
                paidAmount: 150.00,
                status: INVOICE_STATES.PARTIALLY_PAID
            });

            // محاولة سداد بمبلغ يتجاوز الرصيد المتبقي (Overpayment)
            const overpayRes = verifier.verifyPaymentAllocation('INV-2026-002', 100.00); // المتبقي 50 فقط
            assert.equal(overpayRes.gate, 'FAIL');
            assert.equal(overpayRes.status, 'OVERPAYMENT_VIOLATION');

            // محاولة استرداد مبلغ أكبر من المسدد فعلياً
            const overRefundRes = verifier.verifyRefund('INV-2026-002', 200.00); // المسدد 150 فقط
            assert.equal(overRefundRes.gate, 'FAIL');
            assert.equal(overRefundRes.status, 'REFUND_EXCEEDS_PAID_AMOUNT');
        });
    });

    // 2. Financial Statements & Trial Balance Reconcile
    describe('2. Financial Statements & Trial Balance Reconcile', () => {
        it('should verify balanced trial balances and detect negative balance anomalies', () => {
            const verifier = new FinancialStatementVerifier();
            const accounts = [
                { id: '1010-CASH', debit: 5000.00, credit: 0.00 },
                { id: '2010-ACCOUNTS-PAYABLE', debit: 0.00, credit: 3000.00 },
                { id: '3010-RETAINED-EARNINGS', debit: 0.00, credit: 2000.00 }
            ];

            const balRes = verifier.verifyTrialBalance(accounts);
            assert.equal(balRes.gate, 'PASS');
            assert.equal(balRes.isBalanced, true);

            // ميزان غير متوازن
            const badAccounts = [
                { id: '1010-CASH', debit: 5000.00, credit: 0.00 },
                { id: '2010-AP', debit: 0.00, credit: 4000.00 } // فارق 1000
            ];
            const badRes = verifier.verifyTrialBalance(badAccounts);
            assert.equal(badRes.gate, 'FAIL');
            assert.equal(badRes.difference, 1000.00);
        });

        it('should reconcile physical inventory valuation with general ledger accounts', () => {
            const verifier = new FinancialStatementVerifier();
            const physical = { itemId: 'ITEM-STEEL-01', quantity: 100, unitCost: 15.50 }; // القيمة 1550
            const ledgerAccount = { balance: 1550.00, tolerance: 0.00 };

            const recRes = verifier.verifyInventoryValuation(physical, ledgerAccount);
            assert.equal(recRes.gate, 'PASS');
            assert.equal(recRes.isReconciled, true);
        });

        it('should execute synthetic bank reconciliation and identify unmatched items', () => {
            const verifier = new FinancialStatementVerifier();
            const bankStatements = [
                { reference: 'CHK-101', amount: 500.00 },
                { reference: 'CHK-102', amount: 250.00 } // غير موجود في الدفتر
            ];
            const cashBook = [
                { reference: 'CHK-101', amount: 500.00 }
            ];

            const res = verifier.verifyBankReconciliation(bankStatements, cashBook);
            assert.equal(res.gate, 'FAIL');
            assert.equal(res.unmatchedBankCount, 1);
            assert.equal(res.matchedTotal, 500.00);
        });
    });

    // 3. AI + Financial Workflow Governance
    describe('3. AI + Financial Workflow Governance & Mandatory HITL', () => {
        it('should block AI proposals with calculation discrepancies or missing human approval', () => {
            const governor = new AiFinancialGovernor();

            // اقتراح يحتوي على تضارب حسابي بين البنود والإجمالي
            const calcMismatch = governor.verifyAiFinancialProposal({
                actionType: 'INVOICE_POSTING',
                extractedTotal: 100.00,
                lineItems: [
                    { quantity: 2, unitPrice: 30.00 } // المجموع 60 وليس 100
                ],
                humanApproval: { isApproved: true }
            });
            assert.equal(calcMismatch.gate, 'FAIL');
            assert.ok(calcMismatch.violations.some(v => v.type === 'AI_CALCULATION_DISCREPANCY'));

            // اقتراح مالي عالي الأثر بدون موافقة بشرية
            const noHitl = governor.verifyAiFinancialProposal({
                actionType: 'PAYMENT_DISBURSEMENT',
                extractedTotal: 500.00,
                lineItems: [{ quantity: 1, unitPrice: 500.00 }],
                humanApproval: null
            });
            assert.equal(noHitl.gate, 'FAIL');
            assert.ok(noHitl.violations.some(v => v.type === 'HUMAN_APPROVAL_MANDATORY_FOR_FINANCIAL_ACTION'));

            // اقتراح سليم ومعتمد بشرياً
            const valid = governor.verifyAiFinancialProposal({
                actionType: 'INVOICE_POSTING',
                extractedTotal: 500.00,
                lineItems: [{ quantity: 5, unitPrice: 100.00 }],
                humanApproval: { isApproved: true }
            });
            assert.equal(valid.gate, 'PASS');
            assert.equal(valid.isCompliant, true);
        });
    });
});
