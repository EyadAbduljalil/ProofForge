/**
 * @file tool-normalizer.js
 * @description محرك توحيد وتطبيع نتائج أدوات الفحص والاختبار والأمان (Tool Result Normalization)
 * يحول مخرجات Semgrep, OWASP ZAP, Trivy, OSV, Lighthouse, ESLint وغيرها إلى نموذج موحد صارم (Unified Finding Model)
 */

class ToolResultNormalizer {
    /**
     * تطبيع نتيجة فحص من أي أداة خارجية إلى النموذج الموحد
     * @param {Object} rawFinding النتيجة الخام من الأداة
     * @param {string} source اسم الأداة المصدر
     * @returns {Object} كائن النتيجة الموحدة (Unified Finding)
     */
    static normalizeFinding(rawFinding, source = 'GENERIC') {
        const findingId = rawFinding.id || `FND_${source.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        let severity = 'MEDIUM';
        const rawSev = (rawFinding.severity || rawFinding.level || '').toUpperCase();
        if (['CRITICAL', 'BLOCKER'].includes(rawSev)) severity = 'CRITICAL';
        else if (['HIGH', 'ERROR'].includes(rawSev)) severity = 'HIGH';
        else if (['MEDIUM', 'WARN', 'WARNING'].includes(rawSev)) severity = 'MEDIUM';
        else if (['LOW', 'INFO', 'NOTE'].includes(rawSev)) severity = 'LOW';

        return {
            id: findingId,
            source: source.toUpperCase(),
            title: rawFinding.title || rawFinding.message || 'مشكلة هندسية أو أمنية مرصودة',
            category: rawFinding.category || 'SECURITY_CODE_QUALITY',
            severity,
            confidence: rawFinding.confidence || 'HIGH',
            status: rawFinding.status || 'OPEN', // OPEN | CONFIRMED | FALSE_POSITIVE | FIXED | REGRESSION_PROTECTED | ACCEPTED_RISK | NOT_APPLICABLE
            affected_files: Array.isArray(rawFinding.affected_files) ? rawFinding.affected_files : (rawFinding.file ? [rawFinding.file] : []),
            affected_components: Array.isArray(rawFinding.affected_components) ? rawFinding.affected_components : [],
            line_number: rawFinding.line || rawFinding.lineNumber || null,
            rule_id: rawFinding.rule_id || rawFinding.ruleId || null,
            evidence: rawFinding.evidence || rawFinding.snippet || 'No raw snippet provided',
            remediation: rawFinding.remediation || rawFinding.fixRecommendation || 'راجع معايير الأمان المحددة للمكون',
            regression_test: rawFinding.regression_test || null,
            normalized_at: new Date().toISOString()
        };
    }

    /**
     * تجميع وإزالة التكرارات بين الأدوات المختلفة لنفس الملف ونفس السطر
     */
    static deduplicateFindings(findings = []) {
        const uniqueMap = new Map();
        for (const f of findings) {
            const normalized = this.normalizeFinding(f, f.source);
            const key = `${normalized.category}_${(normalized.affected_files[0] || 'root')}_${normalized.line_number || 'any'}_${normalized.rule_id || 'rule'}`;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, normalized);
            } else {
                // إذا تم رصده من أداة إضافية، ندمج الدليل ونرفع الثقة
                const existing = uniqueMap.get(key);
                existing.confidence = 'VERY_HIGH';
                if (!existing.affected_components.includes(normalized.source)) {
                    existing.affected_components.push(normalized.source);
                }
            }
        }
        return Array.from(uniqueMap.values());
    }
}

module.exports = ToolResultNormalizer;
