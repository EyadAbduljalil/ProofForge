#!/usr/bin/env node
/**
 * ProofForge Architecture & Invariants Verification Runner
 */
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🏛️ [ProofForge Architecture Skill] Running architecture and invariants verification...');

const root = path.resolve(__dirname, '../../../');
const webforge = path.join(root, 'bin/webforge.js');

const res = spawnSync(process.execPath, [webforge, 'verify'], {
  cwd: root,
  stdio: 'inherit'
});

if (res.status === 0) {
  console.log('\n✅ [ProofForge Architecture Skill] Architecture verified successfully.');
  process.exit(0);
} else {
  console.error('\n❌ [ProofForge Architecture Skill] Architecture verification failed.');
  process.exit(res.status || 1);
}
