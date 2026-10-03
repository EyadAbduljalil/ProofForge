const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
    financialErp: {
        ACCOUNTING_MODELS,
        FINANCIAL_MODULES,
        FinancialDomainProfile,
        ErpDomainProfile,
        AccountingModelDetector,
        DoubleEntryValidator,
        LedgerReconciliationEngine,
        MultiCurrencyValidator,
        FiscalPeriodLock,
        TaxInvoicingValidator,
        FinancialAtomicitySimulator,
        FinancialIdempotencyGuard,
        SegregationOfDutiesGuard,
        NegativeBalanceGuard,
        FinancialAuditTrail
    }
} = require('../v2');

describe('WebForge V2 — Financial & ERP Domain Verification Master Suite', () => {

    describe('1. Financial & ERP Domain Profiles & Accounting Model Detection', () => {
        it('should initialize financial and ERP profiles and verify module presence', () => {
            const finProfile = new FinancialDomainProfile({
                modules: ['general_ledger', 'invoicing', 'payments', 'tax', 'multi_currency'],
                baseCurrency: 'SAR',
                supportedCurrencies: ['SAR', 'USD', 'EUR']
            });

            assert.equal(finProfile.baseCurrency, 'SAR');
            assert.equal(finProfile.hasModule('general_ledger'), true);
            assert.equal(finProfile.hasModule('payroll'), false);

            const erpProfile = new ErpDomainProfile({
                organizationStructure: { companies: 2, branches: 5, multiTenant: true }
            });
            assert.equal(erpProfile.organizationStructure.companies, 2);
            assert.equal(erpProfile.organizationStructure.multiTenant, true);
        });

        it('should detect accounting model with evidence or return INSUFFICIENT_EVIDENCE', () => {
            // Insufficient evidence test
            const emptyCheck = AccountingModelDetector.detectModel({});
            assert.equal(emptyCheck.conclusion, 'INSUFFICIENT_EVIDENCE');
            assert.equal(emptyCheck.detectedModel, ACCOUNTING_MODELS.UNKNOWN);

            // Double-entry evidence test
            const doubleEntryCheck = AccountingModelDetector.detectModel({
                hasDebitField: true,
                hasCreditField: true,
                hasJournalTable: true,
                hasChartOfAccounts: true
            });
            assert.equal(doubleEntryCheck.conclusion, 'VERIFIED');
            assert.equal(doubleEntryCheck.detectedModel, ACCOUNTING_MODELS.DOUBLE_ENTRY);

            // Single entry test
            const singleCheck = AccountingModelDetector.detectModel({ singleEntryCashBook: true });
            assert.equal(singleCheck.conclusion, 'VERIFIED');
            assert.equal(singleCheck.detectedModel, ACCOUNTING_MODELS.SINGLE_ENTRY);
        });
    });

    describe('2. Double-Entry Validation & Accounting Invariants', () => {
        it('should validate balanced double-entry journals and reject unbalanced entries', () => {
            // Valid balanced journal
            const balancedJournal = {
                lines: [
                    { account: '1010-CASH', debit: 5000.50, credit: 0 },
                    { account: '4010-REVENUE', debit: 0, credit: 5000.50 }
                ]
            };
            const validRes = DoubleEntryValidator.validateJournalEntry(balancedJournal);
            assert.equal(validRes.valid, true);
            assert.equal(validRes.discrepancy, 0);

            // Unbalanced journal
            const unbalancedJournal = {
                lines: [
                    { account: '1010-CASH', debit: 5000, credit: 0 },
                    { account: '4010-REVENUE', debit: 0, credit: 4900 }
                ]
            };
            const invalidRes = DoubleEntryValidator.validateJournalEntry(unbalancedJournal);
            assert.equal(invalidRes.valid, false);
            assert.equal(invalidRes.discrepancy, 100);

            // Multi-line journal with rounding
            const multiLineJournal = {
                lines: [
                    { account: '1010-CASH', debit: 1150.00, credit: 0 },
                    { account: '4010-SALES', debit: 0, credit: 1000.00 },
                    { account: '2020-VAT-OUTPUT', debit: 0, credit: 150.00 }
                ]
            };
            const multiRes = DoubleEntryValidator.validateJournalEntry(multiLineJournal);
            assert.equal(multiRes.valid, true);

            // Negative or single line rejection
            assert.equal(DoubleEntryValidator.validateJournalEntry({ lines: [{ debit: 100 }] }).valid, false);
            assert.equal(DoubleEntryValidator.validateJournalEntry({ lines: [{ debit: -50, credit: 0 }, { debit: 0, credit: -50 }] }).valid, false);
        });

        it('should reconcile source transactions against general ledger postings', () => {
            const sources = [{ id: 'TXN-01' }, { id: 'TXN-02' }, { id: 'TXN-03' }];
            const glEntries = [
                { id: 'GL-01', transactionId: 'TXN-01' },
                { id: 'GL-02', transactionId: 'TXN-02' },
                { id: 'GL-03', transactionId: 'TXN-03' }
            ];

            const matchRes = LedgerReconciliationEngine.reconcileLedger(sources, glEntries);
            assert.equal(matchRes.reconciled, true);
            assert.equal(matchRes.missingInGLCount, 0);

            // Discrepancy simulation: Missing TXN-03 and Orphan GL-99
            const brokenGL = [
                { id: 'GL-01', transactionId: 'TXN-01' },
                { id: 'GL-99', transactionId: 'TXN-GHOST' }
            ];
            const brokenRes = LedgerReconciliationEngine.reconcileLedger(sources, brokenGL);
            assert.equal(brokenRes.reconciled, false);
            assert.equal(brokenRes.missingInGLCount, 2);
            assert.equal(brokenRes.orphanInGLCount, 1);
        });
    });

    describe('3. Multi-Currency, Fiscal Periods & Invoicing Calculations', () => {
        it('should validate multi-currency conversions and rounding tolerance', () => {
            const conversion = MultiCurrencyValidator.validateConversion({
                foreignAmount: 100, // 100 USD
                exchangeRate: 3.75, // to SAR
                baseAmount: 375.00
            });
            assert.equal(conversion.valid, true);

            const invalidConversion = MultiCurrencyValidator.validateConversion({
                foreignAmount: 100,
                exchangeRate: 3.75,
                baseAmount: 350.00
            });
            assert.equal(invalidConversion.valid, false);
        });

        it('should enforce fiscal period locks and reject posting to closed periods', () => {
            const periodLock = new FiscalPeriodLock([
                { id: '2026-Q1', status: 'CLOSED' },
                { id: '2026-Q2', status: 'OPEN' }
            ]);

            const closedPost = periodLock.canPostToPeriod('2026-Q1');
            assert.equal(closedPost.allowed, false);
            assert.ok(closedPost.reason.includes('مقفلة'));

            const openPost = periodLock.canPostToPeriod('2026-Q2');
            assert.equal(openPost.allowed, true);
        });

        it('should validate invoice totals, line items, and tax computations', () => {
            const invoice = {
                items: [
                    { quantity: 2, unitPrice: 100, taxRate: 15 }, // 200 + 30 tax
                    { quantity: 1, unitPrice: 300, taxRate: 15 }  // 300 + 45 tax
                ],
                discount: 50, // subtotal = 500 - 50 = 450. tax = 75. total = 525
                totalAmount: 525.00
            };

            const taxCheck = TaxInvoicingValidator.validateInvoice(invoice);
            assert.equal(taxCheck.valid, true);
            assert.equal(taxCheck.subtotal, 500);
            assert.equal(taxCheck.tax, 75);
        });
    });

    describe('4. Transaction Governance, Atomicity, Idempotency & SoD', () => {
        it('should verify atomic rollback on multi-step financial posting failure', async () => {
            // Full commit test
            const successPosting = await FinancialAtomicitySimulator.executeAtomicPosting({ id: 'TX-1' });
            assert.equal(successPosting.success, true);
            assert.equal(successPosting.status, 'COMMITTED');
            assert.equal(successPosting.state.step5_audit_logged, true);

            // Mid-transaction failure (step 3 fails) -> Rollback
            const failedPosting = await FinancialAtomicitySimulator.executeAtomicPosting({ id: 'TX-2' }, { failAtStep: 3 });
            assert.equal(failedPosting.success, false);
            assert.equal(failedPosting.status, 'ROLLED_BACK');
            assert.equal(failedPosting.state.rolledBack, true);
            assert.equal(failedPosting.state.step3_gl_posted, false);
        });

        it('should enforce financial idempotency and reject duplicate transactions', () => {
            const guard = new FinancialIdempotencyGuard();
            const res1 = guard.processTransaction('KEY-PAY-999', { amount: 500 });
            assert.equal(res1.allowed, true);
            assert.equal(res1.replayed, false);

            // Replay attempt with same key
            const res2 = guard.processTransaction('KEY-PAY-999', { amount: 500 });
            assert.equal(res2.allowed, false);
            assert.equal(res2.replayed, true);
            assert.ok(res2.reason.includes('مكررة'));
        });

        it('should enforce Segregation of Duties (SoD) and prohibit self-approval', () => {
            // Self-approval attempt
            const selfApproval = SegregationOfDutiesGuard.validateApproval('USER-ALICE', 'USER-ALICE');
            assert.equal(selfApproval.valid, false);
            assert.equal(selfApproval.violation, 'SELF_APPROVAL_PROHIBITED');

            // Proper maker-checker
            const makerChecker = SegregationOfDutiesGuard.validateApproval('USER-ALICE', 'USER-BOB-CONTROLLER');
            assert.equal(makerChecker.valid, true);
        });

        it('should prevent unauthorized overdrafts and verify financial audit hash-chain integrity', () => {
            // Balance check
            const overdraftAttempt = NegativeBalanceGuard.checkBalance(100, 250, false);
            assert.equal(overdraftAttempt.allowed, false);
            assert.ok(overdraftAttempt.reason.includes('رصيد غير كافٍ'));

            const validDeduction = NegativeBalanceGuard.checkBalance(500, 200, false);
            assert.equal(validDeduction.allowed, true);
            assert.equal(validDeduction.resultingBalance, 300);

            // Audit trail hash chain
            const trail = new FinancialAuditTrail();
            const e1 = trail.appendEvent('JOURNAL_CREATED', { journalId: 'J-01' });
            const e2 = trail.appendEvent('JOURNAL_APPROVED', { journalId: 'J-01', approver: 'BOB' });
            const e3 = trail.appendEvent('JOURNAL_POSTED', { journalId: 'J-01' });

            assert.equal(e2.prevHash, e1.hash);
            assert.equal(e3.prevHash, e2.hash);
            assert.equal(trail.verifyTrailIntegrity().intact, true);

            // Tamper test
            trail.ledgerEvents[1].details.approver = 'EVE_MALICIOUS';
            assert.equal(trail.verifyTrailIntegrity().intact, false);
        });
    });
});
