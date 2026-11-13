/**
 * @file path-loader-guard.js
 * @description حارس أمان المسارات ونظام الملفات الكنسي في ProofForge (Hardened Path & Filesystem Guard)
 * يضمن تطبيق مبدأ الفشل المغلق (Fail-Closed) ومنع ثغرات القفز بين المسارات (Path Traversal)،
 * والهروب عبر الروابط الرمزية (Symlink Escapes)، والحقن بالبايت الصفري، ومسارات UNC والمسارات المطلقة غير المصرح بها.
 */

'use strict';

const path = require('path');
const fs = require('fs');

class PathLoaderGuard {
    /**
     * المسار الجذري الافتراضي والموثوق للمشروع
     */
    static getProjectRoot() {
        return path.resolve(__dirname, '../..');
    }

    /**
     * التحقق الصارم من أن المسار يقع بأمان داخل المجلد الجذري الموثوق
     * @param {string} candidatePath المسار المطلوب فحصه
     * @param {string} rootPath المجلد الجذري المصرح به
     * @returns {boolean}
     */
    static isInsideRoot(candidatePath, rootPath) {
        const resolvedCandidate = path.resolve(candidatePath);
        const resolvedRoot = path.resolve(rootPath);

        // فحص البادئة مع فاصل المجلدات لضمان عدم تطابق أسماء المجلدات المتشابهة
        return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(resolvedRoot + path.sep);
    }

    /**
     * التحقق الصارم والآمن من مسار ملف للقراءة، مع فحص الامتداد والروابط الرمزية
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

        const trimmed = filePath.trim();

        // 2. فحص حقن البايت الصفري (Null-Byte Injection)
        if (trimmed.indexOf('\0') !== -1) {
            const err = new Error('محظور: تم رصد محاولة حقن بايت صفري في المسار (Null-Byte Injection Detected)');
            err.code = 'SECURITY_PATH_POISONING';
            throw err;
        }

        // 3. فحص مسارات الشبكة غير الموثوقة (UNC Paths)
        if (trimmed.startsWith('\\\\') || trimmed.startsWith('//')) {
            const err = new Error(`محظور: تم رفض مسار UNC للشبكة غير المصرح به: '${trimmed}'`);
            err.code = 'UNC_PATH_REJECTED';
            throw err;
        }

        // 4. حل المسار المطلق والتحقق الصارم من عدم الخروج عن جذر المشروع (Path Traversal Defense)
        const resolvedPath = path.resolve(projectRoot, trimmed);
        const resolvedRoot = path.resolve(projectRoot);

        if (!this.isInsideRoot(resolvedPath, resolvedRoot)) {
            const err = new Error('محظور: محاولة قراءة أو تحميل ملف يقع خارج حدود مساحة عمل المشروع (Path Traversal / Sandbox Escape Detected)');
            err.code = 'PATH_TRAVERSAL_DETECTED';
            throw err;
        }

        // 5. التحقق من امتداد الملف إذا تم تحديده
        if (allowedExtensions && allowedExtensions.length > 0) {
            const ext = path.extname(resolvedPath).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                const err = new Error(`محظور: امتداد الملف '${ext}' غير مسموح به. الامتدادات المصرح بها: ${allowedExtensions.join(', ')}`);
                err.code = 'DISALLOWED_EXTENSION';
                throw err;
            }
        }

        // 6. التحقق من وجود الملف فعلياً على القرص
        if (!fs.existsSync(resolvedPath)) {
            const err = new Error(`الملف المطلوب غير موجود على القرص: '${resolvedPath}'`);
            err.code = 'FILE_NOT_FOUND';
            throw err;
        }

        // 7. فحص الروابط الرمزية الحقيقي لمنع الهروب (Symlink Escape Protection)
        let realPath;
        try {
            realPath = fs.realpathSync(resolvedPath);
        } catch (e) {
            const err = new Error(`فشل استخراج المسار الحقيقي للملف: ${e.message}`);
            err.code = 'REALPATH_RESOLUTION_FAILED';
            throw err;
        }

        let realRoot;
        try {
            realRoot = fs.realpathSync(resolvedRoot);
        } catch (e) {
            realRoot = resolvedRoot;
        }

        if (!this.isInsideRoot(realPath, realRoot)) {
            const err = new Error('محظور: تم رصد رابط رمزي يشير إلى خارج حدود مساحة العمل المعتمدة (Symlink Escape Detected)');
            err.code = 'SYMLINK_ESCAPE_DETECTED';
            throw err;
        }

        // 8. التحقق من أن المسار يمثل ملفاً عادياً وليس مجلداً أو مقبساً أو جهازاً
        const stats = fs.statSync(realPath);
        if (!stats.isFile()) {
            const err = new Error(`المسار المحدد لا يمثل ملفاً عادياً: '${resolvedPath}'`);
            err.code = 'NOT_A_REGULAR_FILE';
            throw err;
        }

        return realPath;
    }

    /**
     * التحقق الصارم من مسار كتابة ملف جديد أو تحديثه (حتى لو لم يكن الملف موجوداً بعد)
     * يفحص أقرب مجلد أصل موجود فعلياً ويتأكد من بقائه داخل الجذر
     * @param {string} destinationPath مسار الملف المراد إنشاؤه أو الكتابة إليه
     * @param {Object} options 
     * @returns {string} المسار المطلق المحلول الآمن للكتابة
     */
    static validateSafeWritePath(destinationPath, options = {}) {
        const projectRoot = options.projectRoot || this.getProjectRoot();

        if (!destinationPath || typeof destinationPath !== 'string') {
            const err = new Error('مسار الوجهة للكتابة غير معرف أو ليس نصاً');
            err.code = 'INVALID_WRITE_PATH';
            throw err;
        }

        const trimmed = destinationPath.trim();
        if (trimmed.indexOf('\0') !== -1) {
            const err = new Error('محظور: حقن بايت صفري في مسار الكتابة');
            err.code = 'SECURITY_PATH_POISONING';
            throw err;
        }

        if (trimmed.startsWith('\\\\') || trimmed.startsWith('//')) {
            const err = new Error('محظور: مسارات UNC غير مصرح بها للكتابة');
            err.code = 'UNC_PATH_REJECTED';
            throw err;
        }

        const resolvedTarget = path.resolve(projectRoot, trimmed);
        const resolvedRoot = path.resolve(projectRoot);

        if (!this.isInsideRoot(resolvedTarget, resolvedRoot)) {
            const err = new Error(`محظور: مسار الكتابة يقع خارج حدود مساحة العمل المسموحة: '${resolvedTarget}'`);
            err.code = 'PATH_TRAVERSAL_DETECTED';
            throw err;
        }

        // البحث عن أقرب مجلد أصل موجود فعلياً لفحص الروابط الرمزية
        let currentDir = path.dirname(resolvedTarget);
        while (!fs.existsSync(currentDir) && currentDir !== path.dirname(currentDir)) {
            currentDir = path.dirname(currentDir);
        }

        if (fs.existsSync(currentDir)) {
            const realAncestor = fs.realpathSync(currentDir);
            let realRoot;
            try {
                realRoot = fs.realpathSync(resolvedRoot);
            } catch (e) {
                realRoot = resolvedRoot;
            }

            if (!this.isInsideRoot(realAncestor, realRoot)) {
                const err = new Error('محظور: المجلد الأصل لمسار الكتابة يشير عبر رابط رمزي إلى خارج مساحة العمل');
                err.code = 'SYMLINK_ESCAPE_DETECTED';
                throw err;
            }
        }

        return resolvedTarget;
    }

