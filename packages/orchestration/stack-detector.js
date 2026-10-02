/**
 * @file stack-detector.js
 * @description محرك الاستكشاف والتكيف الشامل مع لغات وأطر عمل وقواعد بيانات ومكونات المشروع
 * WebForge Adaptive Stack & Capability Detection Engine
 */

const fs = require('fs');
const path = require('path');

class StackDetector {
    /**
     * اكتشاف الـ Stack الفعلي والقدرات والمكونات المعمارية للمشروع بناءً على الأدلة الصارمة
     * @param {string} rootDir مسار جذر المشروع
     * @returns {Object} ملف التوصيف المتكيف للـ Stack والقدرات
     */
    static detectStack(target = process.cwd()) {
        const isVirtual = typeof target === 'object' && target.files;
        const rootDir = isVirtual ? (target.rootDir || '.') : target;
        
        const fileExists = (relPath) => {
            if (isVirtual) return Boolean(target.files[relPath]);
            return fs.existsSync(path.join(rootDir, relPath));
        };

        const readFile = (relPath) => {
            if (isVirtual) return target.files[relPath] || '';
            return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
        };

        const stack = {
            timestamp: new Date().toISOString(),
            rootDir,
            projectType: 'unknown',
            languages: [],
            frontend: { framework: 'none', uiType: 'none', evidence: [] },
            backend: { framework: 'none', runtime: 'none', evidence: [] },
            database: { engine: 'none', orm: 'none', evidence: [] },
            cache: { engine: 'none', evidence: [] },
            queue: { engine: 'none', evidence: [] },
            api: { styles: [], evidence: [] },
            auth: { strategies: [], evidence: [] },
            testing: { frameworks: [], evidence: [] },
            infrastructure: { technologies: [], evidence: [] },
            localization: { supported: false, rtl: false, evidence: [] },
            ai: { enabled: false, technologies: [], evidence: [] },
            evidence: []
        };

        // 1. فحص ملفات التعريف والحزم (Manifests)
        const hasPackageJson = fileExists('package.json');
        const hasRequirementsTxt = fileExists('requirements.txt') || fileExists('pyproject.toml');
        const hasComposerJson = fileExists('composer.json');
        const hasPomXml = fileExists('pom.xml') || fileExists('build.gradle');
        const hasCargoToml = fileExists('Cargo.toml');
        const hasGoMod = fileExists('go.mod');

        // فحص بيئة Node.js / JavaScript / TypeScript
        if (hasPackageJson) {
            stack.languages.push('javascript');
            stack.backend.runtime = 'nodejs';
            try {
                const pkg = JSON.parse(readFile('package.json'));
                const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

                if (allDeps['typescript'] || fileExists('tsconfig.json')) {
                    stack.languages.push('typescript');
                    stack.evidence.push('TypeScript detected via config/dependencies');
                }

                // Frontend Frameworks
                if (allDeps['next']) {
                    stack.frontend = { framework: 'nextjs', uiType: 'react-ssr', evidence: ['next in dependencies'] };
                } else if (allDeps['react']) {
                    stack.frontend = { framework: 'react', uiType: 'spa', evidence: ['react in dependencies'] };
                } else if (allDeps['vue'] || allDeps['nuxt']) {
                    stack.frontend = { framework: allDeps['nuxt'] ? 'nuxt' : 'vue', uiType: 'spa', evidence: ['vue/nuxt in dependencies'] };
                } else if (allDeps['@angular/core']) {
                    stack.frontend = { framework: 'angular', uiType: 'spa', evidence: ['angular in dependencies'] };
                } else if (allDeps['svelte'] || allDeps['@sveltejs/kit']) {
                    stack.frontend = { framework: 'svelte', uiType: 'spa', evidence: ['svelte in dependencies'] };
                }

                // Backend Frameworks
                if (allDeps['express']) {
                    stack.backend.framework = 'express';
                    stack.backend.evidence.push('express in dependencies');
                } else if (allDeps['fastify']) {
                    stack.backend.framework = 'fastify';
                    stack.backend.evidence.push('fastify in dependencies');
                } else if (allDeps['@nestjs/core']) {
                    stack.backend.framework = 'nestjs';
                    stack.backend.evidence.push('nestjs in dependencies');
                }

                // Database Drivers / ORMs
                if (allDeps['pg'] || allDeps['postgres']) {
                    stack.database.engine = 'postgresql';
                    stack.database.evidence.push('pg driver detected');
                } else if (allDeps['mysql2'] || allDeps['mysql']) {
                    stack.database.engine = 'mysql';
                    stack.database.evidence.push('mysql driver detected');
                } else if (allDeps['sqlite3'] || allDeps['better-sqlite3']) {
                    stack.database.engine = 'sqlite';
                    stack.database.evidence.push('sqlite driver detected');
                } else if (allDeps['mongoose'] || allDeps['mongodb']) {
                    stack.database.engine = 'mongodb';
                    stack.database.evidence.push('mongodb/mongoose detected');
                }

                if (allDeps['prisma'] || allDeps['@prisma/client']) {
                    stack.database.orm = 'prisma';
                } else if (allDeps['drizzle-orm']) {
                    stack.database.orm = 'drizzle';
                } else if (allDeps['typeorm']) {
                    stack.database.orm = 'typeorm';
                }

                // Cache
                if (allDeps['redis'] || allDeps['ioredis']) {
                    stack.cache.engine = 'redis';
                    stack.cache.evidence.push('redis client detected');
                }

                // Queue
                if (allDeps['bull'] || allDeps['bullmq']) {
                    stack.queue.engine = 'bullmq';
                    stack.queue.evidence.push('bullmq detected');
                } else if (allDeps['amqplib'] || allDeps['kafkajs']) {
                    stack.queue.engine = allDeps['kafkajs'] ? 'kafka' : 'rabbitmq';
                }

                // APIs
                if (allDeps['graphql'] || allDeps['apollo-server']) {
                    stack.api.styles.push('graphql');
                }
                if (allDeps['@trpc/server']) {
                    stack.api.styles.push('trpc');
                }
                if (allDeps['ws'] || allDeps['socket.io']) {
                    stack.api.styles.push('websocket');
                }

                // Testing
                if (allDeps['jest']) stack.testing.frameworks.push('jest');
                if (allDeps['vitest']) stack.testing.frameworks.push('vitest');
                if (allDeps['playwright'] || allDeps['@playwright/test']) stack.testing.frameworks.push('playwright');
                if (allDeps['cypress']) stack.testing.frameworks.push('cypress');
            } catch (e) {}
        }

        // فحص بيئة Python
        if (hasRequirementsTxt) {
            stack.languages.push('python');
            stack.backend.runtime = 'python';
            stack.evidence.push('Python manifest detected');
            const pyContent = (readFile('requirements.txt') + '\n' + readFile('pyproject.toml')).toLowerCase();
            if (pyContent.includes('django')) stack.backend.framework = 'django';
            else if (pyContent.includes('fastapi')) stack.backend.framework = 'fastapi';
            else if (pyContent.includes('flask')) stack.backend.framework = 'flask';

            if (pyContent.includes('psycopg') || pyContent.includes('asyncpg')) stack.database.engine = 'postgresql';
            else if (pyContent.includes('mysql') || pyContent.includes('pymysql')) stack.database.engine = 'mysql';
            else if (pyContent.includes('sqlite')) stack.database.engine = 'sqlite';
            else if (pyContent.includes('pymongo')) stack.database.engine = 'mongodb';

            if (pyContent.includes('redis')) stack.cache.engine = 'redis';
            if (pyContent.includes('celery')) stack.queue.engine = 'celery';
        }

        // فحص بيئة PHP
        if (hasComposerJson) {
            stack.languages.push('php');
            stack.backend.runtime = 'php';
            stack.evidence.push('PHP Composer manifest detected');
            const phpContent = readFile('composer.json').toLowerCase();
            if (phpContent.includes('laravel/framework')) stack.backend.framework = 'laravel';
            else if (phpContent.includes('symfony/framework-bundle')) stack.backend.framework = 'symfony';

            if (phpContent.includes('predis') || phpContent.includes('redis')) stack.cache.engine = 'redis';
        }

        // فحص بيئة Java
        if (hasPomXml) {
            stack.languages.push('java');
            stack.backend.runtime = 'jvm';
            stack.evidence.push('Java Maven/Gradle manifest detected');
            const jvmContent = (readFile('pom.xml') + '\n' + readFile('build.gradle')).toLowerCase();
            if (jvmContent.includes('spring-boot') || jvmContent.includes('springframework')) stack.backend.framework = 'spring-boot';
            if (jvmContent.includes('mongodb') || jvmContent.includes('mongo')) stack.database.engine = 'mongodb';
            if (jvmContent.includes('kafka')) stack.queue.engine = 'kafka';
        }

        // فحص بيئة Rust
        if (hasCargoToml) {
            stack.languages.push('rust');
            stack.backend.runtime = 'native-rust';
            stack.evidence.push('Rust Cargo manifest detected');
            const rustContent = readFile('Cargo.toml').toLowerCase();
            if (rustContent.includes('actix-web')) stack.backend.framework = 'actix-web';
            else if (rustContent.includes('axum')) stack.backend.framework = 'axum';
            if (rustContent.includes('rusqlite') || rustContent.includes('sqlite')) stack.database.engine = 'sqlite';
        }

        // فحص بيئة Go
        if (hasGoMod) {
            stack.languages.push('go');
            stack.backend.runtime = 'native-go';
            stack.evidence.push('Go Module manifest detected');
            const goContent = readFile('go.mod').toLowerCase();
            if (goContent.includes('gin-gonic/gin')) stack.backend.framework = 'gin';
            else if (goContent.includes('gofiber/fiber')) stack.backend.framework = 'fiber';
        }

        // فحص Vanilla Web UI والمجلدات المحلية
        if (fileExists('apps/web/index.html') || fileExists('index.html')) {
            if (stack.frontend.framework === 'none') {
                stack.frontend = { framework: 'vanilla-html-css-js', uiType: 'accessible-web', evidence: ['index.html found in apps/web or root'] };
            }
        }

        // فحص الخادم الموحد الأصلي
        if (fileExists('apps/server/server.js')) {
            if (stack.backend.framework === 'none') {
                stack.backend = { framework: 'native-http-zero-trust', runtime: 'nodejs', evidence: ['apps/server/server.js detected'] };
            }
            stack.api.styles.push('rest');
            stack.auth.strategies.push('scrypt-token-auth');
            stack.testing.frameworks.push('node-test-runner');
        }

        // فحص محول التخزين الهجين وقواعد البيانات المحلية
        if (fileExists('apps/server/db/storage-adapter.js') || fileExists('adapters/db/hybrid-storage-adapter.js')) {
            if (stack.database.engine === 'none') {
                stack.database = { engine: 'hybrid-in-memory-file', orm: 'none', evidence: ['Storage adapter detected'] };
            }
            if (stack.cache.engine === 'none') {
                stack.cache = { engine: 'local-in-memory-ttl', evidence: ['internal cache with TTL detected'] };
            }
        }

        // فحص البنية التحتية
        if (fileExists('Dockerfile')) {
            stack.infrastructure.technologies.push('docker');
        }
        if (fileExists('docker-compose.yml') || fileExists('docker-compose.yaml')) {
            stack.infrastructure.technologies.push('docker-compose');
        }
        if (fileExists('nginx.conf') || fileExists('packages/infrastructure/nginx.conf')) {
            stack.infrastructure.technologies.push('nginx');
        }

        // فحص دعم اللغات و RTL
        if (fileExists('apps/web/index.html')) {
            try {
                const htmlContent = readFile('apps/web/index.html');
                if (htmlContent.includes('dir="rtl"') || htmlContent.includes('lang="ar"')) {
                    stack.localization = { supported: true, rtl: true, evidence: ['dir="rtl" and lang="ar" in index.html'] };
                }
            } catch (e) {}
        }

        // تصنيف نوع المشروع
        if (stack.frontend.framework !== 'none' && stack.backend.framework !== 'none') {
            stack.projectType = 'fullstack-web-application';
        } else if (stack.frontend.framework !== 'none') {
            stack.projectType = 'frontend-web-application';
        } else if (stack.backend.framework !== 'none') {
            stack.projectType = 'backend-service-api';
        } else {
            stack.projectType = 'modular-library-system';
        }

        return stack;
    }
}

module.exports = StackDetector;
