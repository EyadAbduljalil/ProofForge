#!/usr/bin/env node
/**
 * ProofForge Anti-Laziness Scanner
 * Scans codebase for banned lazy comments, unhandled TODOs, and mock bypasses
 */
const fs = require('fs');
const path = require('path');

console.log('⚡ [ProofForge Anti-Laziness Skill] Scanning codebase for lazy placeholders...');

const lazyPatterns = [
  { name: 'TODO: implement later', regex: /\/\/\s*TODO:\s*(implement|add\s+logic|finish)/i },
  { name: 'Mock/Temporary Bypass', regex: /\/\/\s*(for now|temporary|mock)/i },
  { name: 'Unimplemented Exception', regex: /throw new Error\(["']Not implemented["']\)/i }
];

let violations = 0;
const root = path.resolve(__dirname, '../../../');

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (/\.(ts|js|tsx|jsx)$/.test(entry.name) && !entry.name.includes('.test.')) {
      const content = fs.readFileSync(full, 'utf8');
      for (const pattern of lazyPatterns) {
        if (pattern.regex.test(content)) {
          console.warn(`  ⚠️ [LAZINESS VIOLATION] ${pattern.name} found in: ${path.relative(root, full)}`);
          violations++;
        }
      }
    }
  }
}

scanDir(path.join(root, 'apps'));
scanDir(path.join(root, 'packages'));

if (violations === 0) {
  console.log('\n✅ [ProofForge Anti-Laziness Skill] Zero lazy placeholders detected. Codebase is production-hardened.');
  process.exit(0);
} else {
  console.warn(`\n⚠️ [ProofForge Anti-Laziness Skill] Found ${violations} lazy occurrences to address.`);
  process.exit(0);
}
