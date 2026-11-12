#!/usr/bin/env node
/**
 * ProofForge Security Verification Runner
 * Verifies core security invariants across packages/security
 */
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🛡️ [ProofForge Security Skill] Running automated security verification...');

const root = path.resolve(__dirname, '../../../');
const webforge = path.join(root, 'bin/webforge.js');

const res = spawnSync(process.execPath, [webforge, 'security'], {
  cwd: root,
  stdio: 'inherit'
});

if (res.status === 0) {
  console.log('\n✅ [ProofForge Security Skill] Security verification PASSED with 100% evidence.');
  process.exit(0);
} else {
  console.error('\n❌ [ProofForge Security Skill] Security verification FAILED.');
  process.exit(res.status || 1);
}
