/**
 * @file audit-intelligence.js
 * @description WebForge V2 — Audit Intelligence, Readiness Assessment, Risk Classification, Exceptions & ADRs
 * يدير تاريخ ومقارنة التدقيق، تقييم الجاهزية للإنتاج عبر 9 أبعاد، تصنيف المخاطر، استثناءات الحوكمة، وسجلات القرارات المعمارية ADRs.
 */

const crypto = require('crypto');

class ExceptionManager {
    constructor() {
        this.exceptions = new Map();
    }

    /**
     * تسجيل استثناء / إعفاء رسمي مع ضوابط معوضة
     */
    grantException(config = {}) {
        if (!config.rule || !config.reason || !config.compensatingControl) {
            throw new Error('الاستثناء يتطلب تحديد القاعدة، والمبرر الصريح، والضابط المعوض.');
        }

        const id = `EXP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const record = {
            id,
            rule: config.rule,
            reason: config.reason,
            scope: config.scope || 'PROJECT_GLOBAL',
            risk: config.risk || 'MEDIUM',
            compensatingControl: config.compensatingControl,
            owner: config.owner || 'SecOps_Team',
            approval: config.approval || 'APPROVED',
            grantedAt: new Date().toISOString(),
            expiresAt: config.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
            status: 'ACTIVE'
        };

        this.exceptions.set(id, record);
        return record;
    }

    /**
     * فحص انتهاء صلاحية الاستثناءات تلقائياً لمنع الاستثناءات الأبدية
     */
    checkExpiration() {
        const now = new Date();
        const results = [];
        for (const [id, exp] of this.exceptions.entries()) {
            if (new Date(exp.expiresAt) < now && exp.status === 'ACTIVE') {
                exp.status = 'EXPIRED';
                results.push({ id, status: 'EXPIRED', rule: exp.rule });
            }
        }
        return results;
    }

    isRuleExempted(ruleId) {
        this.checkExpiration();
        for (const exp of this.exceptions.values()) {
            if (exp.rule === ruleId && exp.status === 'ACTIVE') {
                return { exempted: true, exception: exp };
            }
        }
        return { exempted: false };
    }
}

class AuditHistoryTracker {
    constructor() {
        this.history = [];
    }

    recordAudit(auditRecord) {
        const record = {
            id: `AUD-${Date.now()}`,
            projectId: auditRecord.projectId || 'PRJ-DEFAULT',
            baselineId: auditRecord.baselineId || 'BSL-INITIAL',
            webforgeVersion: auditRecord.webforgeVersion || '2.0.0',
            timestamp: new Date().toISOString(),
            findings: auditRecord.findings || [],
            summary: auditRecord.summary || {},
            evidenceFingerprint: auditRecord.evidenceFingerprint || 'FINGERPRINT_MISSING',
            gateResult: auditRecord.gateResult || 'PASS'
        };
        this.history.push(record);
        return record;
    }

    getHistory(projectId = null) {
        if (projectId) return this.history.filter(h => h.projectId === projectId);
        return [...this.history];
    }
}

class AuditComparator {
    /**
     * مقارنة تدقيقين لكشف المكتشفات الجديدة والمحلولة والمتكررة
     */
    static compareAudits(auditA, auditB) {
        if (!auditA || !auditB) throw new Error('يلزم تمرير جلستي تدقيق للمقارنة.');

        const findingsA = new Map((auditA.findings || []).map(f => [f.id || f.rule || f, f]));
        const findingsB = new Map((auditB.findings || []).map(f => [f.id || f.rule || f, f]));

        const newFindings = [];
        const resolvedFindings = [];
        const recurringFindings = [];

        for (const [id, f] of findingsB.entries()) {
            if (findingsA.has(id)) {
                recurringFindings.push(f);
            } else {
                newFindings.push(f);
            }
        }

        for (const [id, f] of findingsA.entries()) {
            if (!findingsB.has(id)) {
                resolvedFindings.push(f);
            }
        }

        return {
            auditA: auditA.id,
            auditB: auditB.id,
            timestamp: new Date().toISOString(),
            diffSummary: {
                newCount: newFindings.length,
                resolvedCount: resolvedFindings.length,
                recurringCount: recurringFindings.length
            },
            newFindings,
            resolvedFindings,
            recurringFindings
        };
    }
}

class ProjectReadinessAssessment {
    /**
     * تقييم الجاهزية الشامل للإنتاج عبر الأبعاد التسعة المعمارية
     */
    static evaluateReadiness(inputs = {}) {
        const dimensions = {
            security: inputs.security !== false ? 'READY' : 'NEEDS_ATTENTION',
            engineering: inputs.engineering !== false ? 'READY' : 'NEEDS_ATTENTION',
            validation: inputs.validation !== false ? 'READY' : 'NEEDS_ATTENTION',
            accessibility: inputs.accessibility !== false ? 'READY' : 'NEEDS_ATTENTION',
            performance: inputs.performance !== false ? 'READY' : 'NEEDS_ATTENTION',
            reliability: inputs.reliability !== false ? 'READY' : 'NEEDS_ATTENTION',
            documentation: inputs.documentation !== false ? 'READY' : 'NEEDS_ATTENTION',
            evidence: inputs.evidence !== false ? 'READY' : 'NEEDS_ATTENTION',
            governance: inputs.governance !== false ? 'READY' : 'NEEDS_ATTENTION'
        };

        const allReady = Object.values(dimensions).every(v => v === 'READY');
        return {
            overallStatus: allReady ? 'PRODUCTION_READY' : 'CONDITIONAL_READINESS',
            dimensions,
            confidence: 'HIGH',
            evaluatedAt: new Date().toISOString(),
            limitations: inputs.limitations || []
        };
    }
}

class RiskClassifier {
    static classifyRisk(finding = {}) {
        const severity = finding.severity || 'LOW';
        const impact = finding.impact || 'MINIMAL';
        const exposure = finding.exposure || 'INTERNAL';

        let priority = 'P3';
        if (severity === 'CRITICAL' || severity === 'P0') priority = 'P0';
        else if (severity === 'HIGH' || severity === 'P1') priority = 'P1';
        else if (severity === 'MEDIUM' || severity === 'P2') priority = 'P2';

        return {
            findingId: finding.id || 'FND-UNKNOWN',
            severity,
            impact,
            exposure,
            priority,
            confidence: finding.confidence || 'HIGH',
            evaluatedAt: new Date().toISOString()
        };
    }
}

class EngineeringDecisionRecord {
    constructor(config = {}) {
        this.id = config.id || `ADR-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        this.title = config.title || 'قرار معماري بدون عنوان';
        this.decision = config.decision || '';
        this.context = config.context || '';
        this.alternatives = config.alternatives || [];
        this.rationale = config.rationale || '';
        this.constraints = config.constraints || [];
        this.consequences = config.consequences || [];
        this.affectedRules = config.affectedRules || [];
        this.status = config.status || 'ACCEPTED';
        this.date = config.date || new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            decision: this.decision,
            context: this.context,
            alternatives: this.alternatives,
            rationale: this.rationale,
            constraints: this.constraints,
            consequences: this.consequences,
            affectedRules: this.affectedRules,
            status: this.status,
            date: this.date
        };
    }
}

module.exports = {
    ExceptionManager,
    AuditHistoryTracker,
    AuditComparator,
    ProjectReadinessAssessment,
    RiskClassifier,
    EngineeringDecisionRecord
};
