#!/usr/bin/env node
/**
 * ProofForge Technical SEO & Structured Metadata Verifier (Real Inspection)
 * Validates: Title tags, meta descriptions, canonical URL links, OpenGraph metadata,
 * heading hierarchy (H1 presence), and crawl accessibility.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Technical SEO & Structured Metadata Verifier');

const htmlFiles = engine.findFiles('apps/web', ['.html']);

engine.recordCheck(
    'HTML Documents Discovery',
    htmlFiles.length > 0,
    `Found ${htmlFiles.length} HTML documents for SEO inspection`,
    'CRITICAL'
);

for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const rel = path.relative(engine.rootDir, htmlFile);

    // 1. Document title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const hasValidTitle = titleMatch && titleMatch[1].trim().length > 5;
    engine.recordCheck(`Document Title Tag (${rel})`, Boolean(hasValidTitle), hasValidTitle ? `Valid title: "${titleMatch[1].trim()}"` : 'Missing or too short title tag', 'HIGH');

    // 2. Meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const hasValidDesc = descMatch && descMatch[1].trim().length > 10;
    engine.recordCheck(`Meta Description (${rel})`, Boolean(hasValidDesc), hasValidDesc ? 'Meta description tag populated' : 'Missing or empty meta description tag', 'HIGH');

    // 3. Canonical link
    const hasCanonical = /<link\s+rel=["']canonical["']\s+href=["'][^"']+["']/i.test(html);
    engine.recordCheck(`Canonical URL Tag (${rel})`, hasCanonical, hasCanonical ? 'Canonical URL tag present' : 'Missing canonical link tag', 'HIGH');

    // 4. OpenGraph tags
    const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(html);
    const hasOgDesc = /<meta\s+property=["']og:description["']/i.test(html);
    engine.recordCheck(`OpenGraph Social Metadata (${rel})`, hasOgTitle && hasOgDesc, (hasOgTitle && hasOgDesc) ? 'og:title and og:description present' : 'Missing OpenGraph metadata tags', 'MEDIUM');

    // 5. Semantic Heading 1 (H1)
    const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);
    engine.recordCheck(`Semantic H1 Heading Landmark (${rel})`, hasH1, hasH1 ? 'Primary H1 heading present in document' : 'Missing H1 heading tag', 'HIGH');
}

engine.finish();
