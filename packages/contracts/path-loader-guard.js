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
            const err = new Error('محظور: الملف المطلوب يشير عبر رابط رمزي إلى خارج حدود مساحة العمل (Symlink Escape)');
            err.code = 'SYMLINK_ESCAPE_DETECTED';
            throw err;
        }

        // 8. التأكد من أن المسار يمثل ملفاً حقيقياً وليس مجلداً أو ملفاً خاصاً
        const stats = fs.statSync(realPath);
        if (!stats.isFile()) {
            const err = new Error(`المسار المحدد لا يمثل ملفاً عادياً: '${resolvedPath}'`);
            err.code = 'NOT_A_REGULAR_FILE';
            throw err;
        }

        return realPath;
    }

    /**
     * التحقق الصارم من مسار كتابة ملف جديد أو تحديثه مع التدقيق الكامل في الروابط الرمزية للهدف وأصوله
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

        // تطهير وتوحيد الفواصل لمنع ثغرات القفز عبر الأنظمة المتعددة (Cross-Platform Traversal Defense)
        const normalized = trimmed.replace(/\\/g, '/');

        // كشف وحظر المسارات المطلقة بحرف محرك الأقراص على أنظمة POSIX (Linux/macOS)
        if (/^[a-zA-Z]:/.test(trimmed) && process.platform !== 'win32') {
            const err = new Error(`محظور: مسار مطلق لنظام Windows غير مصرح به: '${trimmed}'`);
            err.code = 'PATH_TRAVERSAL_DETECTED';
            throw err;
        }

        const resolvedTarget = path.isAbsolute(normalized) ? path.resolve(normalized) : path.resolve(projectRoot, normalized);
        const resolvedRoot = path.resolve(projectRoot);

        // 1. التحقق المعجمي من الاحتواء داخل الجذر
        if (!this.isInsideRoot(resolvedTarget, resolvedRoot)) {
            const err = new Error(`محظور: مسار الكتابة يقع خارج حدود مساحة العمل المسموحة: '${resolvedTarget}'`);
            err.code = 'PATH_TRAVERSAL_DETECTED';
            throw err;
        }

        let realRoot;
        try {
            realRoot = fs.realpathSync(resolvedRoot);
        } catch (e) {
            realRoot = resolvedRoot;
        }

        // 2. إذا كان الملف الهدف موجوداً بالفعل على القرص: فحصه مباشرة وبشكل مستقل عبر lstat
        let targetExists = false;
        let targetLstat = null;
        try {
            targetLstat = fs.lstatSync(resolvedTarget);
            targetExists = true;
        } catch (e) {
            targetExists = false;
        }

        if (targetExists && targetLstat) {
            // رفض الكتابة المباشرة إلى الروابط الرمزية (Symlink Target Bypass Prevention)
            if (targetLstat.isSymbolicLink()) {
                let symlinkTargetReal;
                try {
                    symlinkTargetReal = fs.realpathSync(resolvedTarget);
                } catch (e) {
                    symlinkTargetReal = null;
                }

                if (!symlinkTargetReal || !this.isInsideRoot(symlinkTargetReal, realRoot)) {
                    const err = new Error(`محظور: ملف الهدف رابط رمزي يشير إلى خارج مساحة العمل الموثوقة: '${resolvedTarget}'`);
                    err.code = 'SYMLINK_ESCAPE_DETECTED';
                    throw err;
                }

                if (!options.allowSymlinks) {
                    const err = new Error(`محظور: لا يمكن الكتابة فوق رابط رمزي موجود: '${resolvedTarget}'`);
                    err.code = 'SYMLINK_TARGET_REJECTED';
                    throw err;
                }
            }

            if (targetLstat.isDirectory()) {
                const err = new Error(`محظور: الهدف المحدد يمثل مجلداً وليس ملفاً: '${resolvedTarget}'`);
                err.code = 'IS_A_DIRECTORY';
                throw err;
            }

            if (!targetLstat.isFile() && !targetLstat.isSymbolicLink()) {
                const err = new Error(`محظور: الهدف المحدد يمثل كائناً خاصاً غير مصرح بالكتابة إليه: '${resolvedTarget}'`);
                err.code = 'NOT_A_REGULAR_FILE';
                throw err;
            }

            // فحص المسار الحقيقي للهدف والتأكد من بقائه داخل الجذر الحقيقي
            let realTarget;
            try {
                realTarget = fs.realpathSync(resolvedTarget);
            } catch (e) {
                const err = new Error(`فشل حل المسار الحقيقي للهدف: ${e.message}`);
                err.code = 'REALPATH_RESOLUTION_FAILED';
                throw err;
            }

            if (!this.isInsideRoot(realTarget, realRoot)) {
                const err = new Error(`محظور: المسار الحقيقي للهدف يقع خارج الجذر الموثوق: '${realTarget}'`);
                err.code = 'SYMLINK_ESCAPE_DETECTED';
                throw err;
            }
        }

        // 3. فحص كافة المجلدات الأصلية الموجودة داخل مساحة العمل للتأكد من عدم وجود روابط رمزية هاربة
        let currentDir = path.dirname(resolvedTarget);
        while (currentDir !== path.dirname(currentDir)) {
            if (!this.isInsideRoot(currentDir, realRoot)) {
                break;
            }

            let dirLstat = null;
            try {
                dirLstat = fs.lstatSync(currentDir);
            } catch (e) {
                dirLstat = null;
            }

            if (dirLstat && dirLstat.isSymbolicLink()) {
                let realDir;
                try {
                    realDir = fs.realpathSync(currentDir);
                } catch (e) {
                    const err = new Error(`فشل حل المسار الحقيقي للرابط الرمزي: ${e.message}`);
                    err.code = 'REALPATH_RESOLUTION_FAILED';
                    throw err;
                }
                if (!this.isInsideRoot(realDir, realRoot)) {
                    const err = new Error(`محظور: أحد المجلدات الأصلية يشير عبر رابط رمزي إلى خارج مساحة العمل: '${currentDir}'`);
                    err.code = 'SYMLINK_ESCAPE_DETECTED';
                    throw err;
                }
            }

            if (currentDir === realRoot) break;
            currentDir = path.dirname(currentDir);
        }

        return resolvedTarget;
    }

    /**
     * كتابة ذرية آمنة للمحتوى مع فحص المسارات واستخدام ملف مؤقت داخل المجلد نفسه
     * @param {string} destinationPath 
     * @param {string|Buffer} content 
     * @param {Object} options 
     */
    static safeAtomicWrite(destinationPath, content, options = {}) {
        const safePath = this.validateSafeWritePath(destinationPath, options);
        const parentDir = path.dirname(safePath);

        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }

        // إنشاء ملف مؤقت في نفس المجلد لضمان نفس وحدة التخزين (Filesystem Volume)
        const tmpFile = path.join(parentDir, `.tmp-${path.basename(safePath)}-${Date.now()}-${process.pid}-${Math.random().toString(36).slice(2)}`);

        try {
            fs.writeFileSync(tmpFile, content, { encoding: options.encoding || 'utf8', mode: options.mode || 0o644 });
            // استبدال ذري آمن
            fs.renameSync(tmpFile, safePath);
            return safePath;
        } catch (err) {
            try {
                if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
            } catch (cleanupErr) {
                // تجاهل أخطاء التنظيف في مسار الفشل
            }
            throw err;
        }
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
