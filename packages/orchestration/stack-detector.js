/**
 * @file stack-detector.js
 * @description محرك الاستكشاف والتكيف الشامل مع لغات وأطر عمل وقواعد بيانات ومكونات المشروع
 * WebForge Adaptive Stack & Capability Detection Engine (Hardened with Manifests & Lockfiles)
 */

const fs = require('fs');
const path = require('path');

class StackDetector {
    /**
     * اكتشاف الـ Stack الفعلي والقدرات والمكونات المعمارية للمشروع بناءً على الأدلة الصارمة
     * @param {string|Object} target مسار جذر المشروع أو كائن ملفات افتراضي للـ Benchmarks
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
            try {
                return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
            } catch (e) {
                return '';
            }
        };

        const stack = {
            timestamp: new Date().toISOString(),
            rootDir,
            projectType: 'unknown',
            languages: [],
            manifests: [],
            lockfiles: [],
            frontend: { framework: 'none', uiType: 'none', confidence: 'NOT_DETECTED', evidence: [] },
            backend: { framework: 'none', runtime: 'none', confidence: 'NOT_DETECTED', evidence: [] },
            database: { engine: 'none', orm: 'none', driver: 'none', confidence: 'NOT_DETECTED', evidence: [] },
            cache: { engine: 'none', confidence: 'NOT_DETECTED', evidence: [] },
            queue: { engine: 'none', confidence: 'NOT_DETECTED', evidence: [] },
            api: { styles: [], confidence: 'NOT_DETECTED', evidence: [] },
            auth: { strategies: [], confidence: 'NOT_DETECTED', evidence: [] },
            testing: { frameworks: [], confidence: 'NOT_DETECTED', evidence: [] },
            infrastructure: { technologies: [], confidence: 'NOT_DETECTED', evidence: [] },
            localization: { supported: false, rtl: false, confidence: 'NOT_DETECTED', evidence: [] },
            ai: { enabled: false, technologies: [], confidence: 'NOT_DETECTED', evidence: [] },
            evidence: []
        };

        // 1. فحص ملفات التعريف والحزم وملفات القفل (Manifests & Lockfiles)
        const manifestMap = [
            { file: 'package.json', type: 'npm-manifest', lang: 'javascript' },
            { file: 'package-lock.json', type: 'npm-lockfile', isLock: true },
            { file: 'pnpm-lock.yaml', type: 'pnpm-lockfile', isLock: true },
            { file: 'yarn.lock', type: 'yarn-lockfile', isLock: true },
            { file: 'requirements.txt', type: 'python-pip-manifest', lang: 'python' },
            { file: 'pyproject.toml', type: 'python-poetry-manifest', lang: 'python' },
            { file: 'poetry.lock', type: 'python-poetry-lockfile', isLock: true },
            { file: 'Pipfile', type: 'pipfile-manifest', lang: 'python' },
            { file: 'Pipfile.lock', type: 'pipfile-lock', isLock: true },
            { file: 'composer.json', type: 'composer-manifest', lang: 'php' },
            { file: 'composer.lock', type: 'composer-lockfile', isLock: true },
            { file: 'pom.xml', type: 'maven-manifest', lang: 'java' },
            { file: 'build.gradle', type: 'gradle-manifest', lang: 'java' },
            { file: 'build.gradle.kts', type: 'gradle-kts-manifest', lang: 'java' },
            { file: 'Cargo.toml', type: 'cargo-manifest', lang: 'rust' },
            { file: 'Cargo.lock', type: 'cargo-lockfile', isLock: true },
            { file: 'go.mod', type: 'go-module-manifest', lang: 'go' },
            { file: 'go.sum', type: 'go-sum-lockfile', isLock: true },
            { file: 'Gemfile', type: 'ruby-gemfile', lang: 'ruby' },
            { file: 'Gemfile.lock', type: 'ruby-lockfile', isLock: true },
            { file: 'mix.exs', type: 'elixir-manifest', lang: 'elixir' }
        ];

        for (const m of manifestMap) {
            if (fileExists(m.file)) {
                if (m.isLock) {
                    stack.lockfiles.push(m.file);
                } else {
                    stack.manifests.push(m.file);
                    if (m.lang && !stack.languages.includes(m.lang)) {
                        stack.languages.push(m.lang);
                    }
                }
            }
        }

        // فحص بيئة Node.js / JavaScript / TypeScript
        if (fileExists('package.json')) {
            stack.backend.runtime = 'nodejs';
            try {
                const pkg = JSON.parse(readFile('package.json'));
                const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

                if (allDeps['typescript'] || fileExists('tsconfig.json')) {
                    if (!stack.languages.includes('typescript')) stack.languages.push('typescript');
                    stack.evidence.push('TypeScript detected via tsconfig.json/dependencies');
                }

                // Frontend Frameworks
                if (allDeps['next']) {
                    stack.frontend = { framework: 'nextjs', uiType: 'react-ssr', confidence: 'DETECTED', evidence: ['next in dependencies'] };
                } else if (allDeps['react']) {
                    stack.frontend = { framework: 'react', uiType: 'spa', confidence: 'DETECTED', evidence: ['react in dependencies'] };
                } else if (allDeps['vue'] || allDeps['nuxt']) {
                    stack.frontend = { framework: allDeps['nuxt'] ? 'nuxt' : 'vue', uiType: 'spa', confidence: 'DETECTED', evidence: ['vue/nuxt in dependencies'] };
                } else if (allDeps['@angular/core']) {
                    stack.frontend = { framework: 'angular', uiType: 'spa', confidence: 'DETECTED', evidence: ['angular in dependencies'] };
                } else if (allDeps['svelte'] || allDeps['@sveltejs/kit']) {
                    stack.frontend = { framework: 'svelte', uiType: 'spa', confidence: 'DETECTED', evidence: ['svelte in dependencies'] };
                }

                // Backend Frameworks
                if (allDeps['express']) {
                    stack.backend.framework = 'express';
                    stack.backend.confidence = 'DETECTED';
                    stack.backend.evidence.push('express in dependencies');
                } else if (allDeps['fastify']) {
                    stack.backend.framework = 'fastify';
                    stack.backend.confidence = 'DETECTED';
                    stack.backend.evidence.push('fastify in dependencies');
                } else if (allDeps['@nestjs/core']) {
                    stack.backend.framework = 'nestjs';
                    stack.backend.confidence = 'DETECTED';
                    stack.backend.evidence.push('nestjs in dependencies');
                }

                // Database Drivers
                if (allDeps['pg'] || allDeps['postgres']) {
                    stack.database.driver = 'pg';
                    stack.database.engine = 'postgresql';
                    stack.database.confidence = 'PROBABLE';
                    stack.database.evidence.push('pg driver detected');
                } else if (allDeps['mysql2'] || allDeps['mysql']) {
                    stack.database.driver = 'mysql2';
                    stack.database.engine = 'mysql';
                    stack.database.confidence = 'PROBABLE';
                    stack.database.evidence.push('mysql driver detected');
                } else if (allDeps['sqlite3'] || allDeps['better-sqlite3']) {
                    stack.database.driver = 'sqlite3';
                    stack.database.engine = 'sqlite';
                    stack.database.confidence = 'PROBABLE';
                    stack.database.evidence.push('sqlite driver detected');
                } else if (allDeps['mongoose'] || allDeps['mongodb']) {
                    stack.database.driver = 'mongodb';
                    stack.database.engine = 'mongodb';
                    stack.database.confidence = 'PROBABLE';
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
                    stack.cache.confidence = 'PROBABLE';
                    stack.cache.evidence.push('redis client detected');
                }

                // Queue
                if (allDeps['bull'] || allDeps['bullmq']) {
                    stack.queue.engine = 'bullmq';
                    stack.queue.confidence = 'PROBABLE';
                    stack.queue.evidence.push('bullmq detected');
                } else if (allDeps['amqplib'] || allDeps['kafkajs']) {
                    stack.queue.engine = allDeps['kafkajs'] ? 'kafka' : 'rabbitmq';
                    stack.queue.confidence = 'PROBABLE';
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
        if (fileExists('requirements.txt') || fileExists('pyproject.toml') || fileExists('Pipfile')) {
            stack.backend.runtime = 'python';
            stack.evidence.push('Python manifest/lockfile detected');
            const pyContent = (readFile('requirements.txt') + '\n' + readFile('pyproject.toml') + '\n' + readFile('Pipfile')).toLowerCase();
            if (pyContent.includes('django')) {
                stack.backend.framework = 'django';
                stack.backend.confidence = 'DETECTED';
            } else if (pyContent.includes('fastapi')) {
                stack.backend.framework = 'fastapi';
                stack.backend.confidence = 'DETECTED';
            } else if (pyContent.includes('flask')) {
                stack.backend.framework = 'flask';
                stack.backend.confidence = 'DETECTED';
            }

            if (pyContent.includes('psycopg') || pyContent.includes('asyncpg')) {
                stack.database.engine = 'postgresql';
                stack.database.confidence = 'PROBABLE';
            } else if (pyContent.includes('mysql') || pyContent.includes('pymysql')) {
                stack.database.engine = 'mysql';
                stack.database.confidence = 'PROBABLE';
            } else if (pyContent.includes('sqlite')) {
                stack.database.engine = 'sqlite';
                stack.database.confidence = 'PROBABLE';
            } else if (pyContent.includes('pymongo')) {
                stack.database.engine = 'mongodb';
                stack.database.confidence = 'PROBABLE';
            }

            if (pyContent.includes('redis')) {
                stack.cache.engine = 'redis';
                stack.cache.confidence = 'PROBABLE';
            }
            if (pyContent.includes('celery')) {
                stack.queue.engine = 'celery';
                stack.queue.confidence = 'PROBABLE';
            }
        }

        // فحص بيئة PHP
        if (fileExists('composer.json')) {
            stack.backend.runtime = 'php';
            stack.evidence.push('PHP Composer manifest detected');
            const phpContent = readFile('composer.json').toLowerCase();
            if (phpContent.includes('laravel/framework')) {
                stack.backend.framework = 'laravel';
                stack.backend.confidence = 'DETECTED';
            } else if (phpContent.includes('symfony/framework-bundle')) {
                stack.backend.framework = 'symfony';
                stack.backend.confidence = 'DETECTED';
            }

            if (phpContent.includes('predis') || phpContent.includes('redis')) {
                stack.cache.engine = 'redis';
                stack.cache.confidence = 'PROBABLE';
            }
        }

        // فحص بيئة Java
        if (fileExists('pom.xml') || fileExists('build.gradle') || fileExists('build.gradle.kts')) {
            stack.backend.runtime = 'jvm';
            stack.evidence.push('Java Maven/Gradle manifest detected');
            const jvmContent = (readFile('pom.xml') + '\n' + readFile('build.gradle') + '\n' + readFile('build.gradle.kts')).toLowerCase();
            if (jvmContent.includes('spring-boot') || jvmContent.includes('springframework')) {
                stack.backend.framework = 'spring-boot';
                stack.backend.confidence = 'DETECTED';
            }
            if (jvmContent.includes('mongodb') || jvmContent.includes('mongo')) {
                stack.database.engine = 'mongodb';
                stack.database.confidence = 'PROBABLE';
            }
            if (jvmContent.includes('kafka')) {
                stack.queue.engine = 'kafka';
                stack.queue.confidence = 'PROBABLE';
            }
        }

        // فحص بيئة Rust
        if (fileExists('Cargo.toml')) {
            stack.backend.runtime = 'native-rust';
            stack.evidence.push('Rust Cargo manifest detected');
            const rustContent = readFile('Cargo.toml').toLowerCase();
            if (rustContent.includes('actix-web')) {
                stack.backend.framework = 'actix-web';
                stack.backend.confidence = 'DETECTED';
            } else if (rustContent.includes('axum')) {
                stack.backend.framework = 'axum';
                stack.backend.confidence = 'DETECTED';
            }
            if (rustContent.includes('rusqlite') || rustContent.includes('sqlite')) {
                stack.database.engine = 'sqlite';
                stack.database.confidence = 'PROBABLE';
            }
        }

        // فحص بيئة Go
        if (fileExists('go.mod')) {
            stack.backend.runtime = 'native-go';
            stack.evidence.push('Go Module manifest detected');
            const goContent = readFile('go.mod').toLowerCase();
            if (goContent.includes('gin-gonic/gin')) {
                stack.backend.framework = 'gin';
                stack.backend.confidence = 'DETECTED';
            } else if (goContent.includes('gofiber/fiber')) {
                stack.backend.framework = 'fiber';
                stack.backend.confidence = 'DETECTED';
            }
        }

        // فحص بيئة C# / .NET
        if (fileExists('appsettings.json') || fileExists('Program.cs')) {
            if (!stack.languages.includes('csharp')) stack.languages.push('csharp');
            stack.backend.runtime = 'dotnet';
            stack.backend.confidence = 'DETECTED';
        }

        // فحص Vanilla Web UI والمجلدات المحلية
        if (fileExists('apps/web/index.html') || fileExists('index.html')) {
            if (stack.frontend.framework === 'none') {
                stack.frontend = { framework: 'vanilla-html-css-js', uiType: 'accessible-web', confidence: 'DETECTED', evidence: ['index.html found in apps/web or root'] };
            }
        }

        // فحص الخادم الموحد الأصلي
        if (fileExists('apps/server/server.js')) {
            if (stack.backend.framework === 'none') {
                stack.backend = { framework: 'native-http-zero-trust', runtime: 'nodejs', confidence: 'DETECTED', evidence: ['apps/server/server.js detected'] };
            }
            stack.api.styles.push('rest');
            stack.api.confidence = 'DETECTED';
            stack.auth.strategies.push('scrypt-token-auth');
            stack.auth.confidence = 'DETECTED';
            stack.testing.frameworks.push('node-test-runner');
            stack.testing.confidence = 'DETECTED';
        }

        // فحص محول التخزين الهجين وقواعد البيانات المحلية
        if (fileExists('apps/server/db/storage-adapter.js') || fileExists('adapters/db/hybrid-storage-adapter.js')) {
            if (stack.database.engine === 'none') {
                stack.database = { engine: 'hybrid-in-memory-file', orm: 'none', confidence: 'DETECTED', evidence: ['Storage adapter detected'] };
            }
            if (stack.cache.engine === 'none') {
                stack.cache = { engine: 'local-in-memory-ttl', confidence: 'DETECTED', evidence: ['internal cache with TTL detected'] };
            }
        }

        // فحص البنية التحتية
        if (fileExists('Dockerfile')) {
            stack.infrastructure.technologies.push('docker');
            stack.infrastructure.confidence = 'DETECTED';
        }
        if (fileExists('docker-compose.yml') || fileExists('docker-compose.yaml') || fileExists('compose.yml')) {
            stack.infrastructure.technologies.push('docker-compose');
            stack.infrastructure.confidence = 'DETECTED';
        }
        if (fileExists('nginx.conf') || fileExists('packages/infrastructure/nginx.conf')) {
            stack.infrastructure.technologies.push('nginx');
            stack.infrastructure.confidence = 'DETECTED';
        }

        // فحص دعم اللغات و RTL
        if (fileExists('apps/web/index.html')) {
            try {
                const htmlContent = readFile('apps/web/index.html');
                if (htmlContent.includes('dir="rtl"') || htmlContent.includes('lang="ar"')) {
                    stack.localization = { supported: true, rtl: true, confidence: 'DETECTED', evidence: ['dir="rtl" and lang="ar" in index.html'] };
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
