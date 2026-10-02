/**
 * @file failure-scenario-library.js
 * @description مكتبة سيناريوهات الفشل والاختبارات المرنة (Failure Scenario Library & Chaos Resilience)
 * توفر سيناريوهات حقن الأعطال واختبار استعادة النظام وسلامة البيانات
 */

const StandardFailureScenarios = [
    {
        id: 'SCENARIO_DB_TIMEOUT',
        name: 'انقطاع استجابة قاعدة البيانات (Database Timeout)',
        injection: 'Simulate DB connection delay exceeding 5000ms',
        expectedBehavior: 'Fallback to degraded mode or cached response with structured 504 AppError',
        dataIntegrity: 'Atomic transaction rollback, no orphan records',
        recovery: 'Automatic retry with exponential backoff'
    },
    {
        id: 'SCENARIO_CACHE_FAILURE',
        name: 'انهيار خادم الكاش (Cache Down / Unreachable)',
        injection: 'Simulate Redis/Cache cluster connection refused',
        expectedBehavior: 'Graceful degradation: query database directly without server crash',
        dataIntegrity: 'Zero cache-inconsistency, read directly from primary store',
        recovery: 'Circuit breaker trips and probes cache health periodically'
    },
    {
        id: 'SCENARIO_RACE_CONDITION',
        name: 'تضارب متزامن على نفس المورد (Concurrent Double Action)',
        injection: 'Trigger 10 parallel checkout requests with identical idempotency key and user ID',
        expectedBehavior: 'Exactly 1 request succeeds with 200 OK; remaining 9 rejected with 409 or return cached idempotent response',
        dataIntegrity: 'No balance negative overdraft, inventory decremented strictly once',
        recovery: 'Mutex lock released cleanly after completion'
    },
    {
        id: 'SCENARIO_EXPIRED_CREDENTIAL',
        name: 'انتهاء صلاحية مفتاح الربط الخارجي (Expired External API Key)',
        injection: 'Inject expired OAuth / API token to payment gateway',
        expectedBehavior: 'Log sanitized error without leaking secret, return 502 Bad Gateway to client',
        dataIntegrity: 'Transaction marked as FAILED_AUTH in audit ledger',
        recovery: 'Alert triggered for secret rotation'
    }
];

class FailureScenarioLibrary {
    static getScenarios() {
        return [...StandardFailureScenarios];
    }

    /**
     * محاكاة وتنفيذ سيناريو الفشل والتحقق من الاستجابة المتوقعة
     */
    static async executeScenario(scenarioId, targetHandler) {
        const scenario = StandardFailureScenarios.find(s => s.id === scenarioId);
        if (!scenario) throw new Error(`السيناريو '${scenarioId}' غير موجود.`);

        const startTime = Date.now();
        let result = { passed: false, scenarioId, error: null, recoveryTimeMs: 0 };

        try {
            const execution = await targetHandler(scenario);
            result.passed = execution.success === true;
            result.evidence = execution.evidence || 'Handled gracefully';
        } catch (err) {
            result.passed = false;
            result.error = err.message;
        }

        result.recoveryTimeMs = Date.now() - startTime;
        return result;
    }
}

module.exports = FailureScenarioLibrary;
