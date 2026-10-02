/**
 * @file adaptive-verification-planner.js
 * @description محرك بناء خطة التحقق المتكيفة بناءً على الـ Stack المكتشف وسياق المشروع الفعلي
 * WebForge Adaptive Verification Planner
 */

class AdaptiveVerificationPlanner {
    /**
     * بناء خطة التحقق الذكية المتكيفة
     * @param {Object} detectedStack ناتج محرك StackDetector
     * @param {Object} envCapabilities إمكانيات البيئة المحلية المتاحة
     * @returns {Object} خطة التحقق المتكيفة
     */
    static planVerification(detectedStack, envCapabilities = {}) {
        const plan = {
            timestamp: new Date().toISOString(),
            projectType: detectedStack.projectType,
            activeVerificationSuites: [],
            notApplicableSuites: [],
            environmentLimitations: [],
            metrics: {
                totalSuites: 0,
                activeCount: 0,
                notApplicableCount: 0,
                limitationCount: 0
            }
        };

        const allPotentialSuites = [
            {
                id: 'SUITE_BACKEND_HTTP',
                name: 'Native Backend & HTTP API Invariants',
                applicableWhen: () => detectedStack.backend.framework !== 'none' || detectedStack.languages.includes('javascript'),
                testPath: 'tests/e2e/server_app.test.js'
            },
            {
                id: 'SUITE_SECURITY_GOVERNANCE',
                name: 'Security Intelligence & Zero-Trust Governance',
                applicableWhen: () => true, // حوكمة الأمان ملزمة لكافة المشاريع
                testPath: 'packages/security/tests/security-governance.test.js'
            },
            {
                id: 'SUITE_ORCHESTRATION_COMPLIANCE',
                name: 'Master Orchestration & Anti-Hallucination Compliance',
                applicableWhen: () => true,
                testPath: 'packages/orchestration/tests/orchestration.test.js'
            },
            {
                id: 'SUITE_ACCESSIBLE_COMPONENTS',
                name: 'Frontend Accessible Components & DOM Logic',
                applicableWhen: () => detectedStack.frontend.framework !== 'none',
                testPath: 'tests/accessible-components.test.js'
            },
            {
                id: 'SUITE_DESIGN_SYSTEM_TOKENS',
                name: 'Design System & CSS Semantic Tokens',
                applicableWhen: () => detectedStack.frontend.framework !== 'none',
                testPath: 'tests/design-system.test.js'
            },
            {
                id: 'SUITE_POSTGRESQL_LIVE',
                name: 'PostgreSQL Live ACID & Migration Test',
                applicableWhen: () => detectedStack.database.engine === 'postgresql',
                requiresEnv: 'postgres_live',
                testPath: 'tests/db/postgres-live.test.js'
            },
            {
                id: 'SUITE_REDIS_LIVE',
                name: 'Redis Distributed Cache & Key Expiry Test',
                applicableWhen: () => detectedStack.cache.engine === 'redis',
                requiresEnv: 'redis_live',
                testPath: 'tests/cache/redis-live.test.js'
            },
            {
                id: 'SUITE_PLAYWRIGHT_BROWSER_E2E',
                name: 'Headless Chromium Playwright Visual Interaction',
                applicableWhen: () => detectedStack.frontend.framework !== 'none' && detectedStack.testing.frameworks.includes('playwright'),
                requiresEnv: 'playwright_browser',
                testPath: 'tests/e2e/browser.test.js'
            },
            {
                id: 'SUITE_DOCKER_CONTAINER_RUNTIME',
                name: 'Docker Container Runtime & Non-Root Execution',
                applicableWhen: () => detectedStack.infrastructure.technologies.includes('docker'),
                requiresEnv: 'docker_daemon',
                testPath: 'tests/infrastructure-hardening.test.js'
            },
            {
                id: 'SUITE_KAFKA_MESSAGING',
                name: 'Apache Kafka Event Streams & Partitioning',
                applicableWhen: () => detectedStack.queue.engine === 'kafka',
                requiresEnv: 'kafka_broker'
            },
            {
                id: 'SUITE_GRAPHQL_SECURITY',
                name: 'GraphQL Query Depth & Introspection Protection',
                applicableWhen: () => detectedStack.api.styles.includes('graphql'),
                testPath: 'packages/security/tests/expanded-security.test.js'
            }
        ];

        allPotentialSuites.forEach(suite => {
            plan.metrics.totalSuites++;
            const isApplicable = suite.applicableWhen();

            if (!isApplicable) {
                plan.notApplicableSuites.push({
                    id: suite.id,
                    name: suite.name,
                    status: 'NOT_APPLICABLE',
                    reason: `Technology is not part of project stack (Engine: ${detectedStack.database.engine}, Cache: ${detectedStack.cache.engine}, Queue: ${detectedStack.queue.engine})`
                });
                plan.metrics.notApplicableCount++;
            } else {
                // إذا كانت الميزة مطلوبة، نفحص توفر البيئة
                if (suite.requiresEnv && !envCapabilities[suite.requiresEnv]) {
                    plan.environmentLimitations.push({
                        id: suite.id,
                        name: suite.name,
                        status: 'ENVIRONMENT_LIMITATION',
                        reason: `Requires '${suite.requiresEnv}' which is not active in current host environment`
                    });
                    plan.metrics.limitationCount++;
                } else {
                    plan.activeVerificationSuites.push({
                        id: suite.id,
                        name: suite.name,
                        testPath: suite.testPath,
                        status: 'ACTIVE_FOR_EXECUTION'
                    });
                    plan.metrics.activeCount++;
                }
            }
        });

        return plan;
    }
}

module.exports = AdaptiveVerificationPlanner;
