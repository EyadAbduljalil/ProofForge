// حارس أمان الملفات ورفع البيانات وحماية المسارات (File Security Guard)
const path = require('path');

class FileSecurityGuard {
    static sanitizeFilename(filename) {
        if (!filename || typeof filename !== 'string') return 'unnamed_file';
        // إزالة مسارات العبور ومحارف التحكم الخطرة
        const base = path.basename(filename);
        return base.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '.');
    }

    static validatePathTraversal(baseDir, targetPath) {
        const resolvedBase = path.resolve(baseDir);
        const resolvedTarget = path.resolve(baseDir, targetPath);

        if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
            const err = new Error('محظور: محاولة عبور مسار الدليل (Path Traversal / Zip Slip Detected)');
            err.statusCode = 403;
            throw err;
        }

        return resolvedTarget;
    }

    static validateFileUpload(file, options = {}) {
        const maxSizeBytes = options.maxSizeBytes || 10 * 1024 * 1024; // 10MB
        const allowedExtensions = options.allowedExtensions || ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
        const dangerousExtensions = ['.php', '.phtml', '.exe', '.sh', '.bat', '.cmd', '.js', '.vbs', '.py', '.pl'];

        if (!file || !file.name) {
            throw new Error('بيانات الملف المرفوع غير مكتملة');
        }

        if (file.size && file.size > maxSizeBytes) {
            throw new Error(`حجم الملف يتجاوز الحد الأقصى المسموح به (${Math.floor(maxSizeBytes / 1024 / 1024)}MB)`);
        }

        const ext = path.extname(file.name).toLowerCase();
        if (dangerousExtensions.includes(ext)) {
            throw new Error(`نوع الملف '${ext}' محظور تماماً لأسباب أمنية`);
        }

        if (!allowedExtensions.includes(ext)) {
            throw new Error(`امتداد الملف '${ext}' غير مدعوم`);
        }

        const safeName = `${Date.now()}_${this.sanitizeFilename(file.name)}`;
        return { valid: true, safeName, extension: ext };
    }
}

module.exports = FileSecurityGuard;
