/**
 * @file failure-scenario-library.js
 * @description مكتبة سيناريوهات الفشل والاختبارات المرنة (Failure Scenario Library & Chaos Resilience)
 * توفر كتالوجاً شاملاً يغطي 6 فئات رئيسية مع آليات حقن آمنة معزولة لحماية المستودع من التلف
 */

const SCENARIO_CATEGORIES = {
    PLANNING: 'PLANNING',
    IMPLEMENTATION: 'IMPLEMENTATION',
    SECURITY: 'SECURITY',
    VERIFICATION: 'VERIFICATION',
    RELIABILITY: 'RELIABILITY',
    AGENT_BEHAVIOR: 'AGENT_BEHAVIOR'
};

const EXECUTION_TYPES = {
    SIMULATED: 'SIMULATED',
    LIVE: 'LIVE',
    UNIT: 'UNIT',
    INTEGRATION: 'INTEGRATION'
};

const StandardFailureScenarios = [
    // 1. Reliability Scenarios
    {
        id: 'SCENARIO_DB_TIMEOUT',
        category: SCENARIO_CATEGORIES.RELIABILITY,
        name: 'انقطاع استجابة قاعدة البيانات (Database Timeout)',
        description: 'محاكاة تأخير استجابة محول التخزين أو خادم قاعدة البيانات لأكثر من 5000ms',
        preconditions: 'Database adapter active and receiving query traffic',
        trigger: 'Simulate DB connection delay exceeding 5000ms',
        expected_detection: 'Detection via timeout guard and health probe',
        expected_classification: 'PERFORMANCE_FAILURE',
        expected_response: 'Fallback to degraded mode or structured 504 AppError',
        expectedBehavior: 'Fallback to degraded mode or cached response with structured 504 AppError',
        dataIntegrity: 'Atomic transaction rollback, no orphan records',
        severity: 'HIGH',
        recovery_strategy: 'Automatic retry with exponential backoff and connection pool reset',
        recovery: 'Automatic retry with exponential backoff',
        verification: 'verify_atomic_rollback_and_timeout_status',
        executionType: EXECUTION_TYPES.SIMULATED
    },
    {
        id: 'SCENARIO_CACHE_FAILURE',
        category: SCENARIO_CATEGORIES.RELIABILITY,
        name: 'انهيار خادم الكاش (Cache Down / Unreachable)',
        description: 'محاكاة فشل الاتصال بخادم الكاش الموزع',
        preconditions: 'Cache adapter configured with FAIL_CLOSED policy',
        trigger: 'Simulate Redis/Cache cluster connection refused',
        expected_detection: 'Cache client connection error trapped',
        expected_classification: 'DEPENDENCY_FAILURE',
        expected_response: 'Graceful degradation to primary store with security invariant maintained',
        expectedBehavior: 'Graceful degradation: query database directly without server crash',
        dataIntegrity: 'Zero cache-inconsistency, read directly from primary store',
        severity: 'MEDIUM',
        recovery_strategy: 'Circuit breaker trips and probes cache health periodically',
        recovery: 'Circuit breaker trips and probes cache health periodically',
        verification: 'verify_direct_db_fallback',
        executionType: EXECUTION_TYPES.SIMULATED
    },
    {
        id: 'SCENARIO_RACE_CONDITION',
        category: SCENARIO_CATEGORIES.RELIABILITY,
        name: 'تضارب متزامن على نفس المورد (Concurrent Double Action)',
        description: 'إطلاق 10 طلبات متوازية لنفس العملية المالية أو مفتاح عدم التكرار',
        preconditions: 'Idempotency engine and account balance initialized',
        trigger: 'Trigger 10 parallel checkout requests with identical idempotency key and user ID',
        expected_detection: 'Idempotency key collision / Mutex lock contention',
        expected_classification: 'CONCURRENCY_OR_RACE',
        expected_response: 'Exactly 1 request processed, remaining 9 receive idempotent replay or 409 Conflict',
        expectedBehavior: 'Exactly 1 request succeeds with 200 OK; remaining 9 rejected with 409 or return cached idempotent response',
        dataIntegrity: 'No balance negative overdraft, inventory decremented strictly once',
        severity: 'HIGH',
        recovery_strategy: 'Mutex lock released cleanly after atomic completion',
        recovery: 'Mutex lock released cleanly after completion',
        verification: 'verify_strictly_one_execution',
        executionType: EXECUTION_TYPES.UNIT
    },

    // 2. Planning Scenarios
    {
        id: 'SCENARIO_CONTRADICTORY_REQUIREMENT',
        category: SCENARIO_CATEGORIES.PLANNING,
        name: 'تعارض في المتطلبات الدستورية (Contradictory Requirements)',
        description: 'اقتراح متطلب يتناقض مع متطلب دستوري أعلى أولوية (مثل تعطيل الأمان للتسريع)',
        preconditions: 'AuthorityHierarchy & RuleConflictEngine active',
        trigger: 'Inject conflicting rule preferring agent convenience over P0 Security',
        expected_detection: 'RuleConflictEngine detects priority clash',
        expected_classification: 'REQUIREMENT_CONFLICT',
        expected_response: 'Arbitration in favor of P0 Security with logged justification',
        expectedBehavior: 'P0 Security automatically overrides P8 Agent preferences',
        dataIntegrity: 'System invariant remains uncorrupted',
        severity: 'HIGH',
        recovery_strategy: 'AuthorityHierarchy.arbitrate()',
        recovery: 'Arbitration and conflict resolution log generated',
        verification: 'verify_p0_security_win',
        executionType: EXECUTION_TYPES.UNIT
    },
    {
        id: 'SCENARIO_MISSING_CAPABILITY',
        category: SCENARIO_CATEGORIES.PLANNING,
        name: 'غياب قدرة مطلوبة للمهمة (Missing Required Capability)',
        description: 'طلب تنفيذ فحص يتطلب متصفحاً حقيقياً في بيئة خالية من المتصفح',
        preconditions: 'CapabilityModel shows Browser as ENVIRONMENT_LIMITATION',
        trigger: 'Trigger browser E2E test without headless browser binary',
        expected_detection: 'TaskReplanner identifies capability missing',
        expected_classification: 'CAPABILITY_MISSING',
        expected_response: 'Adaptive replanning to static verification and mark ENVIRONMENT_LIMITATION',
        expectedBehavior: 'No false verification claim; graceful degradation to HTTP E2E',
        dataIntegrity: 'Audit registry accurately records capability gap',
        severity: 'LOW',
        recovery_strategy: 'Replan to alternative static / HTTP verification suite',
        recovery: 'Switch execution to active supported suites',
        verification: 'verify_no_false_green_claims',
        executionType: EXECUTION_TYPES.INTEGRATION
    },

    // 3. Implementation Scenarios
    {
        id: 'SCENARIO_SYNTAX_BUILD_BREAK',
        category: SCENARIO_CATEGORIES.IMPLEMENTATION,
        name: 'انكسار في البناء أو أخطاء نحوية (Syntax / Build Failure)',
        description: 'حقن خطأ في بناء الكود البرمجي داخل بيئة معزولة',
        preconditions: 'SafeRepairEngine and Build Gate active',
        trigger: 'Apply modification with syntax error in mock file',
        expected_detection: 'Build gate validator returns false',
        expected_classification: 'IMPLEMENTATION_FAILURE',
        expected_response: 'Trigger SafeRepairEngine automatic rollback to previous checkpoint',
        expectedBehavior: 'Revert changes safely, return FAILED_AND_REVERTED status',
        dataIntegrity: 'File restored to exact pre-modification hash',
        severity: 'MEDIUM',
        recovery_strategy: 'Scoped Git file restore and TaskReplanner strategy change',
        recovery: 'State restored to clean checkpoint',
        verification: 'verify_clean_state_restoration',
        executionType: EXECUTION_TYPES.UNIT
    },

    // 4. Security Scenarios
    {
        id: 'SCENARIO_EXPIRED_CREDENTIAL',
        category: SCENARIO_CATEGORIES.SECURITY,
        name: 'انتهاء صلاحية مفتاح الربط الخارجي (Expired External API Key)',
        description: 'حقن رمز وصول منتهي الصلاحية',
        preconditions: 'SecretsGuard and TokenManager active',
        trigger: 'Inject expired OAuth / API token to external integration',
        expected_detection: 'TokenManager verifies signature and expiration status',
        expected_classification: 'SECURITY_FAILURE',
        expected_response: 'Sanitize error output, block request, alert for rotation',
        expectedBehavior: 'Log sanitized error without leaking secret, return 502 Bad Gateway to client',
        dataIntegrity: 'Transaction marked as FAILED_AUTH in audit ledger',
        severity: 'HIGH',
        recovery_strategy: 'Token revocation family invalidation and secure refresh',
        recovery: 'Alert triggered for secret rotation',
        verification: 'verify_token_family_revocation',
        executionType: EXECUTION_TYPES.UNIT
    },
    {
        id: 'SCENARIO_PROMPT_INJECTION',
        category: SCENARIO_CATEGORIES.SECURITY,
        name: 'محاولة حقن تعليمات في كود المستودع (Prompt / Command Injection)',
        description: 'تمرير تعليمات هجومية تحاول تجاوز توجيهات النظام أو استخراج أسرار',
        preconditions: 'UntrustedRepoGuard active',
        trigger: 'Inject system prompt override payload inside simulated user input',
        expected_detection: 'UntrustedRepoGuard regex and pattern scanner detects override payload',
        expected_classification: 'SECURITY_FAILURE',
        expected_response: 'Neutralize payload as passive data and deny arbitrary execution',
        expectedBehavior: 'Neutralized as data-only, dangerous command blocked',
        dataIntegrity: 'Zero execution of injected instructions',
        severity: 'CRITICAL',
        recovery_strategy: 'UntrustedRepoGuard.sanitizeUntrustedInput()',
        recovery: 'Event logged in Security Memory',
        verification: 'verify_input_neutralization',
        executionType: EXECUTION_TYPES.UNIT
    },

    // 5. Verification Scenarios
    {
        id: 'SCENARIO_FLAKY_TEST_NOISE',
        category: SCENARIO_CATEGORIES.VERIFICATION,
        name: 'إنذار كاذب في فحص الأمان (False Positive Finding Noise)',
        description: 'أداة فحص تدعي وجود ثغرة في كود محمي بالبارامترات',
        preconditions: 'FindingVerifier and EvidenceGraph active',
        trigger: 'Provide raw finding for parameterized query claiming SQL injection',
        expected_detection: 'FindingVerifier analyzes code context around finding',
        expected_classification: 'TEST_FAILURE',
        expected_response: 'Mark finding as FALSE_POSITIVE with justification',
        expectedBehavior: 'Prevent blocking developer on false alert',
        dataIntegrity: 'EvidenceGraph updates finding confidence to FALSE_POSITIVE',
        severity: 'LOW',
        recovery_strategy: 'Independent verification gate validation',
        recovery: 'Annotate finding in EvidenceGraph',
        verification: 'verify_false_positive_verdict',
        executionType: EXECUTION_TYPES.UNIT
    },

    // 6. Agent Behavior Scenarios
    {
        id: 'SCENARIO_REPEATED_REPAIR_LOOP',
        category: SCENARIO_CATEGORIES.AGENT_BEHAVIOR,
        name: 'حلقة تكرار فاشلة للوكيل (Agent Infinite Repair Loop)',
        description: 'تكرار نفس المحاولة الفاشلة 3 مرات متتالية دون تغيير الاستراتيجية',
        preconditions: 'TaskReplanner Loop Protection enabled',
        trigger: 'Feed identical task failure signature 3 times',
        expected_detection: 'TaskReplanner signature map detects loop pattern',
        expected_classification: 'UNKNOWN_FAILURE',
        expected_response: 'Return REPLAN_BLOCKED and escalate to prevent runaway execution',
        expectedBehavior: 'Immediate halt of infinite retry loop',
        dataIntegrity: 'No uncontrolled resource exhaustion',
        severity: 'HIGH',
        recovery_strategy: 'TaskReplanner.replanOnFailure() returns REPLAN_BLOCKED',
        recovery: 'Escalate to human review',
        verification: 'verify_replan_blocked_decision',
        executionType: EXECUTION_TYPES.UNIT
    }
];

