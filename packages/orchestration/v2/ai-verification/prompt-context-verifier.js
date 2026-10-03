/**
 * @file prompt-context-verifier.js
 * @description WebForge V2.3 — Prompt Injection & Context Integrity Verifier
 * محرك فحص حقن الأوامر المباشر وغير المباشر (Indirect Prompt Injection)،
 * وتسميم الذاكرة والسياق والوثائق المسترجعة وحماية الأسرار من الاستخراج
 */

'use strict';

class PromptContextVerifier {
    constructor() {
        this.injectionPatterns = [
            /system\s*prompt\s*extraction/i,
            /repeat\s*the\s*words\s*above/i,
            /what\s*are\s*your\s*system\s*instructions/i,
            /reveal\s*your\s*initial\s*instructions/i,
            /print\s*the\s*hidden\s*prompt/i,
            /output\s*all\s*environment\s*variables/i,
            /<script\b[^>]*>/i,
            /javascript:\s*/i,
            /\{\{.*?\}\}/, // تلاعب بقوالب النصوص
            /\[INSTRUCTION_OVERRIDE\]/i
        ];
    }

    /**
     * فحص مدخلات أو وثائق بحثاً عن محاولات حقن الأوامر (Prompt Injection)
     * @param {string} content
     * @param {Object} options
     */
    verifyContentSafety(content = '', options = {}) {
        const text = String(content);
        const findings = [];

        // 1. فحص الأنماط المعروفة للحقن واستخراج الأوامر
        for (const pattern of this.injectionPatterns) {
            if (pattern.test(text)) {
                findings.push({
                    type: 'PROMPT_INJECTION_DETECTED',
                    severity: 'CRITICAL',
                    match: String(pattern),
                    message: 'تم رصد نمط حقن أوامر أو محاولة استخراج للتعليمات السرية للنظام.'
                });
            }
        }

        // 2. فحص تسريب أو طلب أسرار مفاتيح الـ API
        const secretLeaks = [/api[_-]?key/i, /bearer\s+[a-z0-9_-]+/i, /secret[_-]?token/i];
        if (options.checkForSecretExtraction) {
            for (const sp of secretLeaks) {
                if (sp.test(text)) {
                    findings.push({
                        type: 'SECRET_EXTRACTION_ATTEMPT',
                        severity: 'CRITICAL',
                        message: 'محاولة استخراج أو تسريب مفاتيح برمجية حساسة عبر الاستعلام.'
                    });
                }
            }
        }

        const isSafe = findings.length === 0;
        return {
            status: isSafe ? 'VERIFIED' : 'INJECTION_ATTACK_DETECTED',
            gate: isSafe ? 'PASS' : 'FAIL',
            isSafe,
            findingsCount: findings.length,
            findings
        };
    }

    /**
     * التحقق من سلامة وثيقة مسترجعة ضمن منظومة RAG قبل حقنها في السياق
     * (Indirect Injection in Retrieved Documents)
     * @param {Object} retrievedDoc
     */
    verifyRetrievedDocument(retrievedDoc = {}) {
        const { id, title = '', body = '', sourceUri = '' } = retrievedDoc;
        const checkBody = this.verifyContentSafety(body);
        const checkTitle = this.verifyContentSafety(title);

        const isCompromised = !checkBody.isSafe || !checkTitle.isSafe;
        const allFindings = [...checkBody.findings, ...checkTitle.findings];

        return {
            docId: id || sourceUri,
            status: isCompromised ? 'COMPROMISED_CONTEXT' : 'VERIFIED',
            gate: isCompromised ? 'FAIL' : 'PASS',
            isSafe: !isCompromised,
            hasIndirectInjection: isCompromised,
            findings: allFindings
        };
    }
}

module.exports = {
    PromptContextVerifier
};
