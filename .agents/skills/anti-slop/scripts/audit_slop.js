#!/usr/bin/env node
/**
 * ProofForge Anti-Slop Visual Intelligence Auditor (Real Inspection)
 * Validates: Detection of generic AI tropes, clichéd purple/indigo gradients,
 * fake trust counters, bloated shadow wrappers, and enforces semantic HTML hierarchy.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Anti-Slop Visual Intelligence Auditor');

const htmlFiles = engine.findFiles('apps/web', ['.html']);
const cssFiles = engine.findFiles('packages/design-system', ['.css']);
const allFiles = [...htmlFiles, ...cssFiles];

engine.recordCheck(
    'Visual Style Assets Discovery',
    allFiles.length > 0,
    `Discovered ${allFiles.length} UI and style assets for Anti-Slop inspection`,
    'CRITICAL'
);

const slopTropePatterns = [
    { name: 'Excessive Generic Purple Gradient', regex: /(from-purple-[\w-]+[\s\S]*?to-indigo|linear-gradient\([^)]*#8b5cf6[^)]*#6366f1\))/i, severity: 'HIGH' },
    { name: 'Fake Marketing Trust Metric', regex: /(100%\s*(Satisfaction|Guaranteed|Secure)|99\.9%\s*(Loved|Trusted|Happy))/i, severity: 'MEDIUM' },
    { name: 'Bloated Card Shadow Slop', regex: /shadow-2xl\s+shadow-purple/i, severity: 'MEDIUM' },
    { name: 'Excessive Deeply Nested DIV Slop', regex: /<div>\s*<div>\s*<div>\s*<div>\s*<div>/i, severity: 'HIGH' }
];

let slopCount = 0;

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(engine.rootDir, file);

    for (const trope of slopTropePatterns) {
        if (trope.regex.test(content)) {
            slopCount++;
            engine.recordCheck(
                `Anti-Slop Violation in ${rel}`,
                false,
                `Found prohibited trope: ${trope.name}`,
                trope.severity
            );
        }
    }
}

engine.recordCheck(
    'Zero AI Visual Slop Invariant',
    slopCount === 0,
    slopCount === 0 ? 'All visual templates and stylesheets conform to Anti-Slop craft standards' : `Detected ${slopCount} AI slop design tropes`,
    'HIGH'
);

// Semantic tags presence check
for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const hasSemanticTags = /<(header|nav|main|section|article|footer)[^>]*>/i.test(html);
    engine.recordCheck(
        `Semantic HTML Architecture (${path.basename(htmlFile)})`,
        hasSemanticTags,
        hasSemanticTags ? 'HTML employs semantic landmarks' : 'Missing semantic HTML landmarks (generic div soup)',
        'HIGH'
    );
}

engine.finish();
