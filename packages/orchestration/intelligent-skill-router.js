/**
 * @file intelligent-skill-router.js
 * @description محرك التوجيه الذكي للمهارات والأوركسترا متعددة التخصصات في ProofForge
 * (ProofForge Intelligent Multi-Skill Orchestrator & Dependency Router)
 * 
 * يحلل متطلبات المشروع، ويرصد حزمة التقنيات (Stack Detection)،
 * ويرتب المهارات الـ 28 ترتيباً طوبولوجياً حتمياً خالياً من الحلقات (Cycle-Free Topological Order)،
 * ويدير حل التعارضات بحسب هرمية السلطة (Authority Hierarchy)،
 * وينفذ السيناريوهات الكبرى الستة مع إلزام عقود الأدلة (Evidence Contracts).
 */

'use strict';

const AuthorityHierarchy = require('./authority-hierarchy');
const RuleConflictEngine = require('./rule-conflict-engine');

class IntelligentSkillRouter {
    /**
     * فهرس المهارات الـ 28 المعتمدة مع التبعيات وطبقات التنفيذ
     */
    static get SKILL_CATALOG() {
        return {
            'architecture': {
                id: 'architecture',
                category: 'FOUNDATION',
                priority: 'P2_ARCHITECTURE',
                dependencies: [],
                evidenceRequired: ['ADR_DOCUMENT', 'SYSTEM_DIAGRAM', 'DOMAIN_INVARIANTS'],
                description: 'هندسة النظم وحدود المكونات والقرارات المعمارية'
            },
            'security': {
                id: 'security',
                category: 'FOUNDATION',
                priority: 'P0_SECURITY_SAFETY',
                dependencies: [],
                evidenceRequired: ['THREAT_MODEL', 'AUTH_BOUNDARY_MATRIX', 'OWASP_ASVS_CHECKLIST'],
                description: 'الأمن السيبراني، ومنع IDOR، وتشفير الجلسات، ونموذج الصفر ثقة'
            },
            'anti-laziness': {
                id: 'anti-laziness',
                category: 'GOVERNANCE',
                priority: 'P1_CONSTITUTION',
                dependencies: [],
                evidenceRequired: ['ZERO_PLACEHOLDER_PROOF', 'FULL_IMPLEMENTATION_VERIFICATION'],
                description: 'منع كسل النماذج وحظر التعليقات الوهمية والتنفيذ الجزئي'
            },
            'anti-slop': {
                id: 'anti-slop',
                category: 'GOVERNANCE',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: [],
                evidenceRequired: ['DESIGN_TOKEN_VALIDATION', 'ANTI_SLOP_AUDIT'],
                description: 'مكافحة التصاميم الركيكة وفرض التناغم البصري'
            },
            'database': {
                id: 'database',
                category: 'DATA',
                priority: 'P4_ENGINEERING',
                dependencies: ['architecture'],
                evidenceRequired: ['MIGRATION_SCRIPTS', 'TENANT_ISOLATION_PROOF', 'ACID_TRANSACTION_TESTS'],
                description: 'هندسة قواعد البيانات وعزل المستأجرين وحماية المعاملات الذرية'
            },
            'backend': {
                id: 'backend',
                category: 'SERVICES',
                priority: 'P4_ENGINEERING',
                dependencies: ['architecture', 'database'],
                evidenceRequired: ['SERVICE_LAYER_IMPLEMENTATION', 'RATE_LIMITER_CONFIG', 'HEALTH_PROBES'],
                description: 'بناء الخدمات الخلفية ومسارات API والتحقق من الجلسات والحد من المعدل'
            },
            'api': {
                id: 'api',
                category: 'SERVICES',
                priority: 'P4_ENGINEERING',
                dependencies: ['architecture', 'backend'],
                evidenceRequired: ['OPENAPI_CONTRACT', 'IDEMPOTENCY_TESTS', 'INPUT_VALIDATION_SCHEMA'],
                description: 'تصميم عقود API، ومفاتيح عدم التكرار، والتحقق الصارم من المدخلات'
            },
            'ecommerce': {
                id: 'ecommerce',
                category: 'DOMAIN',
                priority: 'P3_DOMAIN',
                dependencies: ['architecture', 'database', 'security'],
                evidenceRequired: ['IDEMPOTENT_CHECKOUT_PROOF', 'INVENTORY_RACE_TESTS', 'WEBHOOK_HMAC_VERIFICATION'],
                description: 'معاملات التجارة الإلكترونية، والدفع الذري، وتزامن المخزون'
            },
            'design-system': {
                id: 'design-system',
                category: 'PRESENTATION',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['architecture'],
                evidenceRequired: ['DESIGN_TOKENS_JSON', 'COLOR_SCALE_MATRIX', 'TYPOGRAPHY_SYSTEM'],
                description: 'نظام التصميم، ورموز الألوان، والشبكة الطباعية والتناسق البصري'
            },
            'ui-ux': {
                id: 'ui-ux',
                category: 'PRESENTATION',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['architecture', 'design-system'],
                evidenceRequired: ['USER_FLOW_STATE_MACHINE', 'ACTIONABLE_ERROR_STATES'],
                description: 'تصميم تجربة المستخدم وحالات الواجهة الخمس (Idle, Loading, Empty, Error, Success)'
            },
            'frontend': {
                id: 'frontend',
                category: 'PRESENTATION',
                priority: 'P4_ENGINEERING',
                dependencies: ['architecture', 'design-system'],
                evidenceRequired: ['COMPONENT_HIERARCHY', 'CLIENT_STATE_BOUNDARIES', 'CHUNK_OPTIMIZATION'],
                description: 'تطوير الواجهة الأمامية وإدارة الحالة وتحسين الأداء'
            },
            'forms': {
                id: 'forms',
                category: 'PRESENTATION',
                priority: 'P4_ENGINEERING',
                dependencies: ['frontend'],
                evidenceRequired: ['SCHEMA_VALIDATION_RULES', 'DOUBLE_SUBMIT_DEFENSE', 'INLINE_ERROR_HANDLING'],
                description: 'النماذج المعقدة، والتحقق الصارم، ومنع الإرسال المزدوج'
            },
            'responsive': {
                id: 'responsive',
                category: 'PRESENTATION',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['frontend'],
                evidenceRequired: ['VIEWPORT_BREAKPOINTS_TEST', 'TOUCH_TARGET_44PX_AUDIT', 'ZERO_HORIZONTAL_SCROLL'],
                description: 'التجاوب التام من الشاشات المحمولة 320px حتى شاشات 4K'
            },
            'rtl': {
                id: 'rtl',
                category: 'PRESENTATION',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['frontend', 'design-system'],
                evidenceRequired: ['LOGICAL_PROPERTIES_AUDIT', 'ICON_MIRRORING_VERIFICATION', 'BIDIRECTIONAL_PARITY'],
                description: 'دعم اتجاه اليمين لليسار العربي والعبري والخصائص المنطقية CSS'
            },
            'accessibility': {
                id: 'accessibility',
                category: 'QUALITY',
                priority: 'P1_CONSTITUTION',
                dependencies: ['frontend', 'design-system'],
                evidenceRequired: ['WCAG_2_2_AAA_AUDIT', 'KEYBOARD_NAVIGATION_TEST', 'ARIA_LABELS_VERIFICATION'],
                description: 'إتاحة الوصول الكاملة WCAG 2.2 AA/AAA وقارئات الشاشة والتنقل بلوحة المفاتيح'
            },
            'taste-craft': {
                id: 'taste-craft',
                category: 'PRESENTATION',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['frontend', 'design-system'],
                evidenceRequired: ['MICRO_INTERACTIONS_SPEC', 'TACTILE_FEEDBACK_AUDIT'],
                description: 'صقل التفاصيل واللمسات الفنية والحدود والظلال التفاعلية'
            },
            'motion': {
                id: 'motion',
                category: 'PRESENTATION',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['frontend', 'design-system'],
                evidenceRequired: ['GPU_60FPS_BUDGET', 'PREFERS_REDUCED_MOTION_DEFENSE'],
                description: 'التحريك الفيزيائي المتزن واحترام إعدادات تقليل الحركة'
            },
            'dashboards': {
                id: 'dashboards',
                category: 'PRESENTATION',
                priority: 'P4_ENGINEERING',
                dependencies: ['frontend', 'api'],
                evidenceRequired: ['DATA_VIRTUALIZATION_TEST', 'REALTIME_SYNC_PROOF', 'KPI_CARD_DENSITY'],
                description: 'لوحات القيادة عالية الكثافة والمخططات البيانية والجداول الافتراضية'
            },
            'image-to-code': {
                id: 'image-to-code',
                category: 'PRESENTATION',
                priority: 'P4_ENGINEERING',
                dependencies: ['design-system'],
                evidenceRequired: ['DESIGN_TOKEN_CONFORMANCE', 'ZERO_HALLUCINATION_PROOF'],
                description: 'تحويل التصاميم والصور إلى شفرة إنتاجية مطابقة'
            },
            'fullstack': {
                id: 'fullstack',
                category: 'SERVICES',
                priority: 'P4_ENGINEERING',
                dependencies: ['architecture', 'database', 'backend', 'frontend'],
                evidenceRequired: ['END_TO_END_LIFECYCLE_TEST', 'UNIFIED_DATA_CONTRACT'],
                description: 'الربط التكاملي الكامل بين الواجهة الأمامية والخدمات الخلفية'
            },
            'ai-engineering': {
                id: 'ai-engineering',
                category: 'SERVICES',
                priority: 'P3_DOMAIN',
                dependencies: ['architecture', 'backend', 'security'],
                evidenceRequired: ['PROMPT_INJECTION_DEFENSE', 'AI_TOOL_PERMISSION_SANDBOX', 'GROUNDING_EVIDENCE'],
                description: 'هندسة نظم الذكاء الاصطناعي والحوكمة وعزل استدعاء الأدوات'
            },
            'project-audit': {
                id: 'project-audit',
                category: 'QUALITY',
                priority: 'P4_ENGINEERING',
                dependencies: [],
                evidenceRequired: ['DEPENDENCY_VULNERABILITY_SCAN', 'TECH_DEBT_LEDGER', 'REMEDIATION_PLAN'],
                description: 'التدقيق الشامل للمستودع ورصد الثغرات والديون التقنية'
            },
            'code-review': {
                id: 'code-review',
                category: 'QUALITY',
                priority: 'P1_CONSTITUTION',
                dependencies: ['project-audit', 'backend', 'frontend'],
                evidenceRequired: ['ADVERSARIAL_REVIEW_REPORT', 'REGRESSION_CHECKLIST', 'SIDE_EFFECT_PROOF'],
                description: 'المراجعة البرمجية الصارمة وكشف العيوب المنطقية المخفية'
            },
            'testing': {
                id: 'testing',
                category: 'QUALITY',
                priority: 'P1_CONSTITUTION',
                dependencies: ['backend', 'frontend'],
                evidenceRequired: ['ZERO_MOCK_VERIFICATION', 'EVIDENCE_CONTRACT_VALIDATION', 'DETERMINISTIC_PASS_SUITE'],
                description: 'الاختبارات الحتمية (Unit, Integration, E2E) وحظر الادعاء بدون دليل'
            },
            'performance': {
                id: 'performance',
                category: 'QUALITY',
                priority: 'P4_ENGINEERING',
                dependencies: ['backend', 'frontend'],
                evidenceRequired: ['LIGHTHOUSE_90_BUDGET', 'CORE_WEB_VITALS_REPORT', 'MEMORY_LEAK_CHECK'],
                description: 'تحسين مؤشرات الويب الحيوية Core Web Vitals وزمن الاستجابة'
            },
            'seo': {
                id: 'seo',
                category: 'QUALITY',
                priority: 'P5_DESIGN_SYSTEM',
                dependencies: ['frontend'],
                evidenceRequired: ['JSON_LD_SCHEMA', 'OPEN_GRAPH_METADATA', 'CANONICAL_TAGS'],
                description: 'هندسة السيو التقني والبيانات المنظمة وبطاقات المشاركة'
            },
            'deployment': {
                id: 'deployment',
                category: 'GOVERNANCE',
                priority: 'P0_SECURITY_SAFETY',
                dependencies: ['testing', 'security'],
                evidenceRequired: ['NON_ROOT_DOCKERFILE', 'LOCKFILE_REPRODUCIBILITY', 'ZERO_SECRET_LEAK_AUDIT'],
                description: 'أمن النشر وحاويات Docker غير الجذرية وخطوط CI/CD'
            },
            'production-readiness': {
                id: 'production-readiness',
                category: 'GOVERNANCE',
                priority: 'P0_SECURITY_SAFETY',
                dependencies: ['deployment', 'testing', 'security'],
                evidenceRequired: ['12_FACTOR_AUDIT', 'HEALTHZ_READYZ_PROBES', 'STRUCTURED_JSON_LOGS'],
                description: 'الجاهزية الإنتاجية النهائية والموثوقية SRE ومراقبة العمليات'
            }
        };
    }

