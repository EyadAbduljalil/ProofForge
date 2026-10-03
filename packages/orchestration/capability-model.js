/**
 * @file capability-model.js
 * @description النموذج المعماري الموحد لتمثيل وتصنيف القدرات الهندسية (WebForge Formal Capability Model)
 * يميز بدقة صارمة بين: AVAILABLE, PARTIAL, UNAVAILABLE, NOT_DETECTED, NOT_APPLICABLE, ENVIRONMENT_LIMITATION, UNKNOWN
 */

const CAPABILITY_STATES = {
    AVAILABLE: 'AVAILABLE',
    PARTIAL: 'PARTIAL',
    UNAVAILABLE: 'UNAVAILABLE',
    NOT_DETECTED: 'NOT_DETECTED',
    NOT_APPLICABLE: 'NOT_APPLICABLE',
    ENVIRONMENT_LIMITATION: 'ENVIRONMENT_LIMITATION',
    NOT_TESTED: 'NOT_TESTED',
    UNKNOWN: 'UNKNOWN'
};

const CAPABILITY_DIMENSIONS = [
    'Language',
    'Framework',
    'Runtime',
    'Database',
    'Cache',
    'Queue',
    'API',
    'Authentication',
    'Authorization',
    'Testing',
    'Browser',
    'Build',
    'Deployment',
    'CICD',
    'Observability',
    'Security',
    'Localization',
    'RTL',
    'Design',
    'Performance',
    'Infrastructure'
];

class CapabilityModel {
    constructor(stackProfile = {}) {
        this.capabilities = new Map();
        this.timestamp = new Date().toISOString();
        this._buildModel(stackProfile);
    }

    _buildModel(stack) {
        for (const dim of CAPABILITY_DIMENSIONS) {
            this.capabilities.set(dim, {
                dimension: dim,
                state: CAPABILITY_STATES.NOT_DETECTED,
                technology: 'none',
                evidence: [],
                confidence: 'NOT_DETECTED',
                isApplicable: true,
                tested: false,
                notes: ''
            });
        }

        // تعيين القدرات المكتشفة بناءً على الـ Stack
        if (stack.languages && stack.languages.length > 0) {
            this.setCapability('Language', {
                state: CAPABILITY_STATES.AVAILABLE,
                technology: stack.languages.join(', '),
                confidence: 'DETECTED',
                evidence: stack.manifests || []
            });
        }

        if (stack.backend && stack.backend.runtime !== 'none') {
            this.setCapability('Runtime', {
                state: CAPABILITY_STATES.AVAILABLE,
                technology: stack.backend.runtime,
                confidence: stack.backend.confidence || 'DETECTED',
                evidence: stack.backend.evidence || []
            });
        }

        if (stack.backend && stack.backend.framework !== 'none') {
            this.setCapability('Framework', {
                state: CAPABILITY_STATES.AVAILABLE,
                technology: stack.backend.framework,
                confidence: stack.backend.confidence || 'DETECTED',
                evidence: stack.backend.evidence || []
            });
        }

        if (stack.database && stack.database.engine !== 'none') {
            this.setCapability('Database', {
                state: CAPABILITY_STATES.AVAILABLE,
                technology: stack.database.engine,
                confidence: stack.database.confidence || 'DETECTED',
                evidence: stack.database.evidence || []
            });
        } else {
            this.setCapability('Database', {
                state: CAPABILITY_STATES.NOT_APPLICABLE,
                technology: 'none',
                isApplicable: false,
                notes: 'المشروع لا يعتمد على قاعدة بيانات خارجية في الوضع الافتراضي'
            });
        }

        if (stack.cache && stack.cache.engine !== 'none') {
            this.setCapability('Cache', {
                state: CAPABILITY_STATES.AVAILABLE,
                technology: stack.cache.engine,
                confidence: stack.cache.confidence || 'DETECTED',
                evidence: stack.cache.evidence || []
            });
        } else {
            this.setCapability('Cache', {
                state: CAPABILITY_STATES.NOT_APPLICABLE,
                technology: 'none',
                isApplicable: false
            });
        }

        if (stack.localization && stack.localization.supported) {
            this.setCapability('Localization', {
                state: CAPABILITY_STATES.AVAILABLE,
                technology: 'ar-en-multilingual',
                confidence: 'DETECTED',
                evidence: stack.localization.evidence || []
            });
            if (stack.localization.rtl) {
                this.setCapability('RTL', {
                    state: CAPABILITY_STATES.AVAILABLE,
                    technology: 'dir-rtl',
                    confidence: 'DETECTED'
                });
            }
        }
    }

    setCapability(dimension, data) {
        if (!this.capabilities.has(dimension)) {
            throw new Error(`البعد الهندسي '${dimension}' غير معروف في نموذج القدرات.`);
        }
        const current = this.capabilities.get(dimension);
        this.capabilities.set(dimension, { ...current, ...data });
    }

    getCapability(dimension) {
        return this.capabilities.get(dimension);
    }

    getApplicableCapabilities() {
        return Array.from(this.capabilities.values()).filter(c => c.state !== CAPABILITY_STATES.NOT_APPLICABLE);
    }

    getNotApplicableCapabilities() {
        return Array.from(this.capabilities.values()).filter(c => c.state === CAPABILITY_STATES.NOT_APPLICABLE);
    }

    exportProfile() {
        return {
            timestamp: this.timestamp,
            totalDimensions: this.capabilities.size,
            capabilities: Object.fromEntries(this.capabilities)
        };
    }
}

module.exports = {
    CapabilityModel,
    CAPABILITY_STATES,
    CAPABILITY_DIMENSIONS
};
