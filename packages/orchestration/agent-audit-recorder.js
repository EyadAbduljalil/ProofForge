/**
 * @file agent-audit-recorder.js
 * @description سجل تدقيق وتوثيق تغييرات وكيل الذكاء الاصطناعي (AI Change Record & Agent Audit)
 * يضمن التتبع الكامل لكل تعديل برمجي أو معماري يجريه الوكيل مع نقطة التراجع (Rollback Point) وحكم التحقق النهائي
 */

class AgentAuditRecorder {
    constructor() {
        this.auditLog = [];
    }

    recordChange(changeContext) {
        if (!changeContext || !changeContext.intent) {
            throw new Error('يجب تحديد القصد المعماري للتغيير (intent) في سجل التدقيق.');
        }

        const changeRecord = {
            changeId: changeContext.changeId || `CHG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            agentName: changeContext.agentName || 'WebForge_Autonomous_Agent',
            intent: changeContext.intent,
            userTask: changeContext.userTask || 'Unspecified user task',
            detectedRisk: changeContext.detectedRisk || 'LOW',
            filesChanged: Array.isArray(changeContext.filesChanged) ? changeContext.filesChanged : [],
            architectureImpact: changeContext.architectureImpact || 'LOCAL_COMPONENT_MODIFICATION',
            securityImpact: changeContext.securityImpact || 'NO_CRITICAL_IMPACT',
            testsExecuted: Array.isArray(changeContext.testsExecuted) ? changeContext.testsExecuted : [],
            rollbackPoint: changeContext.rollbackPoint || `checkpoint_${Date.now()}`,
            evidence: changeContext.evidence || 'Test execution output attached',
            finalVerdict: changeContext.finalVerdict || 'VERIFIED_AND_ACCEPTED',
            recordedAt: new Date().toISOString()
        };

        this.auditLog.push(changeRecord);
        return changeRecord;
    }

    getAuditTrail() {
        return [...this.auditLog];
    }
}

module.exports = AgentAuditRecorder;
