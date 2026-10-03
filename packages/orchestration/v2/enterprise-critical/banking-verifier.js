/**
 * @file banking-verifier.js
 * @description WebForge V2.6 — Banking & FinTech Verification Engine
 * محرك التحقق من الحسابات المصرفية، دورات المعاملات، ثوابت التحويل الذري، والمطابقة
 */

const crypto = require('crypto');

const BANKING_TRANSACTION_STATES = {
    INITIATED: 'INITIATED',
    AUTHORIZED: 'AUTHORIZED',
    PROCESSING: 'PROCESSING',
    SETTLED: 'SETTLED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REVERSED: 'REVERSED'
};

const ALLOWED_BANKING_TRANSITIONS = {
    [BANKING_TRANSACTION_STATES.INITIATED]: [
        BANKING_TRANSACTION_STATES.AUTHORIZED,
        BANKING_TRANSACTION_STATES.CANCELLED,
        BANKING_TRANSACTION_STATES.FAILED
    ],
    [BANKING_TRANSACTION_STATES.AUTHORIZED]: [
        BANKING_TRANSACTION_STATES.PROCESSING,
        BANKING_TRANSACTION_STATES.CANCELLED,
        BANKING_TRANSACTION_STATES.FAILED
    ],
    [BANKING_TRANSACTION_STATES.PROCESSING]: [
        BANKING_TRANSACTION_STATES.SETTLED,
        BANKING_TRANSACTION_STATES.FAILED
    ],
    [BANKING_TRANSACTION_STATES.SETTLED]: [
        BANKING_TRANSACTION_STATES.REVERSED // التسوية لا تلغى بل تعكس بقيد عكسي
    ],
    [BANKING_TRANSACTION_STATES.FAILED]: [],
    [BANKING_TRANSACTION_STATES.CANCELLED]: [],
    [BANKING_TRANSACTION_STATES.REVERSED]: []
};

class BankingVerifier {
    constructor() {
        this.processedIdempotencyKeys = new Set();
        this.registeredAccounts = new Map(); // accountNumber -> accountId
        this.settledTransactions = new Map(); // txId -> txData
        this.reversals = new Set(); // originalTxId
    }

    /**
     * التحقق من الحساب البنكي والهوية والحدود
     */
    verifyAccount(account) {
        const findings = [];
        const { id, accountNumber, ownerId, currency, balance, status, dailyLimit } = account;

        if (!id || !accountNumber || !ownerId) {
            findings.push({
                code: 'INVALID_BANK_ACCOUNT_IDENTITY',
                severity: 'CRITICAL',
                message: 'الحساب البنكي يفتقد إلى رقم الحساب أو معرف المالك الكنسي'
            });
        }

        // كشف تكرار رقم الحساب البنكي
        if (accountNumber) {
            if (this.registeredAccounts.has(accountNumber) && this.registeredAccounts.get(accountNumber) !== id) {
                findings.push({
                    code: 'DUPLICATE_BANK_ACCOUNT_NUMBER',
                    severity: 'CRITICAL',
                    accountNumber,
                    message: `تم اكتشاف تكرار لرقم الحساب البنكي: ${accountNumber}`
                });
            } else {
                this.registeredAccounts.set(accountNumber, id);
            }
        }

        // فحص الرصيد السالب غير المصرح به
        if (typeof balance !== 'number' || balance < 0) {
            findings.push({
                code: 'NEGATIVE_ACCOUNT_BALANCE_UNAUTHORIZED',
                severity: 'CRITICAL',
                balance,
                message: `رصيد الحساب سالب بشكل غير مصرح به: ${balance}`
            });
        }

        if (dailyLimit !== undefined && dailyLimit <= 0) {
            findings.push({
                code: 'INVALID_DAILY_LIMIT',
                severity: 'HIGH',
                dailyLimit,
                message: `سقف المعاملات اليومي للحساب يجب أن يكون قيمة موجبة: ${dailyLimit}`
            });
        }

        return {
            valid: findings.length === 0,
            accountId: id,
            findings
        };
    }

