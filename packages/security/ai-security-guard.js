// حارس أمان الذكاء الاصطناعي والوكلاء واستدعاء الأدوات (AI & Agent Security Guard)
class AISecurityGuard {
    constructor(options = {}) {
        this.toolAllowlist = options.toolAllowlist || [];
        this.maxActionsPerSession = options.maxActionsPerSession || 50;
        this.actionCount = 0;
        this.sessionTenantId = options.tenantId || null;
    }

    static detectPromptInjection(inputText) {
        if (!inputText || typeof inputText !== 'string') return { detected: false };

        const dangerousPatterns = [
            /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
            /disregard\s+(all\s+)?(rules|prompts|system)/i,
            /you\s+are\s+now\s+in\s+DAN\s+mode/i,
            /bypass\s+(security|filter|guardrail)/i,
            /reveal\s+(system\s+prompt|secret\s+key|api\s+key)/i,
            /print\s+(environment\s+variables|env\s+vars)/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(inputText)) {
                return {
                    detected: true,
                    pattern: pattern.toString(),
                    reason: 'تم رصد محاولة حقن تعليمات مشبوهة (Prompt Injection Attempt)'
                };
            }
        }

        return { detected: false };
    }

    authorizeToolExecution(user, toolName, toolArguments) {
        // 1. فحص الميزانية وسقف العمليات (Action Limits)
        if (this.actionCount >= this.maxActionsPerSession) {
            throw new Error('تم تجاوز سقف العمليات المسموح به لجلسة الذكاء الاصطناعي');
        }

        // 2. فحص القائمة البيضاء للأدوات (Tool Allowlist)
        if (this.toolAllowlist.length > 0 && !this.toolAllowlist.includes(toolName)) {
            throw new Error(`الأداة '${toolName}' غير مصرح للذكاء الاصطناعي باستدعائها (Unauthorized Tool Execution)`);
        }

        // 3. فحص صلاحيات المستخدم للأداة
        if (toolName.startsWith('admin_') && user.role !== 'admin') {
            throw new Error(`محظور: المستخدم الحالي لا يملك صلاحية تنفيذ الأداة الإدارية '${toolName}'`);
        }

        // 4. فحص عزل المستأجر في وسائط الأداة
        if (toolArguments && toolArguments.tenantId && this.sessionTenantId) {
            if (toolArguments.tenantId !== this.sessionTenantId) {
                throw new Error('محظور: محاولة استدعاء أداة على مستأجر آخر (Cross-tenant AI Violation)');
            }
        }

        this.actionCount++;
        return { authorized: true, toolName, actionId: this.actionCount };
    }

    static validateAIOutput(rawOutput, expectedSchema) {
        if (!rawOutput) throw new Error('مخرجات النموذج فارغة');
        
        // حظر الأوامر الخطرة المباشرة
        const dangerousCommands = ['rm -rf', 'format', 'drop database', 'eval(', 'exec('];
        const outputStr = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput);
        
        for (const cmd of dangerousCommands) {
            if (outputStr.toLowerCase().includes(cmd)) {
                throw new Error(`مخرجات النموذج تحتوي على أمر خطر محظور التنفيذ تلقائياً: ${cmd}`);
            }
        }

        return { safe: true, output: rawOutput };
    }
}

module.exports = AISecurityGuard;
