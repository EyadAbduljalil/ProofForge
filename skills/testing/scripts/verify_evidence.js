#!/usr/bin/env node
/**
 * ProofForge Evidence & Quality Gate Runner
 */
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🧪 [ProofForge Testing Skill] Collecting and verifying deterministic test evidence...');

const root = path.resolve(__dirname, '../../../');
const webforge = path.join(root, 'bin/webforge.js');

const res = spawnSync(process.execPath, [webforge, 'test'], {
  cwd: root,
  stdio: 'inherit'
});

if (res.status === 0) {
  console.log('\n✅ [ProofForge Testing Skill] Evidence Contract SATISFIED. 100% tests passing.');
  process.exit(0);
} else {
  console.error('\n❌ [ProofForge Testing Skill] Evidence Contract VIOLATED. Tests failed.');
  process.exit(res.status || 1);
}
