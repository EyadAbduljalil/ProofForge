/**
 * @file risk-engine.js
 * @description محرك تقييم وحساب المخاطر متعدد العوامل والمعايير
 * WebForge OS Security Intelligence & Governance System
 */

class RiskAssessmentEngine {
    /**
     * تقييم المخاطر الأمنية بناءً على مصفوفة العوامل متعددة الأبعاد
     * @param {Object} factors العوامل الأمنية
     * @returns {Object} نتيجة التقييم والتصنيف مع الشرح والتبرير
     */
    static evaluateRisk({
        impact = 'MEDIUM',          // CRITICAL, HIGH, MEDIUM, LOW
        exploitability = 'MEDIUM',  // HIGH, MEDIUM, LOW
        exposure = 'INTERNAL',      // PUBLIC_INTERNET, AUTHENTICATED_API, INTERNAL, RESTRICTED
        authRequired = true,
        privilegesRequired = 'NONE', // NONE, USER, ADMIN, SYSTEM
        dataSensitivity = 'MEDIUM', // CRITICAL, HIGH, MEDIUM, LOW
        tenantImpact = 'SINGLE',    // CROSS_TENANT, SINGLE, NONE
        attackComplexity = 'LOW'    // LOW, MEDIUM, HIGH
    }) {
        let score = 0;

        // 1. حساب وزن التأثير (Impact Weight)
        const impactWeights = { CRITICAL: 40, HIGH: 30, MEDIUM: 20, LOW: 10 };
        score += impactWeights[impact] || 20;

        // 2. حساب وزن قابلية الاستغلال (Exploitability Weight)
        const exploitWeights = { HIGH: 25, MEDIUM: 15, LOW: 5 };
        score += exploitWeights[exploitability] || 15;

        // 3. حساب وزن الانكشاف على الإنترنت (Exposure Weight)
        const exposureWeights = { PUBLIC_INTERNET: 20, AUTHENTICATED_API: 12, INTERNAL: 5, RESTRICTED: 2 };
        score += exposureWeights[exposure] || 10;

        // 4. حساسية البيانات وتأثير المستأجرين
        if (dataSensitivity === 'CRITICAL') score += 10;
        if (tenantImpact === 'CROSS_TENANT') score += 15;

        // 5. متطلبات المصادقة والصلاحيات
        if (!authRequired && exposure === 'PUBLIC_INTERNET') score += 15;
        if (privilegesRequired === 'NONE') score += 5;
        if (attackComplexity === 'LOW') score += 5;

        // تصنيف مستوى الخطورة
        let level = 'INFO';
        let isBlocker = false;

        if (score >= 85 || (impact === 'CRITICAL' && !authRequired && exposure === 'PUBLIC_INTERNET')) {
            level = 'CRITICAL';
            isBlocker = true;
        } else if (score >= 65 || tenantImpact === 'CROSS_TENANT') {
            level = 'HIGH';
            isBlocker = (impact === 'CRITICAL');
        } else if (score >= 40) {
            level = 'MEDIUM';
        } else if (score >= 20) {
            level = 'LOW';
        }

        return {
            score,
            level,
            isBlocker,
            reasoning: [
                `Impact: ${impact} (${impactWeights[impact] || 20} pts)`,
                `Exploitability: ${exploitability} (${exploitWeights[exploitability] || 15} pts)`,
                `Exposure: ${exposure} (${exposureWeights[exposure] || 10} pts)`,
                `Cross-Tenant Impact: ${tenantImpact === 'CROSS_TENANT' ? 'YES (+15 pts)' : 'NO'}`,
                `Auth Required: ${authRequired ? 'YES' : 'NO (Unauthenticated Public Exposure +15 pts)'}`
            ],
            qualityGateAction: isBlocker ? 'BLOCK_RELEASE' : (level === 'HIGH' ? 'REQUIRE_SECURITY_APPROVAL' : 'ALLOW_WITH_LOG')
        };
    }
}

module.exports = RiskAssessmentEngine;
