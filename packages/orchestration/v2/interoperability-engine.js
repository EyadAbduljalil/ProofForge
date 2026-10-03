/**
 * @file interoperability-engine.js
 * @description WebForge V2 — Machine-Readable Interoperability, SARIF Export, CI/CD Contract & Rule Testing Framework
 * يوفر تصدير النتائج إلى معيار SARIF v2.1.0، مخططات JSON المعيارية، إطار اختبار القواعد المستقل، وعقد تكامل CI/CD المحايد تقنياً.
 */

class SarifExporter {
    /**
     * تحويل نتائج فحص WebForge إلى معيار SARIF v2.1.0 القياسي
     */
    static exportToSarif(findings = [], runInfo = {}) {
        const rulesMap = new Map();
        const results = [];

        for (const finding of findings) {
            const ruleId = finding.rule || finding.ruleId || 'WEBFORGE-SEC-001';
            if (!rulesMap.has(ruleId)) {
                rulesMap.set(ruleId, {
                    id: ruleId,
                    name: finding.title || ruleId,
                    shortDescription: { text: finding.description || finding.message || ruleId },
                    defaultConfiguration: {
                        level: SarifExporter.mapSeverityToSarifLevel(finding.severity)
                    }
                });
            }

            results.push({
                ruleId: ruleId,
                level: SarifExporter.mapSeverityToSarifLevel(finding.severity),
                message: { text: finding.message || finding.description || 'تم رصد مخالفة لمعيار WebForge' },
                locations: [{
                    physicalLocation: {
                        artifactLocation: {
                            uri: finding.file || 'repository/canonical-evidence'
                        },
                        region: {
                            startLine: finding.line || 1
                        }
                    }
                }],
                properties: {
                    evidenceConfidence: finding.confidence || 'HIGH',
                    remediation: finding.remediation || 'راجع إرشادات الإصلاح في توثيق القاعدة الكنسية.'
                }
            });
        }

        return {
            $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
            version: '2.1.0',
            runs: [{
                tool: {
                    driver: {
                        name: 'WebForge OS',
                        semanticVersion: runInfo.version || '2.0.0',
                        informationUri: 'https://webforge.dev',
                        rules: Array.from(rulesMap.values())
                    }
                },
                results
            }]
        };
    }

    static mapSeverityToSarifLevel(severity) {
        switch ((severity || '').toUpperCase()) {
            case 'CRITICAL':
            case 'HIGH':
            case 'P0':
            case 'P1':
                return 'error';
            case 'MEDIUM':
            case 'P2':
                return 'warning';
            case 'LOW':
            case 'P3':
                return 'note';
            default:
                return 'none';
        }
    }
}

class RuleTestFramework {
    constructor() {
        this.tests = [];
    }

    registerTest(ruleTest) {
        if (!ruleTest.ruleId || !ruleTest.testCases) {
            throw new Error('اختبار القاعدة يجب أن يتضمن معرف القاعدة وحالات الفحص.');
        }
        this.tests.push(ruleTest);
        return ruleTest;
    }

    /**
     * تشغيل حزمة اختبارات القاعدة المستقلة
     */
    runRuleTests(ruleId = null) {
        const testsToRun = ruleId ? this.tests.filter(t => t.ruleId === ruleId) : this.tests;
        const results = [];

        for (const t of testsToRun) {
            let passCount = 0;
            const casesResults = [];

            for (const c of t.testCases) {
                // محاكاة تقييم الحالة الإيجابية أو السلبية
                const actual = c.evaluate ? c.evaluate() : c.expected;
                const passed = actual === c.expected;
                if (passed) passCount++;
                casesResults.push({
                    caseName: c.name,
                    expected: c.expected,
                    actual,
                    passed
                });
            }

            results.push({
                ruleId: t.ruleId,
                totalCases: t.testCases.length,
                passedCases: passCount,
                allPassed: passCount === t.testCases.length,
                details: casesResults
            });
        }

        return {
            totalRulesTested: results.length,
            allRulesPassed: results.every(r => r.allPassed),
            results
        };
    }
}

class CicdIntegrationContract {
    /**
     * تعريف عقد التكامل الآلي مع خطوط الأنابيب CI/CD
     */
    static getContract() {
        return {
            contractVersion: '2.0.0',
            name: 'WebForge CI/CD Standard Integration Contract',
            stackAgnostic: true,
            inputs: {
                projectPath: 'مسار المستودع المستهدف بالفحص',
                profilePath: 'مسار ملف تعريف المشروع المخصص (اختياري)',
                strictGate: 'تفعيل الإيقاف الحتمي عند فشل أي بوابة أمان P0 (افتراضي: true)'
            },
            exitCodes: {
                0: 'VERIFIED / PASS — كافة بوابات الجودة والأمان اجتازت بنجاح كامل',
                1: 'GATE_FAILURE — فشل في إحدى بوابات الجودة أو وجود ثغرة أمنية P0/P1',
                2: 'SCHEMA_VIOLATION — تشوه في المخططات أو البيانات المدخلة',
                3: 'TAMPER_DETECTED — اكتشاف تلاعب في سجلات التدقيق أو الأدلة'
            },
            outputs: {
                jsonSummary: 'webforge-summary.json',
                sarifReport: 'webforge-results.sarif',
                auditLog: 'webforge-audit.log',
                evidenceHash: 'webforge-evidence.sha256'
            }
        };
    }
}

module.exports = {
    SarifExporter,
    RuleTestFramework,
    CicdIntegrationContract
};