    /**
     * تعريف السيناريوهات الستة الكبرى المعتمدة
     */
    static get SCENARIOS() {
        return {
            'fullstack-saas': {
                id: 'fullstack-saas',
                name: 'Full-Stack SaaS Platform',
                description: 'منصة برمجية سحابية متكاملة متعددة المستأجرين بنظام الاشتراكات ولوحات التحكم',
                targetSkills: [
                    'architecture',
                    'security',
                    'anti-laziness',
                    'database',
                    'backend',
                    'api',
                    'design-system',
                    'frontend',
                    'dashboards',
                    'performance',
                    'testing',
                    'production-readiness'
                ],
                keyInvariants: [
                    'عزل بيانات المستأجرين عبر tenant_id إلزامي في كل استعلام',
                    'مفاتيح عدم تكرار المعاملات Idempotency Keys لعمليات الاشتراك والفوترة',
                    'حظر كافة بيانات الاعتماد السرية واستخدام متغيرات بيئة مدققة',
                    'توفير مسارات الفحص /healthz و /readyz'
                ]
            },
            'ecommerce': {
                id: 'ecommerce',
                name: 'E-commerce & Transaction Systems',
                description: 'متجر إلكتروني بنظام سلة وتسوق ودفع آمن وحماية من سباق المخزون وتواقيع الويب هوك',
                targetSkills: [
                    'architecture',
                    'security',
                    'anti-laziness',
                    'database',
                    'backend',
                    'ecommerce',
                    'api',
                    'forms',
                    'design-system',
                    'frontend',
                    'testing',
                    'production-readiness'
                ],
                keyInvariants: [
                    'معاملات الدفع ذرية ومحصنة ضد سباق المخزون (SELECT FOR UPDATE / Mutex)',
                    'التحقق الصارم من توقيع HMAC Timing-Safe لجميع الويب هوكس الواردة من بوابات الدفع',
                    'حماية النماذج ضد الإرسال المزدوج (Double-Submit Defense)',
                    'سجلات تدقيق مالية غير قابلة للتعديل'
                ]
            },
            'refactoring': {
                id: 'refactoring',
                name: 'Existing Project Refactoring & Hardening',
                description: 'إعادة هيكلة وتطهير مستودع قائم، وحل الديون التقنية، وسد الثغرات الأمنية',
                targetSkills: [
                    'project-audit',
                    'security',
                    'code-review',
                    'architecture',
                    'anti-laziness',
                    'testing',
                    'performance',
                    'production-readiness'
                ],
                keyInvariants: [
                    'عدم كسر التوافقية العكسية إلا بقرار معمارية معتمد (ADR)',
                    'توثيق سجل الديون التقنية Remediation Plan قبل إجراء التعديلات الجراحية',
                    'إلزام وجود اختبارات انحدار حتمية قبل وبعد التعديل',
                    'تطهير كافة التعليقات المهملة والمحاكاة الوهمية'
                ]
            },
            'secure-auth': {
                id: 'secure-auth',
                name: 'Secure Authentication & Access Control',
                description: 'منظومة مصادقة وتفويض عالية الأمان، مع منع IDOR، وتشفير الجلسات، وعزل الأدوار RBAC',
                targetSkills: [
                    'security',
                    'architecture',
                    'anti-laziness',
                    'database',
                    'backend',
                    'api',
                    'forms',
                    'design-system',
                    'frontend',
                    'code-review',
                    'testing'
                ],
                keyInvariants: [
                    'تطبيق مبدأ الصفر ثقة وعدم الاعتماد مطلقاً على تحقق المتصفح',
                    'تجزئة كلمات المرور باستخدام خوارزميات مقاومة للزمن والمقارنة الآمنة Timing-Safe',
                    'فرض التحقق الصارم من ملكية المورد (Anti-IDOR) على مستوى الخادم في كل مسار',
                    'حماية الجلسات بخصائص HttpOnly و SameSite و Secure وتجديد الرمز بعد تسجيل الدخول'
                ]
            },
            'rtl-accessibility': {
                id: 'rtl-accessibility',
                name: 'RTL Localization & WCAG AAA Accessibility',
                description: 'واجهة متقدمة داعمة للعربية RTL بالكامل مع الامتثال الصارم لمعايير الوصول WCAG 2.2 AAA',
                targetSkills: [
                    'architecture',
                    'design-system',
                    'anti-slop',
                    'ui-ux',
                    'rtl',
                    'accessibility',
                    'taste-craft',
                    'frontend',
                    'responsive',
                    'testing'
                ],
                keyInvariants: [
                    'استخدام الخصائص المنطقية CSS بالكامل (ms-, me-, ps-, pe-) بدلاً من left/right',
                    'عكس الأيقونات الاتجاهية حصراً مع إبقاء أيقونات الوسائط غير معكوسة',
                    'نسبة تباين ألوان لا تقل عن 7:1 للنصوص العادية (WCAG AAA)',
                    'دعم كامل للتنقل بلوحة المفاتيح وحلقات التركيز المرئية وقارئات الشاشة ARIA'
                ]
            },
            'production-api': {
                id: 'production-api',
                name: 'Hardened Production API Microservice',
                description: 'خدمة واجهة برمجية فائقة الموثوقية والأمان مع مواصفات OpenAPI وتحديد المعدل والنشر الآمن',
                targetSkills: [
                    'architecture',
                    'security',
                    'anti-laziness',
                    'api',
                    'backend',
                    'database',
                    'performance',
                    'testing',
                    'deployment',
                    'production-readiness'
                ],
                keyInvariants: [
                    'عقد OpenAPI 3.0 صارم مع رفض أي حقول غير مصرح بها (Strict DTO Validation)',
                    'تحديد المعدل المنزلق (Sliding-Window Rate Limiting) لكل عميل/مفتاح',
                    'حظر تام لتسريب الأسرار في الحاويات وتشغيل الحاويات بمستخدم غير جذري (Non-Root)',
                    'إلزام اختبارات عدم التكرار والأداء تحت الحمل العالي'
                ]
            }
        };
    }