    /**
     * التحقق من انتقالات حالات المعاملة المصرفية
     */
    verifyTransactionTransition(currentState, nextState, context = {}) {
        const findings = [];
        const allowed = ALLOWED_BANKING_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_BANKING_TX_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة المعاملة المصرفية الحالية غير معترف بها: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_BANKING_TX_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `انتقال محظور في حالة المعاملة البنكية من ${currentState} إلى ${nextState}`
            });
        }

        // محاولة إلغاء معاملة مستقرة بدلاً من عكسها
        if (currentState === BANKING_TRANSACTION_STATES.SETTLED && nextState === BANKING_TRANSACTION_STATES.CANCELLED) {
            findings.push({
                code: 'SETTLED_TX_CANCELLATION_FORBIDDEN',
                severity: 'CRITICAL',
                message: 'لا يجوز إلغاء معاملة بنكية مستقرة (Settled)؛ يجب إجراء قيد عكسي موثق (Reversal)'
            });
        }

        return {
            valid: findings.length === 0,
            currentState,
            nextState,
            findings
        };
    }

    /**
     * التحقق من التحويل البنكي الذري (Atomic Transfer Verification)
     * Invariant: Source Debit = Destination Credit & No Replay & Balance Checks
     */
    verifyTransfer(transferRequest, sourceAccount, destAccount) {
        const findings = [];
        const { transferId, amount, currency, idempotencyKey, sourceOwnerId } = transferRequest;

        // 1. فحص مفتاح عدم التكرار (Anti-Replay / Idempotency)
        if (!idempotencyKey) {
            findings.push({
                code: 'MISSING_TRANSFER_IDEMPOTENCY_KEY',
                severity: 'CRITICAL',
                message: 'معاملة التحويل البنكي تفتقد إلى مفتاح منع التكرار (Idempotency Key)'
            });
        } else if (this.processedIdempotencyKeys.has(idempotencyKey)) {
            findings.push({
                code: 'DUPLICATE_TRANSFER_REPLAY_ATTEMPT',
                severity: 'CRITICAL',
                idempotencyKey,
                message: `محاولة إعادة إرسال أو تكرار تحويل بنكي تمت معالجته مسبقاً: ${idempotencyKey}`
            });
            return { valid: false, findings };
        }

        // 2. التحقق من صحة المبلغ
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            findings.push({
                code: 'INVALID_TRANSFER_AMOUNT',
                severity: 'CRITICAL',
                amount,
                message: `مبلغ التحويل غير قانوني أو سالب/صفري: ${amount}`
            });
        }

        // 3. التحقق من صلاحية الحساب المصدر وملكيته
        if (sourceAccount.status !== 'ACTIVE') {
            findings.push({
                code: 'SOURCE_ACCOUNT_INACTIVE',
                severity: 'CRITICAL',
                status: sourceAccount.status,
                message: `الحساب المصدر للتحويل ليس في حالة نشطة: ${sourceAccount.status}`
            });
        }

        if (sourceOwnerId && sourceAccount.ownerId !== sourceOwnerId) {
            findings.push({
                code: 'UNAUTHORIZED_ACCOUNT_DEBIT_ATTEMPT',
                severity: 'CRITICAL',
                actorOwnerId: sourceOwnerId,
                realOwnerId: sourceAccount.ownerId,
                message: 'محاولة سحب أو تحويل من حساب لا يملكه الفاعل (Anti-IDOR)'
            });
        }

        // 4. التحقق من كفاية الرصيد (Anti-Overdraft)
        if (sourceAccount.balance < amount) {
            findings.push({
                code: 'INSUFFICIENT_FUNDS_OVERDRAFT_BLOCKED',
                severity: 'CRITICAL',
                availableBalance: sourceAccount.balance,
                requestedAmount: amount,
                deficit: amount - sourceAccount.balance,
                message: `محاولة سحب تفوق الرصيد المتاح: الرصيد ${sourceAccount.balance} والمطلوب ${amount}`
            });
        }

        // 5. التحقق من سقف المعاملات اليومي
        if (sourceAccount.dailyLimit && amount > sourceAccount.dailyLimit) {
            findings.push({
                code: 'TRANSFER_EXCEEDS_DAILY_LIMIT',
                severity: 'HIGH',
                dailyLimit: sourceAccount.dailyLimit,
                amount,
                message: `المبلغ المطلوب (${amount}) يتجاوز السقف اليومي للتحويل (${sourceAccount.dailyLimit})`
            });
        }

        // 6. التحقق من تطابق العملات
        if (sourceAccount.currency !== currency || destAccount.currency !== currency) {
            findings.push({
                code: 'CURRENCY_MISMATCH_WITHOUT_FX_RATE',
                severity: 'HIGH',
                transferCurrency: currency,
                sourceCurrency: sourceAccount.currency,
                destCurrency: destAccount.currency,
                message: 'عدم تطابق عملة التحويل مع الحسابات المصرفية دون تحديد سعر صرف معتمد'
            });
        }

        if (findings.length === 0) {
            this.processedIdempotencyKeys.add(idempotencyKey);
            this.settledTransactions.set(transferId, {
                transferId,
                sourceAccountId: sourceAccount.id,
                destAccountId: destAccount.id,
                amount,
                currency,
                status: BANKING_TRANSACTION_STATES.SETTLED
            });
        }

        return {
            valid: findings.length === 0,
            transferId,
            projectedSourceBalance: sourceAccount.balance - amount,
            projectedDestBalance: destAccount.balance + amount,
            findings
        };
    }

    /**
     * التحقق من عملية عكس المعاملة (Reversal Verification)
     */
    verifyReversal(originalTxId, reversalRequest) {
        const findings = [];
        const originalTx = this.settledTransactions.get(originalTxId);

        if (!originalTx) {
            findings.push({
                code: 'ORIGINAL_TRANSACTION_NOT_FOUND',
                severity: 'CRITICAL',
                originalTxId,
                message: `المعاملة البنكية الأصلية المراد عكسها غير موجودة: ${originalTxId}`
            });
            return { valid: false, findings };
        }

        if (this.reversals.has(originalTxId)) {
            findings.push({
                code: 'DUPLICATE_REVERSAL_ATTEMPT',
                severity: 'CRITICAL',
                originalTxId,
                message: `تم عكس هذه المعاملة البنكية مسبقاً ولا يجوز تكرار العكس: ${originalTxId}`
            });
        }

        if (reversalRequest.amount > originalTx.amount) {
            findings.push({
                code: 'REVERSAL_AMOUNT_EXCEEDS_ORIGINAL',
                severity: 'CRITICAL',
                reversalAmount: reversalRequest.amount,
                originalAmount: originalTx.amount,
                message: `مبلغ القيد العكسي (${reversalRequest.amount}) يتجاوز مبلغ المعاملة الأصلية (${originalTx.amount})`
            });
        }

        if (findings.length === 0) {
            this.reversals.add(originalTxId);
        }

        return {
            valid: findings.length === 0,
            originalTxId,
            findings
        };
    }

    /**
     * التحقق من مطابقة دفتر الأستاذ البنكي وكشف الحساب التخليقي
     */
    verifyLedgerReconciliation(openingBalance, transactions = [], syntheticStatementClosingBalance) {
        const findings = [];
        let calculatedBalance = openingBalance;

        for (const tx of transactions) {
            if (tx.type === 'CREDIT') {
                calculatedBalance += tx.amount;
            } else if (tx.type === 'DEBIT') {
                calculatedBalance -= tx.amount;
            } else {
                findings.push({
                    code: 'UNKNOWN_TX_POSTING_TYPE',
                    severity: 'HIGH',
                    txId: tx.id,
                    type: tx.type,
                    message: `نوع قيد المعاملة غير صالح: ${tx.type}`
                });
            }
        }

        if (Math.abs(calculatedBalance - syntheticStatementClosingBalance) > 0.01) {
            findings.push({
                code: 'BANK_STATEMENT_RECONCILIATION_DISCREPANCY',
                severity: 'CRITICAL',
                calculatedBalance,
                syntheticStatementClosingBalance,
                discrepancy: calculatedBalance - syntheticStatementClosingBalance,
                message: `تضارب في تسوية الحساب البنكي: رصيد الدفتر المحسوب (${calculatedBalance}) يختلف عن كشف الحساب (${syntheticStatementClosingBalance})`
            });
        }

        return {
            reconciled: findings.length === 0,
            calculatedBalance,
            syntheticStatementClosingBalance,
            findings
        };
    }
}

module.exports = {
    BANKING_TRANSACTION_STATES,
    ALLOWED_BANKING_TRANSITIONS,
    BankingVerifier
};
