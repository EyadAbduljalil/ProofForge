/**
 * @file release-metadata-validator.test.js
 * @description مدقق اتساق بيانات الإصدار والتكوين (Release Metadata Consistency Validator)
 * يمنع تكرار أي تضارب بين package.json و package-lock.json و plugin.json و README.md ومجلد skills
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('======================================================');
console.log('🔍 Testing Release Metadata Consistency & Parity');
console.log('======================================================');

const rootDir = path.resolve(__dirname, '../../../');

const pkgPath = path.join(rootDir, 'package.json');
const lockPath = path.join(rootDir, 'package-lock.json');
const pluginPath = path.join(rootDir, 'plugin.json');
const readmePath = path.join(rootDir, 'README.md');
const skillsDir = path.join(rootDir, 'skills');

assert(fs.existsSync(pkgPath), 'package.json missing');
assert(fs.existsSync(lockPath), 'package-lock.json missing');
assert(fs.existsSync(pluginPath), 'plugin.json missing');
assert(fs.existsSync(readmePath), 'README.md missing');
assert(fs.existsSync(skillsDir), 'skills/ directory missing');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
const readme = fs.readFileSync(readmePath, 'utf8');

const dynamicSkills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

console.log(`>>> [1/5] Checking package.json version (${pkg.version})...`);
assert(pkg.version && /^\d+\.\d+\.\d+$/.test(pkg.version));
console.log('  [PASS] 1. package.json has valid SemVer');

console.log(`>>> [2/5] Checking package-lock.json parity...`);
assert.strictEqual(lock.version, pkg.version, `package-lock.json version (${lock.version}) must match package.json (${pkg.version})`);
if (lock.packages && lock.packages['']) {
    assert.strictEqual(lock.packages[''].version, pkg.version, 'Root package in lockfile must match');
}
console.log('  [PASS] 2. package-lock.json version matches package.json');

console.log(`>>> [3/5] Checking plugin.json parity...`);
assert.strictEqual(plugin.version, pkg.version, `plugin.json version (${plugin.version}) must match package.json (${pkg.version})`);
console.log('  [PASS] 3. plugin.json version matches package.json');

console.log(`>>> [4/5] Checking Skills Count Consistency across metadata...`);
const actualCount = dynamicSkills.length;
assert.strictEqual(actualCount, 28, `Expected 28 skills, found ${actualCount}`);
assert(plugin.description.includes(`${actualCount} specialized skills`), `plugin.json description must mention ${actualCount} skills`);
assert(readme.includes(`${actualCount}%20Canonical`) || readme.includes(`${actualCount} specialized`), `README.md must mention ${actualCount} skills`);
console.log(`  [PASS] 4. Skills count parity verified (${actualCount} skills across all files)`);

console.log(`>>> [5/5] Checking README release badge...`);
assert(readme.includes(`Release-v${pkg.version}`), `README.md release badge must match package.json version v${pkg.version}`);
console.log('  [PASS] 5. README release badge matches package.json');

console.log('======================================================');
console.log('>>> [SUCCESS] All Release Metadata Consistency Checks PASSED 100%.');
console.log('======================================================');
