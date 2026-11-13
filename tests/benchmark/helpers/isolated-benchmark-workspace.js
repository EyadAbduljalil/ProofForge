/**
 * @file isolated-benchmark-workspace.js
 * @description مدير مساحات العمل المعزولة لاختبارات القياس المعياري (Task 2 Fixture Data-Loss Prevention)
 * يضمن تخصيص مساحات عمل فريدة ومؤقتة لكل جولة اختبار مع سجل ملكية حصري ومنع حذف أي ملفات مستودعية مشتركة
 */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const PathLoaderGuard = require('../../../packages/contracts/path-loader-guard');

const OWNER_MARKER_FILE = '.pf-benchmark-owner.json';
const OWNER_MARKER_ID = 'proofforge-benchmark-owner';

class IsolatedBenchmarkWorkspace {
    /**
     * تخصيص مساحة عمل مؤقتة فريدة تماماً وتوثيق ملكيتها
     * @param {string} prefix بادئة المجلد المؤقت
     * @returns {{workspaceDir: string, skillsDir: string, cleanup: Function}}
     */
    static allocate(prefix = 'pf-bench-') {
        const tmpBase = os.tmpdir();
        const uniqueDir = fs.mkdtempSync(path.join(tmpBase, `${prefix}${Date.now()}-${process.pid}-`));
        const realWorkspaceDir = fs.realpathSync(uniqueDir);

        // كتابة علامة الملكية الحصرية الموثقة
        const markerPath = path.join(realWorkspaceDir, OWNER_MARKER_FILE);
        const markerData = {
            marker: OWNER_MARKER_ID,
            allocatedAt: new Date().toISOString(),
            pid: process.pid,
            workspacePath: realWorkspaceDir
        };

        fs.writeFileSync(markerPath, JSON.stringify(markerData, null, 2), 'utf8');

        const skillsDir = path.join(realWorkspaceDir, '.agents', 'skills');
        fs.mkdirSync(skillsDir, { recursive: true });

        const cleanup = () => {
            IsolatedBenchmarkWorkspace.safeCleanup(realWorkspaceDir);
        };

        return {
            workspaceDir: realWorkspaceDir,
            skillsDir,
            cleanup
        };
    }

    /**
     * تنظيف آمن ومشروط بوجود علامة الملكية والتأكد من بقاء المسار داخل مجلد النظام المؤقت
     * @param {string} targetWorkspaceDir المسار المطلوب تنظيفه
     */
    static safeCleanup(targetWorkspaceDir) {
        if (!targetWorkspaceDir || typeof targetWorkspaceDir !== 'string') {
            throw new Error('مسار مساحة العمل غير محدد أو غير صالح للتنظيف');
        }

        const tmpRoot = fs.realpathSync(os.tmpdir());
        let realTarget;
        try {
            realTarget = fs.realpathSync(targetWorkspaceDir);
        } catch (e) {
            // المجلد غير موجود أصلاً
            return false;
        }

        // 1. التأكد الحتمي من أن المسار يقع حصراً داخل المجلد المؤقت للنظام (وليس مسار المشروع أو مجلد fixtures المشترك)
        if (!PathLoaderGuard.isInsideRoot(realTarget, tmpRoot) || realTarget === tmpRoot) {
            throw new Error(`محظور أمنياً: تم رفض تنظيف مسار يقع خارج مجلد النظام المؤقت: '${realTarget}'`);
        }

        // 2. التحقق من وجود وصحة علامة الملكية الصريحة
        const markerPath = path.join(realTarget, OWNER_MARKER_FILE);
        if (!fs.existsSync(markerPath)) {
            throw new Error(`محظور أمنياً: لا يمكن تنظيف مسار يفتقر إلى علامة ملكية ProofForge المعتمدة: '${realTarget}'`);
        }

        try {
            const parsed = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
            if (parsed.marker !== OWNER_MARKER_ID || parsed.workspacePath !== realTarget) {
                throw new Error(`محظور أمنياً: تم رصد علامة ملكية غير مطابقة أو مزورة لمساحة العمل: '${realTarget}'`);
            }
        } catch (err) {
            throw new Error(`فشل قراءة علامة الملكية: ${err.message}`);
        }

        // 3. التنظيف الآمن دون تتبع الروابط الرمزية
        fs.rmSync(realTarget, { recursive: true, force: true });
        return true;
    }
}

module.exports = IsolatedBenchmarkWorkspace;
