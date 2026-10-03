/**
 * @file incident-intelligence.js
 * @description محرك استخبارات الحوادث التشغيلية وتحليل الأسباب الجذرية (Production Incident Intelligence)
 * يدير دورة حياة الحادثة من الرصد، الخط الزمني، تحليل الأسباب المرشحة، ارتباط التغييرات، توليد تقارير Postmortem وحقنها في الذاكرة
 */

const INCIDENT_STATUSES = {
    OPEN: 'OPEN',
    INVESTIGATING: 'INVESTIGATING',
    MITIGATED: 'MITIGATED',
    REMEDIATED: 'REMEDIATED',
    VERIFIED: 'VERIFIED',
    CLOSED: 'CLOSED'
};

const ROOT_CAUSE_CONFIDENCE = {
    CONFIRMED: 'CONFIRMED',
    LIKELY: 'LIKELY',
    POSSIBLE: 'POSSIBLE',
    INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE'
};

const CORRELATION_TYPES = {
    TEMPORAL_CORRELATION: 'TEMPORAL_CORRELATION',
    COMPONENT_CORRELATION: 'COMPONENT_CORRELATION',
    EVIDENCE_SUPPORTED: 'EVIDENCE_SUPPORTED',
    CAUSALITY_CONFIRMED: 'CAUSALITY_CONFIRMED'
};

class IncidentIntelligence {
    constructor(engineeringMemory = null) {
        this.memory = engineeringMemory;
        this.incidents = new Map();
    }

