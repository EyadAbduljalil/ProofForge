/**
 * @file hr-payroll-verifier.js
 * @description WebForge V2.6 — HR & Payroll Systems Verification Engine
 * محرك التحقق من دورات حياة الموظفين، استحقاقات الإجازات، وحسابات الرواتب وثوابتها المحاسبية
 * تنبيه تنظيمي: هذا المحرك يقوم بالتحقق الحسابي والهيكلي ولا يدعي الامتثال لقوانين العمل والضرائب المحلية دون إثبات رسمي
 */

const EMPLOYMENT_STATES = {
    HIRED: 'HIRED',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    ON_LEAVE: 'ON_LEAVE',
    TERMINATED: 'TERMINATED'
};

const ALLOWED_HR_TRANSITIONS = {
    [EMPLOYMENT_STATES.HIRED]: [EMPLOYMENT_STATES.ACTIVE, EMPLOYMENT_STATES.TERMINATED],
    [EMPLOYMENT_STATES.ACTIVE]: [EMPLOYMENT_STATES.SUSPENDED, EMPLOYMENT_STATES.ON_LEAVE, EMPLOYMENT_STATES.TERMINATED],
    [EMPLOYMENT_STATES.SUSPENDED]: [EMPLOYMENT_STATES.ACTIVE, EMPLOYMENT_STATES.TERMINATED],
    [EMPLOYMENT_STATES.ON_LEAVE]: [EMPLOYMENT_STATES.ACTIVE, EMPLOYMENT_STATES.TERMINATED],
    [EMPLOYMENT_STATES.TERMINATED]: []
};

class HrPayrollVerifier {
    constructor() {
        this.registeredEmployees = new Map(); // nationalTaxId -> employeeId
        this.processedPayrollKeys = new Set(); // employeeId:periodKey
        this.approvedLeaves = []; // { employeeId, startDate, endDate }
    }

    /**
     * التحقق من ملف الموظف وعدم تكرار الهوية الضريبية
     */
    verifyEmployee(employee) {
        const findings = [];
        const { id, nationalTaxId, organizationId, status } = employee;

        if (!id || !nationalTaxId || !organizationId) {
            findings.push({
                code: 'INCOMPLETE_EMPLOYEE_PROFILE',
                severity: 'CRITICAL',
                message: 'ملف الموظف يفتقد إلى الرقم الضريبي أو معرف المنظمة الكنسي'
            });
        }

        if (nationalTaxId) {
            if (this.registeredEmployees.has(nationalTaxId) && this.registeredEmployees.get(nationalTaxId) !== id) {
                findings.push({
                    code: 'DUPLICATE_EMPLOYEE_TAX_ID',
                    severity: 'CRITICAL',
                    nationalTaxId,
                    existingEmployeeId: this.registeredEmployees.get(nationalTaxId),
                    newEmployeeId: id,
                    message: `تم اكتشاف تكرار للرقم الضريبي للموظف: ${nationalTaxId}`
                });
            } else {
                this.registeredEmployees.set(nationalTaxId, id);
            }
        }

        return {
            valid: findings.length === 0,
            employeeId: id,
            findings
        };
    }

