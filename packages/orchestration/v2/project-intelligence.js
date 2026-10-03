/**
 * @file project-intelligence.js
 * @description WebForge V2 — Project Context Intelligence & Baseline Management
 * يمثل نموذج ملف تعريف المشروع (Project Profile) ونموذج خط الأساس (Project Baseline)
 * وتصدير السياق بشكل آلي ومحايد للمكدس التقني.
 */

const crypto = require('crypto');

// فئات المشاريع القياسية المدعومة
const PROJECT_TYPES = {
    WEB_APPLICATION: 'Web Application',
    API: 'API / Microservice',
    ECOMMERCE: 'E-Commerce Platform',
    SAAS: 'SaaS Application',
    ENTERPRISE: 'Enterprise Application',
    MOBILE_HYBRID: 'Mobile / Hybrid App',
    INTERNAL_TOOL: 'Internal Tool / Dashboard',
    CONTENT_PLATFORM: 'Content / Media Platform',
    DATA_PLATFORM: 'Data / Analytics Platform'
};

const PROJECT_MATURITY_LEVELS = {
    L0_EXPLORATORY: 'L0_EXPLORATORY',
    L1_PROTOTYPE: 'L1_PROTOTYPE',
    L2_DEVELOPMENT: 'L2_DEVELOPMENT',
    L3_STAGING: 'L3_STAGING',
    L4_PRODUCTION_READY: 'L4_PRODUCTION_READY',
    L5_ENTERPRISE_HARDENED: 'L5_ENTERPRISE_HARDENED'
};

class ProjectProfile {
    constructor(config = {}) {
        this.id = config.id || `PRJ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        this.name = config.name || 'WebForge Unnamed Project';
        this.type = config.type || PROJECT_TYPES.WEB_APPLICATION;
        this.maturity = config.maturity || PROJECT_MATURITY_LEVELS.L2_DEVELOPMENT;
        this.detectedStack = config.detectedStack || { runtime: 'agnostic', frameworks: [], databases: [] };
        this.detectedCapabilities = config.detectedCapabilities || [];
        this.constraints = config.constraints || [];
        this.requirements = {
            security: config.requirements?.security || 'OWASP_ASVS_L2',
            accessibility: config.requirements?.accessibility || 'WCAG_2_2_AA',
            performance: config.requirements?.performance || 'CORE_WEB_VITALS',
            localization: config.requirements?.localization || 'LTR_RTL_BI_DIRECTIONAL',
            governance: config.requirements?.governance || 'P0_STRICT'
        };
        this.environment = {
            target: config.environment?.target || 'production',
            ci: config.environment?.ci || 'generic-ci',
            deployment: config.environment?.deployment || 'cloud-agnostic'
        };
        this.createdAt = config.createdAt || new Date().toISOString();
        this.metadata = config.metadata || {};
    }

    /**
     * حساب البصمة المشفرة لملف تعريف المشروع
     */
    getFingerprint() {
        const payload = JSON.stringify({
            id: this.id,
            name: this.name,
            type: this.type,
            maturity: this.maturity,
            requirements: this.requirements,
            constraints: this.constraints,
            environment: this.environment
        });
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    /**
     * تصدير بصيغة JSON قابلة للقراءة الآلية
     */
    toJSON() {
        return {
            $schema: 'https://webforge.dev/schemas/v2/project-profile.json',
            id: this.id,
            name: this.name,
            type: this.type,
            maturity: this.maturity,
            fingerprint: this.getFingerprint(),
            detectedStack: this.detectedStack,
            detectedCapabilities: this.detectedCapabilities,
            requirements: this.requirements,
            environment: this.environment,
            constraints: this.constraints,
            createdAt: this.createdAt,
            metadata: this.metadata
        };
    }

    /**
     * تصدير بصيغة YAML-compatible text
     */
    toYAML() {
        const json = this.toJSON();
        return Object.entries(json).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n');
    }
}

class ProjectBaseline {
    constructor(config = {}) {
        this.id = config.id || `BSL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        this.projectId = config.projectId || 'PRJ-DEFAULT';
        this.webforgeVersion = config.webforgeVersion || '2.0.0';
        this.timestamp = config.timestamp || new Date().toISOString();
        this.selectedRules = config.selectedRules || [];
        this.applicableRules = config.applicableRules || [];
        this.activeValidators = config.activeValidators || [];
        this.activeAdapters = config.activeAdapters || [];
        this.activeTemplates = config.activeTemplates || [];
        this.evidenceSnapshot = config.evidenceSnapshot || [];
        this.findingsSnapshot = config.findingsSnapshot || [];
        this.riskState = config.riskState || { critical: 0, high: 0, medium: 0, low: 0 };
        this.ruleVersions = config.ruleVersions || {};
        this.validatorVersions = config.validatorVersions || {};
    }

    /**
     * توليد بصمة خط الأساس المشفرة
     */
    getFingerprint() {
        const payload = JSON.stringify({
            projectId: this.projectId,
            selectedRules: [...this.selectedRules].sort(),
            applicableRules: [...this.applicableRules].sort(),
            activeValidators: [...this.activeValidators].sort(),
            activeAdapters: [...this.activeAdapters].sort(),
            riskState: this.riskState,
            webforgeVersion: this.webforgeVersion
        });
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    /**
     * مقارنة خط الأساس الحالي مع خط أساس آخر
     */
    compareTo(otherBaseline) {
        if (!otherBaseline) throw new Error('خط الأساس المستهدف للمقارنة غير موجود.');

        const addedRules = this.applicableRules.filter(r => !otherBaseline.applicableRules.includes(r));
        const removedRules = otherBaseline.applicableRules.filter(r => !this.applicableRules.includes(r));

        const thisFindings = new Set(this.findingsSnapshot.map(f => f.id || f));
        const otherFindings = new Set(otherBaseline.findingsSnapshot.map(f => f.id || f));

        const newFindings = [...thisFindings].filter(f => !otherFindings.has(f));
        const resolvedFindings = [...otherFindings].filter(f => !thisFindings.has(f));

        return {
            baselineA: otherBaseline.id,
            baselineB: this.id,
            identical: this.getFingerprint() === otherBaseline.getFingerprint(),
            ruleDiff: { addedRules, removedRules },
            findingDiff: { newFindings, resolvedFindings },
            riskDiff: {
                previous: otherBaseline.riskState,
                current: this.riskState
            }
        };
    }

    toJSON() {
        return {
            $schema: 'https://webforge.dev/schemas/v2/project-baseline.json',
            id: this.id,
            projectId: this.projectId,
            webforgeVersion: this.webforgeVersion,
            timestamp: this.timestamp,
            fingerprint: this.getFingerprint(),
            selectedRules: this.selectedRules,
            applicableRules: this.applicableRules,
            activeValidators: this.activeValidators,
            activeAdapters: this.activeAdapters,
            activeTemplates: this.activeTemplates,
            findingsCount: this.findingsSnapshot.length,
            riskState: this.riskState,
            ruleVersions: this.ruleVersions
        };
    }
}

module.exports = {
    ProjectProfile,
    ProjectBaseline,
    PROJECT_TYPES,
    PROJECT_MATURITY_LEVELS
};