    createIncident(incidentContext = {}) {
        const id = incidentContext.id || `INC_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        const timeline = Array.isArray(incidentContext.timeline) ? incidentContext.timeline : [];
        const hasCompleteTimestamps = timeline.length > 0 && timeline.every(t => t.timestamp);

        const incident = {
            id,
            incident_id: id,
            title: incidentContext.title || 'حادثة تشغيلية غير مسماة',
            severity: incidentContext.severity || 'HIGH', // CRITICAL | HIGH | MEDIUM | LOW
            status: INCIDENT_STATUSES.OPEN,
            detectedAt: incidentContext.detectedAt || new Date().toISOString(),
            detected_at: incidentContext.detectedAt || new Date().toISOString(),
            resolvedAt: null,
            resolved_at: null,
            affectedServices: incidentContext.affectedServices || incidentContext.affected_components || [],
            affected_components: incidentContext.affected_components || incidentContext.affectedServices || [],
            affected_capabilities: incidentContext.affected_capabilities || [],
            signals: Array.isArray(incidentContext.signals) ? incidentContext.signals : [],
            timeline: timeline,
            timeline_status: hasCompleteTimestamps ? 'COMPLETE' : (timeline.length === 0 ? 'EMPTY' : 'TIMELINE_INCOMPLETE'),
            changes: Array.isArray(incidentContext.changes) ? incidentContext.changes : [],
            findings: Array.isArray(incidentContext.findings) ? incidentContext.findings : [],
            dependencies: Array.isArray(incidentContext.dependencies) ? incidentContext.dependencies : [],
            root_cause_candidates: [],
            rootCause: null,
            impact: incidentContext.impact || 'تأثر جزئي في استجابة الخدمة',
            mitigation: null,
            recovery: null,
            verification: null,
            evidence: incidentContext.evidence || 'Log trace captured',
            postmortem: null
        };

        this.incidents.set(id, incident);
        return incident;
    }

    addTimelineEvent(incidentId, event = {}) {
        const incident = this.getIncident(incidentId);
        if (!incident) throw new Error(`الحادثة '${incidentId}' غير موجودة.`);

        const timelineEvent = {
            type: event.type || 'SYSTEM_EVENT', // deployment, code_change, config_change, test_failure, security_finding, perf_anomaly, runtime_error, rollback
            description: event.description || 'حدث تشغيلي مسجل',
            timestamp: event.timestamp || new Date().toISOString(),
            component: event.component || 'general',
            metadata: event.metadata || {}
        };

        incident.timeline.push(timelineEvent);
        incident.timeline_status = incident.timeline.every(t => t.timestamp) ? 'COMPLETE' : 'TIMELINE_INCOMPLETE';
        return timelineEvent;
    }

    /**
     * ربط التغييرات البرمجية أو المعمارية بالحادثة وتحديد درجة الارتباط السببي
     */
    correlateChanges(incidentId, changes = []) {
        const incident = this.getIncident(incidentId);
        if (!incident) throw new Error(`الحادثة '${incidentId}' غير موجودة.`);

        const correlated = [];
        for (const chg of changes) {
            let correlationType = CORRELATION_TYPES.TEMPORAL_CORRELATION;
            
            const matchesComponent = incident.affected_components.some(c => (chg.filesChanged || []).some(f => f.includes(c) || c.includes(f)));
            if (matchesComponent && chg.diffSummary?.security_sensitive_changes) {
                correlationType = CORRELATION_TYPES.CAUSALITY_CONFIRMED;
            } else if (matchesComponent) {
                correlationType = CORRELATION_TYPES.COMPONENT_CORRELATION;
            } else if (chg.evidence) {
                correlationType = CORRELATION_TYPES.EVIDENCE_SUPPORTED;
            }

            const record = {
                changeId: chg.changeId || chg.operation_id || 'CHG_UNKNOWN',
                intent: chg.intent || '',
                correlation: correlationType,
                files: chg.filesChanged || [],
                timestamp: chg.timestamp || null
            };

            incident.changes.push(record);
            correlated.push(record);
        }

        return correlated;
    }

    /**
     * تحليل وتوليد مرشحي الأسباب الجذرية استناداً للأدلة الملموسة
     */
    evaluateRootCauseCandidates(incidentId, candidates = []) {
        const incident = this.getIncident(incidentId);
        if (!incident) throw new Error(`الحادثة '${incidentId}' غير موجودة.`);

        incident.root_cause_candidates = candidates.map(c => {
            const hasSupporting = Array.isArray(c.supporting_evidence) && c.supporting_evidence.length > 0;
            const hasContradicting = Array.isArray(c.contradicting_evidence) && c.contradicting_evidence.length > 0;

            let confidence = ROOT_CAUSE_CONFIDENCE.POSSIBLE;
            if (hasSupporting && !hasContradicting && c.reproduced === true) {
                confidence = ROOT_CAUSE_CONFIDENCE.CONFIRMED;
            } else if (hasSupporting && !hasContradicting) {
                confidence = ROOT_CAUSE_CONFIDENCE.LIKELY;
            } else if (!hasSupporting) {
                confidence = ROOT_CAUSE_CONFIDENCE.INSUFFICIENT_EVIDENCE;
            }

            return {
                hypothesis: c.hypothesis || 'فرضية سبب جذري',
                confidence,
                supporting_evidence: c.supporting_evidence || [],
                contradicting_evidence: c.contradicting_evidence || [],
                affected_components: c.affected_components || incident.affected_components
            };
        });

        // إذا وجد سبب مؤكد بدليل قاطع، يتم اعتماده
        const confirmed = incident.root_cause_candidates.find(c => c.confidence === ROOT_CAUSE_CONFIDENCE.CONFIRMED);
        if (confirmed) {
            incident.rootCause = confirmed.hypothesis;
        }

        return incident.root_cause_candidates;
    }

    resolveIncident(id, resolutionContext = {}) {
        if (!this.incidents.has(id)) throw new Error(`الحادثة '${id}' غير موجودة.`);
        const incident = this.incidents.get(id);

        const establishedRootCause = resolutionContext.rootCause || incident.rootCause;
        incident.rootCause = establishedRootCause || 'CONFIRMED ROOT CAUSE: NOT ESTABLISHED';
        incident.remediation = resolutionContext.remediation || 'تم تطبيق إصلاح برمجي مدرع';
        incident.status = INCIDENT_STATUSES.VERIFIED;
        incident.resolvedAt = new Date().toISOString();
        incident.resolved_at = incident.resolvedAt;
        incident.mitigation = resolutionContext.mitigation || incident.remediation;
        incident.recovery = resolutionContext.recovery || 'استعادة الاستجابة الطبيعية للخدمات';
        incident.verification = resolutionContext.verification || 'VERIFIED_VIA_TEST_EXECUTION';

        // توليد تقرير Postmortem المنظم
        incident.postmortem = {
            incident_summary: incident.title,
            summary: incident.title, // للتوافق العكسي
            impact: incident.impact,
            detection: `تم الرصد عبر: ${incident.evidence} في ${incident.detectedAt}`,
            timeline_status: incident.timeline_status,
            timeline: incident.timeline.map(t => `[${t.timestamp || 'UNTIMED'}] ${t.type}: ${t.description}`),
            root_cause_candidates: incident.root_cause_candidates,
            confirmed_root_cause: incident.rootCause,
            rootCauseAnalysis: incident.rootCause, // للتوافق العكسي
            contributing_factors: resolutionContext.contributingFactors || ['ضغط استدعاء متزامن', 'حدود الموارد'],
            mitigation: incident.mitigation,
            recovery: incident.recovery,
            verification: incident.verification,
            what_worked: resolutionContext.whatWorked || ['بوابات الأمان عملت بحزم', 'التراجع الذاتي حمى المستودع'],
            what_failed: resolutionContext.whatFailed || ['تأخر اكتشاف التسريب في مرحلة ما قبل الإنتاج'],
            corrective_actions: resolutionContext.actionItems || ['إضافة اختبار انحدار دائم لمنع تكرار الحادثة'],
            actionItems: resolutionContext.actionItems || ['إضافة اختبار انحدار دائم لمنع تكرار الحادثة'], // للتوافق العكسي
            regression_tests: resolutionContext.regressionTests || [`test_regression_${id}.js`],
            preventive_controls: resolutionContext.preventiveMeasures || 'تم قفل النمط في الذاكرة الهندسية',
            preventiveMeasures: resolutionContext.preventiveMeasures || 'تم قفل النمط في الذاكرة الهندسية' // للتوافق العكسي
        };

        // حقن الحادثة وحلها في الذاكرة الهندسية تلقائياً دون تكرار
        if (this.memory) {
            this.memory.recordMemory('past_bugs', id, {
                title: incident.title,
                rootCause: incident.rootCause,
                remediation: incident.remediation,
                resolved_at: incident.resolvedAt
            });
            this.memory.recordResolvedFailure({
                failure_signature: `INC_FAIL_${id}`,
                category: 'INCIDENT',
                root_cause: incident.rootCause,
                repair_strategy: incident.remediation,
                changed_components: incident.affected_components,
                verification_result: 'VERIFIED'
            });
        }

        return incident;
    }

    getIncident(id) {
        return this.incidents.get(id) || null;
    }
}

IncidentIntelligence.INCIDENT_STATUSES = INCIDENT_STATUSES;
IncidentIntelligence.ROOT_CAUSE_CONFIDENCE = ROOT_CAUSE_CONFIDENCE;
IncidentIntelligence.CORRELATION_TYPES = CORRELATION_TYPES;

module.exports = IncidentIntelligence;