    /**
     * التحقق من انتقالات دورة حياة التوظيف
     */
    verifyEmploymentTransition(currentState, nextState) {
        const findings = [];
        const allowed = ALLOWED_HR_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_EMPLOYMENT_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة التوظيف الحالية غير معروفة: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_EMPLOYMENT_LIFECYCLE_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `انتقال غير مصرح به في دورة حياة التوظيف من ${currentState} إلى ${nextState}`
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
     * التحقق من طلبات الإجازات والأرصدة والتداخل الزمني
     */
    verifyLeaveRequest(leaveRequest, leaveLedger = {}) {
        const findings = [];
        const { id, employeeId, requestedDays, startDate, endDate } = leaveRequest;
        const { availableDays = 0 } = leaveLedger;

        // 1. فحص كفاية رصيد الإجازات
        if (requestedDays > availableDays) {
            findings.push({
                code: 'INSUFFICIENT_LEAVE_BALANCE',
                severity: 'HIGH',
                requestedDays,
                availableDays,
                deficit: requestedDays - availableDays,
                message: `أيام الإجازة المطلوبة (${requestedDays}) تتجاوز رصيد الموظف المتاح (${availableDays})`
            });
        }

        // 2. فحص تداخل الإجازات للموظف (Overlapping Leave)
        const reqStart = new Date(startDate).getTime();
        const reqEnd = new Date(endDate).getTime();

        for (const approved of this.approvedLeaves) {
            if (approved.employeeId === employeeId) {
                const appStart = new Date(approved.startDate).getTime();
                const appEnd = new Date(approved.endDate).getTime();

                if (reqStart < appEnd && reqEnd > appStart) {
                    findings.push({
                        code: 'OVERLAPPING_LEAVE_PERIOD_COLLISION',
                        severity: 'CRITICAL',
                        employeeId,
                        conflictingLeave: approved,
                        message: `تداخل زمني: الموظف لديه إجازة معتمدة أخرى تتداخل مع الفترة المطلوبة (${startDate} إلى ${endDate})`
                    });
                }
            }
        }

        if (findings.length === 0) {
            this.approvedLeaves.push({ employeeId, startDate, endDate });
        }

        return {
            valid: findings.length === 0,
            remainingBalance: Math.max(0, availableDays - requestedDays),
            findings
        };
    }

    /**
     * التحقق من ثوابت الرواتب والاستقطاعات ومطابقة القيد المزدوج
     * Invariant: Net Pay = Gross Pay - Deductions & Anti-Duplicate Run
     */
    verifyPayrollRun(payrollRecord, employeeProfile) {
        const findings = [];
        const { employeeId, periodKey, grossPay, deductions = [], claimedNetPay } = payrollRecord;

        if (employeeProfile.status !== 'ACTIVE' && employeeProfile.status !== 'ON_LEAVE') {
            findings.push({
                code: 'PAYROLL_FOR_INACTIVE_EMPLOYEE',
                severity: 'CRITICAL',
                employeeId,
                status: employeeProfile.status,
                message: `محاولة احتساب راتب لموظف ليس في حالة نشطة: ${employeeProfile.status}`
            });
        }

        // منع تكرار معالجة الراتب لنفس الفترة
        const deduplicationKey = `${employeeId}:${periodKey}`;
        if (this.processedPayrollKeys.has(deduplicationKey)) {
            findings.push({
                code: 'DUPLICATE_PAYROLL_PROCESSING_DETECTED',
                severity: 'CRITICAL',
                deduplicationKey,
                message: `تمت معالجة راتب هذا الموظف مسبقاً لنفس الفترة المالية: ${periodKey}`
            });
            return { valid: false, findings };
        }

        let totalDeductions = 0;
        for (const ded of deductions) {
            if (ded.amount < 0) {
                findings.push({
                    code: 'NEGATIVE_PAYROLL_DEDUCTION',
                    severity: 'CRITICAL',
                    type: ded.type,
                    amount: ded.amount,
                    message: `قيمة استقطاع سالبة غير قانونية في مسير الراتب: ${ded.type}`
                });
            }
            totalDeductions += ded.amount;
        }

        // الحساب المتوقع لصافي الراتب
        const expectedNetPay = Math.max(0, grossPay - totalDeductions);
        if (Math.abs(expectedNetPay - claimedNetPay) > 0.01) {
            findings.push({
                code: 'PAYROLL_NET_PAY_INVARIANT_MISMATCH',
                severity: 'CRITICAL',
                grossPay,
                totalDeductions,
                expectedNetPay,
                claimedNetPay,
                discrepancy: claimedNetPay - expectedNetPay,
                message: `تضارب في حساب صافي الراتب: المتوقع ${expectedNetPay} والمسجل في المسير ${claimedNetPay}`
            });
        }

        if (findings.length === 0) {
            this.processedPayrollKeys.add(deduplicationKey);
        }

        return {
            valid: findings.length === 0,
            expectedNetPay,
            totalDeductions,
            findings
        };
    }

    /**
     * التحقق من سرية بيانات الرواتب وعزل الموظفين (Anti-IDOR / Payroll Privacy)
     */
    verifyPayrollPrivacy(requestActor, targetEmployeeId) {
        const findings = [];
        const { actorId, role } = requestActor;

        if (role === 'PAYROLL_ADMIN' || role === 'FINANCE_DIRECTOR') {
            return { authorized: true, findings: [] };
        }

        // الموظف العادي لا يجوز له الاطلاع على قسيمة راتب زميله
        if (actorId !== targetEmployeeId) {
            findings.push({
                code: 'UNAUTHORIZED_PAYROLL_DATA_ACCESS_IDOR',
                severity: 'CRITICAL',
                actorId,
                targetEmployeeId,
                message: `محاولة وصول غير مصرح بها لبيانات رواتب موظف آخر (IDOR): الموظف (${actorId}) حاول الاطلاع على راتب (${targetEmployeeId})`
            });
            return { authorized: false, findings };
        }

        return { authorized: true, findings: [] };
    }
}

module.exports = {
    EMPLOYMENT_STATES,
    ALLOWED_HR_TRANSITIONS,
    HrPayrollVerifier
};
