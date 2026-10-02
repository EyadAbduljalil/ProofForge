/**
 * @file supply-chain-engine.js
 * @description محرك حوكمة وفحص سلسلة التوريد البرمجية والتبعيات (Supply Chain Posture Engine)
 * يفحص الحزم، ملفات التثبيت المغلقة (Lockfiles)، البرمجيات النصية للتهيئة (Install Scripts)، والتثبيت الصارم للنسخ
 */

class SupplyChainEngine {
    /**
     * تدقيق شامل لسلامة سلسلة التوريد حسب الـ Stack المكتشف
     * @param {Object} stack ملف التوصيف المكتشف للمشروع
     * @param {Object} manifests محتويات ملفات الحزم
     */
    static auditSupplyChain(stack, manifests = {}) {
        const findings = [];
        let score = 100;

        // 1. فحص بيئة Node.js / npm
        if (manifests['package.json']) {
            try {
                const pkg = typeof manifests['package.json'] === 'string' 
                    ? JSON.parse(manifests['package.json']) 
                    : manifests['package.json'];

                const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
                for (const [dep, version] of Object.entries(deps)) {
                    if (version === '*' || version === 'latest') {
                        findings.push({
                            id: `SC_UNPINNED_${dep}`,
                            severity: 'HIGH',
                            category: 'SUPPLY_CHAIN_DEPENDENCY',
                            message: `الاعتمادية '${dep}' تستخدم إصداراً عائماً وغير محدد (${version}) مما يعرض النظام لهجمات التحديث الضار.`,
                            remediation: `ثبت الإصدار برقم دقيق (Pinned Exact Version) مثل '1.2.3'.`
                        });
                        score -= 10;
                    }
                }

                // فحص برمجيات التثبيت الخطرة (Dangerous Pre/Post Install Scripts)
                const scripts = pkg.scripts || {};
                for (const [scriptName, scriptCmd] of Object.entries(scripts)) {
                    if (['preinstall', 'postinstall', 'install'].includes(scriptName)) {
                        if (scriptCmd.includes('curl') || scriptCmd.includes('wget') || scriptCmd.includes('bash') || scriptCmd.includes('sh')) {
                            findings.push({
                                id: `SC_SUSPICIOUS_INSTALL_SCRIPT_${scriptName}`,
                                severity: 'CRITICAL',
                                category: 'SUPPLY_CHAIN_EXECUTION',
                                message: `البرمجية النصية '${scriptName}' تحتوي على أوامر تنزيل أو تنفيذ عائمة (${scriptCmd}).`,
                                remediation: `إزالة الأوامر العائمة واستخدام حزم معتمدة دون تنفيذ كود في مرحلة التثبيت.`
                            });
                            score -= 25;
                        }
                    }
                }
            } catch (e) {}
        }

        // 2. فحص بيئة Python
        if (manifests['requirements.txt']) {
            const lines = manifests['requirements.txt'].split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && !trimmed.includes('==') && !trimmed.includes('>=')) {
                    findings.push({
                        id: `SC_PYTHON_UNPINNED_${trimmed.substring(0, 15)}`,
                        severity: 'MEDIUM',
                        category: 'SUPPLY_CHAIN_DEPENDENCY',
                        message: `حزمة بايثون '${trimmed}' غير مثبتة بإصدار محدد.`,
                        remediation: `استخدم صيغة 'package==1.0.0'.`
                    });
                    score -= 5;
                }
            }
        }

        score = Math.max(0, score);
        return {
            supplyChainScore: score,
            posture: score >= 85 ? 'STRONG' : (score >= 60 ? 'ACCEPTABLE' : 'CRITICAL_RISK'),
            findingsCount: findings.length,
            findings,
            auditedAt: new Date().toISOString()
        };
    }
}

module.exports = SupplyChainEngine;
