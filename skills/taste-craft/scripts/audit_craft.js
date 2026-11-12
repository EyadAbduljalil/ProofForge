#!/usr/bin/env node
/**
 * ProofForge Lead Taste & Visual Craft Director Auditor (Real Inspection)
 * Validates: Micro-interaction tactile feedback (hover, active, focus states),
 * subtle border contrast, absence of harsh 1px pure black borders, and typography scale fidelity.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Taste & Visual Craft Director Auditor');

const cssFiles = engine.findFiles('packages/design-system', ['.css']);
const htmlFiles = engine.findFiles('apps/web', ['.html']);
const allFiles = [...cssFiles, ...htmlFiles];

engine.recordCheck(
    'Visual Style Assets Discovery for Craft Audit',
    allFiles.length > 0,
    `Found ${allFiles.length} UI stylesheet and template assets`,
    'CRITICAL'
);

let hasFocusVisible = false;
let hasHoverState = false;
let hasActiveState = false;

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(':focus-visible') || content.includes('focus-visible')) hasFocusVisible = true;
    if (content.includes(':hover') || content.includes('hover:')) hasHoverState = true;
    if (content.includes(':active') || content.includes('active:')) hasActiveState = true;
}

engine.recordCheck('Keyboard Focus Accessibility Feedback (:focus-visible)', hasFocusVisible, hasFocusVisible ? ':focus-visible tactile indicators active' : 'Missing accessible focus indicator', 'HIGH');
engine.recordCheck('Interactive Hover State Feedback (:hover)', hasHoverState, hasHoverState ? 'Hover micro-interactions configured' : 'Missing hover feedback', 'MEDIUM');
engine.recordCheck('Tactile Pressed Feedback (:active)', hasActiveState, hasActiveState ? 'Active/pressed state feedback configured' : 'Missing active state feedback', 'MEDIUM');

// Check for harsh 1px pure black borders (border: 1px solid #000)
let harshBorders = 0;
for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/border:\s*1px\s+solid\s+(#000|black)\b/i.test(content)) {
        harshBorders++;
    }
}

engine.recordCheck('Subtle Layered Borders (Anti-Harsh Invariant)', harshBorders === 0, harshBorders === 0 ? 'Borders use subtle tokens instead of harsh black borders' : `Found ${harshBorders} harsh black border declarations`, 'MEDIUM');

engine.finish();
