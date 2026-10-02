/**
 * @file animation-decision-engine.js
 * @description محرك حوكمة الحركة والأنيميشن واختيار المكتبات المناسبة وفرض قيود الأداء والإتاحة
 * WebForge Master Orchestration System
 */

class AnimationDecisionEngine {
    /**
     * تقييم متطلبات الحركة واختيار التقنية المناسبة بدون إسراف أو استيراد عشوائي
     * @param {Object} requirements متطلبات الحركة
     * @returns {Object} نتيجة القرار وتوصية التقنية المناسبة
     */
    static evaluateAnimationNeeds({
        purpose = 'ui_feedback',          // ui_feedback, layout_transition, complex_timeline, smooth_scroll, 3d_webgl
        trigger = 'hover',                 // hover, click, scroll, mount, continuous
        complexity = 'simple',             // simple, moderate, complex
        framework = 'react',               // vanilla, react, vue
        supportsReducedMotion = true,
        performanceBudgetMs = 16
    }) {
        let selectedTechnology = 'CSS_TRANSITIONS';
        let rationale = '';

        if (trigger === 'hover' && complexity === 'simple') {
            selectedTechnology = 'CSS_TRANSITIONS';
            rationale = 'Simple hover state transitions should always use lightweight CSS transitions without JS libraries.';
        } else if (purpose === 'ui_feedback' || purpose === 'layout_transition') {
            selectedTechnology = 'MOTION'; // framer-motion / motion.dev
            rationale = 'Declarative spring physics and layout transitions for React UI components.';
        } else if (purpose === 'complex_timeline' || complexity === 'complex') {
            selectedTechnology = 'GSAP';
            rationale = 'Advanced timeline sequencing and imperative orchestration required.';
        } else if (purpose === 'smooth_scroll') {
            selectedTechnology = 'LENIS';
            rationale = 'Lightweight inertial smooth scrolling orchestration.';
        } else if (purpose === '3d_webgl') {
            selectedTechnology = 'THREE_JS';
            rationale = 'Interactive 3D WebGL scenes requiring dedicated rendering engine.';
        }

        return {
            decision_id: `ANIM_DEC_${Date.now()}`,
            selectedTechnology,
            rationale,
            reducedMotionMandatory: true,
            performanceConstraint: `${performanceBudgetMs}ms per frame (60fps target)`,
            cleanupRequired: ['cancelAnimationFrame', 'removeEventListener', 'killTimelines'],
            status: 'GOVERNED'
        };
    }

    /**
     * فحص شروط الأداء والإتاحة لكود الحركة
     * @param {string} animationCode 
     * @returns {Object} تقرير التدقيق
     */
    static auditAnimationCode(animationCode = '') {
        const violations = [];
        const hasReducedMotion = animationCode.includes('prefers-reduced-motion') || animationCode.includes('useReducedMotion');
        const hasForcedReflow = animationCode.includes('getBoundingClientRect') && animationCode.includes('requestAnimationFrame');

        if (!hasReducedMotion) {
            violations.push({
                severity: 'HIGH',
                rule: 'ACCESSIBILITY_REDUCED_MOTION',
                message: 'Animation code must respect prefers-reduced-motion media query.'
            });
        }

        if (hasForcedReflow) {
            violations.push({
                severity: 'MEDIUM',
                rule: 'PERFORMANCE_LAYOUT_THRASHING',
                message: 'Repeated layout measurement inside animation loop causes forced reflow.'
            });
        }

        return {
            compliant: violations.length === 0,
            violations,
            status: violations.length === 0 ? 'VERIFIED' : 'FAILED'
        };
    }
}

module.exports = AnimationDecisionEngine;
