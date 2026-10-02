/**
 * @file incident-intelligence.js
 * @description محرك استخبارات الحوادث التشغيلية وتحليل الأسباب الجذرية (Production Incident Intelligence)
 * يدير دورة حياة الحادثة من الرصد والتشخيص والتحليل الجذري، والتصحيح، وتوليد تقرير ما بعد الحادثة (Postmortem) وحقنها في الذاكرة لمنع التكرار
 */

class IncidentIntelligence {
    constructor(engineeringMemory = null) {
        this.memory = engineeringMemory;
        this.incidents = new Map();
    }

    createIncident(incidentContext) {
        const id = incidentContext.id || `INC_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const incident = {
            id,
            title: incidentContext.title || 'حادثة تشغيلية غير مسماة',
            severity: incidentContext.severity || 'HIGH', // CRITICAL | HIGH | MEDIUM | LOW
            status: 'OPEN', // OPEN | INVESTIGATING | REMEDIATED | VERIFIED | CLOSED
            detectedAt: new Date().toISOString(),
            affectedServices: incidentContext.affectedServices || [],
            evidence: incidentContext.evidence || 'Log trace captured',
            rootCause: null,
            remediation: null,
            postmortem: null
        };

        this.incidents.set(id, incident);
        return incident;
    }

    resolveIncident(id, resolutionContext) {
        if (!this.incidents.has(id)) throw new Error(`الحادثة '${id}' غير موجودة.`);
        const incident = this.incidents.get(id);

        incident.rootCause = resolutionContext.rootCause || 'سبب تقني تم تشخيصه ومعالجته';
        incident.remediation = resolutionContext.remediation || 'تم تطبيق إصلاح برمجي مدرع';
        incident.status = 'VERIFIED';
        incident.resolvedAt = new Date().toISOString();

        // توليد تقرير Postmortem آلي
        incident.postmortem = {
            summary: incident.title,
            timeline: `رصد: ${incident.detectedAt} -> حل: ${incident.resolvedAt}`,
            rootCauseAnalysis: incident.rootCause,
            actionItems: resolutionContext.actionItems || ['إضافة اختبار انحدار دائم لمنع تكرار الحادثة'],
            preventiveMeasures: resolutionContext.preventiveMeasures || 'تم قفل النمط في الذاكرة الهندسية'
        };

        // حقن الحادثة وحلها في الذاكرة الهندسية تلقائياً
        if (this.memory) {
            this.memory.recordMemory('past_bugs', id, {
                title: incident.title,
                rootCause: incident.rootCause,
                remediation: incident.remediation
            });
            this.memory.recordMemory('successful_repair_patterns', `fix_${id}`, {
                fix: incident.remediation,
                regression_test: `test_${id}.js`
            });
        }

        return incident;
    }

    getIncident(id) {
        return this.incidents.get(id);
    }
}

module.exports = IncidentIntelligence;
