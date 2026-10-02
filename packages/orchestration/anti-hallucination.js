/**
 * @file anti-hallucination.js
 * @description محرك مكافحة الهلوسة والتحقق من الوجود الفعلي للكيانات البرمجية والاعتماديات
 * WebForge Master Orchestration System
 */

const fs = require('fs');
const path = require('path');

class AntiHallucinationGuard {
    /**
     * التحقق من وجود الحزمة في المستودع أو في سجل الاعتماديات المعتمدة
     * @param {string} packageName اسم الحزمة
     * @param {string} rootDir مسار جذر المشروع
     * @returns {Object} نتيجة الفحص
     */
    static verifyPackageExistence(packageName, rootDir = process.cwd()) {
        const pkgPath = path.join(rootDir, 'package.json');
        const regPath = path.join(rootDir, 'registry', 'dependencies.json');

        let isDeclaredInPkg = false;
        let isApprovedInRegistry = false;

        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
                if (allDeps[packageName]) isDeclaredInPkg = true;
            } catch (e) {}
        }

        if (fs.existsSync(regPath)) {
            try {
                const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
                if (reg.approved_dependencies && reg.approved_dependencies.some(d => d.name === packageName || d.alias === packageName)) {
                    isApprovedInRegistry = true;
                }
            } catch (e) {}
        }

        // الحزم المدمجة في Node.js
        const builtinModules = ['fs', 'path', 'crypto', 'http', 'https', 'stream', 'buffer', 'util', 'os', 'child_process', 'assert', 'events', 'url'];
        const isBuiltin = builtinModules.includes(packageName);

        if (isBuiltin || isDeclaredInPkg || isApprovedInRegistry) {
            return {
                verified: true,
                packageName,
                type: isBuiltin ? 'NODE_BUILTIN' : (isDeclaredInPkg ? 'PROJECT_DEPENDENCY' : 'REGISTRY_APPROVED'),
                status: 'VERIFIED'
            };
        }

        return {
            verified: false,
            packageName,
            type: 'UNKNOWN_OR_INVENTED',
            status: 'VIOLATION_HALLUCINATED_PACKAGE',
            reason: `Package '${packageName}' is neither declared in package.json, nor in registry/dependencies.json, nor a Node.js builtin.`
        };
    }

    /**
     * التحقق من وجود ملف فعلي في المستودع قبل الإشارة إليه
     * @param {string} relativeFilePath 
     * @param {string} rootDir 
     */
    static verifyFileExistence(relativeFilePath, rootDir = process.cwd()) {
        const fullPath = path.join(rootDir, relativeFilePath);
        let exists = fs.existsSync(fullPath);
        let resolvedPath = relativeFilePath;

        if (!exists) {
            const promptFallback = path.join(rootDir, 'prompt', relativeFilePath);
            if (fs.existsSync(promptFallback)) {
                exists = true;
                resolvedPath = path.join('prompt', relativeFilePath);
            }
        }

        return {
            verified: exists,
            filePath: resolvedPath,
            status: exists ? 'VERIFIED' : 'FILE_NOT_FOUND',
            reason: exists ? 'File exists on disk' : `File '${relativeFilePath}' does not exist on filesystem.`
        };
    }
}

module.exports = AntiHallucinationGuard;