    /**
     * التحقق الصارم من مجلد آمن وموجود
     * @param {string} dirPath 
     * @param {Object} options 
     * @returns {string} المسار الحقيقي الآمن للمجلد
     */
    static validateSafeDirectory(dirPath, options = {}) {
        const projectRoot = options.projectRoot || this.getProjectRoot();

        if (!dirPath || typeof dirPath !== 'string') {
            const err = new Error('مسار المجلد غير معرف أو فارغ');
            err.code = 'INVALID_DIRECTORY_PATH';
            throw err;
        }

        const trimmed = dirPath.trim();
        if (trimmed.indexOf('\0') !== -1 || trimmed.startsWith('\\\\') || trimmed.startsWith('//')) {
            const err = new Error('مسار مجلد غير آمن أو يحتوي على بايت صفري أو UNC');
            err.code = 'SECURITY_PATH_POISONING';
            throw err;
        }

        const resolvedDir = path.resolve(projectRoot, trimmed);
        const resolvedRoot = path.resolve(projectRoot);

        if (!this.isInsideRoot(resolvedDir, resolvedRoot)) {
            const err = new Error(`المجلد المطلوب يقع خارج حدود مساحة العمل: '${resolvedDir}'`);
            err.code = 'PATH_TRAVERSAL_DETECTED';
            throw err;
        }

        if (!fs.existsSync(resolvedDir)) {
            const err = new Error(`المجلد المحدد غير موجود: '${resolvedDir}'`);
            err.code = 'DIRECTORY_NOT_FOUND';
            throw err;
        }

        const realDir = fs.realpathSync(resolvedDir);
        let realRoot;
        try {
            realRoot = fs.realpathSync(resolvedRoot);
        } catch (e) {
            realRoot = resolvedRoot;
        }

        if (!this.isInsideRoot(realDir, realRoot)) {
            const err = new Error('المجلد المحدد يشير عبر رابط رمزي إلى خارج مساحة العمل');
            err.code = 'SYMLINK_ESCAPE_DETECTED';
            throw err;
        }

        const stat = fs.statSync(realDir);
        if (!stat.isDirectory()) {
            const err = new Error(`المسار المحدد لا يمثل مجلداً: '${resolvedDir}'`);
            err.code = 'NOT_A_DIRECTORY';
            throw err;
        }

        return realDir;
    }
}

module.exports = PathLoaderGuard;
