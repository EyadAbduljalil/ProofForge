/**
 * @file supply-chain.js
 * @description محرك أمان سلسلة التوريد وفحص الحزم البرمجية والسكربتات وتوليد SBOM
 * WebForge OS Security Intelligence & Governance System
 */

const fs = require('fs');
const path = require('path');

class SupplyChainGuard {
    /**
     * تدقيق شامل لسلسلة التوريد في المشروع
     * @param {string} rootDir مسار جذر المشروع
     * @returns {Object} نتائج فحص سلسلة التوريد وقائمة SBOM
     */
    static auditSupplyChain(rootDir = process.cwd()) {
        const results = {
            timestamp: new Date().toISOString(),
            status: 'SECURE',
            issues: [],
            warnings: [],
            sbom: {
                format: 'CycloneDX-JSON',
                specVersion: '1.5',
                components: []
            }
        };

        const pkgPath = path.join(rootDir, 'package.json');
        if (!fs.existsSync(pkgPath)) {
            results.issues.push({ severity: 'CRITICAL', message: 'package.json not found' });
            results.status = 'FAILED';
            return results;
        }

        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

            // 1. فحص السكربتات المشبوهة في حزم المشروع (Lifecycle scripts check)
            const scripts = pkg.scripts || {};
            const suspiciousHooks = ['preinstall', 'install', 'postinstall'];
            suspiciousHooks.forEach(hook => {
                if (scripts[hook]) {
                    results.warnings.push({
                        type: 'SUSPICIOUS_LIFECYCLE_SCRIPT',
                        severity: 'MEDIUM',
                        scriptName: hook,
                        command: scripts[hook],
                        message: `Lifecycle hook '${hook}' detected. Verify it does not execute untrusted remote code.`
                    });
                }
            });

            // 2. فحص الحزم والإصدارات وتوليد الـ SBOM
            const deps = pkg.dependencies || {};
            const devDeps = pkg.devDependencies || {};

            Object.entries({ ...deps, ...devDeps }).forEach(([depName, version]) => {
                // فحص الحزم غير المثبتة (Unpinned / wildcard)
                if (version.startsWith('^') || version.startsWith('*') || version.startsWith('>=')) {
                    results.warnings.push({
                        type: 'UNPINNED_DEPENDENCY',
                        severity: 'LOW',
                        package: depName,
                        version,
                        message: `Package '${depName}' uses mutable version range '${version}'. Consider pinning exact version in production.`
                    });
                }

                results.sbom.components.push({
                    name: depName,
                    version,
                    type: 'library',
                    purl: `pkg:npm/${depName}@${version.replace(/^[\^~]/, '')}`
                });
            });

            // 3. التحقق من وجود package-lock.json لضمان القفل المحكم والتكرارية
            const lockPath = path.join(rootDir, 'package-lock.json');
            if (!fs.existsSync(lockPath)) {
                results.warnings.push({
                    type: 'MISSING_LOCKFILE',
                    severity: 'MEDIUM',
                    message: 'package-lock.json is missing. Lockfile is required to prevent dependency tampering.'
                });
            }

        } catch (err) {
            results.issues.push({ severity: 'CRITICAL', message: `Failed to parse package.json: ${err.message}` });
            results.status = 'FAILED';
        }

        return results;
    }
}

module.exports = SupplyChainGuard;
