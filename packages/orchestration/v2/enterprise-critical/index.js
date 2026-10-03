/**
 * @file index.js
 * @description WebForge V2.6 — Enterprise & Critical Systems Verification Layer Master Exports
 * تصدير كافة محركات التحقق للأنظمة المؤسسية والحرجة (Banking, Healthcare, Government, HR/Payroll)
 */

const {
    BANKING_TRANSACTION_STATES,
    ALLOWED_BANKING_TRANSITIONS,
    BankingVerifier
} = require('./banking-verifier');

const {
    HealthcareVerifier
} = require('./healthcare-verifier');

const {
    GOVERNMENT_CASE_STATES,
    ALLOWED_GOVERNMENT_TRANSITIONS,
    GovernmentVerifier
} = require('./government-verifier');

const {
    EMPLOYMENT_STATES,
    ALLOWED_HR_TRANSITIONS,
    HrPayrollVerifier
} = require('./hr-payroll-verifier');

module.exports = {
    // Banking / FinTech
    BANKING_TRANSACTION_STATES,
    ALLOWED_BANKING_TRANSITIONS,
    BankingVerifier,

    // Healthcare
    HealthcareVerifier,

    // Government / Public Services
    GOVERNMENT_CASE_STATES,
    ALLOWED_GOVERNMENT_TRANSITIONS,
    GovernmentVerifier,

    // HR / Payroll
    EMPLOYMENT_STATES,
    ALLOWED_HR_TRANSITIONS,
    HrPayrollVerifier
};
