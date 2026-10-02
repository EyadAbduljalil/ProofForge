/**
 * @file agent-permission-boundary.js
 * @description مصفوفة وحواجز صلاحيات وكيل الذكاء الاصطناعي (Agent Permission Boundary)
 * تفرض مبدأ الامتيازات الأقل (Principle of Least Privilege) والرفض الافتراضي (Default Deny) على كافة أدوات وعمليات الوكيل
 */

const STANDARD_PERMISSIONS = {
    READ_REPOSITORY: 'ALLOWED',
    RUN_TESTS: 'ALLOWED',
    RUN_BUILD: 'ALLOWED',
    RUN_SECURITY_SCAN: 'ALLOWED',
    WRITE_SOURCE: 'REQUIRES_CHECKPOINT',
    RUN_BROWSER: 'ALLOWED',
    RUN_DATABASE: 'SANDBOXED_ONLY',
    RUN_NETWORK: 'RESTRICTED_LOCAL',
    MODIFY_INFRASTRUCTURE: 'REQUIRES_APPROVAL',
    PUSH_GIT: 'REQUIRES_APPROVAL',
    CREATE_PR: 'ALLOWED',
    MERGE: 'REQUIRES_HUMAN_GATE'
};

class AgentPermissionBoundary {
    constructor(customOverrides = {}) {
        this.permissions = { ...STANDARD_PERMISSIONS, ...customOverrides };
    }

    /**
     * تقييم ما إذا كان مسموحاً للوكيل تنفيذ العملية المطلوبة
     */
    evaluatePermission(action, context = {}) {
        const policy = this.permissions[action] || 'DENIED'; // Default Deny

        if (policy === 'DENIED') {
            return {
                allowed: false,
                reason: `العملية '${action}' محظورة بالكامل بموجب سياسة أمان الوكيل (Default Deny).`
            };
        }

        if (policy === 'REQUIRES_APPROVAL' || policy === 'REQUIRES_HUMAN_GATE') {
            if (!context.humanApprovalToken && !context.explicitlyApproved) {
                return {
                    allowed: false,
                    requiresApproval: true,
                    reason: `العملية '${action}' حساسة وتتطلب موافقة بشرية صريحة (Human Approval Gate).`
                };
            }
        }

        if (policy === 'REQUIRES_CHECKPOINT' && !context.checkpointCreated) {
            return {
                allowed: false,
                requiresCheckpoint: true,
                reason: `العملية '${action}' تتطلب إنشاء نقطة استعادة (Checkpoint) قبل التعديل لضمان إمكانية التراجع.`
            };
        }

        return {
            allowed: true,
            action,
            policy,
            evaluatedAt: new Date().toISOString()
        };
    }
}

module.exports = AgentPermissionBoundary;
