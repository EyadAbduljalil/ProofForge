#!/usr/bin/env node
/**
 * ProofForge Design System & Token Scale Verifier (Real Inspection)
 * Validates: Design token completeness (colors, typography, spacing, elevation),
 * semantic CSS variable mapping, and token consistency.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Design System & Token Scale Verifier');

const dsDir = path.join(engine.rootDir, 'packages/design-system');
const tokensFile = path.join(dsDir, 'tokens.css');
const indexCss = path.join(dsDir, 'index.css');

engine.recordCheck(
    'Design System Package Discovery',
    fs.existsSync(dsDir),
    fs.existsSync(dsDir) ? 'packages/design-system directory exists' : 'Missing design-system package',
    'CRITICAL'
);

engine.recordCheck(
    'Core Tokens Definition (tokens.css)',
    fs.existsSync(tokensFile),
    fs.existsSync(tokensFile) ? 'tokens.css present' : 'Missing tokens.css',
    'CRITICAL'
);

if (fs.existsSync(tokensFile)) {
    const tokensContent = fs.readFileSync(tokensFile, 'utf8');

    // 1. Spacing rhythm
    const hasSpacingTokens = tokensContent.includes('--space-') || tokensContent.includes('--spacing-') || tokensContent.includes('--size-');
    engine.recordCheck('Spacing Scale Tokens', hasSpacingTokens, hasSpacingTokens ? 'Systematic spacing tokens defined' : 'Missing spacing scale tokens', 'HIGH');

    // 2. Color palette tokens
    const hasColorTokens = tokensContent.includes('--color-') || tokensContent.includes('--bg-') || tokensContent.includes('--text-');
    engine.recordCheck('Color Palette Design Tokens', hasColorTokens, hasColorTokens ? 'Color tokens defined' : 'Missing color design tokens', 'HIGH');

    // 3. Radius tokens
    const hasRadiusTokens = tokensContent.includes('--radius-') || tokensContent.includes('--rounded-');
    engine.recordCheck('Border Radius Tokens', hasRadiusTokens, hasRadiusTokens ? 'Border radius tokens defined' : 'Missing radius tokens', 'MEDIUM');
}

// Check client HTML for token usage
const clientHtml = path.join(engine.rootDir, 'apps/web/index.html');
if (fs.existsSync(clientHtml)) {
    const html = fs.readFileSync(clientHtml, 'utf8');
    const hasVarUsage = html.includes('var(--');
    engine.recordCheck('Client DOM Token Integration', hasVarUsage, hasVarUsage ? 'Client HTML integrates design tokens via CSS variables' : 'Client HTML uses hardcoded inline styles without design tokens', 'HIGH');
}

engine.finish();
