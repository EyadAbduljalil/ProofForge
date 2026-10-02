/**
 * @file change-impact.js
 * @description محرك تحليل أثر التغييرات وتحديد نطاق اختبارات التراجع المستهدفة
 * WebForge OS Security Intelligence & Governance System
 */

class ChangeImpactAnalyzer {
    constructor() {
        this.dependencyGraph = {
            'packages/security/token-manager.js': {
                affectedControls: ['SEC-CTRL-01', 'SEC-AUTH-01'],
                affectedFeatures: ['Authentication', 'Session Management', 'Token Refresh'],
                requiredTests: [
                    'packages/security/tests/security.test.js'
                ]
            },
            'packages/security/ownership-guard.js': {
                affectedControls: ['SEC-CTRL-02', 'SEC-AUTHZ-01', 'SEC-TENANT-01'],
                affectedFeatures: ['Multi-Tenant Isolation', 'Resource Authorization', 'IDOR Prevention'],
                requiredTests: [
                    'packages/security/tests/security.test.js'
                ]
            },
            'packages/security/ssrf-guard.js': {
                affectedControls: ['SEC-CTRL-03', 'SEC-SSRF-01'],
                affectedFeatures: ['External Webhooks', 'URL Downloader', 'Cloud Metadata Protection'],
                requiredTests: [
                    'packages/security/tests/security_expansion.test.js'
                ]
            },
            'packages/security/ai-security-guard.js': {
                affectedControls: ['SEC-CTRL-04', 'SEC-AI-01'],
                affectedFeatures: ['Prompt Ingestion', 'AI Tool Execution', 'RAG Boundaries'],
                requiredTests: [
                    'packages/security/tests/security_expansion.test.js'
                ]
            },
            'packages/security/file-security.js': {
                affectedControls: ['SEC-CTRL-05', 'SEC-FILE-01'],
                affectedFeatures: ['File Uploads', 'Archive Extraction', 'Static Storage'],
                requiredTests: [
                    'packages/security/tests/security_expansion.test.js'
                ]
            },
            'packages/contracts/envelope.js': {
                affectedControls: ['SEC-SCHEMA-01'],
                affectedFeatures: ['API Responses', 'Frontend Client Envelope', 'Error Formatting'],
                requiredTests: [
                    'packages/contracts/tests/contracts.test.js'
                ]
            }
        };
    }

    /**
     * تحليل الملفات المعدلة وحساب مساحة الأثر ونطاق الاختبارات المطلوبة بدقة
     * @param {string[]} changedFiles قائمة الملفات المعدلة
     * @returns {Object} تقرير تحليل الأثر ونطاق الاختبارات المستهدفة
     */
    analyzeImpact(changedFiles = []) {
        const affectedControls = new Set();
        const affectedFeatures = new Set();
        const requiredTests = new Set();

        changedFiles.forEach(file => {
            const normalizedPath = file.replace(/\\/g, '/');
            const match = this.dependencyGraph[normalizedPath];
            if (match) {
                match.affectedControls.forEach(c => affectedControls.add(c));
                match.affectedFeatures.forEach(f => affectedFeatures.add(f));
                match.requiredTests.forEach(t => requiredTests.add(t));
            } else {
                // إذا كان الملف غير مسجل صراحة، نوصي بتشغيل الفحص الأمني العام
                requiredTests.add('packages/security/tests/security.test.js');
                requiredTests.add('packages/security/tests/security_expansion.test.js');
            }
        });

        return {
            timestamp: new Date().toISOString(),
            changedFiles,
            affectedControls: Array.from(affectedControls),
            affectedFeatures: Array.from(affectedFeatures),
            targetedRegressionSuite: Array.from(requiredTests),
            summary: `Calculated targeted regression scope: ${requiredTests.size} test suites needed.`
        };
    }
}

module.exports = ChangeImpactAnalyzer;
