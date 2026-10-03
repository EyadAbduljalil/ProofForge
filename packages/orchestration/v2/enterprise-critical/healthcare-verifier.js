/**
 * @file healthcare-verifier.js
 * @description WebForge V2.6 — Healthcare & Medical Systems Technical Verification Engine
 * محرك التحقق من الهياكل والعمليات الفنية للأنظمة الصحية وتدقيق الخصوصية والذكاء الاصطناعي
 * تنبيه تنظيمي حاسم: هذا المحرك يقوم بالتحقق الفني والهيكلي فقط ولا يقدم أي أحكام طبية أو إكلينيكية
 */

class HealthcareVerifier {
    constructor() {
        this.registeredPatients = new Map(); // identifier -> patientId
        this.appointments = []; // { id, patientId, providerId, startTime, endTime, status }
        this.dispensedPrescriptions = new Set(); // prescriptionId
    }

    /**
     * التحقق من عزل بيانات المرضى ومنع الوصول غير المصرح به (Anti-IDOR / Patient Isolation)
     */
    verifyPatientIsolation(requestActor, targetPatient, assignedRelationships = []) {
        const findings = [];
        const { actorId, role } = requestActor;
        const { id: patientId, assignedProviderId } = targetPatient;

        if (role === 'SUPER_ADMIN_AUDITOR') {
            return { authorized: true, findings: [] };
        }

        // فحص علاقة الطبيب المعالج بالمريض
        const hasDirectAssignment = assignedProviderId === actorId || assignedRelationships.some(r => r.patientId === patientId && r.providerId === actorId);

        if (!hasDirectAssignment) {
            findings.push({
                code: 'UNAUTHORIZED_PATIENT_RECORD_ACCESS_IDOR',
                severity: 'CRITICAL',
                actorId,
                patientId,
                message: `محاولة وصول غير مصرح بها لسجل المريض: الفاعل (${actorId}) ليس الطبيب أو مقدم الرعاية المخصص للمريض (${patientId})`
            });
            return { authorized: false, findings };
        }

        return { authorized: true, findings: [] };
    }

    /**
     * التحقق من سلامة السجلات الطبية والنسخ (Medical Record Integrity)
     */
    verifyMedicalRecord(record, patient) {
        const findings = [];
        const { id, patientId, authorId, timestamp, version, isFinalized, modificationAttempt } = record;

        if (!id || !authorId || !timestamp) {
            findings.push({
                code: 'INCOMPLETE_MEDICAL_RECORD_METADATA',
                severity: 'HIGH',
                message: 'السجل الطبي يفتقد إلى معرف المؤلف أو الختم الزمني الكنسي'
            });
        }

        // فحص السجلات اليتيمة (Orphan Record)
        if (!patient || patient.id !== patientId) {
            findings.push({
                code: 'ORPHAN_MEDICAL_RECORD_PATIENT_MISMATCH',
                severity: 'CRITICAL',
                recordPatientId: patientId,
                actualPatientId: patient ? patient.id : null,
                message: 'السجل الطبي غير مرتبط بمريض صالح أو يشير إلى مريض غير موجود'
            });
        }

        // منع تعديل السجلات الطبية المغلقة والنهائية دون ملحق رسمي (Addendum)
        if (isFinalized && modificationAttempt && !record.addendumAuthorized) {
            findings.push({
                code: 'MODIFICATION_OF_FINALIZED_MEDICAL_RECORD_FORBIDDEN',
                severity: 'CRITICAL',
                recordId: id,
                version,
                message: 'حظر تعديل سجل طبي تم إغلاقه واعتماده نهائياً؛ يلزم إضافة ملحق طبي مستقل (Addendum)'
            });
        }

        return {
            valid: findings.length === 0,
            recordId: id,
            findings
        };
    }

    /**
     * التحقق من المواعيد ومنع الحجز المزدوج (Anti-Double-Booking Verification)
     */
    verifyAppointment(appointmentRequest, existingAppointments = null) {
        const findings = [];
        const { id, patientId, providerId, startTime, endTime } = appointmentRequest;
        const currentAppointments = existingAppointments || this.appointments;

        const reqStart = new Date(startTime).getTime();
        const reqEnd = new Date(endTime).getTime();

        if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
            findings.push({
                code: 'INVALID_APPOINTMENT_TIME_WINDOW',
                severity: 'HIGH',
                startTime,
                endTime,
                message: 'النافذة الزمنية للموعد الطبي غير صالحة أو تاريخ الانتهاء يسبق البداية'
            });
            return { valid: false, findings };
        }

