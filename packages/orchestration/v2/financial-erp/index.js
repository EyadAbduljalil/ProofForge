/**
 * @file index.js
 * @description WebForge V2 — Financial & ERP Domain Verification Master Exports
 * يجمع كافة مكونات التحقق المحاسبي والمالي وأنظمة ERP
 */

const {
    ACCOUNTING_MODELS,
    FINANCIAL_MODULES,
    FinancialDomainProfile,
    ErpDomainProfile,
    AccountingModelDetector
} = require('./financial-profile');

const {
    DoubleEntryValidator,
    LedgerReconciliationEngine,
    MultiCurrencyValidator,
    FiscalPeriodLock,
    TaxInvoicingValidator
} = require('./accounting-invariants');

const {
    FinancialAtomicitySimulator,
    FinancialIdempotencyGuard,
    SegregationOfDutiesGuard,
    NegativeBalanceGuard,
    FinancialAuditTrail
} = require('./transaction-governance');

module.exports = {
    // Profiles & Detection
    ACCOUNTING_MODELS,
    FINANCIAL_MODULES,
    FinancialDomainProfile,
    ErpDomainProfile,
    AccountingModelDetector,

    // Invariants & Reconciliation
    DoubleEntryValidator,
    LedgerReconciliationEngine,
    MultiCurrencyValidator,
    FiscalPeriodLock,
    TaxInvoicingValidator,

    // Transaction Governance & Security
    FinancialAtomicitySimulator,
    FinancialIdempotencyGuard,
    SegregationOfDutiesGuard,
    NegativeBalanceGuard,
    FinancialAuditTrail,

    // V2.4 Second-Generation Expansion Engines
    INVOICE_STATES: require('./financial-lifecycle-verifier').INVOICE_STATES,
    FinancialLifecycleVerifier: require('./financial-lifecycle-verifier').FinancialLifecycleVerifier,
    FinancialStatementVerifier: require('./financial-statement-verifier').FinancialStatementVerifier,
    AiFinancialGovernor: require('./ai-financial-governor').AiFinancialGovernor
};
