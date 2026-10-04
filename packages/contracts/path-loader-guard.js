/**
 * @file path-loader-guard.js
 * @description حارس أمان المسارات ومحركات التحميل الكنسية في ProofForge (Path and Loader Security Guard)
 * يضمن تطبيق مبدأ الفشل المغلق (Fail-Closed) ومنع ثغرات القفز بين المسارات (Path Traversal)،
 * ومحاولات قراءة ملفات خارج مساحة العمل، وتمرير امتدادات غير مسموح بها.
 */

const path = require('path');
const fs = require('fs');

class PathLoaderGuard {
    /**
     * المسار الجذري الافتراضي للمشروع
     */
    static getProjectRoot() {
        return path.resolve(__dirname, '../..');
    }

    /**
     * تدقيق والتحقق من مسار ملف السجل قبل محاولة قراءته أو تحميله
     * @param {string} filePath المسار الممرر للتحميل
     * @param {Object} options خيارات التدقيق الإضافية
     * @returns {string} المسار الآمن المحلول
     */
    static validateSafePath(filePath, options = {}) {
        const allowedExtensions = options.allowedExtensions || ['.json'];
        const projectRoot = options.projectRoot || this.getProjectRoot();

        // 1. التحقق من وجود ونوع المسار
        if (!filePath || typeof filePath !== 'string') {
            const err = new Error('محظور: يجب تمرير مسار نصي صالح للملف (Invalid/Empty Path)');
            err.code = 'INVALID_PATH';
            throw err;
        }

        // 2. فحص حقن البايت الصفري (Null-Byte Injection)
        if (filePath.indexOf('\0') !== -1) {
            const err = new Error('محظور: تم رصد محاولة حقن بايت صفري في المسار (Null-Byte Injection Detected)');
            err.code = 'SECURITY_PATH_POISONING';
            throw err;
        }

        // 3. حل المسار المطلق والتحقق الصارم من عدم الخروج عن جذر المشروع (Path Traversal Defense)
        const resolvedPath = path.resolve(filePath);
        const resolvedRoot = path.resolve(projectRoot);

        if (!resolvedPath.startsWith(resolvedRoot + path.sep) && resolvedPath !== resolvedRoot) {
            const err = new Error('محظور: محاولة قراءة أو تحميل ملف يقع خارج حدود مساحة عمل المشروع (Path Traversal / Sandbox Escape Detected)');
            err.code = 'PATH_TRAVERSAL_DETECTED';
            throw err;
        }

        // 4. التحقق من امتداد الملف
        const ext = path.extname(filePath).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            const err = new Error(`محظور: امتداد الملف '${ext}' غير مسموح به. الامتدادات المصرح بها: ${allowedExtensions.join(', ')}`);
            err.code = 'DISALLOWED_EXTENSION';
            throw err;
        }

        // 5. التحقق من وجود الملف فعلياً على القرص وأنه ملف وليس مجلداً
        if (!fs.existsSync(resolvedPath)) {
            const err = new Error(`الملف المطلوب غير موجود على القرص: '${resolvedPath}'`);
            err.code = 'FILE_NOT_FOUND';
            throw err;
        }

        const stats = fs.statSync(resolvedPath);
        if (!stats.isFile()) {
            const err = new Error(`المسار المحدد لا يمثل ملفاً عادياً: '${resolvedPath}'`);
            err.code = 'NOT_A_REGULAR_FILE';
            throw err;
        }

        return resolvedPath;
    }
}

module.exports = PathLoaderGuard;
