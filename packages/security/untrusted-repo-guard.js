/**
 * @file untrusted-repo-guard.js
 * @description حارس حماية النظام من المستودعات والمدخلات غير الموثوقة (Untrusted Repository Guard)
 * يمنع محاولات حقن الأوامر، استغلال الملفات الموجهة (Instruction Injection في README/AGENTS)، وتسريب الأسرار
 */

class UntrustedRepoGuard {
    /**
     * فحص وتطهير محتوى الملفات من محاولات التلاعب بالوكيل (Prompt Injection & System Override)
     */
    static sanitizeUntrustedInput(rawContent) {
        if (!rawContent || typeof rawContent !== 'string') return '';

        // رصد محاولات تجاوز التعليمات الدستورية داخل ملفات المشروع
        const dangerousPatterns = [
            /ignore\s+(all\s+)?previous\s+instructions/i,
            /system\s+prompt\s+override/i,
            /you\s+are\s+now\s+dan/i,
            /execute\s+command\s*:\s*rm\s+-rf/i,
            /curl\s+.*\s*\|\s*sh/i,
            /exfiltrate\s+secrets/i
        ];

        let hasInjection = false;
        const flags = [];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(rawContent)) {
                hasInjection = true;
                flags.push(pattern.toString());
            }
        }

        return {
            safe: !hasInjection,
            flags,
            content: rawContent,
            decision: hasInjection ? 'NEUTRALIZE_AS_DATA_ONLY' : 'TRUSTED_PROJECT_DATA'
        };
    }

    /**
     * التحقق من سلامة الأوامر البرمجية قبل تمريرها لبيئة التشغيل
     */
    static validateCommandSafety(cmd) {
        if (!cmd || typeof cmd !== 'string') return { safe: false, reason: 'أمر غير صالح' };

        const forbiddenCommands = [
            /rm\s+-rf\s+\//,
            /:\(\)\s*\{\s*:\|\:&\s*\};:/, // Fork bomb
            /mkfs/,
            /dd\s+if=/,
            /curl.*\|\s*(bash|sh)/,
            /wget.*\|\s*(bash|sh)/
        ];

        for (const pattern of forbiddenCommands) {
            if (pattern.test(cmd)) {
                return {
                    safe: false,
                    reason: `الأمر محظور أمنياً لاحتوائه على نمط تدميري أو غير معزول (${pattern}).`
                };
            }
        }

        return { safe: true };
    }
}

module.exports = UntrustedRepoGuard;
