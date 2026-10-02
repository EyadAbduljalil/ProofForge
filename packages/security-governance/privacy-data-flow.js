/**
 * @file privacy-data-flow.js
 * @description محرك حماية الخصوصية وتدفق البيانات وكشف تسرب البيانات الشخصية الحساسة (PII) والأسرار
 * WebForge OS Security Intelligence & Governance System
 */

class PrivacyDataFlowGuard {
    constructor() {
        this.piiPatterns = {
            EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            CREDIT_CARD: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
            PHONE_NUMBER: /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g,
            JWT_TOKEN: /\beyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g,
            API_KEY: /\b(?:wf_live_|sk_live_|ghp_|AKIA)[a-zA-Z0-9_-]{16,}\b/g
        };

        this.sensitiveKeys = [
            'password', 'passwd', 'secret', 'token', 'apiKey', 'access_token',
            'refreshToken', 'credit_card', 'cvv', 'ssn', 'privateKey', 'auth_header'
        ];
    }

    /**
     * فحص وتطهير الكائنات أو السلاسل النصية وحجب البيانات الحساسة لمنع تسربها
     * @param {any} data البيانات المراد فحصها
     * @returns {Object} نتيجة الفحص والتطهير
     */
    sanitizeAndAudit(data) {
        let findings = [];
        const sanitized = this.deepScrub(data, findings);

        return {
            hasLeakage: findings.length > 0,
            leakageCount: findings.length,
            findings,
            sanitizedData: sanitized
        };
    }

    /**
     * تطهير الكائنات بشكل متكرر
     */
    deepScrub(input, findings, currentPath = '') {
        if (input === null || input === undefined) return input;

        if (typeof input === 'string') {
            let scrubbedStr = input;
            // فحص أنماط الأسرار والـ PII
            for (const [type, regex] of Object.entries(this.piiPatterns)) {
                if (regex.test(scrubbedStr)) {
                    findings.push({
                        path: currentPath || 'root_string',
                        type,
                        message: `Detected sensitive pattern '${type}' in data string`
                    });
                    scrubbedStr = scrubbedStr.replace(regex, `[REDACTED_${type}]`);
                }
            }
            return scrubbedStr;
        }

        if (Array.isArray(input)) {
            return input.map((item, index) => this.deepScrub(item, findings, `${currentPath}[${index}]`));
        }

        if (typeof input === 'object') {
            const sanitizedObj = {};
            for (const [key, value] of Object.entries(input)) {
                const fullPath = currentPath ? `${currentPath}.${key}` : key;

                // فحص المفاتيح الحساسة الصريحة
                const isSensitiveKey = this.sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()));
                if (isSensitiveKey) {
                    findings.push({
                        path: fullPath,
                        type: 'SENSITIVE_KEY_OVEREXPOSURE',
                        message: `Field '${key}' contains sensitive authentication or PII data`
                    });
                    sanitizedObj[key] = '[REDACTED_SECRET]';
                } else {
                    sanitizedObj[key] = this.deepScrub(value, findings, fullPath);
                }
            }
            return sanitizedObj;
        }

        return input;
    }

    /**
     * التحقق من سلامة استجابة الـ API لضمان عدم تسريب أعمدة قاعدة البيانات غير المصرح بها (DTO enforcement)
     * @param {Object} rawEntity الكيان الخام من قاعدة البيانات
     * @param {string[]} allowedFields قائمة الحقول المسموحة في الاستجابة (Whitelist)
     * @returns {Object} كائن النقل المعقم (Clean DTO)
     */
    enforceResponseDTO(rawEntity, allowedFields = []) {
        if (!rawEntity || typeof rawEntity !== 'object') return {};
        const safeDto = {};
        allowedFields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(rawEntity, field)) {
                safeDto[field] = rawEntity[field];
            }
        });
        return safeDto;
    }
}

module.exports = PrivacyDataFlowGuard;