        // فحص التعارض الزمني للطبيب أو المريض (Overlap Detection)
        for (const app of currentAppointments) {
            if (app.id === id || app.status === 'CANCELLED') continue;

            const appStart = new Date(app.startTime).getTime();
            const appEnd = new Date(app.endTime).getTime();

            // شرط التداخل: StartA < EndB AND EndA > StartB
            const isOverlapping = reqStart < appEnd && reqEnd > appStart;

            if (isOverlapping) {
                if (app.providerId === providerId) {
                    findings.push({
                        code: 'PROVIDER_DOUBLE_BOOKING_COLLISION',
                        severity: 'CRITICAL',
                        providerId,
                        conflictingAppointmentId: app.id,
                        message: `تعارض حجز مزدوج للطبيب (${providerId}): الطبيب مرتبط بموعد آخر في نفس الفترة الزمنية`
                    });
                }
                if (app.patientId === patientId) {
                    findings.push({
                        code: 'PATIENT_DOUBLE_BOOKING_COLLISION',
                        severity: 'CRITICAL',
                        patientId,
                        conflictingAppointmentId: app.id,
                        message: `تعارض حجز مزدوج للمريض (${patientId}): المريض لديه موعد مجدول في نفس الفترة الزمنية`
                    });
                }
            }
        }

        if (findings.length === 0 && !existingAppointments) {
            this.appointments.push({ id, patientId, providerId, startTime, endTime, status: 'SCHEDULED' });
        }

        return {
            valid: findings.length === 0,
            appointmentId: id,
            findings
        };
    }

    /**
     * التحقق من سلامة نتائج المختبر وربطها بالطلب (Lab Result Verification)
     */
    verifyLabResult(labResult, labOrder) {
        const findings = [];

        if (!labOrder || labOrder.id !== labResult.orderId) {
            findings.push({
                code: 'ORPHAN_LAB_RESULT_NO_ORDER',
                severity: 'CRITICAL',
                resultOrderId: labResult.orderId,
                message: 'النتيجة المخبرية غير مرتبطة بأمر فحص طبي صالح ومعتمد'
            });
        }

        if (labOrder && labOrder.patientId !== labResult.patientId) {
            findings.push({
                code: 'LAB_RESULT_PATIENT_MISMATCH',
                severity: 'CRITICAL',
                orderPatientId: labOrder.patientId,
                resultPatientId: labResult.patientId,
                message: 'معرف المريض في النتيجة المخبرية لا يطابق المريض المسجل في أمر الفحص الأصلي'
            });
        }

        return {
            valid: findings.length === 0,
            findings
        };
    }

    /**
     * التحقق من السلامة الهيكلية للوصفة الطبية (Prescription Workflow Integrity)
     */
    verifyPrescriptionWorkflow(prescription, action = 'DISPENSE') {
        const findings = [];
        const { id, patientId, authorId, medicationName, dosage, status } = prescription;

        if (!id || !patientId || !authorId || !medicationName || !dosage) {
            findings.push({
                code: 'INCOMPLETE_PRESCRIPTION_DATA',
                severity: 'CRITICAL',
                message: 'الوصفة الطبية تفتقد إلى بيانات إلزامية (اسم الدواء، الجرعة، أو الطبيب المصرح)'
            });
        }

        if (action === 'DISPENSE') {
            if (status === 'CANCELLED') {
                findings.push({
                    code: 'DISPENSING_CANCELLED_PRESCRIPTION_FORBIDDEN',
                    severity: 'CRITICAL',
                    prescriptionId: id,
                    message: 'محاولة صرف وصفة طبية ملغاة رسمياً'
                });
            }

            if (this.dispensedPrescriptions.has(id)) {
                findings.push({
                    code: 'PRESCRIPTION_ALREADY_DISPENSED',
                    severity: 'CRITICAL',
                    prescriptionId: id,
                    message: 'تم صرف هذه الوصفة الطبية مسبقاً ولا يجوز تكرار صرفها دون إعادة تفويض'
                });
            } else if (findings.length === 0) {
                this.dispensedPrescriptions.add(id);
            }
        }

        return {
            valid: findings.length === 0,
            prescriptionId: id,
            findings
        };
    }

    /**
     * حوكمة الذكاء الاصطناعي في المنظومة الصحية (AI Clinical Decision Guard)
     * Invariant: AI Clinical Recommendation MUST NOT execute without licensed human review (HITL)
     */
    verifyAiClinicalGuard(aiRecommendation) {
        const findings = [];
        const { recommendationType, hasLicensedPhysicianApproval, reviewerLicenseNumber } = aiRecommendation;

        if (!hasLicensedPhysicianApproval || !reviewerLicenseNumber) {
            findings.push({
                code: 'AI_CLINICAL_ACTION_MISSING_HUMAN_APPROVAL',
                severity: 'CRITICAL',
                recommendationType,
                message: `محاولة تنفيذ توصية ذكاء اصطناعي سريرية (${recommendationType}) دون مراجعة واعتماد طبيب بشري مرخص (HITL Mandatory)`
            });
        }

        return {
            approved: findings.length === 0,
            requiresHumanApproval: true,
            findings
        };
    }
}

module.exports = {
    HealthcareVerifier
};
