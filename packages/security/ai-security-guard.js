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
            /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|rules|prompts|commands|security|guards)/i,
            /disregard\s+(all\s+)?(rules|prompts|system|instructions|security)/i,
            /you\s+are\s+now\s+in\s+(DAN|developer|override)\s+mode/i,
            /bypass\s+(security|filter|guardrail|verification|rules)/i,
            /reveal\s+(system\s+prompt|secret\s+key|api\s+key)/i,
            /print\s+(environment\s+variables|env\s+vars)/i,
            /تجاهل\s+(كافة|جميع|كل)?\s*(التعليمات|الأوامر|القواعد|السياق|الضوابط)/i,
            /(تخطى|تجاوز|عطل)\s*(الأمان|الفلتر|الحماية|الضوابط|التحقق)/i,
            /(اطبع|اكشف|اعرض)\s*(التعليمات\s*النظامية|المفاتيح\s*السرية|المتغيرات)/i
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

        // 3. فحص صلاحيات المستخدم للأداة الإدارية أو الخطرة
        const dangerousTools = ['execute_command', 'delete_database', 'transfer_funds', 'shell_exec', 'format_disk'];
        const isPrivileged = toolName.startsWith('admin_') || toolName.startsWith('sys_') || dangerousTools.includes(toolName);
        if (isPrivileged && (!user || user.role !== 'admin')) {
            throw new Error(`محظور: المستخدم الحالي لا يملك صلاحية تنفيذ الأداة الإدارية '${toolName}'`);
        }

        // 4. فحص عزل المستأجر في وسائط الأداة
        if (toolArguments && toolArguments.tenantId && this.sessionTenantId) {
            if (String(toolArguments.tenantId) !== String(this.sessionTenantId)) {
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

    /**
     * تدقيق وتأمين المحتوى المسترجع من أدوات بروتوكول MCP والاسترجاع الخارجي (C2 Zero-Trust Retrieval Guard)
     * يضمن أن: Retrieved Content !== Evidence, Tool Result !== Evidence
     * ويكتشف هجمات حقن التعليمات غير المباشرة (Indirect Prompt Injection) وتسميم الأدلة
     */
    static validateRetrievedContent(payload = '') {
        const text = typeof payload === 'string' ? payload : (payload.content || payload.text || JSON.stringify(payload));
        const reasons = [];

        // 1. فحص حقن التعليمات المباشر وغير المباشر
        const injectionCheck = this.detectPromptInjection(text);
        if (injectionCheck.detected) {
            reasons.push(injectionCheck.reason);
        }

        // 2. فحص محاولات تزييف الصلاحيات وتسميم الأدلة (Evidence Poisoning Signals)
        const poisoningPatterns = [
            /(?:system\s*override|admin\s*bypass|grant\s*all\s*privileges)/i,
            /(?:mark\s*(?:this|all)\s*(?:as\s*)?verified|self-certified|bypass\s*verification)/i,
            /(?:لا\s*تقم\s*بالفحص|تجاوز\s*التحقق|معتمد\s*تلقائياً)/i
        ];

        for (const pattern of poisoningPatterns) {
            if (pattern.test(text)) {
                reasons.push('تم رصد محاولة تزييف اعتمادية أو تسميم للأدلة (Evidence Poisoning Attempt)');
                break;
            }
        }

        const safe = reasons.length === 0;

        return {
            safe,
            threatDetected: !safe,
            reasons,
            trust_classification: 'UNTRUSTED_EXTERNAL_CONTENT',
            isTrustedEvidence: false, // دستوري: لا يمكن ترقية المحتوى المسترجع تلقائياً لدليل
            sanitizedSnippet: text.substring(0, 200)
        };
    }
}

module.exports = AISecurityGuard;
