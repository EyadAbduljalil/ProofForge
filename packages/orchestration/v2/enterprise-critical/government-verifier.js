/**
 * @file government-verifier.js
 * @description WebForge V2.6 — Government & Public Services Systems Verification Engine
 * محرك التحقق من المعاملات الحكومية، سير المستندات، تفويض الاعتمادات، وعزل البيانات
 */

const GOVERNMENT_CASE_STATES = {
    APPLICATION: 'APPLICATION',
    UNDER_REVIEW: 'UNDER_REVIEW',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED'
};

const ALLOWED_GOVERNMENT_TRANSITIONS = {
    [GOVERNMENT_CASE_STATES.APPLICATION]: [
        GOVERNMENT_CASE_STATES.UNDER_REVIEW,
        GOVERNMENT_CASE_STATES.REJECTED
    ],
    [GOVERNMENT_CASE_STATES.UNDER_REVIEW]: [
        GOVERNMENT_CASE_STATES.APPROVED,
        GOVERNMENT_CASE_STATES.REJECTED
    ],
    [GOVERNMENT_CASE_STATES.APPROVED]: [
        GOVERNMENT_CASE_STATES.COMPLETED
    ],
    [GOVERNMENT_CASE_STATES.REJECTED]: [
        GOVERNMENT_CASE_STATES.APPLICATION // إعادة التقديم
    ],
    [GOVERNMENT_CASE_STATES.COMPLETED]: []
};

class GovernmentVerifier {
    constructor() {
        this.registeredCitizens = new Map(); // nationalId -> citizenId
    }

    /**
     * التحقق من ملف المواطن وعدم تكرار الهوية
     */
    verifyCitizen(citizen) {
        const findings = [];
        const { id, nationalId, fullName } = citizen;

        if (!id || !nationalId) {
            findings.push({
                code: 'INVALID_CITIZEN_PROFILE',
                severity: 'CRITICAL',
                message: 'ملف المواطن يفتقد إلى الرقم الوطني أو المعرف الرسمي'
            });
        }

        if (nationalId) {
            if (this.registeredCitizens.has(nationalId) && this.registeredCitizens.get(nationalId) !== id) {
                findings.push({
                    code: 'DUPLICATE_NATIONAL_ID_DETECTED',
                    severity: 'CRITICAL',
                    nationalId,
                    existingCitizenId: this.registeredCitizens.get(nationalId),
                    newCitizenId: id,
                    message: `تم اكتشاف تكرار للرقم الوطني للمواطن: ${nationalId}`
                });
            } else {
                this.registeredCitizens.set(nationalId, id);
            }
        }

        return {
            valid: findings.length === 0,
            citizenId: id,
            findings
        };
    }

    /**
     * التحقق من انتقالات حالات المعاملة / القضية الحكومية
     */
    verifyCaseTransition(currentState, nextState, context = {}) {
        const findings = [];
        const allowed = ALLOWED_GOVERNMENT_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_GOVERNMENT_CASE_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة المعاملة الحكومية غير معترف بها: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_GOVERNMENT_CASE_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `انتقال محظور في حالة المعاملة الحكومية من ${currentState} إلى ${nextState}`
            });
        }

        // فحص تجاوز مرحلة المراجعة (Approval Bypass)
        if (currentState === GOVERNMENT_CASE_STATES.APPLICATION && nextState === GOVERNMENT_CASE_STATES.APPROVED) {
            findings.push({
                code: 'GOVERNMENT_REVIEW_STAGE_BYPASSED',
                severity: 'CRITICAL',
                message: 'حظر تجاوز مرحلة المراجعة والتدقيق والاعتماد المباشر من التقديم إلى القبول'
            });
        }

        // فحص اكتمال المستندات الإلزامية قبل الاعتماد
        if (nextState === GOVERNMENT_CASE_STATES.APPROVED && context.missingRequiredDocuments) {
            findings.push({
                code: 'APPROVAL_WITH_MISSING_REQUIRED_DOCUMENTS',
                severity: 'CRITICAL',
                missingDocs: context.missingRequiredDocuments,
                message: 'لا يجوز اعتماد المعاملة الحكومية في ظل وجود وثائق رسمية إلزامية مفقودة'
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
     * التحقق من سلطة الاعتماد ومنع الاعتماد الذاتي (Anti-Self-Approval Verification)
     */
    verifyApprovalAuthority(caseRecord, approvingOfficer) {
        const findings = [];
        const { caseId, applicantCitizenId, requiredOfficerRole, jurisdictionAgencyId } = caseRecord;
        const { officerId, officerRole, agencyId } = approvingOfficer;

        // 1. ثابت منع الاعتماد الذاتي: لا يجوز للموظف اعتماد طلبه الشخصي
        if (officerId === applicantCitizenId) {
            findings.push({
                code: 'SELF_APPROVAL_VIOLATION',
                severity: 'CRITICAL',
                officerId,
                caseId,
                message: `انتهاك أمني حرج: الموظف الحكومي (${officerId}) يحاول اعتماد معاملته الشخصية (Anti-Self-Approval)`
            });
        }

        // 2. التحقق من تطابق الرتبة / الصلاحية الإدارية
        if (requiredOfficerRole && officerRole !== requiredOfficerRole) {
            findings.push({
                code: 'INSUFFICIENT_OFFICER_APPROVAL_ROLE',
                severity: 'CRITICAL',
                currentRole: officerRole,
                requiredRole: requiredOfficerRole,
                message: `رتبة الموظف (${officerRole}) غير مؤهلة لاعتماد هذا النوع من المعاملات (المطلوب: ${requiredOfficerRole})`
            });
        }

        // 3. التحقق من عزل الوكالات الحكومية (Cross-Agency Access)
        if (jurisdictionAgencyId && agencyId !== jurisdictionAgencyId) {
            findings.push({
                code: 'CROSS_AGENCY_UNAUTHORIZED_APPROVAL',
                severity: 'CRITICAL',
                officerAgency: agencyId,
                caseAgency: jurisdictionAgencyId,
                message: `محاولة اعتماد معاملة تابعة لوكالة حكومية أخرى (${jurisdictionAgencyId}) بواسطة موظف من (${agencyId})`
            });
        }

        return {
            authorized: findings.length === 0,
            findings
        };
    }

    /**
     * التحقق من عزل بيانات المواطنين والقضايا (Citizen Data Isolation / IDOR)
     */
    verifyCitizenDataIsolation(requestActor, targetCase) {
        const findings = [];
        const { actorId, role, citizenId: sessionCitizenId } = requestActor;
        const { caseId, applicantCitizenId } = targetCase;

        if (role === 'GOVERNMENT_AUDITOR' || role === 'AUTHORIZED_OFFICER') {
            return { authorized: true, findings: [] };
        }

        // المواطن العادي لا يرى سوى قضاياه ومعاملاته الشخصية فقط
        if (sessionCitizenId && sessionCitizenId !== applicantCitizenId) {
            findings.push({
                code: 'CROSS_CITIZEN_CASE_ACCESS_IDOR',
                severity: 'CRITICAL',
                sessionCitizenId,
                applicantCitizenId,
                caseId,
                message: `محاولة وصول غير مصرح بها لمعاملة مواطن آخر (IDOR): المواطن (${sessionCitizenId}) حاول استعراض ملف (${applicantCitizenId})`
            });
            return { authorized: false, findings };
        }

        return { authorized: true, findings: [] };
    }
}

module.exports = {
    GOVERNMENT_CASE_STATES,
    ALLOWED_GOVERNMENT_TRANSITIONS,
    GovernmentVerifier
};
