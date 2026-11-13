/**
 * @file project-context-discovery.test.js
 * @description اختبارات التحقق من محرك استكشاف سياق وبيئة المشاريع
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ProjectContextDiscovery = require('../project-context-discovery');

console.log('======================================================');
console.log('🔍 Testing Project Context Discovery Engine');
console.log('======================================================');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcd-test-'));

try {
    // 1. Rejects invalid or nonexistent directory
    assert.throws(() => {
        ProjectContextDiscovery.discoverContext(null);
    }, /محظور/);
    assert.throws(() => {
        ProjectContextDiscovery.discoverContext(path.join(tempDir, 'nonexistent-xyz'));
    }, /غير موجود/);
    console.log('  [PASS] 1. Rejects invalid or nonexistent directory');

    // 2. Discovers Node.js, Express, PostgreSQL, Prisma, Jest
    const dummyPkg = {
        name: 'test-saas-app',
        version: '1.0.0',
        dependencies: {
            express: '^4.18.2',
            pg: '^8.11.3',
            '@prisma/client': '^5.0.0'
        },
        devDependencies: {
            typescript: '^5.0.0',
            jest: '^29.0.0'
        }
    };
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(dummyPkg, null, 2), 'utf8');

    // Add migrations dir
    const migDir = path.join(tempDir, 'apps/server/db/migrations');
    fs.mkdirSync(migDir, { recursive: true });
    fs.writeFileSync(path.join(migDir, '001_init.sql'), 'CREATE TABLE test (id INT);', 'utf8');

    // Add Dockerfile
    fs.writeFileSync(path.join(tempDir, 'Dockerfile'), 'FROM node:20-alpine\nUSER node\n', 'utf8');

    // Add ADR
    fs.writeFileSync(path.join(tempDir, 'ADR-001.md'), '# ADR 1\nApproved\n', 'utf8');

    // Add README
    fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test Project\n', 'utf8');

    const context = ProjectContextDiscovery.discoverContext(tempDir);

    assert(context.languages.includes('javascript'), 'Must discover javascript');
    assert(context.languages.includes('typescript'), 'Must discover typescript');
    assert(context.frameworks.includes('express'), 'Must discover express');
    assert.strictEqual(context.database.engine, 'postgresql', 'Must discover postgresql');
    assert.strictEqual(context.database.orm, 'prisma', 'Must discover prisma');
    assert.strictEqual(context.database.hasMigrations, true, 'Must detect migrations');
    assert.strictEqual(context.infrastructure.hasDocker, true, 'Must detect Dockerfile');
    assert.strictEqual(context.documentation.hasReadme, true, 'Must detect README');
    assert.strictEqual(context.documentation.hasAdr, true, 'Must detect ADR');
    console.log('  [PASS] 2. Discovers Node.js, TypeScript, Express, PostgreSQL, Prisma, Docker, ADR');

    // 3. Immutability check
    assert.throws(() => {
        context.languages.push('python');
    });
    console.log('  [PASS] 3. Discovered context is immutable Object.freeze');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All Project Context Discovery Tests PASSED.');
    console.log('======================================================');

} finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
