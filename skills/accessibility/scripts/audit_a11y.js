#!/usr/bin/env node
/**
 * ProofForge Accessibility & WCAG 2.2 Compliance Auditor (Real Inspection)
 * Validates: Image alt tags, interactive element accessible names, form labels,
 * keyboard accessibility, document language, and focus state visibility.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Accessibility & WCAG Compliance Auditor');

const htmlFiles = engine.findFiles('apps/web', ['.html']);
const jsFiles = engine.findFiles('apps/web', ['.js']);
const compFiles = engine.findFiles('packages/components', ['.js']);

engine.recordCheck(
    'Interactive Client Files Discovery',
    htmlFiles.length > 0,
    `Discovered ${htmlFiles.length} HTML files and ${jsFiles.length + compFiles.length} script files for a11y audit`,
    'CRITICAL'
);

for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const relative = path.relative(engine.rootDir, htmlFile);

    // 1. Language specification
    const hasLang = /<html[^>]+lang=["'][a-zA-Z0-9_-]+["']/i.test(content);
    engine.recordCheck(`Root Language Declaration (${relative})`, hasLang, hasLang ? 'html tag has lang attribute' : 'Missing lang attribute on html element', 'HIGH');

    // 2. Images without alt attribute
    const imgMatches = content.match(/<img[^>]*>/gi) || [];
    const imgsWithoutAlt = imgMatches.filter(img => !/alt=["'][^"']*["']/i.test(img));
    engine.recordCheck(`Image Alt Attributes (${relative})`, imgsWithoutAlt.length === 0, imgsWithoutAlt.length === 0 ? 'All <img> tags have alt attributes' : `Found ${imgsWithoutAlt.length} images lacking alt attribute`, 'HIGH');

    // 3. Buttons without accessible text or aria-label
    const buttonMatches = content.match(/<button[^>]*>([\s\S]*?)<\/button>/gi) || [];
    let emptyButtons = 0;
    for (const btn of buttonMatches) {
        const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(btn);
        const innerText = btn.replace(/<[^>]+>/g, '').trim();
        if (!hasAriaLabel && innerText.length === 0) {
            emptyButtons++;
        }
    }
    engine.recordCheck(`Button Accessible Names (${relative})`, emptyButtons === 0, emptyButtons === 0 ? `All ${buttonMatches.length} buttons have accessible text/label` : `Found ${emptyButtons} buttons without accessible names`, 'HIGH');

    // 4. Form inputs have labels or aria-label
    const inputMatches = content.match(/<input[^>]*>/gi) || [];
    let unlabelledInputs = 0;
    for (const input of inputMatches) {
        if (/type=["'](hidden|submit|button|reset)["']/i.test(input)) continue;
        const idMatch = input.match(/id=["']([^"']+)["']/i);
        const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(input);
        const hasAriaLabelledby = /aria-labelledby=["'][^"']+["']/i.test(input);
        let hasLabel = false;
        if (idMatch) {
            const inputId = idMatch[1];
            hasLabel = new RegExp(`<label[^>]+for=["']${inputId}["']`, 'i').test(content);
        }
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
            unlabelledInputs++;
        }
    }
    engine.recordCheck(`Form Input Accessibility (${relative})`, unlabelledInputs === 0, unlabelledInputs === 0 ? `All ${inputMatches.length} inputs properly labeled` : `Found ${unlabelledInputs} inputs lacking accessible label`, 'HIGH');

    // 5. Reduced motion support in styles
    const hasReducedMotion = /prefers-reduced-motion/i.test(content);
    engine.recordCheck(`Reduced Motion Media Query (${relative})`, hasReducedMotion, hasReducedMotion ? 'CSS respects prefers-reduced-motion' : 'Missing prefers-reduced-motion media query', 'MEDIUM');
}

// 6. Check for outline: none without focus styling in stylesheets
const cssFiles = engine.findFiles('packages/design-system', ['.css']);
for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, 'utf8');
    const hasNakedOutlineNone = /outline:\s*none(?![^}]*focus)/i.test(css);
    engine.recordCheck('Keyboard Focus Outline Preservation', !hasNakedOutlineNone, !hasNakedOutlineNone ? 'No destructive outline:none without focus indicator' : 'Found outline:none removing keyboard focus ring', 'HIGH');
}

engine.finish();
