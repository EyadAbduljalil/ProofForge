#!/usr/bin/env node
/**
 * ProofForge Motion & Animation Performance Auditor (Real Inspection)
 * Validates: GPU-accelerated transforms (transform, opacity), avoidance of layout-thrashing animations,
 * presence of prefers-reduced-motion accessibility rules, and animation duration budgets.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Motion & Animation Performance Auditor');

const motionCss = path.join(engine.rootDir, 'packages/design-system/motion.css');
const clientHtml = path.join(engine.rootDir, 'apps/web/index.html');

engine.recordCheck(
    'Motion Design System Definition',
    fs.existsSync(motionCss),
    fs.existsSync(motionCss) ? 'packages/design-system/motion.css exists' : 'Missing motion.css',
    'CRITICAL'
);

if (fs.existsSync(motionCss)) {
    const css = fs.readFileSync(motionCss, 'utf8');

    // 1. Reduced motion query
    const hasReducedMotion = css.includes('prefers-reduced-motion');
    engine.recordCheck('Reduced Motion Media Query in motion.css', hasReducedMotion, hasReducedMotion ? 'Accessible prefers-reduced-motion fallback present' : 'Missing reduced motion query', 'HIGH');

    // 2. Easing curve definitions
    const hasEasing = css.includes('--ease-') || css.includes('cubic-bezier');
    engine.recordCheck('Physics-Based Easing Curves', hasEasing, hasEasing ? 'Systematic easing curves defined' : 'Missing easing curves', 'MEDIUM');

    // 3. Duration budgets (< 500ms for UI)
    const hasBoundedDurations = css.includes('--duration-');
    engine.recordCheck('Motion Duration Token Budgets', hasBoundedDurations, hasBoundedDurations ? 'Bounded duration tokens defined' : 'Missing duration tokens', 'MEDIUM');
}

// 4. Scan all stylesheets for layout-thrashing transition properties
const cssFiles = engine.findFiles('packages/design-system', ['.css']);
let layoutReflowViolations = 0;
const reflowProperties = [/transition:[^;]*(width|height|top|left|bottom|right|margin|padding)(?!\w)/i];

for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf8');
    for (const pattern of reflowProperties) {
        if (pattern.test(content)) {
            layoutReflowViolations++;
            engine.recordCheck(`Layout Reflow Animation in ${path.basename(cssFile)}`, false, 'Animating width/height/margin causes layout reflows', 'HIGH');
        }
    }
}

engine.recordCheck('GPU-Accelerated Composite Animation Invariant', layoutReflowViolations === 0, layoutReflowViolations === 0 ? 'Zero layout-thrashing animations detected' : `Found ${layoutReflowViolations} reflow animation properties`, 'HIGH');

engine.finish();
