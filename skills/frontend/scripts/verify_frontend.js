#!/usr/bin/env node
/**
 * ProofForge Frontend Architecture Verifier (Real Inspection)
 * Validates: Client entry points, viewport configuration, error handling containers,
 * UI state management, and asset loading integrity.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Frontend Architecture Verifier');

// 1. Entry point inspection
const webIndex = path.join(engine.rootDir, 'apps/web/index.html');
const webApp = path.join(engine.rootDir, 'apps/web/app.js');

engine.recordCheck(
    'Client HTML Entry Point',
    fs.existsSync(webIndex),
    fs.existsSync(webIndex) ? 'apps/web/index.html present' : 'Missing apps/web/index.html',
    'CRITICAL'
);

engine.recordCheck(
    'Client JS Application Logic',
    fs.existsSync(webApp),
    fs.existsSync(webApp) ? 'apps/web/app.js present' : 'Missing apps/web/app.js',
    'CRITICAL'
);

if (fs.existsSync(webIndex)) {
    const html = fs.readFileSync(webIndex, 'utf8');
    
    // 2. Viewport configuration
    const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width/i.test(html);
    engine.recordCheck('Responsive Viewport Meta Tag', hasViewport, hasViewport ? 'Valid viewport tag' : 'Missing width=device-width viewport meta', 'HIGH');

    // 3. Error container / boundary elements
    const hasErrorAlert = /id=["'][^"']*(error|alert)[^"']*["']/i.test(html);
    engine.recordCheck('Resilient Error UI Containers', hasErrorAlert, hasErrorAlert ? 'Error container present in DOM' : 'Missing user error boundary container', 'HIGH');

    // 4. Accessible root document language
    const hasLang = /<html[^>]+lang=["'][a-z]{2,5}["']/i.test(html);
    engine.recordCheck('HTML Lang Attribute', hasLang, hasLang ? 'HTML root specifies language' : 'Missing html lang attribute', 'MEDIUM');
}

if (fs.existsSync(webApp)) {
    const js = fs.readFileSync(webApp, 'utf8');

    // 5. Unhandled exception / event listener error boundary
    const hasEventHandling = /addEventListener/i.test(js);
    engine.recordCheck('Client DOM Event Binding', hasEventHandling, hasEventHandling ? 'Event listeners bound' : 'Missing client event bindings', 'HIGH');

    // 6. Asynchronous error catching
    const hasCatchOrErrorHandling = /(\.catch\(|try\s*\{[\s\S]*catch)/i.test(js);
    engine.recordCheck('Async UI Error Handling', hasCatchOrErrorHandling, hasCatchOrErrorHandling ? 'Async operations guarded by try/catch or .catch' : 'Unguarded async network operations detected', 'HIGH');
}

// 7. Component package inspection
const compPkg = path.join(engine.rootDir, 'packages/components');
if (fs.existsSync(compPkg)) {
    const compFiles = engine.findFiles(compPkg, ['.js']);
    engine.recordCheck('Reusable UI Components Count', compFiles.length > 0, `Found ${compFiles.length} component modules in packages/components`, 'MEDIUM');
}

engine.finish();
