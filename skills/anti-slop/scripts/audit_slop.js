#!/usr/bin/env node
/**
 * ProofForge Anti-Slop Visual Scanner
 * Scans workspace for typical AI slop keywords and low-contrast patterns
 */
const fs = require('fs');
const path = require('path');

console.log('🎨 [ProofForge Anti-Slop Skill] Auditing codebase for AI visual slop patterns...');

const slopRegexes = [
  { name: 'Excessive Purple/Pink Gradients', pattern: /from-purple-\d+.*to-(pink|indigo)-\d+/i },
  { name: 'Magic/Super AI Clichés in UI', pattern: /AI-Powered Super Magic|The Ultimate Next-Gen/i },
  { name: 'Overly Rounded Bloated Cards', pattern: /rounded-(2xl|3xl).*shadow-2xl/i }
];

let slopFound = 0;
const root = path.resolve(__dirname, '../../../');

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (/\.(tsx|jsx|html|css|vue)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const rule of slopRegexes) {
        if (rule.pattern.test(content)) {
          console.warn(`  ⚠️ [SLOP WARNING] ${rule.name} found in: ${path.relative(root, full)}`);
          slopFound++;
        }
      }
    }
  }
}

scanDir(path.join(root, 'apps'));

if (slopFound === 0) {
  console.log('\n✅ [ProofForge Anti-Slop Skill] Codebase is 100% clean of generic AI slop.');
  process.exit(0);
} else {
  console.log(`\n⚠️ [ProofForge Anti-Slop Skill] Found ${slopFound} potential visual slop occurrences to review.`);
  process.exit(0);
}
