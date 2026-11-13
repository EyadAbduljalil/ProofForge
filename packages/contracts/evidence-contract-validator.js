/**
 * @file evidence-contract-validator.js
 * @description مدقق وموثق عقود الأدلة الحتمية الصارمة (Strict Evidence Contract Validator)
 * 
 * يفرض السلسلة الحتمية الكاملة للإثبات:
 * متطلب (Requirement) -> دليل موحد (Evidence) -> مدقق تخصصي (Specialized Verifier) -> نتيجة فحص (Check Result) -> مخرج مادي محصن (Artifact Hash)
 * 
 * يحظر تماماً المطابقة بالكلمات المفتاحية أو النصوص الجزئية،
 * ويفرض الفصل التام بين منتج المخرج ومدققه المستقل.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PathLoaderGuard = require('./path-loader-guard');

class EvidenceContractValidator {
    /**
     * جدول المطابقة الكنسية الصارمة للمتطلبات والفحوصات التخصصية
     * يمنع أي مطابقة عشوائية أو مبنية على الشبه النصي (No Keyword Guessing)
     */
    static CANONICAL_EVIDENCE_MAP = Object.freeze({
        // 1. مهارة الهندسة المعمارية (Architecture)
        'architecture:ADR_DOCUMENT': {
            requiredCheckId: 'Clean Architecture Dependency Invariant',
            expectedArtifact: 'ADR-001.md',
            verifierScript: 'skills/architecture/scripts/verify_architecture.js'
        },
        'architecture:SYSTEM_DIAGRAM': {
            requiredCheckId: 'State Machine Formalism Engine',
            expectedArtifact: null,
            verifierScript: 'skills/architecture/scripts/verify_architecture.js'
        },
        'architecture:DOMAIN_INVARIANTS': {
            requiredCheckId: 'Engineering Invariant Graph Engine',
            expectedArtifact: null,
            verifierScript: 'skills/architecture/scripts/verify_architecture.js'
        },

        // 2. مهارة الأمان الصارم (Security)
        'security:THREAT_MODEL': {
            requiredCheckId: 'Multi-Tenant Anti-IDOR Ownership Guard',
            expectedArtifact: 'THREAT_MODEL.json',
            verifierScript: 'skills/security/scripts/verify_security.js'
        },
        'security:AUTH_BOUNDARY_MATRIX': {
            requiredCheckId: 'Constant-Time Password Verification',
            expectedArtifact: null,
            verifierScript: 'skills/security/scripts/verify_security.js'
        },
        'security:OWASP_ASVS_CHECKLIST': {
            requiredCheckId: 'Anti-Injection & Prototype Pollution Sanitization',
            expectedArtifact: null,
            verifierScript: 'skills/security/scripts/verify_security.js'
        },

        // 3. مهارة مكافحة الكسل البرمجي (Anti-Laziness)
        'anti-laziness:ZERO_PLACEHOLDER_PROOF': {
            requiredCheckId: 'Zero Laziness Violation Invariant',
            expectedArtifact: null,
            verifierScript: 'skills/anti-laziness/scripts/scan_laziness.js'
        },
        'anti-laziness:FULL_IMPLEMENTATION_VERIFICATION': {
            requiredCheckId: 'Production Source Files Discovery',
            expectedArtifact: null,
            verifierScript: 'skills/anti-laziness/scripts/scan_laziness.js'
        },

        // 4. مهارة قواعد البيانات وعزل المستأجرين (Database)
        'database:MIGRATION_SCRIPTS': {
            requiredCheckId: 'Migration Files Presence',
            expectedArtifact: 'apps/server/db/migrations/001_initial.sql',
            verifierScript: 'skills/database/scripts/verify_database.js'
        },
        'database:TENANT_ISOLATION_PROOF': {
            requiredCheckId: 'Multi-Tenant Column Isolation (tenant_id)',
            expectedArtifact: null,
            verifierScript: 'skills/database/scripts/verify_database.js'
        },
        'database:ACID_TRANSACTION_TESTS': {
            requiredCheckId: 'Transaction Atomicity Capability',
            expectedArtifact: null,
            verifierScript: 'skills/database/scripts/verify_database.js'
        },

        // 5. مهارة الخدمات الخلفية (Backend)
        'backend:SERVICE_LAYER_IMPLEMENTATION': {
            requiredCheckId: 'Persistent Storage Adapter',
            expectedArtifact: 'apps/server/server.js',
            verifierScript: 'skills/backend/scripts/verify_backend.js'
        },
        'backend:RATE_LIMITER_CONFIG': {
            requiredCheckId: 'Rate Limiting Integration',
            expectedArtifact: null,
            verifierScript: 'skills/backend/scripts/verify_backend.js'
        },
        'backend:HEALTH_PROBES': {
            requiredCheckId: 'Liveness Probe (/healthz)',
            expectedArtifact: null,
            verifierScript: 'skills/backend/scripts/verify_backend.js'
        },

        // 6. مهارة عقود الواجهات البرمجية (API)
        'api:OPENAPI_CONTRACT': {
            requiredCheckId: 'Semantic API Route Versioning (/api/v1/)',
            expectedArtifact: 'openapi.json',
            verifierScript: 'skills/api/scripts/verify_api.js'
        },
        'api:IDEMPOTENCY_TESTS': {
            requiredCheckId: 'Mutation Idempotency Enforcement',
            expectedArtifact: null,
            verifierScript: 'skills/api/scripts/verify_api.js'
        },
        'api:INPUT_VALIDATION_SCHEMA': {
            requiredCheckId: 'Server-Side Request Body Sanitization',
            expectedArtifact: null,
            verifierScript: 'skills/api/scripts/verify_api.js'
        },

        // 7. مهارة التجارة الإلكترونية (Ecommerce)
        'ecommerce:IDEMPOTENT_CHECKOUT_PROOF': {
            requiredCheckId: 'Checkout Idempotency Replay Protection',
            expectedArtifact: null,
            verifierScript: 'skills/ecommerce/scripts/verify_ecommerce.js'
        },
        'ecommerce:INVENTORY_RACE_TESTS': {
            requiredCheckId: 'Inventory Stock Validation & Deduction',
            expectedArtifact: null,
            verifierScript: 'skills/ecommerce/scripts/verify_ecommerce.js'
        },
        'ecommerce:WEBHOOK_HMAC_VERIFICATION': {
            requiredCheckId: 'Timing-Safe HMAC Webhook Verification',
            expectedArtifact: null,
            verifierScript: 'skills/ecommerce/scripts/verify_ecommerce.js'
        },

        // 8. مهارة النشر والحاويات (Deployment)
        'deployment:NON_ROOT_DOCKERFILE': {
            requiredCheckId: 'Non-Root Container Runtime Execution (USER)',
            expectedArtifact: 'Dockerfile',
            verifierScript: 'skills/deployment/scripts/verify_deployment.js'
        },
        'deployment:LOCKFILE_REPRODUCIBILITY': {
            requiredCheckId: 'Deterministic Package Installation (npm ci)',
            expectedArtifact: null,
            verifierScript: 'skills/deployment/scripts/verify_deployment.js'
        },
        'deployment:ZERO_SECRET_LEAK_AUDIT': {
            requiredCheckId: 'Multi-Stage Docker Build Isolation',
            expectedArtifact: null,
            verifierScript: 'skills/deployment/scripts/verify_deployment.js'
        },

        // 9. مهارة نظام التصميم والرموز (Design System)
        'design-system:DESIGN_TOKENS_JSON': {
            requiredCheckId: 'Core Tokens Definition (tokens.css)',
            expectedArtifact: null,
            verifierScript: 'skills/design-system/scripts/verify_design_system.js'
        },
        'design-system:COLOR_SCALE_MATRIX': {
            requiredCheckId: 'Color Palette Design Tokens',
            expectedArtifact: null,
            verifierScript: 'skills/design-system/scripts/verify_design_system.js'
        },
        'design-system:TYPOGRAPHY_SYSTEM': {
            requiredCheckId: 'Spacing Scale Tokens',
            expectedArtifact: null,
            verifierScript: 'skills/design-system/scripts/verify_design_system.js'
        },

        // 10. مهارة الواجهات الأمامية (Frontend)
        'frontend:COMPONENT_HIERARCHY': {
            requiredCheckId: 'Reusable UI Components Count',
            expectedArtifact: null,
            verifierScript: 'skills/frontend/scripts/verify_frontend.js'
        },
        'frontend:CLIENT_STATE_BOUNDARIES': {
            requiredCheckId: 'Client DOM Event Binding',
            expectedArtifact: null,
            verifierScript: 'skills/frontend/scripts/verify_frontend.js'
        },
        'frontend:CHUNK_OPTIMIZATION': {
            requiredCheckId: 'Async UI Error Handling',
            expectedArtifact: null,
            verifierScript: 'skills/frontend/scripts/verify_frontend.js'
        },

        // 11. مهارة إمكانية الوصول (Accessibility)
        'accessibility:WCAG_2_2_AAA_AUDIT': {
            requiredCheckId: 'Button Accessible Names (apps\\web\\index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/accessibility/scripts/audit_a11y.js'
        },
        'accessibility:KEYBOARD_NAVIGATION_TEST': {
            requiredCheckId: 'Keyboard Focus Outline Preservation',
            expectedArtifact: null,
            verifierScript: 'skills/accessibility/scripts/audit_a11y.js'
        },
        'accessibility:ARIA_LABELS_VERIFICATION': {
            requiredCheckId: 'Form Input Accessibility (apps\\web\\index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/accessibility/scripts/audit_a11y.js'
        },

        // 12. مهارة الاختبارات المؤتمتة (Testing)
        'testing:ZERO_MOCK_VERIFICATION': {
            requiredCheckId: 'Zero Empty/Mock Test Bodies Invariant',
            expectedArtifact: null,
            verifierScript: 'skills/testing/scripts/verify_testing.js'
        },
        'testing:EVIDENCE_CONTRACT_VALIDATION': {
            requiredCheckId: 'Assertion Density & Deterministic Evidence',
            expectedArtifact: null,
            verifierScript: 'skills/testing/scripts/verify_testing.js'
        },
        'testing:DETERMINISTIC_PASS_SUITE': {
            requiredCheckId: 'Automated Test Suite Discovery',
            expectedArtifact: null,
            verifierScript: 'skills/testing/scripts/verify_testing.js'
        },

        // 13. مهارة الأداء (Performance)
        'performance:LIGHTHOUSE_90_BUDGET': {
            requiredCheckId: 'Non-Blocking Head Scripts (apps\\web\\index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/performance/scripts/verify_performance.js'
        },
        'performance:CORE_WEB_VITALS_REPORT': {
            requiredCheckId: 'Cumulative Layout Shift (CLS) Image Attributes (apps\\web\\index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/performance/scripts/verify_performance.js'
        },
        'performance:MEMORY_LEAK_CHECK': {
            requiredCheckId: 'Timer Cleanup & Memory Leak Guard (app.js)',
            expectedArtifact: null,
            verifierScript: 'skills/performance/scripts/verify_performance.js'
        },

        // 14. مهارة لوحات البيانات (Dashboards)
        'dashboards:DATA_VIRTUALIZATION_TEST': {
            requiredCheckId: 'High-Density Dashboard Grid Layout',
            expectedArtifact: null,
            verifierScript: 'skills/dashboards/scripts/verify_dashboards.js'
        },
        'dashboards:REALTIME_SYNC_PROOF': {
            requiredCheckId: 'Real-Time Activity & Audit Log Stream View',
            expectedArtifact: null,
            verifierScript: 'skills/dashboards/scripts/verify_dashboards.js'
        },
        'dashboards:KPI_CARD_DENSITY': {
            requiredCheckId: 'System Health Status Indicator Widget',
            expectedArtifact: null,
            verifierScript: 'skills/dashboards/scripts/verify_dashboards.js'
        },

        // 15. مهارة الجاهزية للإنتاج (Production Readiness)
        'production-readiness:12_FACTOR_AUDIT': {
            requiredCheckId: 'Graceful Termination Lifecycle (SIGTERM/SIGINT)',
            expectedArtifact: null,
            verifierScript: 'skills/production-readiness/scripts/verify_production_readiness.js'
        },
        'production-readiness:HEALTHZ_READYZ_PROBES': {
            requiredCheckId: 'Kubernetes/Container Health Probes (/healthz, /readyz)',
            expectedArtifact: null,
            verifierScript: 'skills/production-readiness/scripts/verify_production_readiness.js'
        },
        'production-readiness:STRUCTURED_JSON_LOGS': {
            requiredCheckId: 'Log Secret Sanitization & PII Scrubbing',
            expectedArtifact: null,
            verifierScript: 'skills/production-readiness/scripts/verify_production_readiness.js'
        },

        // 16. مهارة التصميم المتجاوب (Responsive)
        'responsive:VIEWPORT_BREAKPOINTS_TEST': {
            requiredCheckId: 'Mobile Viewport Meta Tag',
            expectedArtifact: null,
            verifierScript: 'skills/responsive/scripts/verify_responsive.js'
        },
        'responsive:TOUCH_TARGET_44PX_AUDIT': {
            requiredCheckId: 'Adaptive Flexbox/Grid Containers',
            expectedArtifact: null,
            verifierScript: 'skills/responsive/scripts/verify_responsive.js'
        },
        'responsive:ZERO_HORIZONTAL_SCROLL': {
            requiredCheckId: 'Zero Rigid Fixed Pixel Layout Blowouts',
            expectedArtifact: null,
            verifierScript: 'skills/responsive/scripts/verify_responsive.js'
        },

        // 17. مهارة دعم العربية والاتجاه من اليمين لليسار (RTL)
        'rtl:LOGICAL_PROPERTIES_AUDIT': {
            requiredCheckId: 'Logical CSS Properties Adoption',
            expectedArtifact: null,
            verifierScript: 'skills/rtl/scripts/verify_rtl.js'
        },
        'rtl:ICON_MIRRORING_VERIFICATION': {
            requiredCheckId: 'Arabic Locale Declaration (apps\\web\\index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/rtl/scripts/verify_rtl.js'
        },
        'rtl:BIDIRECTIONAL_PARITY': {
            requiredCheckId: 'Root RTL Direction Declaration (apps\\web\\index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/rtl/scripts/verify_rtl.js'
        },

        // 18. مهارة النماذج والتحقق (Forms)
        'forms:SCHEMA_VALIDATION_RULES': {
            requiredCheckId: 'Server-Side Field Validation Rules',
            expectedArtifact: null,
            verifierScript: 'skills/forms/scripts/verify_forms.js'
        },
        'forms:DOUBLE_SUBMIT_DEFENSE': {
            requiredCheckId: 'Payload Sanitization Defense',
            expectedArtifact: null,
            verifierScript: 'skills/forms/scripts/verify_forms.js'
        },
        'forms:INLINE_ERROR_HANDLING': {
            requiredCheckId: 'Form Field Label Associations',
            expectedArtifact: null,
            verifierScript: 'skills/forms/scripts/verify_forms.js'
        },

        // 19. مهارة مكافحة التصاميم الرديئة (Anti-Slop)
        'anti-slop:DESIGN_TOKEN_VALIDATION': {
            requiredCheckId: 'Zero AI Visual Slop Invariant',
            expectedArtifact: null,
            verifierScript: 'skills/anti-slop/scripts/audit_slop.js'
        },
        'anti-slop:ANTI_SLOP_AUDIT': {
            requiredCheckId: 'Semantic HTML Architecture (index.html)',
            expectedArtifact: null,
            verifierScript: 'skills/anti-slop/scripts/audit_slop.js'
        },

        // 20. مهارة تدفق المستخدم (UI/UX)
        'ui-ux:USER_FLOW_STATE_MACHINE': {
            requiredCheckId: 'Operation Success State Confirmation',
            expectedArtifact: null,
            verifierScript: 'skills/ui-ux/scripts/verify_ui_ux.js'
        },
        'ui-ux:ACTIONABLE_ERROR_STATES': {
            requiredCheckId: 'Actionable Error Feedback UI',
            expectedArtifact: null,
            verifierScript: 'skills/ui-ux/scripts/verify_ui_ux.js'
        },

        // 21. مهارة الذوق والحرفية (Taste-Craft)
        'taste-craft:MICRO_INTERACTIONS_SPEC': {
            requiredCheckId: 'Interactive Hover State Feedback (:hover)',
            expectedArtifact: null,
            verifierScript: 'skills/taste-craft/scripts/audit_craft.js'
        },
        'taste-craft:TACTILE_FEEDBACK_AUDIT': {
            requiredCheckId: 'Tactile Pressed Feedback (:active)',
            expectedArtifact: null,
            verifierScript: 'skills/taste-craft/scripts/audit_craft.js'
        },

        // 22. مهارة تدقيق المشاريع (Project-Audit)
        'project-audit:DEPENDENCY_VULNERABILITY_SCAN': {
            requiredCheckId: 'Security & ASVS Invariants',
            expectedArtifact: null,
            verifierScript: 'skills/project-audit/scripts/audit_project.js'
        },
        'project-audit:TECH_DEBT_LEDGER': {
            requiredCheckId: 'Anti-Laziness & Zero-Truncation',
            expectedArtifact: null,
            verifierScript: 'skills/project-audit/scripts/audit_project.js'
        },
        'project-audit:REMEDIATION_PLAN': {
            requiredCheckId: 'Composite Quality Score Threshold (>= 90%)',
            expectedArtifact: null,
            verifierScript: 'skills/project-audit/scripts/audit_project.js'
        },

        // 23. مهارة المراجعة البرمجية الصارمة (Code-Review)
        'code-review:ADVERSARIAL_REVIEW_REPORT': {
            requiredCheckId: 'Production Codebase Discovery for Adversarial Review',
            expectedArtifact: null,
            verifierScript: 'skills/code-review/scripts/review_code.js'
        },
        'code-review:REGRESSION_CHECKLIST': {
            requiredCheckId: 'Zero Critical Code Sinks Invariant',
            expectedArtifact: null,
            verifierScript: 'skills/code-review/scripts/review_code.js'
        },
        'code-review:SIDE_EFFECT_PROOF': {
            requiredCheckId: 'Zero Critical Code Sinks Invariant',
            expectedArtifact: null,
            verifierScript: 'skills/code-review/scripts/review_code.js'
        }
    });

    /**
     * التحقق الصارم من عقد الدليل وربطه بفحصه التخصصي والمخرج المادي
     * @param {Object} params معلمات التحقق
     * @returns {Object} كائن الدليل المعتمد الحتمي
     */
    static validateAndBindEvidence(params) {
        const {
            skillId,
            requirementId,
            parsedVerifierOutput,
            workspacePath,
            candidateArtifact,
            executionProvenance = {}
        } = params;

        if (!skillId || !requirementId) {
            throw new Error('[FAIL-CLOSED] معرف المهارة أو معرف المتطلب مفقود.');
        }

        const mapKey = `${skillId}:${requirementId}`;
        const canonicalSpec = this.CANONICAL_EVIDENCE_MAP[mapKey];

        // 1. رفض أي متطلب لا يمتلك عقداً كنسياً مسجلاً (حظر التخمين)
        if (!canonicalSpec) {
            throw new Error(`[FAIL-CLOSED] العقد الكنسي غير مسجل للمتطلب '${requirementId}' في المهارة '${skillId}'.`);
        }

        // 2. التحقق من سلامة مخرجات المدقق التخصصي
        if (!parsedVerifierOutput || typeof parsedVerifierOutput !== 'object') {
            throw new Error(`[FAIL-CLOSED] مخرجات أداة الفحص للمهارة '${skillId}' مفقودة أو مشوهة.`);
        }

        if (parsedVerifierOutput.status !== 'VERIFIED' && parsedVerifierOutput.status !== 'PASS') {
            throw new Error(`[FAIL-CLOSED] حالة المدقق للمهارة '${skillId}' ليست VERIFIED صريحة (المستلم: ${parsedVerifierOutput.status}).`);
        }

        if (!Array.isArray(parsedVerifierOutput.checks)) {
            throw new Error(`[FAIL-CLOSED] مخرجات المدقق للمهارة '${skillId}' تفتقر إلى مصفوفة الفحوصات المفصلة.`);
        }

        // 3. البحث المباشر والصارم عن الفحص المطابق الكنسي (No Substring Guessing)
        const targetCheck = parsedVerifierOutput.checks.find(c => {
            const prop = (c.property || c.id || '').trim();
            return prop === canonicalSpec.requiredCheckId || prop.startsWith(canonicalSpec.requiredCheckId.split('(')[0].trim());
        });

        if (!targetCheck) {
            throw new Error(`[FAIL-CLOSED] الفحص الكنسي الإلزامي '${canonicalSpec.requiredCheckId}' غير موجود في نتائج مدقق المهارة '${skillId}' للمتطلب '${requirementId}'.`);
        }

        if (targetCheck.status !== 'PASS' || targetCheck.passed !== true) {
            throw new Error(`[FAIL-CLOSED] الفحص الكنسي '${canonicalSpec.requiredCheckId}' للمتطلب '${requirementId}' لم يسجل حالة PASS صريحة.`);
        }

        // 4. التحقق من سلامة المخرج المادي على القرص (Physical Artifact Integrity)
        let verifiedArtifactRecord = null;
        const targetArtifactRelPath = (candidateArtifact && candidateArtifact.path)
            ? candidateArtifact.path
            : canonicalSpec.expectedArtifact;

        if (targetArtifactRelPath) {
            const safeArtifactPath = path.isAbsolute(targetArtifactRelPath)
                ? targetArtifactRelPath
                : path.join(workspacePath, targetArtifactRelPath);

            // فحص تسلق المسارات والامتدادات والروابط الرمزية غير المصرح بها
            PathLoaderGuard.validateSafePath(safeArtifactPath, {
                projectRoot: workspacePath,
                allowedExtensions: ['.json', '.md', '.sql', '.js', '.ts', '.css', '.html', '']
            });

            if (!fs.existsSync(safeArtifactPath)) {
                throw new Error(`[FAIL-CLOSED] المخرج المادي الإلزامي للدليل '${requirementId}' غير موجود على القرص: ${targetArtifactRelPath}`);
            }

            const stat = fs.statSync(safeArtifactPath);
            if (stat.size === 0) {
                throw new Error(`[FAIL-CLOSED] المخرج المادي للدليل '${requirementId}' فارغ تماماً (Zero Bytes): ${targetArtifactRelPath}`);
            }

            const fileContent = fs.readFileSync(safeArtifactPath);
            const computedSha256 = crypto.createHash('sha256').update(fileContent).digest('hex');

            // إذا كان المرشح يحمل hash سابق، التأكد من مطابقته لمنع التلاعب بعد الإنشاء
            if (candidateArtifact && candidateArtifact.sha256 && candidateArtifact.sha256 !== computedSha256) {
                throw new Error(`[FAIL-CLOSED] تلاعب مرصود في مخرج الدليل '${requirementId}': التجزئة الحالية (${computedSha256}) لا تطابق التجزئة المسجلة (${candidateArtifact.sha256}).`);
            }

            verifiedArtifactRecord = {
                path: targetArtifactRelPath,
                resolvedPath: safeArtifactPath,
                sizeBytes: stat.size,
                sha256: computedSha256,
                verifiedAt: new Date().toISOString()
            };
        }

        // 5. بناء كائن الدليل الموحد متكامل الهوية (Explicit Evidence Identity)
        const evidenceId = `EVID_${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${skillId}_${requirementId}`;

        return {
            evidenceId,
            requirementId,
            skillId,
            verifierId: canonicalSpec.verifierScript,
            checkId: targetCheck.id || targetCheck.property,
            checkProperty: targetCheck.property,
            status: 'VERIFIED',
            scope: `PROJECT_REQUIREMENT_${requirementId}`,
            createdAt: new Date().toISOString(),
            source: 'SPECIALIZED_VERIFIER_ENGINE',
            artifactPath: verifiedArtifactRecord ? verifiedArtifactRecord.path : null,
            artifactHash: verifiedArtifactRecord ? verifiedArtifactRecord.sha256 : null,
            verificationResult: {
                checkStatus: targetCheck.status,
                passed: targetCheck.passed,
                details: targetCheck.details || 'Check passed with strict compliance',
                severity: targetCheck.severity || 'CRITICAL',
                verifierDurationMs: parsedVerifierOutput.duration_ms || 0
            },
            verificationMetadata: {
                totalChecksInVerifier: parsedVerifierOutput.total_checks,
                passedChecksInVerifier: parsedVerifierOutput.passed_checks,
                failedChecksInVerifier: parsedVerifierOutput.failed_checks,
                executionProvenance
            }
        };
    }
}

module.exports = EvidenceContractValidator;
