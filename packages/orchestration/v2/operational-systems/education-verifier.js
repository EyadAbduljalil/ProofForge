/**
 * @file education-verifier.js
 * @description WebForge V2.7 — Education & Academic Systems Verification Engine
 * محرك التحقق من دورات حياة الطلاب والمقررات، سعة القاعات، المتطلبات السابقة، وحماية الدرجات الأكاديمية
 */

const ENROLLMENT_STATES = {
    APPLIED: 'APPLIED',
    ENROLLED: 'ENROLLED',
    WAITLISTED: 'WAITLISTED',
    DROPPED: 'DROPPED',
    COMPLETED: 'COMPLETED'
};

const ALLOWED_ENROLLMENT_TRANSITIONS = {
    [ENROLLMENT_STATES.APPLIED]: [ENROLLMENT_STATES.ENROLLED, ENROLLMENT_STATES.WAITLISTED, ENROLLMENT_STATES.DROPPED],
    [ENROLLMENT_STATES.WAITLISTED]: [ENROLLMENT_STATES.ENROLLED, ENROLLMENT_STATES.DROPPED],
    [ENROLLMENT_STATES.ENROLLED]: [ENROLLMENT_STATES.DROPPED, ENROLLMENT_STATES.COMPLETED],
    [ENROLLMENT_STATES.DROPPED]: [ENROLLMENT_STATES.ENROLLED], // إعادة التسجيل بعد الانسحاب
    [ENROLLMENT_STATES.COMPLETED]: []
};

class EducationVerifier {
    constructor() {
        this.registeredEnrollments = new Map(); // studentId:courseId:term -> status
        this.finalizedGrades = new Map(); // studentId:courseId -> grade
    }

    /**
     * التحقق من سعة المقرر والمقاعد المتاحة (Course Capacity Verification)
     */
    verifyCourseCapacity(course, currentEnrollmentCount, requestedSeats = 1, overrideAuthorized = false) {
        const findings = [];
        const { id: courseId, capacity = 30 } = course;

        const projectedTotal = currentEnrollmentCount + requestedSeats;
        if (projectedTotal > capacity && !overrideAuthorized) {
            findings.push({
                code: 'COURSE_CAPACITY_EXCEEDED',
                severity: 'HIGH',
                courseId,
                capacity,
                currentEnrollmentCount,
                requestedSeats,
                overflow: projectedTotal - capacity,
                message: `تجاوز السعة الاستيعابية للمقرر (${courseId}): السعة ${capacity} والمطلوب ${projectedTotal} دون استثناء معتمد`
            });
        }

        return {
            valid: findings.length === 0,
            courseId,
            availableSeats: Math.max(0, capacity - projectedTotal),
            findings
        };
    }

    /**
     * التحقق من استيفاء المتطلبات السابقة للمقرر (Prerequisites Verification)
     */
    verifyPrerequisites(studentCompletedCourseIds = [], coursePrerequisites = []) {
        const findings = [];
        const missingPrerequisites = [];

        for (const prereq of coursePrerequisites) {
            if (!studentCompletedCourseIds.includes(prereq)) {
                missingPrerequisites.push(prereq);
            }
        }

        if (missingPrerequisites.length > 0) {
            findings.push({
                code: 'PREREQUISITE_REQUIREMENT_UNMET',
                severity: 'CRITICAL',
                missingPrerequisites,
                message: `الطالب لم يستوفِ المتطلبات السابقة الإلزامية للمقرر: ${missingPrerequisites.join(', ')}`
            });
        }

        return {
            eligible: findings.length === 0,
            missingPrerequisites,
            findings
        };
    }

    /**
     * التحقق من انتقالات حالة التسجيل الأكاديمي
     */
    verifyEnrollmentTransition(currentState, nextState) {
        const findings = [];
        const allowed = ALLOWED_ENROLLMENT_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_ENROLLMENT_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة التسجيل الأكاديمي غير معروفة: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_ENROLLMENT_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `انتقال محظور في حالة التسجيل من ${currentState} إلى ${nextState}`
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
     * حماية الدرجات الأكاديمية ومنع التعديل غير المصرح به (Grade Tampering Guard)
     */
    verifyGradeModification(gradeRecord, modificationRequest, requestingActor) {
        const findings = [];
        const { studentId, courseId, isFinalized, grade } = gradeRecord;
        const { actorId, role } = requestingActor;
        const { newGrade, authorizedReason, signedByRegistrar } = modificationRequest;

        // فحص صلاحية الفاعل
        if (role !== 'INSTRUCTOR' && role !== 'REGISTRAR') {
            findings.push({
                code: 'UNAUTHORIZED_GRADE_MODIFIER_ROLE',
                severity: 'CRITICAL',
                actorId,
                role,
                message: `الفاعل (${actorId}) برتبة (${role}) غير مصرح له بتعديل الدرجات الأكاديمية`
            });
            return { valid: false, findings };
        }

        // فحص نطاق الدرجة الجديدة
        if (typeof newGrade !== 'number' || newGrade < 0 || newGrade > 100) {
            findings.push({
                code: 'INVALID_GRADE_VALUE_RANGE',
                severity: 'CRITICAL',
                newGrade,
                message: `قيمة الدرجة الأكاديمية يجب أن تكون رقماً بين 0 و 100: ${newGrade}`
            });
        }

        // حظر تعديل الدرجات المغلقة والنهائية دون توقيع رسمي من عمادة القبول والتسجيل
        if (isFinalized && !signedByRegistrar) {
            findings.push({
                code: 'UNAUTHORIZED_GRADE_TAMPERING_ATTEMPT',
                severity: 'CRITICAL',
                studentId,
                courseId,
                currentGrade: grade,
                attemptedGrade: newGrade,
                message: 'محاولة تعديل درجة أكاديمية معتمدة ونهائية دون توقيع واعتماد رسمي من عمادة التسجيل'
            });
        }

        return {
            valid: findings.length === 0,
            findings
        };
    }

    /**
     * مطابقة كشف الدرجات الرسمي مع السجل الأكاديمي المعتمد (Transcript Reconciliation)
     */
    verifyTranscriptReconciliation(transcriptCourses = [], authoritativeHistory = []) {
        const findings = [];
        const authMap = new Map();

        for (const item of authoritativeHistory) {
            authMap.set(item.courseId, item);
        }

        for (const tCourse of transcriptCourses) {
            const authRecord = authMap.get(tCourse.courseId);
            if (!authRecord) {
                findings.push({
                    code: 'TRANSCRIPT_ORPHAN_COURSE_DISCREPANCY',
                    severity: 'CRITICAL',
                    courseId: tCourse.courseId,
                    message: `المقرر (${tCourse.courseId}) مدون في كشف الدرجات ولكنه غير موجود في السجل الأكاديمي التاريخي المعتمد`
                });
                continue;
            }

            if (authRecord.grade !== tCourse.grade) {
                findings.push({
                    code: 'TRANSCRIPT_GRADE_MISMATCH',
                    severity: 'CRITICAL',
                    courseId: tCourse.courseId,
                    transcriptGrade: tCourse.grade,
                    authoritativeGrade: authRecord.grade,
                    message: `تضارب في الدرجة للمقرر (${tCourse.courseId}): المسجل في كشف الدرجات (${tCourse.grade}) يختلف عن السجل المعتمد (${authRecord.grade})`
                });
            }
        }

        return {
            reconciled: findings.length === 0,
            findings
        };
    }
}

module.exports = {
    ENROLLMENT_STATES,
    ALLOWED_ENROLLMENT_TRANSITIONS,
    EducationVerifier
};
