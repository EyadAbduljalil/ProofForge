/**
 * @file architecture-fitness.js
 * @description محرك فحص الملاءمة المعمارية الأمنية وفرض التكوينات الافتراضية الآمنة (Secure Defaults)
 * WebForge OS Security Intelligence & Governance System
 */

const fs = require('fs');
const path = require('path');

class ArchitectureFitnessGuard {
    /**
     * فحص القواعد المعمارية الصارمة للكشف عن الأنماط الخطرة ومطابقة الإعدادات الافتراضية الآمنة
     * @param {string} rootDir مسار جذر المشروع
     * @returns {Object} تقرير اللياقة المعمارية
     */
    static checkFitness(rootDir = process.cwd()) {
        const report = {
            timestamp: new Date().toISOString(),
            status: 'FIT',
            violations: [],
            secureDefaultsChecked: []
        };

        // 1. فحص منع وصول الفرونت إند مباشرة لقاعدة البيانات
        const clientFiles = [
            path.join(rootDir, 'packages', 'api-client', 'api-client.js'),
            path.join(rootDir, 'packages', 'components', 'DataTable.js')
        ];

        clientFiles.forEach(cf => {
            if (fs.existsSync(cf)) {
                const content = fs.readFileSync(cf, 'utf8');
                if (content.includes('SELECT *') || content.includes('require("pg")') || content.includes('require("mongoose")')) {
                    report.violations.push({
                        severity: 'CRITICAL',
                        rule: 'FRONTEND_DIRECT_DB_ACCESS',
                        file: path.basename(cf),
                        message: 'Frontend / Client package attempts to access Database directly.'
                    });
                    report.status = 'VIOLATED';
                }
            }
        });

        // 2. فحص الإعدادات الافتراضية الآمنة (Secure Defaults)
        // أ. ملف تكوين الكوكيز
        const cookieConfigPath = path.join(rootDir, 'packages', 'security', 'cookie-security.js');
        if (fs.existsSync(cookieConfigPath)) {
            const cookieContent = fs.readFileSync(cookieConfigPath, 'utf8');
            const hasHttpOnly = cookieContent.includes('httpOnly: true');
            const hasSameSite = cookieContent.includes('sameSite');
            report.secureDefaultsChecked.push({
                target: 'cookie-security.js',
                property: 'HttpOnly & SameSite by default',
                compliant: hasHttpOnly && hasSameSite
            });
        }

        // ب. ملف ترويسات الأمان CSP
        const cspPath = path.join(rootDir, 'packages', 'security', 'csp-headers.js');
        if (fs.existsSync(cspPath)) {
            const cspContent = fs.readFileSync(cspPath, 'utf8');
            const hasCsp = cspContent.includes('default-src') || cspContent.includes('Content Security Policy');
            report.secureDefaultsChecked.push({
                target: 'csp-headers.js',
                property: 'CSP Security Directives by default',
                compliant: hasCsp
            });
        }

        // ج. تكوين Nginx الآمن (HSTS & Rate Limiting)
        const nginxPath = path.join(rootDir, 'packages', 'infrastructure', 'nginx-hardened.conf');
        if (fs.existsSync(nginxPath)) {
            const nginxContent = fs.readFileSync(nginxPath, 'utf8');
            const hasHsts = nginxContent.includes('Strict-Transport-Security');
            report.secureDefaultsChecked.push({
                target: 'nginx-hardened.conf',
                property: 'HSTS & Security Headers by default',
                compliant: hasHsts
            });
        }

        // د. حاوية Dockerfile غير الجذرية
        const dockerPath = path.join(rootDir, 'packages', 'infrastructure', 'Dockerfile.hardened');
        if (fs.existsSync(dockerPath)) {
            const dockerContent = fs.readFileSync(dockerPath, 'utf8');
            const nonRoot = dockerContent.includes('USER webforge');
            report.secureDefaultsChecked.push({
                target: 'Dockerfile.hardened',
                property: 'Non-Root user execution by default',
                compliant: nonRoot
            });
        }

        if (report.secureDefaultsChecked.some(c => !c.compliant) || report.violations.length > 0) {
            report.status = 'VIOLATED';
        }

        return report;
    }
}

module.exports = ArchitectureFitnessGuard;
