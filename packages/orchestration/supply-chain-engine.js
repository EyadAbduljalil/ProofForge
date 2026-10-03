/**
 * @file supply-chain-engine.js
 * @description محرك حوكمة وفحص وتدقيق سلسلة التوريد والتبعيات وتوليد SBOM
 * يدمج سياسات الأمان والحوكمة مع التحليل الفعلي لملفات الحزم وملفات القفل عبر كافة بيئات التشغيل
 */

const path = require('path');
const fs = require('fs');

class SupplyChainEngine {
    /**
     * تدقيق شامل لسلسلة التوريد وربطه بسياسات الحوكمة وتوليد SBOM
     * @param {Object} stack ملف التوصيف المكتشف للمشروع
     * @param {Object} manifests محتويات ملفات الحزم
     * @param {Object} policies سياسات الحوكمة المخصصة (اختياري)
     */
    static auditSupplyChain(stack = {}, manifests = {}, policies = {}) {
        const findings = [];
        let score = 100;
        const sbom = {
            format: 'CycloneDX-JSON',
            specVersion: '1.5',
            timestamp: new Date().toISOString(),
            components: []
        };

        const rootDir = stack.rootDir || process.cwd();

        // 1. فحص بيئة Node.js / npm
        const pkgContent = manifests['package.json'] || (fs.existsSync(path.join(rootDir, 'package.json')) ? fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8') : null);
        if (pkgContent) {
            try {
                const pkg = typeof pkgContent === 'string' ? JSON.parse(pkgContent) : pkgContent;
                const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

                for (const [dep, version] of Object.entries(deps)) {
                    if (version === '*' || version === 'latest' || version.startsWith('^') || version.startsWith('>=')) {
                        const isWildcard = version === '*' || version === 'latest';
                        findings.push({
                            id: `SC_UNPINNED_${dep}`,
                            severity: isWildcard ? 'HIGH' : 'LOW',
                            category: 'SUPPLY_CHAIN_DEPENDENCY',
                            message: `الاعتمادية '${dep}' تستخدم إصداراً عائماً (${version}). يوصى بالتثبيت الصارم في الإنتاج.`,
                            remediation: `ثبت الإصدار برقم دقيق مثل '${version.replace(/[\^~>=*]/g, '') || '1.0.0'}'.`,
                            rule_id: 'SUPPLY_CHAIN_PINNED_VERSION'
                        });
                        score -= isWildcard ? 10 : 2;
                    }

                    sbom.components.push({
                        name: dep,
                        version: String(version).replace(/^[\^~>=]/, ''),
                        type: 'library',
                        purl: `pkg:npm/${dep}@${String(version).replace(/^[\^~>=]/, '')}`
                    });
                }

                // فحص برمجيات التثبيت المشبوهة
                const scripts = pkg.scripts || {};
                const suspiciousHooks = ['preinstall', 'install', 'postinstall'];
                suspiciousHooks.forEach(hook => {
                    const cmd = scripts[hook];
                    if (cmd) {
                        const hasRemoteExec = cmd.includes('curl') || cmd.includes('wget') || cmd.includes('bash') || cmd.includes('sh');
                        findings.push({
                            id: `SC_SUSPICIOUS_INSTALL_SCRIPT_${hook}`,
                            severity: hasRemoteExec ? 'CRITICAL' : 'MEDIUM',
                            category: 'SUPPLY_CHAIN_EXECUTION',
                            message: `البرمجية النصية '${hook}' تنفذ أمراً (${cmd}). تحقق من عدم تنزيل كود غير موثوق.`,
                            remediation: 'استخدم حزم معتمدة دون تنفيذ كود في مرحلة التثبيت.',
                            rule_id: 'SUPPLY_CHAIN_LIFECYCLE_HOOK'
                        });
                        score -= hasRemoteExec ? 25 : 10;
                    }
                });

                // فحص وجود ملف القفل lockfile
                const hasLock = manifests['package-lock.json'] || manifests['pnpm-lock.yaml'] || manifests['yarn.lock'] ||
                    fs.existsSync(path.join(rootDir, 'package-lock.json')) || fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml')) || fs.existsSync(path.join(rootDir, 'yarn.lock'));
                
                if (!hasLock && Object.keys(deps).length > 0) {
                    findings.push({
                        id: 'SC_MISSING_LOCKFILE',
                        severity: 'MEDIUM',
                        category: 'SUPPLY_CHAIN_INTEGRITY',
                        message: 'ملف القفل (Lockfile) غير موجود. يوصى بوجوده لضمان تكرارية التثبيت ومنع التلاعب بالتبعيات.',
                        remediation: 'قم بتوليد lockfile عبر مدير الحزم الخاص بك.',
                        rule_id: 'SUPPLY_CHAIN_LOCKFILE_REQUIRED'
                    });
                    score -= 10;
                }
            } catch (e) {}
        }

        // 2. فحص بيئة Python
        const pyContent = manifests['requirements.txt'] || (fs.existsSync(path.join(rootDir, 'requirements.txt')) ? fs.readFileSync(path.join(rootDir, 'requirements.txt'), 'utf8') : null);
        if (pyContent) {
            const lines = String(pyContent).split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    if (!trimmed.includes('==') && !trimmed.includes('>=')) {
                        findings.push({
                            id: `SC_PYTHON_UNPINNED_${trimmed.substring(0, 15)}`,
                            severity: 'MEDIUM',
                            category: 'SUPPLY_CHAIN_DEPENDENCY',
                            message: `حزمة بايثون '${trimmed}' غير مثبتة بإصدار محدد.`,
                            remediation: `استخدم صيغة 'package==1.0.0'.`,
                            rule_id: 'SUPPLY_CHAIN_PYTHON_PINNED'
                        });
                        score -= 5;
                    }
                    const [pkgName, pkgVer] = trimmed.split(/==|>=/);
                    if (pkgName) {
                        sbom.components.push({
                            name: pkgName.trim(),
                            version: pkgVer ? pkgVer.trim() : 'latest',
                            type: 'library',
                            purl: `pkg:pypi/${pkgName.trim()}@${pkgVer ? pkgVer.trim() : 'latest'}`
                        });
                    }
                }
            }
        }

        score = Math.max(0, score);
        return {
            supplyChainScore: score,
            posture: score >= 85 ? 'STRONG' : (score >= 60 ? 'ACCEPTABLE' : 'CRITICAL_RISK'),
            findingsCount: findings.length,
            findings,
            sbom,
            auditedAt: new Date().toISOString()
        };
    }
}

module.exports = SupplyChainEngine;
