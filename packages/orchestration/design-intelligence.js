/**
 * @file design-intelligence.js
 * @description محرك الذكاء التصميمي ومكافحة الابتذال والتكرار النمطي (Anti-Slop & Anti-Convergence)
 * WebForge Master Orchestration System
 */

class DesignIntelligenceEngine {
    constructor() {
        this.slopPatterns = [
            {
                pattern: /linear-gradient\([^)]*#8a2be2[^)]*#4b0082[^)]*\)/i,
                name: 'GENERIC_PURPLE_AI_GRADIENT',
                severity: 'MEDIUM',
                message: 'Overused generic AI purple gradient detected without brand justification.'
            },
            {
                pattern: /backdrop-filter:\s*blur\(2[0-9]px\);\s*background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[1-5]\)/i,
                name: 'EXCESSIVE_GLASSMORPHISM',
                severity: 'LOW',
                message: 'Excessive glassmorphism reduces legibility and increases mobile GPU load.'
            }
        ];
    }

    /**
     * فحص كود التصميم للكشف عن أنماط الابتذال
     * @param {string} cssContent 
     * @returns {Object} نتيجة الفحص
     */
    auditDesignQuality(cssContent = '') {
        const findings = [];
        this.slopPatterns.forEach(rule => {
            if (rule.pattern.test(cssContent)) {
                findings.push({
                    name: rule.name,
                    severity: rule.severity,
                    message: rule.message
                });
            }
        });

        return {
            hasSlopPatterns: findings.length > 0,
            findingsCount: findings.length,
            findings,
            qualityScore: Math.max(0, 100 - (findings.length * 20)),
            status: findings.length === 0 ? 'HIGH_INTELLIGENCE' : 'REFINEMENT_RECOMMENDED'
        };
    }
}

module.exports = DesignIntelligenceEngine;
