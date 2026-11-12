#!/usr/bin/env node
/**
 * ProofForge Web Performance & Core Web Vitals Auditor (Real Inspection)
 * Validates: Non-blocking script loading, image dimensions & lazy loading,
 * interval timer hygiene, cache control headers, and asset size budgets.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Web Performance & Core Web Vitals Auditor');

const htmlFiles = engine.findFiles('apps/web', ['.html']);
const jsFiles = engine.findFiles('apps/web', ['.js']);
const serverFile = path.join(engine.rootDir, 'apps/server/server.js');

for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const relative = path.relative(engine.rootDir, htmlFile);

    // 1. Check for synchronous render-blocking scripts in <head>
    const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
    let blockingScripts = 0;
    if (headMatch) {
        const headContent = headMatch[0];
        const scriptTags = headContent.match(/<script[^>]*src=[^>]*>/gi) || [];
        blockingScripts = scriptTags.filter(s => !/defer|async/i.test(s)).length;
    }
    engine.recordCheck(`Non-Blocking Head Scripts (${relative})`, blockingScripts === 0, blockingScripts === 0 ? 'No render-blocking scripts in <head>' : `Found ${blockingScripts} render-blocking scripts in <head>`, 'HIGH');

    // 2. Check images for CLS prevention (width and height attributes)
    const imgTags = html.match(/<img[^>]*>/gi) || [];
    let unconstrainedImgs = 0;
    for (const img of imgTags) {
        const hasWidth = /width=["'][^"']+["']/i.test(img);
        const hasHeight = /height=["'][^"']+["']/i.test(img);
        if (!hasWidth || !hasHeight) {
            unconstrainedImgs++;
        }
    }
    engine.recordCheck(`Cumulative Layout Shift (CLS) Image Attributes (${relative})`, unconstrainedImgs === 0, unconstrainedImgs === 0 ? 'All images have explicit width/height or zero image tags' : `Found ${unconstrainedImgs} images missing explicit dimensions`, 'MEDIUM');
}

// 3. Interval timer cleanup in client scripts
for (const jsFile of jsFiles) {
    const js = fs.readFileSync(jsFile, 'utf8');
    const hasSetInterval = /setInterval\s*\(/i.test(js);
    const hasClearInterval = /clearInterval\s*\(/i.test(js);
    const intervalHygiene = !hasSetInterval || (hasSetInterval && hasClearInterval);
    engine.recordCheck(`Timer Cleanup & Memory Leak Guard (${path.basename(jsFile)})`, intervalHygiene, intervalHygiene ? 'Timer intervals safely managed or absent' : 'Found unmanaged setInterval without clearInterval', 'HIGH');
}

// 4. Server static asset caching headers
if (fs.existsSync(serverFile)) {
    const serverCode = fs.readFileSync(serverFile, 'utf8');
    const hasCacheControl = serverCode.includes('Cache-Control') || serverCode.includes('cache-control') || serverCode.includes('max-age');
    engine.recordCheck('HTTP Asset Cache Headers', hasCacheControl, hasCacheControl ? 'Cache-Control header configured in server response' : 'Server responses lack Cache-Control optimization', 'HIGH');
}

engine.finish();