class FailureScenarioLibrary {
    static getScenarios(category = null) {
        if (category) {
            return StandardFailureScenarios.filter(s => s.category === category);
        }
        return [...StandardFailureScenarios];
    }

    static getScenarioById(id) {
        return StandardFailureScenarios.find(s => s.id === id) || null;
    }

    /**
     * محاكاة وتنفيذ سيناريو الفشل والتحقق من الاستجابة المتوقعة في بيئة آمنة
     */
    static async executeScenario(scenarioId, targetHandler) {
        const scenario = this.getScenarioById(scenarioId);
        if (!scenario) throw new Error(`السيناريو '${scenarioId}' غير موجود.`);

        const startTime = Date.now();
        let result = {
            passed: false,
            scenarioId,
            category: scenario.category,
            executionType: scenario.executionType,
            error: null,
            recoveryTimeMs: 0,
            evidence: null
        };

        try {
            const execution = await targetHandler(scenario);
            result.passed = execution.success === true;
            result.evidence = execution.evidence || 'Handled gracefully according to resilience contract';
        } catch (err) {
            result.passed = false;
            result.error = err.message;
        }

        result.recoveryTimeMs = Date.now() - startTime;
        return result;
    }
}

FailureScenarioLibrary.SCENARIO_CATEGORIES = SCENARIO_CATEGORIES;
FailureScenarioLibrary.EXECUTION_TYPES = EXECUTION_TYPES;

module.exports = FailureScenarioLibrary;