    /**
     * ترتيب المهارات ترتيباً طوبولوجياً حتمياً مع كشف الحلقات
     * @param {Array<string>} skillIds قائمة معرفات المهارات المطلوب ترتيبها
     * @param {Object} [customCatalog] كتالوج مخصص (لأغراض الاختبار ورصد الحلقات)
     * @returns {Array<string>} الترتيب الطوبولوجي الصحيح
     */
    static topologicalSort(skillIds, customCatalog = null) {
        const catalog = customCatalog || this.SKILL_CATALOG;
        const validIds = new Set(skillIds.filter(id => catalog[id]));
        
        // بناء جدول الدرجات الداخلية (In-degree) وقائمة التبعيات
        const inDegree = new Map();
        const adjList = new Map();

        for (const id of validIds) {
            inDegree.set(id, 0);
            adjList.set(id, []);
        }

        for (const id of validIds) {
            const deps = (catalog[id].dependencies || []).filter(dep => validIds.has(dep));
            for (const dep of deps) {
                adjList.get(dep).push(id);
                inDegree.set(id, inDegree.get(id) + 1);
            }
        }

        // استخدام طابور للعقد التي لا تملك أي تبعيات (In-degree = 0)
        // مع الترتيب المعجمي أو أولوية السلطة لضمان الحتمية
        const queue = [];
        for (const [id, deg] of inDegree.entries()) {
            if (deg === 0) {
                queue.push(id);
            }
        }

        // ترتيب البدايات حسب الأولوية الدستورية (P0 ثم P1 ثم P2 ...)
        queue.sort((a, b) => {
            const pA = AuthorityHierarchy.LEVELS[catalog[a].priority]?.level ?? 99;
            const pB = AuthorityHierarchy.LEVELS[catalog[b].priority]?.level ?? 99;
            if (pA !== pB) return pA - pB;
            return a.localeCompare(b);
        });

        const sorted = [];

        while (queue.length > 0) {
            const current = queue.shift();
            sorted.push(current);

            const neighbors = adjList.get(current) || [];
            // فرز الجيران للحفاظ على الحتمية
            neighbors.sort((a, b) => {
                const pA = AuthorityHierarchy.LEVELS[catalog[a].priority]?.level ?? 99;
                const pB = AuthorityHierarchy.LEVELS[catalog[b].priority]?.level ?? 99;
                if (pA !== pB) return pA - pB;
                return a.localeCompare(b);
            });

            for (const neighbor of neighbors) {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }

        // فحص وجود حلقات تبعية دائرية
        if (sorted.length !== validIds.size) {
            throw new Error(`خطأ فادح: تم اكتشاف حلقة تبعية دائرية بين المهارات (${validIds.size - sorted.length} عقد متبقية)`);
        }

        return sorted;
    }

    /**
     * استنتاج وتوجيه المسار بناءً على سيناريو محدد أو نص الطلب والتقنيات
     * @param {Object|string} input السيناريو أو كائن الإدخال
     * @returns {Object} خطة التنفيذ المعتمدة (Execution Plan)
     */
    static route(input) {
        let scenarioKey = null;
        let customPrompt = '';
        let detectedStack = {};

        if (typeof input === 'string') {
            scenarioKey = input.toLowerCase().trim();
            customPrompt = input;
        } else if (input && typeof input === 'object') {
            scenarioKey = input.scenario ? input.scenario.toLowerCase().trim() : null;
            customPrompt = input.prompt || '';
            detectedStack = input.stack || {};
        }

        // محاولة مطابقة أحد السيناريوهات الستة الكبرى
        let matchedScenario = null;
        if (scenarioKey && this.SCENARIOS[scenarioKey]) {
            matchedScenario = this.SCENARIOS[scenarioKey];
        } else {
            // استنتاج السيناريو من الموجه والكلمات الدلالية
            const lower = customPrompt.toLowerCase();
            if (lower.includes('ecommerce') || lower.includes('store') || lower.includes('shop') || lower.includes('cart') || lower.includes('checkout') || lower.includes('متجر') || lower.includes('دفع') || lower.includes('سلة')) {
                matchedScenario = this.SCENARIOS['ecommerce'];
            } else if (lower.includes('refactor') || lower.includes('audit') || lower.includes('legacy') || lower.includes('debt') || lower.includes('إعادة هيكلة') || lower.includes('تدقيق')) {
                matchedScenario = this.SCENARIOS['refactoring'];
            } else if (lower.includes('auth') || lower.includes('login') || lower.includes('rbac') || lower.includes('idor') || lower.includes('مصادقة') || lower.includes('صلاحيات')) {
                matchedScenario = this.SCENARIOS['secure-auth'];
            } else if (lower.includes('rtl') || lower.includes('arabic') || lower.includes('a11y') || lower.includes('wcag') || lower.includes('عربي') || lower.includes('وصول')) {
                matchedScenario = this.SCENARIOS['rtl-accessibility'];
            } else if (lower.includes('api') || lower.includes('microservice') || lower.includes('openapi') || lower.includes('خدمة') || lower.includes('واجهة برمجية')) {
                matchedScenario = this.SCENARIOS['production-api'];
            } else {
                // الافتراضي هو SaaS الشامل
                matchedScenario = this.SCENARIOS['fullstack-saas'];
            }
        }

        // ترتيب المهارات المستهدفة طوبولوجياً
        const orderedSkillIds = this.topologicalSort(matchedScenario.targetSkills);

        // بناء سجل خطوات التنفيذ مع عقود الأدلة
        const catalog = this.SKILL_CATALOG;
        const steps = orderedSkillIds.map((skillId, index) => {
            const skill = catalog[skillId];
            return {
                stepNumber: index + 1,
                skillId,
                canonicalAntigravityName: `proofforge-${skillId}`,
                category: skill.category,
                priority: skill.priority,
                dependencies: skill.dependencies.filter(d => matchedScenario.targetSkills.includes(d)),
                evidenceRequired: skill.evidenceRequired,
                description: skill.description
            };
        });

        // فحص وتسجيل أي تحكيم في التعارضات المحتملة
        const conflictResolutions = [];
        if (orderedSkillIds.includes('security') && orderedSkillIds.includes('performance')) {
            const res = RuleConflictEngine.resolveConflict(
                { id: 'SEC_AUTH_EVERY_REQ', name: 'Zero-Trust Strict Authorization', priority: 'P0_SECURITY_SAFETY', scope: 'SECURITY' },
                { id: 'PERF_AGGRESSIVE_CACHE', name: 'Aggressive Edge Caching Without Reauth', priority: 'P4_ENGINEERING', scope: 'PERFORMANCE' }
            );
            conflictResolutions.push(res);
        }

        if (orderedSkillIds.includes('accessibility') && orderedSkillIds.includes('motion')) {
            const res = RuleConflictEngine.resolveConflict(
                { id: 'A11Y_REDUCED_MOTION', name: 'Prefers Reduced Motion Respect', priority: 'P1_CONSTITUTION', scope: 'ACCESSIBILITY' },
                { id: 'MOTION_CONTINUOUS_PARALLAX', name: 'Continuous Heavy Parallax Transitions', priority: 'P5_DESIGN_SYSTEM', scope: 'MOTION' }
            );
            conflictResolutions.push(res);
        }

        if (orderedSkillIds.includes('anti-laziness')) {
            const res = RuleConflictEngine.resolveConflict(
                { id: 'ANTI_LAZINESS_FULL_CODE', name: 'Zero Placeholder & Full Implementation Enforcement', priority: 'P1_CONSTITUTION', scope: 'QUALITY' },
                { id: 'DEV_QUICK_MOCK', name: 'Temporary Mock Or Stub Shortcut', priority: 'P8_AGENT_PREFERENCES', scope: 'CONVENIENCE' }
            );
            conflictResolutions.push(res);
        }

        return {
            planId: `PLAN_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            scenarioId: matchedScenario.id,
            scenarioName: matchedScenario.name,
            description: matchedScenario.description,
            detectedStack,
            skillCount: orderedSkillIds.length,
            orderedSkillIds,
            steps,
            keyInvariants: matchedScenario.keyInvariants,
            conflictResolutions,
            status: 'READY_FOR_EXECUTION'
        };
    }
}

module.exports = IntelligentSkillRouter;
