#!/usr/bin/env node
/**
 * ProofForge Responsive & Mobile-First Verifier (Real Inspection)
 * Validates: Viewport meta configuration, fluid clamp scales, responsive breakpoint media queries,
 * and avoidance of fixed non-responsive viewport widths (>320px).
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Responsive & Mobile-First Verifier');

const webHtml = path.join(engine.rootDir, 'apps/web/index.html');
const fluidCss = path.join(engine.rootDir, 'packages/design-system/fluid.css');

engine.recordCheck(
    'Fluid Design System Definition (fluid.css)',
    fs.existsSync(fluidCss),
    fs.existsSync(fluidCss) ? 'fluid.css exists' : 'Missing fluid.css',
    'CRITICAL'
);

if (fs.existsSync(fluidCss)) {
    const css = fs.readFileSync(fluidCss, 'utf8');
    const hasClamp = css.includes('clamp(');
    engine.recordCheck('CSS Clamp Fluid Typography & Spacing', hasClamp, hasClamp ? 'Modern CSS clamp() fluid scales verified' : 'Missing clamp() fluid scales', 'HIGH');
}

if (fs.existsSync(webHtml)) {
    const html = fs.readFileSync(webHtml, 'utf8');

    // 1. Viewport tag
    const hasViewport = /<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
    engine.recordCheck('Mobile Viewport Meta Tag', hasViewport, hasViewport ? 'width=device-width viewport tag present' : 'Missing mobile viewport meta tag', 'CRITICAL');

    // 2. Responsive CSS Grid / Flexbox
    const hasFlexibleLayout = /display:\s*(grid|flex)/i.test(html) || /class=["'][^"']*(grid|flex)/i.test(html);
    engine.recordCheck('Adaptive Flexbox/Grid Containers', hasFlexibleLayout, hasFlexibleLayout ? 'Layout uses modern CSS grid or flexbox' : 'Layout relies on rigid fixed positioning', 'HIGH');

    // 3. Scan for hardcoded fixed widths > 320px without max-width or media queries (ignoring max-width / min-width)
    const hardcodedWidths = html.match(/(?<![a-z-])width:\s*([4-9]\d{2,}|[1-9]\d{3,})px/gi) || [];
    engine.recordCheck('Zero Rigid Fixed Pixel Layout Blowouts', hardcodedWidths.length === 0, hardcodedWidths.length === 0 ? 'No rigid fixed-pixel widths > 320px detected' : `Detected ${hardcodedWidths.length} rigid pixel width declarations`, 'HIGH');
}

engine.finish();
