/**
 * @file hitl-decision-tracer.js
 * @description WebForge V2.3 — Human-in-the-Loop & Multi-Agent Decision Tracer
 * محرك التحقق من قرارات الموافقة البشرية (HITL) وتتبع مسار قرارات الذكاء الاصطناعي
 * وضمان عزل صلاحيات الوكلاء المتعددين ومنع التوارث الصامت للصلاحيات
 */

'use strict';

class HitlDecisionTracer {
    constructor() {
        this.approvals = new Map();
        this.decisionTraces = [];
    }

    /**
     * تسجيل موافقة بشرية على قرار ذكاء اصطناعي
     * @param {Object} approvalDef
     */
    recordApproval(approvalDef) {
        if (!approvalDef || !approvalDef.decisionId || !approvalDef.approverId) {
            throw new Error('الموافقة البشرية تتطلب معرف القرار ومعرف المعتمد.');
        }

        // كشف الموافقة الذاتية غير المصرح بها (Anti Self-Approval)
        if (approvalDef.approverId === approvalDef.initiatorId) {
            throw new Error('محظور: لا يجوز للوكيل أو المستخدم اعتماد قراره الذاتي الحساس (Self-Approval Prohibited).');
        }

        const approval = {
            decisionId: String(approvalDef.decisionId),
            approverId: String(approvalDef.approverId),
            scope: approvalDef.scope || 'SINGLE_ACTION',
            status: approvalDef.status || 'APPROVED', // APPROVED, REJECTED
            timestamp: new Date().toISOString()
        };

        this.approvals.set(approval.decisionId, approval);
        return approval;
    }

    /**
     * التحقق من وجود موافقة بشرية سارية المفعول لتنفيذ القرار
     * @param {string} decisionId
     */
    verifyHumanApproval(decisionId) {
        const app = this.approvals.get(decisionId);
        if (!app) {
            return {
                decisionId,
                status: 'APPROVAL_MISSING',
                gate: 'FAIL',
                isApproved: false,
                reason: 'لم يتم العثور على موافقة بشرية مسجلة لهذا القرار الحساس.'
            };
        }

        if (app.status !== 'APPROVED') {
            return {
                decisionId,
                status: 'APPROVAL_REJECTED',
                gate: 'FAIL',
                isApproved: false,
                reason: 'تم رفض القرار من قبل المعتمد البشري.'
            };
        }

        return {
            decisionId,
            approverId: app.approverId,
            status: 'VERIFIED',
            gate: 'PASS',
            isApproved: true
        };
    }

    /**
     * التحقق من تفويض الصلاحيات بين وكلاء متعددين (Multi-Agent Boundary)
     * والتأكد من عدم توارث الصلاحيات بصورة صامتة
     * @param {Object} delegationContext
     */
    verifyAgentDelegation(delegationContext = {}) {
        const { sourceAgent, targetAgent, requestedPermission } = delegationContext;

        if (!sourceAgent || !targetAgent || !requestedPermission) {
            return { status: 'INVALID_DELEGATION', gate: 'FAIL', isAuthorized: false };
        }

        // التحقق من أن الوكيل المصدر يملك الصلاحية أصلاً
        const sourceHasPerm = sourceAgent.permissions && sourceAgent.permissions.includes(requestedPermission);
        if (!sourceHasPerm) {
            return {
                status: 'ILLEGAL_DELEGATION_ATTEMPT',
                gate: 'FAIL',
                isAuthorized: false,
                reason: `الوكيل (${sourceAgent.id}) لا يملك الصلاحية (${requestedPermission}) ولا يحق له تفويضها.`
            };
        }

        // التحقق من أن الوكيل المستهدف مصرح له باستلام هذه الصلاحية
        const targetAllowed = targetAgent.maxAllowedPermissions && targetAgent.maxAllowedPermissions.includes(requestedPermission);
        if (!targetAllowed) {
            return {
                status: 'DELEGATION_PRIVILEGE_ESCALATION',
                gate: 'FAIL',
                isAuthorized: false,
                reason: `محاولة تصعيد صلاحيات غير مصرح بها: الوكيل (${targetAgent.id}) غير مصرح له بتلقي الصلاحية (${requestedPermission}).`
            };
        }

        return {
            sourceAgentId: sourceAgent.id,
            targetAgentId: targetAgent.id,
            permission: requestedPermission,
            status: 'VERIFIED',
            gate: 'PASS',
            isAuthorized: true
        };
    }
}

module.exports = {
    HitlDecisionTracer
};
