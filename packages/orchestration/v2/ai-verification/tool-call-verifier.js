/**
 * @file tool-call-verifier.js
 * @description WebForge V2.3 — Tool Calling & Argument Safety Verifier
 * محرك فحص استدعاء الأدوات بواسطة النموذج، تدقيق المعاملات، ومنع التنفيذ المباشر
 * وفرض حدود الصلاحيات (Model Output -> Action Boundary)
 */

'use strict';

class ToolCallVerifier {
    constructor() {
        this.registeredTools = new Map();
    }

    /**
     * تسجيل أداة تصريحية بحدود صلاحياتها
     * @param {Object} toolDef
     */
    registerTool(toolDef) {
        if (!toolDef || !toolDef.name || !toolDef.schema) {
            throw new Error('الأداة تتطلب اسماً ومخطط معاملات (schema).');
        }

        const tool = {
            name: String(toolDef.name),
            description: toolDef.description || '',
            impactLevel: toolDef.impactLevel || 'LOW', // LOW, MEDIUM, HIGH
            requiredRoles: Array.isArray(toolDef.requiredRoles) ? toolDef.requiredRoles : [],
            schema: toolDef.schema, // { required: [], properties: {} }
            requiresHumanApproval: toolDef.impactLevel === 'HIGH' || Boolean(toolDef.requiresHumanApproval),
            allowDirectExecution: false // حظر مطلق للتنفيذ المباشر
        };

        this.registeredTools.set(tool.name, tool);
        return tool;
    }

    /**
     * التحقق من شرعية طلب استدعاء أداة صادر عن النموذج
     * @param {Object} callRequest
     */
    verifyToolCall(callRequest = {}) {
        const { toolName, arguments: args = {}, actor = {}, hasApproved = false } = callRequest;
        const tool = this.registeredTools.get(toolName);

        if (!tool) {
            return {
                toolName,
                status: 'UNKNOWN_TOOL',
                gate: 'FAIL',
                isPermitted: false,
                reason: `محاولة استدعاء أداة غير مصرح بها أو غير مسجلة: ${toolName}`
            };
        }

        const violations = [];

        // 1. فحص صلاحيات الفاعل (Actor Authorization)
        if (tool.requiredRoles.length > 0) {
            const hasRole = tool.requiredRoles.some(r => actor.roles && actor.roles.includes(r));
            if (!hasRole) {
                violations.push({
                    type: 'UNAUTHORIZED_TOOL_INVOCATION',
                    severity: 'CRITICAL',
                    message: `الفاعل غير مخول باستدعاء الأداة (${tool.name}). الأدوار المطلوبة: ${tool.requiredRoles.join(', ')}`
                });
            }
        }

        // 2. تدقيق معاملات الأداة (Argument Validation)
        const schema = tool.schema || {};
        if (Array.isArray(schema.required)) {
            for (const param of schema.required) {
                if (args[param] === undefined || args[param] === null) {
                    violations.push({
                        type: 'MISSING_TOOL_ARGUMENT',
                        severity: 'HIGH',
                        argument: param,
                        message: `المعامل الإلزامي (${param}) مفقود في استدعاء الأداة.`
                    });
                }
            }
        }

        // 3. فحص محاولات حقن الأوامر داخل المعاملات (Command / Path Injection in Arguments)
        for (const [key, val] of Object.entries(args)) {
            if (typeof val === 'string') {
                if (val.includes('../') || val.includes('..\\') || val.includes('; rm ') || val.includes('|')) {
                    violations.push({
                        type: 'MALICIOUS_TOOL_ARGUMENT',
                        severity: 'CRITICAL',
                        argument: key,
                        message: `تم رصد محاولة حقن مسار أو أوامر في المعامل (${key}): ${val}`
                    });
                }
            }
        }

        // 4. فرض الموافقة البشرية للإجراءات عالية الأثر (Human-in-the-Loop)
        if (tool.requiresHumanApproval && !hasApproved) {
            violations.push({
                type: 'HUMAN_APPROVAL_REQUIRED',
                severity: 'CRITICAL',
                message: `الأداة (${tool.name}) مصنفة كأداة عالية الأثر (${tool.impactLevel}) وتتطلب موافقة بشرية مسبقة صريحة.`
            });
        }

        const isPermitted = violations.length === 0;
        return {
            toolName: tool.name,
            impactLevel: tool.impactLevel,
            status: isPermitted ? 'VERIFIED' : 'INVOCATION_DENIED',
            gate: isPermitted ? 'PASS' : 'FAIL',
            isPermitted,
            violationsCount: violations.length,
            violations
        };
    }
}

module.exports = {
    ToolCallVerifier
};
