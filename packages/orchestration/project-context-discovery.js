/**
 * @file project-context-discovery.js
 * @description محرك الاستكشاف المعماري الحتمي لسياق وبيئة المشاريع في ProofForge
 * (ProofForge Deterministic Project Context Discovery Engine)
 * 
 * يتولى:
 * 1. استكشاف لغات البرمجة وأطر العمل (Frameworks) المستخدمة عبر تحليل الحزم والمخططات الفعلية.
 * 2. اكتشاف طبقة قواعد البيانات والمخططات والتعديلات الهيكلية (Migrations / Schemas).
 * 3. فحص بنية الاختبارات الحتمية وبيئات التشغيل والحاويات (Docker / CI/CD).
 * 4. التحقق الصارم من حدود مساحة العمل ومنع الهروب الأمني أو قراءة مسارات غير مصرح بها.
 * 5. توليد سياق هندسي حتمي موثق يُمرر للوكلاء الذكائيين لمنع التخمين أو التوليد غير المتوافق.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const PathLoaderGuard = require('../contracts/path-loader-guard');

class ProjectContextDiscovery {
    /**
     * استكشاف وتحليل سياق المشروع داخل مساحة العمل المحددة
     * @param {string} projectRoot مسار جذر المشروع المصرح به
     * @returns {Object} وثيقة السياق الهندسي المكتشف
     */
    static discoverContext(projectRoot) {
        if (!projectRoot || typeof projectRoot !== 'string') {
            throw new Error('محظور: يجب تمرير مسار جذري صالح للمشروع (Invalid Project Root)');
        }

        const resolvedRoot = path.resolve(projectRoot);
        if (!fs.existsSync(resolvedRoot) || !fs.statSync(resolvedRoot).isDirectory()) {
            throw new Error(`محظور: مسار المشروع غير موجود أو ليس دليلاً صالحاً: ${resolvedRoot}`);
        }

        const discovered = {
            discoveredAt: new Date().toISOString(),
            projectRoot: resolvedRoot,
            languages: [],
            frameworks: [],
            packageManagers: [],
            database: {
                engine: null,
                orm: null,
                migrationsDir: null,
                hasMigrations: false
            },
            testing: {
                frameworks: [],
                hasTestDir: false,
                testFilesCount: 0
            },
            infrastructure: {
                hasDocker: false,
                hasCompose: false,
                ciWorkflows: []
            },
            documentation: {
                hasReadme: false,
                hasAdr: false,
                adrCount: 0
            },
            manifests: []
        };

        // 1. فحص ملفات التعريف والحزم (Package Manifests)
        this._inspectPackageManifests(resolvedRoot, discovered);

        // 2. فحص بنية قواعد البيانات والمخططات
        this._inspectDatabaseContext(resolvedRoot, discovered);

        // 3. فحص البنية التحتية والحاويات وخطوط CI/CD
        this._inspectInfrastructureContext(resolvedRoot, discovered);

        // 4. فحص بيئة الاختبارات
        this._inspectTestingContext(resolvedRoot, discovered);

        // 5. فحص الوثائق الهندسية وسجلات القرارات المعمارية (ADRs)
        this._inspectDocumentationContext(resolvedRoot, discovered);

        return this._deepFreeze(discovered);
    }

    /**
     * فحص ملفات الحزم (Node.js, Python, Rust, Go)
     */
    static _inspectPackageManifests(root, discovered) {
        // Node.js (package.json)
        const pkgPath = path.join(root, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                PathLoaderGuard.validateSafePath(pkgPath, { projectRoot: root, allowedExtensions: ['.json'] });
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                discovered.languages.push('javascript');
                discovered.packageManagers.push('npm');
                discovered.manifests.push({ type: 'npm', path: 'package.json', name: pkg.name || null, version: pkg.version || null });

                const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
                if (allDeps.typescript) discovered.languages.push('typescript');
                if (allDeps.react) discovered.frameworks.push('react');
                if (allDeps.next) discovered.frameworks.push('nextjs');
                if (allDeps.express) discovered.frameworks.push('express');
                if (allDeps.fastify) discovered.frameworks.push('fastify');
                if (allDeps['@nestjs/core']) discovered.frameworks.push('nestjs');
                if (allDeps.vue) discovered.frameworks.push('vue');
                if (allDeps.prisma || allDeps['@prisma/client']) discovered.database.orm = 'prisma';
                if (allDeps['drizzle-orm']) discovered.database.orm = 'drizzle';
                if (allDeps.pg) discovered.database.engine = 'postgresql';
                if (allDeps.mysql2) discovered.database.engine = 'mysql';
                if (allDeps.sqlite3 || allDeps['better-sqlite3']) discovered.database.engine = 'sqlite';
                if (allDeps.jest) discovered.testing.frameworks.push('jest');
                if (allDeps.vitest) discovered.testing.frameworks.push('vitest');
                if (allDeps.playwright || allDeps['@playwright/test']) discovered.testing.frameworks.push('playwright');
            } catch (err) {
                discovered.diagnostics = discovered.diagnostics || [];
                discovered.diagnostics.push({ file: 'package.json', error: err.message });
            }
        }

        // Python (pyproject.toml / requirements.txt)
        if (fs.existsSync(path.join(root, 'requirements.txt')) || fs.existsSync(path.join(root, 'pyproject.toml'))) {
            discovered.languages.push('python');
            discovered.packageManagers.push('pip');
            discovered.manifests.push({ type: 'python', path: fs.existsSync(path.join(root, 'pyproject.toml')) ? 'pyproject.toml' : 'requirements.txt' });
        }

        // Rust (Cargo.toml)
        if (fs.existsSync(path.join(root, 'Cargo.toml'))) {
            discovered.languages.push('rust');
            discovered.packageManagers.push('cargo');
            discovered.manifests.push({ type: 'cargo', path: 'Cargo.toml' });
        }

        // Go (go.mod)
        if (fs.existsSync(path.join(root, 'go.mod'))) {
            discovered.languages.push('go');
            discovered.packageManagers.push('go');
            discovered.manifests.push({ type: 'go', path: 'go.mod' });
        }

        // إزالة التكرارات
        discovered.languages = Array.from(new Set(discovered.languages));
        discovered.frameworks = Array.from(new Set(discovered.frameworks));
        discovered.testing.frameworks = Array.from(new Set(discovered.testing.frameworks));
    }

    /**
     * فحص بيئة قواعد البيانات
     */
    static _inspectDatabaseContext(root, discovered) {
        const potentialMigrationDirs = [
            'migrations',
            'apps/server/db/migrations',
            'server/db/migrations',
            'db/migrations',
            'prisma/migrations'
        ];

        for (const relDir of potentialMigrationDirs) {
            const dirPath = path.join(root, relDir);
            if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
                discovered.database.migrationsDir = relDir;
                try {
                    const files = fs.readdirSync(dirPath);
                    discovered.database.hasMigrations = files.length > 0;
                } catch (err) {
                    discovered.diagnostics = discovered.diagnostics || [];
                    discovered.diagnostics.push({ file: dirPath, error: err.message });
                }
                break;
            }
        }
    }

    /**
     * فحص البنية التحتية
     */
    static _inspectInfrastructureContext(root, discovered) {
        if (fs.existsSync(path.join(root, 'Dockerfile'))) {
            discovered.infrastructure.hasDocker = true;
        }
        if (fs.existsSync(path.join(root, 'docker-compose.yml')) || fs.existsSync(path.join(root, 'docker-compose.yaml'))) {
            discovered.infrastructure.hasCompose = true;
        }

        const workflowsDir = path.join(root, '.github/workflows');
        if (fs.existsSync(workflowsDir) && fs.statSync(workflowsDir).isDirectory()) {
            try {
                const wfFiles = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
                discovered.infrastructure.ciWorkflows = wfFiles;
            } catch (err) {
                discovered.diagnostics = discovered.diagnostics || [];
                discovered.diagnostics.push({ file: workflowsDir, error: err.message });
            }
        }
    }

    /**
     * فحص الاختبارات
     */
    static _inspectTestingContext(root, discovered) {
        const potentialTestDirs = ['tests', 'test', '__tests__'];
        for (const tDir of potentialTestDirs) {
            const fullDir = path.join(root, tDir);
            if (fs.existsSync(fullDir) && fs.statSync(fullDir).isDirectory()) {
                discovered.testing.hasTestDir = true;
                try {
                    const files = fs.readdirSync(fullDir, { recursive: true });
                    discovered.testing.testFilesCount += files.filter(f => typeof f === 'string' && (f.endsWith('.test.js') || f.endsWith('.spec.js') || f.endsWith('.test.ts'))).length;
                } catch (err) {
                    discovered.diagnostics = discovered.diagnostics || [];
                    discovered.diagnostics.push({ file: fullDir, error: err.message });
                }
            }
        }
    }

    /**
     * فحص التوثيق المعماري
     */
    static _inspectDocumentationContext(root, discovered) {
        if (fs.existsSync(path.join(root, 'README.md'))) {
            discovered.documentation.hasReadme = true;
        }

        // فحص ADRs
        const potentialAdrDirs = ['docs/adr', 'adr', 'docs/decisions', '.'];
        for (const adrRel of potentialAdrDirs) {
            const fullPath = path.join(root, adrRel);
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                try {
                    const files = fs.readdirSync(fullPath);
                    const adrs = files.filter(f => /^adr[-_]?\d+/i.test(f) || /^\d+[-_]adr/i.test(f));
                    if (adrs.length > 0) {
                        discovered.documentation.hasAdr = true;
                        discovered.documentation.adrCount += adrs.length;
                    }
                } catch (err) {
                    discovered.diagnostics = discovered.diagnostics || [];
                    discovered.diagnostics.push({ file: fullPath, error: err.message });
                }
            }
        }
    }

    static _deepFreeze(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        Object.freeze(obj);
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val && typeof val === 'object' && !Object.isFrozen(val)) {
                this._deepFreeze(val);
            }
        }
        return obj;
    }
}

module.exports = ProjectContextDiscovery;
