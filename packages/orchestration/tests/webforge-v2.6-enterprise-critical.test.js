/**
 * @file webforge-v2.6-enterprise-critical.test.js
 * @description WebForge V2.6 — Enterprise & Critical Systems Verification Layer Master Test Suite
 * حزمة اختبارات شاملة وعدائية للأنظمة المصرفية، الصحية، الحكومية، والموارد البشرية/الرواتب
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const v2 = require('../v2/index.js');
const {
    BANKING_TRANSACTION_STATES,
    ALLOWED_BANKING_TRANSITIONS,
    BankingVerifier,
    HealthcareVerifier,
    GOVERNMENT_CASE_STATES,
    GovernmentVerifier,
    EMPLOYMENT_STATES,
    HrPayrollVerifier
} = v2.enterpriseCritical;

describe('WebForge V2.6 — Enterprise & Critical Systems Verification Layer Suite', () => {

    // 1. Banking & FinTech Verification
    describe('1. Banking & FinTech: Accounts, Transfers, Ledgers & Reversals', () => {
        it('should detect duplicate bank accounts, unauthorized negative balance, and illegal state transitions', () => {
            const verifier = new BankingVerifier();
            
            // تسجيل حساب أولي
            verifier.verifyAccount({
                id: 'ACC-1',
                accountNumber: 'IBAN-SA-001',
                ownerId: 'USER-1',
                balance: 5000,
                status: 'ACTIVE'
            });

            // حساب مكرر بنفس رقم الـ IBAN ورصيد سالب
            const badAcc = verifier.verifyAccount({
                id: 'ACC-2',
                accountNumber: 'IBAN-SA-001', // مكرر
                ownerId: 'USER-2',
                balance: -500, // سالب
                status: 'ACTIVE'
            });

            assert.equal(badAcc.valid, false);
            const codes = badAcc.findings.map(f => f.code);
            assert.ok(codes.includes('DUPLICATE_BANK_ACCOUNT_NUMBER'));
            assert.ok(codes.includes('NEGATIVE_ACCOUNT_BALANCE_UNAUTHORIZED'));

            // محاولة إلغاء معاملة مستقرة بدلاً من عكسها
            const cancelTrans = verifier.verifyTransactionTransition(
                BANKING_TRANSACTION_STATES.SETTLED,
                BANKING_TRANSACTION_STATES.CANCELLED
            );
            assert.equal(cancelTrans.valid, false);
            assert.ok(cancelTrans.findings.some(f => f.code === 'SETTLED_TX_CANCELLATION_FORBIDDEN'));
        });

        it('should enforce atomic transfer invariants, prevent overdraft, detect IDOR, and block replay attacks', () => {
            const verifier = new BankingVerifier();
            const sourceAcc = {
                id: 'ACC-SOURCE',
                accountNumber: 'IBAN-SRC',
                ownerId: 'CUSTOMER-A',
                balance: 1000,
                currency: 'USD',
                status: 'ACTIVE',
                dailyLimit: 2000
            };
            const destAcc = {
                id: 'ACC-DEST',
                accountNumber: 'IBAN-DST',
                ownerId: 'CUSTOMER-B',
                balance: 200,
                currency: 'USD',
                status: 'ACTIVE'
            };

            // 1. تحويل غير مصرح به (IDOR: الفاعل يدعي ملكية حساب غير حسابه)
            const idorTransfer = verifier.verifyTransfer({
                transferId: 'TX-101',
                amount: 300,
                currency: 'USD',
                idempotencyKey: 'IDEMP-TX-101',
                sourceOwnerId: 'MALICIOUS-ACTOR'
            }, sourceAcc, destAcc);
            assert.equal(idorTransfer.valid, false);
            assert.ok(idorTransfer.findings.some(f => f.code === 'UNAUTHORIZED_ACCOUNT_DEBIT_ATTEMPT'));

            // 2. محاولة سحب تفوق الرصيد المتاح (Overdraft)
            const overdraftTransfer = verifier.verifyTransfer({
                transferId: 'TX-102',
                amount: 1500, // الرصيد 1000 فقط
                currency: 'USD',
                idempotencyKey: 'IDEMP-TX-102',
                sourceOwnerId: 'CUSTOMER-A'
            }, sourceAcc, destAcc);
            assert.equal(overdraftTransfer.valid, false);
            assert.ok(overdraftTransfer.findings.some(f => f.code === 'INSUFFICIENT_FUNDS_OVERDRAFT_BLOCKED'));

            // 3. تحويل سليم ومنع إعادة إرساله بنفس مفتاح الـ Idempotency
            const validReq = {
                transferId: 'TX-103',
                amount: 400,
                currency: 'USD',
                idempotencyKey: 'IDEMP-TX-103',
                sourceOwnerId: 'CUSTOMER-A'
            };
            const firstRun = verifier.verifyTransfer(validReq, sourceAcc, destAcc);
            assert.equal(firstRun.valid, true);

            const replayRun = verifier.verifyTransfer(validReq, sourceAcc, destAcc);
            assert.equal(replayRun.valid, false);
            assert.ok(replayRun.findings.some(f => f.code === 'DUPLICATE_TRANSFER_REPLAY_ATTEMPT'));
        });

        it('should verify transaction reversals and reconcile ledger against synthetic bank statement', () => {
            const verifier = new BankingVerifier();
            
            // تسجيل معاملة مستقرة
            verifier.settledTransactions.set('TX-SETTLED-1', {
                transferId: 'TX-SETTLED-1',
                amount: 500,
                status: BANKING_TRANSACTION_STATES.SETTLED
            });

            // محاولة عكس مبلغ يفوق المعاملة الأصلية
            const excessiveReversal = verifier.verifyReversal('TX-SETTLED-1', { amount: 600 });
            assert.equal(excessiveReversal.valid, false);
            assert.ok(excessiveReversal.findings.some(f => f.code === 'REVERSAL_AMOUNT_EXCEEDS_ORIGINAL'));

            // تسوية دفترية سليمة
            const reconResult = verifier.verifyLedgerReconciliation(1000, [
                { id: '1', type: 'CREDIT', amount: 500 },
                { id: '2', type: 'DEBIT', amount: 200 }
            ], 1300); // 1000 + 500 - 200 = 1300
            assert.equal(reconResult.reconciled, true);

            // تسوية دفترية بها تضارب
            const badRecon = verifier.verifyLedgerReconciliation(1000, [
                { id: '1', type: 'CREDIT', amount: 500 }
            ], 1200); // المتوقع 1500 وليس 1200
            assert.equal(badRecon.reconciled, false);
            assert.ok(badRecon.findings.some(f => f.code === 'BANK_STATEMENT_RECONCILIATION_DISCREPANCY'));
        });
    });

    // 2. Healthcare & Medical Systems Verification
    describe('2. Healthcare & Medical Systems: Privacy, Records, Appointments & AI Guard', () => {
        it('should isolate patient data (Anti-IDOR) and reject orphan or modified finalized records', () => {
            const verifier = new HealthcareVerifier();
            const targetPatient = { id: 'PATIENT-001', assignedProviderId: 'DR-SMITH' };

            // طبيب غير مخصص للمريض يحاول الوصول
            const foreignDoctor = { actorId: 'DR-JONES', role: 'PHYSICIAN' };
            const accessCheck = verifier.verifyPatientIsolation(foreignDoctor, targetPatient);
            assert.equal(accessCheck.authorized, false);
            assert.ok(accessCheck.findings.some(f => f.code === 'UNAUTHORIZED_PATIENT_RECORD_ACCESS_IDOR'));

            // سجل طبي مغلق ومعدل بدون إذن ملحق رسمي
            const badRecord = {
                id: 'REC-99',
                patientId: 'PATIENT-001',
                authorId: 'DR-SMITH',
                timestamp: '2026-05-01',
                isFinalized: true,
                modificationAttempt: true,
                addendumAuthorized: false
            };
            const recCheck = verifier.verifyMedicalRecord(badRecord, targetPatient);
            assert.equal(recCheck.valid, false);
            assert.ok(recCheck.findings.some(f => f.code === 'MODIFICATION_OF_FINALIZED_MEDICAL_RECORD_FORBIDDEN'));
        });

        it('should prevent appointment double booking for physicians and patients', () => {
            const verifier = new HealthcareVerifier();

            // حجز موعد أولي
            const app1 = {
                id: 'APP-1',
                patientId: 'PAT-1',
                providerId: 'DOC-1',
                startTime: '2026-10-10T10:00:00Z',
                endTime: '2026-10-10T10:30:00Z'
            };
            const res1 = verifier.verifyAppointment(app1);
            assert.equal(res1.valid, true);

            // محاولة حجز موعد لنفس الطبيب في نفس الوقت مع مريض مختلف (Double Booking)
            const app2 = {
                id: 'APP-2',
                patientId: 'PAT-2',
                providerId: 'DOC-1', // نفس الطبيب
                startTime: '2026-10-10T10:15:00Z', // متداخل
                endTime: '2026-10-10T10:45:00Z'
            };
            const res2 = verifier.verifyAppointment(app2);
            assert.equal(res2.valid, false);
            assert.ok(res2.findings.some(f => f.code === 'PROVIDER_DOUBLE_BOOKING_COLLISION'));
        });

        it('should block dispensing cancelled prescriptions and mandate human approval (HITL) for AI clinical actions', () => {
            const verifier = new HealthcareVerifier();

            // وصفة طبية ملغاة
            const cancelledPrescription = {
                id: 'RX-777',
                patientId: 'PAT-1',
                authorId: 'DOC-1',
                medicationName: 'Antibiotic-X',
                dosage: '500mg',
                status: 'CANCELLED'
            };
            const rxCheck = verifier.verifyPrescriptionWorkflow(cancelledPrescription, 'DISPENSE');
            assert.equal(rxCheck.valid, false);
            assert.ok(rxCheck.findings.some(f => f.code === 'DISPENSING_CANCELLED_PRESCRIPTION_FORBIDDEN'));

            // إجراء سريري مقترح من الذكاء الاصطناعي بدون مراجعة طبيب مرخص
            const aiRecommendation = {
                recommendationType: 'ADJUST_DOSAGE_PROTOCOL',
                hasLicensedPhysicianApproval: false,
                reviewerLicenseNumber: null
            };
            const aiGuardCheck = verifier.verifyAiClinicalGuard(aiRecommendation);
            assert.equal(aiGuardCheck.approved, false);
            assert.ok(aiGuardCheck.findings.some(f => f.code === 'AI_CLINICAL_ACTION_MISSING_HUMAN_APPROVAL'));
        });
    });

    // 3. Government & Public Services Systems Verification
    describe('3. Government & Public Services: Cases, Approvals, Anti-Self-Approval & Privacy', () => {
        it('should detect duplicate citizen IDs and block review stage bypass in government cases', () => {
            const verifier = new GovernmentVerifier();

            verifier.verifyCitizen({ id: 'CIT-1', nationalId: 'NAT-100200', fullName: 'Citizen A' });
            const dupCitizen = verifier.verifyCitizen({ id: 'CIT-2', nationalId: 'NAT-100200', fullName: 'Citizen B' });
            assert.equal(dupCitizen.valid, false);
            assert.ok(dupCitizen.findings.some(f => f.code === 'DUPLICATE_NATIONAL_ID_DETECTED'));

            // محاولة تجاوز مرحلة المراجعة (Application مباشرة إلى Approved)
            const bypassTransition = verifier.verifyCaseTransition(
                GOVERNMENT_CASE_STATES.APPLICATION,
                GOVERNMENT_CASE_STATES.APPROVED
            );
            assert.equal(bypassTransition.valid, false);
            assert.ok(bypassTransition.findings.some(f => f.code === 'GOVERNMENT_REVIEW_STAGE_BYPASSED'));
        });

        it('should strictly prohibit self-approval and block cross-citizen case access (Anti-IDOR)', () => {
            const verifier = new GovernmentVerifier();
            const caseRecord = {
                caseId: 'CASE-2026-99',
                applicantCitizenId: 'CITIZEN-OFFICER-X',
                requiredOfficerRole: 'DIRECTOR_GENERAL',
                jurisdictionAgencyId: 'AGENCY-TAX'
            };

            // 1. الموظف يحاول اعتماد طلبه الشخصي (Anti-Self-Approval)
            const selfApproveOfficer = {
                officerId: 'CITIZEN-OFFICER-X',
                officerRole: 'DIRECTOR_GENERAL',
                agencyId: 'AGENCY-TAX'
            };
            const authCheck = verifier.verifyApprovalAuthority(caseRecord, selfApproveOfficer);
            assert.equal(authCheck.authorized, false);
            assert.ok(authCheck.findings.some(f => f.code === 'SELF_APPROVAL_VIOLATION'));

            // 2. مواطن يحاول الوصول لملف مواطن آخر
            const citizenActor = { actorId: 'USER-CIT-2', role: 'CITIZEN', citizenId: 'CITIZEN-Y' };
            const idorCheck = verifier.verifyCitizenDataIsolation(citizenActor, caseRecord);
            assert.equal(idorCheck.authorized, false);
            assert.ok(idorCheck.findings.some(f => f.code === 'CROSS_CITIZEN_CASE_ACCESS_IDOR'));
        });
    });

    // 4. HR & Payroll Systems Verification
    describe('4. HR & Payroll: Lifecycle, Leaves, Payroll Invariants & Privacy', () => {
        it('should detect duplicate employee tax IDs and verify legal employment transitions', () => {
            const verifier = new HrPayrollVerifier();

            verifier.verifyEmployee({ id: 'EMP-1', nationalTaxId: 'TAX-9988', organizationId: 'ORG-MAIN', status: 'ACTIVE' });
            const dupEmp = verifier.verifyEmployee({ id: 'EMP-2', nationalTaxId: 'TAX-9988', organizationId: 'ORG-MAIN', status: 'ACTIVE' });
            assert.equal(dupEmp.valid, false);
            assert.ok(dupEmp.findings.some(f => f.code === 'DUPLICATE_EMPLOYEE_TAX_ID'));

            // تحول قانوني
            const validTrans = verifier.verifyEmploymentTransition(EMPLOYMENT_STATES.ACTIVE, EMPLOYMENT_STATES.ON_LEAVE);
            assert.equal(validTrans.valid, true);

            // تحول محظور
            const invalidTrans = verifier.verifyEmploymentTransition(EMPLOYMENT_STATES.TERMINATED, EMPLOYMENT_STATES.ACTIVE);
            assert.equal(invalidTrans.valid, false);
            assert.ok(invalidTrans.findings.some(f => f.code === 'ILLEGAL_EMPLOYMENT_LIFECYCLE_TRANSITION'));
        });

        it('should block leave requests exceeding available balance or having overlapping periods', () => {
            const verifier = new HrPayrollVerifier();

            // رصيد غير كافٍ
            const badBalance = verifier.verifyLeaveRequest({
                id: 'LEAVE-1',
                employeeId: 'EMP-10',
                requestedDays: 20,
                startDate: '2026-11-01',
                endDate: '2026-11-20'
            }, { availableDays: 10 });
            assert.equal(badBalance.valid, false);
            assert.ok(badBalance.findings.some(f => f.code === 'INSUFFICIENT_LEAVE_BALANCE'));

            // إجازة متداخلة
            verifier.approvedLeaves.push({ employeeId: 'EMP-10', startDate: '2026-12-01', endDate: '2026-12-10' });
            const overlapping = verifier.verifyLeaveRequest({
                id: 'LEAVE-2',
                employeeId: 'EMP-10',
                requestedDays: 5,
                startDate: '2026-12-05', // متداخل
                endDate: '2026-12-09'
            }, { availableDays: 30 });
            assert.equal(overlapping.valid, false);
            assert.ok(overlapping.findings.some(f => f.code === 'OVERLAPPING_LEAVE_PERIOD_COLLISION'));
        });

        it('should enforce net pay invariant, prevent duplicate payroll runs, and protect payroll privacy', () => {
            const verifier = new HrPayrollVerifier();
            const employeeProfile = { id: 'EMP-50', status: 'ACTIVE' };

            // خطأ رياضي في حساب صافي الراتب
            const badPayroll = {
                employeeId: 'EMP-50',
                periodKey: '2026-10',
                grossPay: 5000,
                deductions: [
                    { type: 'TAX', amount: 500 },
                    { type: 'INSURANCE', amount: 300 }
                ],
                claimedNetPay: 4500 // المتوقع 5000 - 800 = 4200 وليس 4500
            };
            const netPayCheck = verifier.verifyPayrollRun(badPayroll, employeeProfile);
            assert.equal(netPayCheck.valid, false);
            assert.ok(netPayCheck.findings.some(f => f.code === 'PAYROLL_NET_PAY_INVARIANT_MISMATCH'));

            // تشغيل سليم للراتب
            const validPayroll = {
                ...badPayroll,
                claimedNetPay: 4200
            };
            const firstRun = verifier.verifyPayrollRun(validPayroll, employeeProfile);
            assert.equal(firstRun.valid, true);

            // تكرار نفس المسير لنفس الشهر
            const duplicateRun = verifier.verifyPayrollRun(validPayroll, employeeProfile);
            assert.equal(duplicateRun.valid, false);
            assert.ok(duplicateRun.findings.some(f => f.code === 'DUPLICATE_PAYROLL_PROCESSING_DETECTED'));

            // فحص خصوصية الرواتب ومنع الموظف من رؤية راتب زميله
            const actorEmp = { actorId: 'EMP-99', role: 'EMPLOYEE' };
            const privCheck = verifier.verifyPayrollPrivacy(actorEmp, 'EMP-50');
            assert.equal(privCheck.authorized, false);
            assert.ok(privCheck.findings.some(f => f.code === 'UNAUTHORIZED_PAYROLL_DATA_ACCESS_IDOR'));
        });
    });
});
