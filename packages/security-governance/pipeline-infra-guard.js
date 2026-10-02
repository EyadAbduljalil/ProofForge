/**
 * @file pipeline-infra-guard.js
 * @description محرك فحص وتدقيق أمان خطوط الإنتاج وأنابيب CI/CD وتكوينات الحاويات والسحابة
 * WebForge OS Security Intelligence & Governance System
 */

const fs = require('fs');
const path = require('path');

class PipelineInfraGuard {
    /**
     * تدقيق شامل لأمان الحاويات وأنابيب CI/CD
     * @param {string} rootDir مسار جذر المشروع
     * @returns {Object} نتائج التدقيق الأمني للبنية التحتية
     */
    static auditInfrastructure(rootDir = process.cwd()) {
        const report = {
            timestamp: new Date().toISOString(),
            containerSecurity: { status: 'SECURE', checks: [] },
            cicdSecurity: { status: 'SECURE', checks: [] }
        };

        // 1. تدقيق Dockerfile
        const dockerfiles = [
            path.join(rootDir, 'Dockerfile'),
            path.join(rootDir, 'packages', 'infrastructure', 'Dockerfile.hardened')
        ];

        let foundDocker = false;
        dockerfiles.forEach(df => {
            if (fs.existsSync(df)) {
                foundDocker = true;
                const content = fs.readFileSync(df, 'utf8');

                // فحص تشغيل المستخدم غير الجذري Non-Root
                const hasNonRoot = content.includes('USER webforge') || content.includes('USER node') || content.includes('USER 1001');
                report.containerSecurity.checks.push({
                    target: path.basename(df),
                    rule: 'NON_ROOT_USER',
                    passed: hasNonRoot,
                    message: hasNonRoot ? 'Container runs as unprivileged user' : 'VIOLATION: Container runs as root (CWE-250)'
                });

                // فحص فحص الصحة Healthcheck
                const hasHealthcheck = content.includes('HEALTHCHECK');
                report.containerSecurity.checks.push({
                    target: path.basename(df),
                    rule: 'HEALTHCHECK_DEFINED',
                    passed: hasHealthcheck,
                    message: hasHealthcheck ? 'Healthcheck instruction verified' : 'WARNING: No healthcheck instruction found'
                });
            }
        });

        if (!foundDocker) {
            report.containerSecurity.status = 'NOT_APPLICABLE';
        } else if (report.containerSecurity.checks.some(c => !c.passed && c.rule === 'NON_ROOT_USER')) {
            report.containerSecurity.status = 'FAILED';
        }

        // 2. تدقيق ملفات سير العمل CI/CD
        const workflowDir = path.join(rootDir, '.github', 'workflows');
        if (fs.existsSync(workflowDir)) {
            const files = fs.readdirSync(workflowDir);
            files.forEach(file => {
                const wfContent = fs.readFileSync(path.join(workflowDir, file), 'utf8');

                // فحص الأسرار الصريحة غير المشفرة
                const hasHardcodedSecret = /password:\s*['"][^$][^'"]+['"]/i.test(wfContent);
                report.cicdSecurity.checks.push({
                    target: file,
                    rule: 'NO_HARDCODED_SECRETS',
                    passed: !hasHardcodedSecret,
                    message: !hasHardcodedSecret ? 'No plaintext credentials detected in workflow' : 'CRITICAL: Hardcoded credentials found'
                });

                // فحص سحب كود غير موثوق من PRs
                const unsafePullRequestTarget = wfContent.includes('pull_request_target');
                report.cicdSecurity.checks.push({
                    target: file,
                    rule: 'SAFE_PR_TRIGGERS',
                    passed: !unsafePullRequestTarget,
                    message: !unsafePullRequestTarget ? 'Safe workflow trigger verified' : 'WARNING: pull_request_target may allow untrusted code execution'
                });
            });
        } else {
            report.cicdSecurity.status = 'NOT_APPLICABLE';
        }

        return report;
    }
}

module.exports = PipelineInfraGuard;
