/**
 * @file ai-agent-governance.js
 * @description محرك حوكمة وكلاء الذكاء الاصطناعي وحدود RAG وبوابة الموافقة البشرية على العمليات عالية الخطورة
 * WebForge OS Security Intelligence & Governance System
 */

class AIAgentGovernanceEngine {
    constructor() {
        // تعريف مصفوفة الأدوات وصلاحياتها ومستوى الخطورة
        this.toolDefinitions = {
            'search_knowledge_base': {
                riskLevel: 'LOW',
                requiredPermission: 'ai.read',
                requiresApproval: false,
                allowedRoles: ['user', 'admin', 'system']
            },
            'fetch_user_profile': {
                riskLevel: 'MEDIUM',
                requiredPermission: 'ai.profile.read',
                requiresApproval: false,
                allowedRoles: ['user', 'admin']
            },
            'issue_financial_refund': {
                riskLevel: 'HIGH',
                requiredPermission: 'financial.refund',
                requiresApproval: true,
                allowedRoles: ['admin']
            },
            'delete_database_records': {
                riskLevel: 'CRITICAL',
                requiredPermission: 'db.delete',
                requiresApproval: true,
                allowedRoles: ['admin', 'system']
            },
            'execute_shell_command': {
                riskLevel: 'CRITICAL',
                requiredPermission: 'infra.exec',
                requiresApproval: true,
                allowedRoles: ['system_privileged_only']
            }
        };

        this.approvalRequests = new Map();
    }

    /**
     * التحقق من صلاحية تنفيذ الأداة بواسطة وكيل الذكاء الاصطناعي وتطبيق الموافقة البشرية إن لزم الأمر
     * @param {Object} executionContext 
     * @returns {Object} قرار السماح أو طلب الموافقة البشرية
     */
    evaluateToolInvocation({ toolName, userRole, tenantId, argumentsPayload, approvedByHuman = false }) {
        const tool = this.toolDefinitions[toolName];
        if (!tool) {
            return {
                allowed: false,
                reason: `Tool '${toolName}' is not registered in the security allowlist. Execution rejected.`,
                action: 'DENY'
            };
        }

        // 1. التحقق من صلاحية الدور (Role Check)
        if (!tool.allowedRoles.includes(userRole)) {
            return {
                allowed: false,
                reason: `Role '${userRole}' lacks permission for tool '${toolName}'. Requires one of: [${tool.allowedRoles.join(', ')}]`,
                action: 'DENY'
            };
        }

        // 2. فحص العمليات عالية الخطورة والموافقة البشرية (Human-in-the-loop Gate)
        if (tool.requiresApproval && !approvedByHuman) {
            const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            this.approvalRequests.set(requestId, {
                requestId,
                toolName,
                userRole,
                tenantId,
                argumentsPayload,
                status: 'PENDING_HUMAN_APPROVAL',
                timestamp: new Date().toISOString()
            });

            return {
                allowed: false,
                requiresApproval: true,
                requestId,
                reason: `High-risk tool '${toolName}' requires human security officer approval before execution.`,
                action: 'HOLD_FOR_APPROVAL'
            };
        }

        return {
            allowed: true,
            action: 'ALLOW',
            reason: `Execution authorized for '${toolName}' with role '${userRole}'.`
        };
    }

    /**
     * عزل سياق RAG والتحقق المسبق من تصريح المستأجر قبل تزويد النموذج بالوثائق
     * @param {Object[]} documents قائمة الوثائق المسترجعة من قاعدة المتجهات
     * @param {string} requestTenantId معرف المستأجر الطالب
     * @returns {Object[]} الوثائق المصرح بها فقط
     */
    filterRAGContextForTenant(documents = [], requestTenantId) {
        if (!requestTenantId) {
            throw new Error('Tenant ID is strictly required for RAG context retrieval.');
        }

        // تصفية الوثائق والتأكد من تطابق المستأجر وعدم وجود وثائق ملغاة
        return documents.filter(doc => {
            const isSameTenant = doc.tenantId === requestTenantId;
            const isNotDeleted = !doc.isDeleted && !doc.isStale;
            return isSameTenant && isNotDeleted;
        });
    }

    /**
     * التحقق من سلامة مخرجات النموذج قبل تمريرها لمعالجات النظام
     * @param {string} rawOutput مخرجات الذكاء الاصطناعي الخام
     * @param {string} expectedType نوع البيانات المتوقع ('json' | 'string')
     */
    validateAIOutput(rawOutput, expectedType = 'json') {
        if (expectedType === 'json') {
            try {
                const parsed = typeof rawOutput === 'object' ? rawOutput : JSON.parse(rawOutput);
                // منع التعيين أو الخصائص الخبيثة
                if (parsed.__proto__ || parsed.constructor?.prototype) {
                    throw new Error('Dangerous prototype property in AI JSON output');
                }
                return { isValid: true, data: parsed };
            } catch (err) {
                return { isValid: false, error: `Invalid AI output JSON schema: ${err.message}` };
            }
        }
        return { isValid: true, data: rawOutput };
    }
}

module.exports = AIAgentGovernanceEngine;
