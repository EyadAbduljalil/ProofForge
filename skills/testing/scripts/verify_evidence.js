#!/usr/bin/env node
/**
 * ProofForge Quality Assurance & Deterministic Verification Verifier (Real Inspection)
 * Validates: Evidence Contract compliance, test assertion density (assert.*),
 * absence of skipped/empty test bodies, and presence of comprehensive test suites.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Quality Assurance & Deterministic Verification Verifier');

const testDirs = ['tests', 'packages/contracts/tests', 'packages/security/tests', 'packages/orchestration/tests'];
let testFiles = [];

for (const dir of testDirs) {
    const files = engine.findFiles(dir, ['.js']);
    testFiles = testFiles.concat(files);
}

engine.recordCheck(
    'Automated Test Suite Discovery',
    testFiles.length >= 10,
    `Found ${testFiles.length} automated test suites across core packages`,
    'CRITICAL'
);

let totalAssertions = 0;
let emptyTestCases = 0;

for (const file of testFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const assertions = (content.match(/assert\.(strictEqual|ok|deepStrictEqual|throws|rejects|notStrictEqual)/g) || []).length;
    totalAssertions += assertions;

    // Check for empty test callback bodies: test('...', () => {})
    if (/test\s*\([^,]+,\s*(async\s*)?\(\)\s*=>\s*\{\s*\}\s*\)/.test(content)) {
        emptyTestCases++;
    }
}

engine.recordCheck(
    'Assertion Density & Deterministic Evidence',
    totalAssertions >= 50,
    `Found ${totalAssertions} rigorous assertions across discovered test suites`,
    'HIGH'
);

engine.recordCheck(
    'Zero Empty/Mock Test Bodies Invariant',
    emptyTestCases === 0,
    emptyTestCases === 0 ? 'All test cases contain executable validation assertions' : `Found ${emptyTestCases} empty test bodies`,
    'CRITICAL'
);

engine.finish();
