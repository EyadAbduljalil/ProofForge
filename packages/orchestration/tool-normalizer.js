/**
 * @file tool-normalizer.js
 * @description محرك توحيد وتطبيع نتائج أدوات الفحص والاختبار والأمان (Tool Result Normalization)
 * يحول مخرجات Semgrep, OWASP ZAP, Trivy, OSV, Lighthouse, ESLint ومعيار SARIF 2.1.0 إلى نموذج موحد صارم
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

        const file = Array.isArray(rawFinding.affected_files) && rawFinding.affected_files.length > 0 ? rawFinding.affected_files[0] : (rawFinding.file || null);
        const line = rawFinding.line || rawFinding.lineNumber || null;
        const column = rawFinding.column || rawFinding.columnNumber || null;
        const message = rawFinding.title || rawFinding.message || 'مشكلة هندسية أو أمنية مرصودة';
        const rule = rawFinding.rule_id || rawFinding.ruleId || null;

        return {
            id: findingId,
            tool: source,
            source: source.toUpperCase(),
            title: message,
            message,
            category: rawFinding.category || 'SECURITY_CODE_QUALITY',
            severity,
            confidence: rawFinding.confidence || 'HIGH',
            status: rawFinding.status || 'OPEN', // OPEN | CONFIRMED | FALSE_POSITIVE | FIXED | REGRESSION_PROTECTED | ACCEPTED_RISK | NOT_APPLICABLE
            file,
            affected_files: Array.isArray(rawFinding.affected_files) ? rawFinding.affected_files : (file ? [file] : []),
            affected_components: Array.isArray(rawFinding.affected_components) ? rawFinding.affected_components : [],
            line,
            column,
            line_number: line,
            column_number: column,
            fingerprint: rawFinding.fingerprint || null,
            rule,
            rule_id: rule,
            evidence: rawFinding.evidence || rawFinding.snippet || 'No raw snippet provided',
            remediation: rawFinding.remediation || rawFinding.fixRecommendation || 'راجع معايير الأمان المحددة للمكون',
            regression_test: rawFinding.regression_test || null,
            metadata: rawFinding.metadata || {},
            normalized_at: new Date().toISOString()
        };
    }

    /**
     * تطبيع مستند SARIF (Static Analysis Results Interchange Format v2.1.0)
     * @param {Object|string} sarifInput كائن أو نص JSON بصيغة SARIF
     * @returns {Array<Object>} مصفوفة النتائج الموحدة
     */
    static normalizeSarif(sarifInput) {
        let sarif;
        try {
            sarif = typeof sarifInput === 'string' ? JSON.parse(sarifInput) : sarifInput;
        } catch (e) {
            return [];
        }

        if (!sarif || !Array.isArray(sarif.runs)) return [];

        const findings = [];

        for (const run of sarif.runs) {
            const toolName = run.tool?.driver?.name || 'SARIF_TOOL';
            const rulesMap = new Map();
            if (Array.isArray(run.tool?.driver?.rules)) {
                for (const rule of run.tool.driver.rules) {
                    rulesMap.set(rule.id, rule);
                }
            }

            if (Array.isArray(run.results)) {
                for (const res of run.results) {
                    const ruleId = res.ruleId || 'GENERIC_RULE';
                    const ruleDef = rulesMap.get(ruleId) || {};
                    const message = res.message?.text || ruleDef.shortDescription?.text || 'SARIF security finding';
                    
                    let file = 'unknown_file';
                    let line = null;
                    let column = null;

                    if (Array.isArray(res.locations) && res.locations[0]?.physicalLocation) {
                        const phys = res.locations[0].physicalLocation;
                        file = phys.artifactLocation?.uri || file;
                        line = phys.region?.startLine || null;
                        column = phys.region?.startColumn || null;
                    }

                    const rawFinding = {
                        id: `FND_SARIF_${ruleId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                        title: message,
                        rule_id: ruleId,
                        severity: res.level || ruleDef.defaultConfiguration?.level || 'warning',
                        file,
                        line,
                        column,
                        fingerprint: res.partialFingerprints?.primaryLocationHash || null,
                        category: ruleDef.properties?.category || 'STATIC_ANALYSIS',
                        confidence: 'HIGH',
                        evidence: res.snippet?.text || 'SARIF Location Verified',
                        remediation: ruleDef.help?.text || 'راجع الإرشادات المصاحبة للقاعدة في SARIF',
                        metadata: {
                            sarifRuleId: ruleId,
                            ruleDescription: ruleDef.fullDescription?.text || null
                        }
                    };

                    findings.push(this.normalizeFinding(rawFinding, toolName));
                }
            }
        }

        return findings;
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
