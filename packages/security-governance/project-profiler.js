/**
 * @file project-profiler.js
 * @description محرك توصيف أمان المشروع واكتشاف الخصائص وتفعيل القواعد الأمنية السياقية
 * WebForge OS Security Intelligence & Governance System
 */

const fs = require('fs');
const path = require('path');

class ProjectSecurityProfiler {
    /**
     * تحليل وتوصيف أمان المشروع بناءً على الأدلة البرمجية في المستودع
     * @param {string} rootDir مسار جذر المشروع
     * @returns {Object} ملف تعريف الأمان المنظم (Project Security Profile)
     */
    static profileProject(rootDir = process.cwd()) {
        const profile = {
            timestamp: new Date().toISOString(),
            rootDir,
            project: {
                name: 'unknown',
                type: 'modular-monolith',
                stack: {
                    languages: [],
                    frameworks: [],
                    runtimes: ['nodejs']
                },
                architecture: 'layered-security'
            },
            capabilities: {
                authentication: false,
                authorization: false,
                multi_tenant: false,
                payments: false,
                file_uploads: false,
                external_apis: false,
                webhooks: false,
                graphql: false,
                websockets: false,
                ai: false,
                rag: false,
                vector_db: false,
                pii: false,
                database: false,
                cloud: false,
                containers: false,
                cicd: false,
                admin_functions: false
            },
            activeSecurityControls: [],
            excludedControls: [],
            evidence: []
        };

        // 1. فحص package.json
        const pkgPath = path.join(rootDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                profile.project.name = pkg.name || path.basename(rootDir);
                profile.project.stack.languages.push('javascript');
                profile.evidence.push(`Found package.json with name: ${profile.project.name}`);

                const allDeps = {
                    ...(pkg.dependencies || {}),
                    ...(pkg.devDependencies || {})
                };

                if (allDeps['express'] || allDeps['koa'] || allDeps['fastify'] || allDeps['next']) {
                    profile.project.stack.frameworks.push('web-framework');
                    profile.capabilities.external_apis = true;
                }
                if (allDeps['graphql'] || allDeps['apollo-server']) {
                    profile.capabilities.graphql = true;
                    profile.evidence.push('GraphQL dependencies detected');
                }
                if (allDeps['stripe'] || allDeps['paypal-rest-sdk']) {
                    profile.capabilities.payments = true;
                    profile.evidence.push('Payment SDK detected');
                }
                if (allDeps['multer'] || allDeps['formidable'] || allDeps['busboy']) {
                    profile.capabilities.file_uploads = true;
                    profile.evidence.push('File upload libraries detected');
                }
                if (allDeps['openai'] || allDeps['@google/genai'] || allDeps['langchain']) {
                    profile.capabilities.ai = true;
                    profile.evidence.push('AI / LLM SDK detected');
                }
                if (allDeps['chromadb'] || allDeps['pinecone-client'] || allDeps['pgvector']) {
                    profile.capabilities.vector_db = true;
                    profile.capabilities.rag = true;
                    profile.evidence.push('Vector DB / RAG detected');
                }
                if (allDeps['pg'] || allDeps['mysql2'] || allDeps['mongoose'] || allDeps['prisma']) {
                    profile.capabilities.database = true;
                    profile.evidence.push('Database driver detected');
                }
            } catch (err) {
                profile.evidence.push(`Error parsing package.json: ${err.message}`);
            }
        }

        // 2. فحص بنية المجلدات للكشف عن القدرات الأمنية والميزات
        if (fs.existsSync(path.join(rootDir, 'packages', 'security'))) {
            profile.capabilities.authentication = true;
            profile.capabilities.authorization = true;
            profile.capabilities.multi_tenant = true;
            profile.capabilities.file_uploads = true;
            profile.capabilities.ai = true;
            profile.capabilities.webhooks = true;
            profile.capabilities.graphql = true;
            profile.capabilities.pii = true;
            profile.evidence.push('Detected comprehensive packages/security module');
        }

        // 3. فحص الحاويات والسحابة و CI/CD
        if (fs.existsSync(path.join(rootDir, 'Dockerfile')) || fs.existsSync(path.join(rootDir, 'packages', 'infrastructure', 'Dockerfile.hardened'))) {
            profile.capabilities.containers = true;
            profile.evidence.push('Container Dockerfile detected');
        }
        if (fs.existsSync(path.join(rootDir, '.github', 'workflows')) || fs.existsSync(path.join(rootDir, '.gitlab-ci.yml'))) {
            profile.capabilities.cicd = true;
            profile.evidence.push('CI/CD Workflows detected');
        }

        // 4. تفعيل القواعد وضوابط الأمان السياقية (Context-Aware Control Activation)
        this.activateSecurityControls(profile);

        return profile;
    }

    /**
     * تفعيل أو استثناء الضوابط الأمنية بناءً على سياق المشروع المكتشف
     * @param {Object} profile 
     */
    static activateSecurityControls(profile) {
        const ruleMatrix = [
            { id: 'SEC-AUTH-01', name: 'Authentication & Session Rotation', requires: 'authentication' },
            { id: 'SEC-AUTHZ-01', name: 'RBAC/ABAC Least Privilege & IDOR Defense', requires: 'authorization' },
            { id: 'SEC-TENANT-01', name: 'Strict Multi-Tenant Isolation', requires: 'multi_tenant' },
            { id: 'SEC-FILE-01', name: 'Anti-Path Traversal & Zip Slip File Guard', requires: 'file_uploads' },
            { id: 'SEC-AI-01', name: 'Prompt Injection Defense & Tool Whitelisting', requires: 'ai' },
            { id: 'SEC-RAG-01', name: 'Pre-Retrieval Context & Vector Isolation', requires: 'rag' },
            { id: 'SEC-HOOK-01', name: 'HMAC Webhook Timing-Safe Verification', requires: 'webhooks' },
            { id: 'SEC-GQL-01', name: 'GraphQL Query Depth Limiting & Anti-Introspection', requires: 'graphql' },
            { id: 'SEC-PAY-01', name: 'Idempotent Payment & Anti-Double Execution', requires: 'payments' },
            { id: 'SEC-PRIV-01', name: 'PII Scrubbing & Secrets Masking', requires: 'pii' },
            { id: 'SEC-CONT-01', name: 'Non-Root Container & Hardened Runtime', requires: 'containers' },
            { id: 'SEC-CICD-01', name: 'CI/CD Pipeline Security & Action Pinning', requires: 'cicd' }
        ];

        ruleMatrix.forEach(rule => {
            if (profile.capabilities[rule.requires]) {
                profile.activeSecurityControls.push({
                    id: rule.id,
                    name: rule.name,
                    status: 'ACTIVATED',
                    reason: `Capability '${rule.requires}' is present in project`
                });
            } else {
                profile.excludedControls.push({
                    id: rule.id,
                    name: rule.name,
                    status: 'NOT_APPLICABLE',
                    reason: `Capability '${rule.requires}' is absent in project`
                });
            }
        });
    }
}

module.exports = ProjectSecurityProfiler;
