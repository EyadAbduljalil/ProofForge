/**
 * @file threat-engine.js
 * @description محرك نمذجة التهديدات وحدود الثقة وتوليد مصفوفة التهديدات المنظمة
 * WebForge OS Security Intelligence & Governance System
 */

class ThreatModelingEngine {
    /**
     * إنشاء نموذج تهديدات شامل بناءً على ملف تعريف المشروع والحدود المعمارية
     * @param {Object} projectProfile 
     * @returns {Object} نموذج التهديدات المنظم (Machine-Readable Threat Model)
     */
    static generateThreatModel(projectProfile) {
        const threatModel = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            projectName: projectProfile?.project?.name || 'WebForge App',
            assets: this.identifyAssets(projectProfile),
            actors: this.identifyActors(projectProfile),
            trustBoundaries: this.identifyTrustBoundaries(projectProfile),
            threats: []
        };

        threatModel.threats = this.mapThreats(threatModel.assets, threatModel.actors, threatModel.trustBoundaries, projectProfile);
        return threatModel;
    }

    static identifyAssets(profile) {
        const assets = [
            { id: 'AST-CRED', name: 'User Credentials & Session Tokens', sensitivity: 'CRITICAL', classification: 'CONFIDENTIAL' },
            { id: 'AST-PII', name: 'Personally Identifiable Information (PII)', sensitivity: 'HIGH', classification: 'RESTRICTED' },
            { id: 'AST-DATA', name: 'Application Database Records', sensitivity: 'HIGH', classification: 'CONFIDENTIAL' },
            { id: 'AST-SEC', name: 'Application API Keys & Secrets', sensitivity: 'CRITICAL', classification: 'SECRET' }
        ];

        if (profile?.capabilities?.payments) {
            assets.push({ id: 'AST-FIN', name: 'Payment Transactions & Card Data', sensitivity: 'CRITICAL', classification: 'PCI-DSS' });
        }
        if (profile?.capabilities?.ai) {
            assets.push({ id: 'AST-AI-CTX', name: 'AI System Prompts & Context Windows', sensitivity: 'HIGH', classification: 'CONFIDENTIAL' });
            assets.push({ id: 'AST-AI-TOOL', name: 'Agent Tool Execution Endpoints', sensitivity: 'CRITICAL', classification: 'PRIVILEGED' });
        }
        if (profile?.capabilities?.containers) {
            assets.push({ id: 'AST-INFRA', name: 'Container Runtime & Host Environment', sensitivity: 'CRITICAL', classification: 'INFRASTRUCTURE' });
        }
        return assets;
    }

    static identifyActors(profile) {
        return [
            { id: 'ACT-ANON', name: 'Anonymous Public Visitor', trustLevel: 'UNTRUSTED' },
            { id: 'ACT-AUTH', name: 'Authenticated Tenant User', trustLevel: 'SEMI-TRUSTED' },
            { id: 'ACT-ADMIN', name: 'System Administrator', trustLevel: 'PRIVILEGED' },
            { id: 'ACT-MALICIOUS', name: 'Hostile Adversary / Exploit Script', trustLevel: 'HOSTILE' },
            { id: 'ACT-AI-AGENT', name: 'Autonomous AI Agent', trustLevel: 'CONTROLLED-UNTRUSTED' },
            { id: 'ACT-3RD-PARTY', name: 'External Webhook / Payment Gateway', trustLevel: 'PARTNER-VERIFIED' }
        ];
    }

    static identifyTrustBoundaries(profile) {
        return [
            { id: 'TB-BROWSER-API', source: 'Browser / Client', destination: 'API Gateway', protocol: 'HTTPS', boundaryType: 'PUBLIC_TO_INTERNAL' },
            { id: 'TB-API-DB', source: 'API Server', destination: 'Database Cluster', protocol: 'TLS/TCP', boundaryType: 'SERVICE_TO_DATA' },
            { id: 'TB-TENANT-CROSS', source: 'Tenant A', destination: 'Tenant B Resources', protocol: 'LOGICAL', boundaryType: 'TENANT_ISOLATION' },
            { id: 'TB-APP-AI', source: 'Backend Core', destination: 'LLM / Vector Model', protocol: 'HTTPS', boundaryType: 'DATA_TO_MODEL' },
            { id: 'TB-AGENT-TOOL', source: 'AI Agent Output', destination: 'Privileged Execution Engine', protocol: 'IPC/RPC', boundaryType: 'UNTRUSTED_AI_TO_CORE' }
        ];
    }

    static mapThreats(assets, actors, boundaries, profile) {
        const threats = [
            {
                id: 'THR-AUTH-01',
                title: 'Session Token Hijacking & Replay Attack',
                asset: 'AST-CRED',
                actor: 'ACT-MALICIOUS',
                trust_boundary: 'TB-BROWSER-API',
                cwe: 'CWE-294',
                impact: 'CRITICAL',
                likelihood: 'MEDIUM',
                risk: 'CRITICAL',
                mitigation_control: 'SEC-AUTH-01',
                test_file: 'packages/security/tests/security.test.js',
                status: 'VERIFIED'
            },
            {
                id: 'THR-IDOR-01',
                title: 'Cross-Tenant Horizontal Privilege Escalation (IDOR)',
                asset: 'AST-DATA',
                actor: 'ACT-AUTH',
                trust_boundary: 'TB-TENANT-CROSS',
                cwe: 'CWE-639',
                impact: 'HIGH',
                likelihood: 'HIGH',
                risk: 'CRITICAL',
                mitigation_control: 'SEC-AUTHZ-01',
                test_file: 'packages/security/tests/security.test.js',
                status: 'VERIFIED'
            },
            {
                id: 'THR-SSRF-01',
                title: 'Server-Side Request Forgery Targeting Cloud Metadata',
                asset: 'AST-INFRA',
                actor: 'ACT-MALICIOUS',
                trust_boundary: 'TB-BROWSER-API',
                cwe: 'CWE-918',
                impact: 'CRITICAL',
                likelihood: 'HIGH',
                risk: 'CRITICAL',
                mitigation_control: 'SEC-SSRF-01',
                test_file: 'packages/security/tests/security_expansion.test.js',
                status: 'VERIFIED'
            }
        ];

        if (profile?.capabilities?.ai) {
            threats.push({
                id: 'THR-AI-01',
                title: 'Indirect Prompt Injection Overriding System Guardrails',
                asset: 'AST-AI-CTX',
                actor: 'ACT-MALICIOUS',
                trust_boundary: 'TB-APP-AI',
                cwe: 'CWE: N/A (LLM01)',
                impact: 'HIGH',
                likelihood: 'HIGH',
                risk: 'HIGH',
                mitigation_control: 'SEC-AI-01',
                test_file: 'packages/security/tests/security_expansion.test.js',
                status: 'VERIFIED'
            });
            threats.push({
                id: 'THR-AI-02',
                title: 'Unauthorized Tool Invocation by Autonomous Agent',
                asset: 'AST-AI-TOOL',
                actor: 'ACT-AI-AGENT',
                trust_boundary: 'TB-AGENT-TOOL',
                cwe: 'CWE-863',
                impact: 'CRITICAL',
                likelihood: 'MEDIUM',
                risk: 'CRITICAL',
                mitigation_control: 'SEC-AI-01',
                test_file: 'packages/security/tests/security_expansion.test.js',
                status: 'VERIFIED'
            });
        }

        return threats;
    }
}

module.exports = ThreatModelingEngine;
