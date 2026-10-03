/**
 * @file financial-profile.js
 * @description WebForge V2 — Financial & ERP Domain Profiles & Accounting Model Detector
 * يعرف ملفات تعريف النطاق المالي والـ ERP ويكتشف النموذج المحاسبي القائم بدقة واحتراز دلالي.
 */

const ACCOUNTING_MODELS = {
    DOUBLE_ENTRY: 'DOUBLE_ENTRY',
    SINGLE_ENTRY: 'SINGLE_ENTRY',
    SUBLEDGER_ARCHITECTURE: 'SUBLEDGER_ARCHITECTURE',
    UNKNOWN: 'UNKNOWN'
};

const FINANCIAL_MODULES = [
    'general_ledger',
    'accounts_receivable',
    'accounts_payable',
    'invoicing',
    'payments',
    'refunds',
    'reversals',
    'purchasing',
    'sales',
    'inventory',
    'fixed_assets',
    'banking',
    'bank_reconciliation',
    'tax',
    'payroll',
    'budgeting',
    'expenses',
    'financial_periods',
    'closing',
    'financial_reporting',
    'multi_currency'
];

class FinancialDomainProfile {
    constructor(config = {}) {
        this.enabled = config.enabled !== false;
        this.modules = Array.isArray(config.modules) ? config.modules : ['general_ledger', 'invoicing', 'payments'];
        this.accountingModel = config.accountingModel || ACCOUNTING_MODELS.UNKNOWN;
        this.baseCurrency = config.baseCurrency || 'USD';
        this.supportedCurrencies = Array.isArray(config.supportedCurrencies) ? config.supportedCurrencies : [this.baseCurrency];
        this.fiscalCalendar = config.fiscalCalendar || { yearStartMonth: 1, periodType: 'MONTHLY' };
        this.approvalModel = config.approvalModel || 'MAKER_CHECKER_DUAL';
        this.taxModels = config.taxModels || ['STANDARD_VAT'];
    }

    hasModule(moduleName) {
        return this.modules.includes(moduleName);
    }

    toJSON() {
        return {
            enabled: this.enabled,
            modules: this.modules,
            accountingModel: this.accountingModel,
            baseCurrency: this.baseCurrency,
            supportedCurrencies: this.supportedCurrencies,
            fiscalCalendar: this.fiscalCalendar,
            approvalModel: this.approvalModel,
            taxModels: this.taxModels
        };
    }
}

class ErpDomainProfile {
    constructor(config = {}) {
        this.organizationStructure = config.organizationStructure || { companies: 1, branches: 1, multiTenant: false };
        this.masterData = config.masterData || ['chart_of_accounts', 'customers', 'vendors', 'items'];
        this.workflows = config.workflows || ['purchase_approval', 'payment_authorization'];
        this.integrations = config.integrations || [];
        this.reporting = config.reporting || ['balance_sheet', 'income_statement', 'trial_balance'];
    }

    toJSON() {
        return {
            organizationStructure: this.organizationStructure,
            masterData: this.masterData,
            workflows: this.workflows,
            integrations: this.integrations,
            reporting: this.reporting
        };
    }
}

class AccountingModelDetector {
    /**
     * كشف النموذج المحاسبي دون افتراضات غير مثبتة بأدلة مادية
     */
    static detectModel(evidence = {}) {
        if (!evidence || Object.keys(evidence).length === 0) {
            return {
                detectedModel: ACCOUNTING_MODELS.UNKNOWN,
                conclusion: 'INSUFFICIENT_EVIDENCE',
                confidence: 'LOW',
                reason: 'لا توجد أدلة كافية أو مخططات توضح وجود قيد محاسبي مزدوج أو فردي.'
            };
        }

        const hasDebitsAndCredits = evidence.hasDebitField && evidence.hasCreditField;
        const hasJournalEntries = evidence.hasJournalTable || evidence.hasLedgerEntries;
        const hasChartOfAccounts = evidence.hasChartOfAccounts;

        if (hasDebitsAndCredits && hasJournalEntries && hasChartOfAccounts) {
            return {
                detectedModel: ACCOUNTING_MODELS.DOUBLE_ENTRY,
                conclusion: 'VERIFIED',
                confidence: 'HIGH',
                reason: 'تم التحقق من وجود حقول المدين والدائن، ودفاتر اليومية، ودليل الحسابات.'
            };
        }

        if (evidence.singleEntryCashBook) {
            return {
                detectedModel: ACCOUNTING_MODELS.SINGLE_ENTRY,
                conclusion: 'VERIFIED',
                confidence: 'MEDIUM',
                reason: 'تم رصد نظام قيد فردي (سجل المقبوضات والمدفوعات البسيط).'
            };
        }

        return {
            detectedModel: ACCOUNTING_MODELS.UNKNOWN,
            conclusion: 'INSUFFICIENT_EVIDENCE',
            confidence: 'LOW',
            reason: 'الأدلة غير كافية للجزم بوجود نموذج قيد مزدوج مكتمل.'
        };
    }
}

module.exports = {
    ACCOUNTING_MODELS,
    FINANCIAL_MODULES,
    FinancialDomainProfile,
    ErpDomainProfile,
    AccountingModelDetector
};
