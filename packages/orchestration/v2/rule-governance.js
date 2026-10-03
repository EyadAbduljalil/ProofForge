/**
 * @file rule-governance.js
 * @description WebForge V2 — Rule Governance, Lifecycle, Versioning & Change Control
 * يدير إصدارات القواعد، وسجلات التعديل، ودورة الحياة (DRAFT -> ACTIVE -> DEPRECATED -> RETIRED)،
 * ومصفوفة التوافقية، وحوكمة التغييرات على النواة المعرفية.
 */

const RULE_STATUSES = {
    DRAFT: 'DRAFT',
    REVIEW: 'REVIEW',
    ACTIVE: 'ACTIVE',
    DEPRECATED: 'DEPRECATED',
    RETIRED: 'RETIRED',
    SUPERSEDED: 'SUPERSEDED'
};

const COMPATIBILITY_LEVELS = {
    COMPATIBLE: 'COMPATIBLE',
    CONDITIONALLY_COMPATIBLE: 'CONDITIONALLY_COMPATIBLE',
    INCOMPATIBLE: 'INCOMPATIBLE',
    DEPRECATED: 'DEPRECATED'
};

class RuleVersionManager {
    constructor() {
        this.ruleRegistry = new Map();
        this.changeLog = [];
    }

    registerRule(ruleConfig) {
        if (!ruleConfig.id) throw new Error('معرف القاعدة إلزامي.');
        const entry = {
            id: ruleConfig.id,
            version: ruleConfig.version || '1.0.0',
            status: ruleConfig.status || RULE_STATUSES.ACTIVE,
            effectiveDate: ruleConfig.effectiveDate || new Date().toISOString(),
            predecessor: ruleConfig.predecessor || null,
            successor: ruleConfig.successor || null,
            compatibility: ruleConfig.compatibility || COMPATIBILITY_LEVELS.COMPATIBLE,
            history: []
        };
        this.ruleRegistry.set(ruleConfig.id, entry);
        return entry;
    }

    /**
     * ترقية إصدار القاعدة وتوثيق التغيير
     */
    updateRuleVersion(ruleId, newVersion, changeReason, metadata = {}) {
        const rule = this.ruleRegistry.get(ruleId);
        if (!rule) throw new Error(`القاعدة ${ruleId} غير مسجلة.`);

        const oldVersion = rule.version;
        rule.version = newVersion;
        rule.effectiveDate = new Date().toISOString();

        const logEntry = {
            ruleId,
            oldVersion,
            newVersion,
            changeReason,
            changeType: metadata.changeType || 'MINOR_UPDATE',
            affectedValidators: metadata.affectedValidators || [],
            affectedTemplates: metadata.affectedTemplates || [],
            timestamp: new Date().toISOString()
        };

        rule.history.push(logEntry);
        this.changeLog.push(logEntry);
        return logEntry;
    }

    /**
     * تغيير حالة دورة حياة القاعدة
     */
    transitionStatus(ruleId, newStatus, successorId = null) {
        const rule = this.ruleRegistry.get(ruleId);
        if (!rule) throw new Error(`القاعدة ${ruleId} غير مسجلة.`);

        if (!Object.values(RULE_STATUSES).includes(newStatus)) {
            throw new Error(`حالة دورة الحياة ${newStatus} غير صالحة.`);
        }

        rule.status = newStatus;
        if (newStatus === RULE_STATUSES.SUPERSEDED && successorId) {
            rule.successor = successorId;
        }

        return {
            ruleId,
            status: newStatus,
            successor: rule.successor,
            timestamp: new Date().toISOString()
        };
    }

    getChangeLog(ruleId = null) {
        if (ruleId) {
            return this.changeLog.filter(c => c.ruleId === ruleId);
        }
        return [...this.changeLog];
    }
}

class CompatibilityManager {
    constructor() {
        this.compatibilityMatrix = new Map();
    }

    setCompatibility(sourceId, targetId, level, notes = '') {
        const key = `${sourceId}:::${targetId}`;
        this.compatibilityMatrix.set(key, {
            sourceId,
            targetId,
            level,
            notes,
            timestamp: new Date().toISOString()
        });
    }

    checkCompatibility(sourceId, targetId) {
        const key = `${sourceId}:::${targetId}`;
        if (this.compatibilityMatrix.has(key)) {
            return this.compatibilityMatrix.get(key);
        }
        // افتراض التوافقية بشكل قياسي ما لم يتم التصريح بغير ذلك
        return {
            sourceId,
            targetId,
            level: COMPATIBILITY_LEVELS.COMPATIBLE,
            notes: 'توافق افتراضي مستقر.'
        };
    }
}

class WebForgeChangeGovernance {
    constructor() {
        this.proposals = [];
    }

    /**
     * تقديم مقترح تعديل في نظام WebForge
     */
    proposeChange(proposal) {
        if (!proposal.title || !proposal.affectedComponents) {
            throw new Error('المقترح يجب أن يحدد العنوان والمكونات المتأثرة.');
        }

        const record = {
            id: `CHG-${Date.now()}`,
            title: proposal.title,
            affectedComponents: proposal.affectedComponents,
            riskLevel: proposal.riskLevel || 'LOW',
            compatibility: proposal.compatibility || COMPATIBILITY_LEVELS.COMPATIBLE,
            testsRequired: proposal.testsRequired || ['npm test'],
            evidence: proposal.evidence || [],
            approval: proposal.approval || 'PENDING_REVIEW',
            status: 'SUBMITTED',
            timestamp: new Date().toISOString()
        };

        this.proposals.push(record);
        return record;
    }

    approveChange(proposalId, approver = 'Architecture_Board') {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) throw new Error(`المقترح ${proposalId} غير موجود.`);
        proposal.approval = 'APPROVED';
        proposal.status = 'READY_FOR_INTEGRATION';
        proposal.approver = approver;
        proposal.approvedAt = new Date().toISOString();
        return proposal;
    }
}

module.exports = {
    RULE_STATUSES,
    COMPATIBILITY_LEVELS,
    RuleVersionManager,
    CompatibilityManager,
    WebForgeChangeGovernance
};
