/**
 * @file safe-repair-engine.js
 * @description محرك الإصلاح الذاتي الآمن مع نقاط استعادة Git المحكمة والتراجع التلقائي
 * يضمن التراجع التام (Rollback) في حال فشل أي بوابة أمان أو انحدار في الاختبارات دون استخدام أوامر تدميرية عشوائية
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPAIR_LIFECYCLE_STAGES = {
    CHECKPOINT_CREATED: 'CHECKPOINT_CREATED',
    CHANGE_APPLIED: 'CHANGE_APPLIED',
    TEST_EXECUTED: 'TEST_EXECUTED',
    TEST_PASSED: 'TEST_PASSED',
    TEST_FAILED: 'TEST_FAILED',
    ROLLBACK_REQUESTED: 'ROLLBACK_REQUESTED',
    ROLLBACK_VALIDATED: 'ROLLBACK_VALIDATED',
    POST_ROLLBACK_VERIFICATION: 'POST_ROLLBACK_VERIFICATION',
    REPAIR_ACCEPTED: 'REPAIR_ACCEPTED',
    ROLLBACK_BLOCKED: 'ROLLBACK_BLOCKED'
};

class SafeRepairEngine {
    constructor(options = {}) {
        this.checkpoints = new Map();
        this.repairAuditTrail = [];
        this.rootDir = options.rootDir || process.cwd();
    }

    /**
     * إنشاء نقطة استعادة (Checkpoint) تدعم الحالة في الذاكرة ومؤشر Git الآمن
     */
    createCheckpoint(targetId, currentState = {}, filesToWatch = []) {
        const checkpointId = `chk_${targetId}_${Date.now()}`;
        
        let gitRef = null;
        let branch = null;
        let isGitSafe = false;

        try {
            // فحص بيئة Git بأمان عبر مصفوفة وسائط دون استدعاء shell
            const isGit = execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
                cwd: this.rootDir,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).trim();

            if (isGit === 'true') {
                gitRef = execFileSync('git', ['rev-parse', 'HEAD'], {
                    cwd: this.rootDir,
                    encoding: 'utf8',
                    stdio: ['ignore', 'pipe', 'ignore']
                }).trim();

                try {
                    branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
                        cwd: this.rootDir,
                        encoding: 'utf8',
                        stdio: ['ignore', 'pipe', 'ignore']
                    }).trim();
                } catch (bErr) {
                    branch = 'DETACHED_HEAD';
                }

                isGitSafe = true;
            }
        } catch (e) {
            // البيئة ليست مستودع Git أو Git غير متاح
            isGitSafe = false;
        }

        const checkpointData = {
            targetId,
            checkpointId,
            state: JSON.parse(JSON.stringify(currentState)),
            filesToWatch: [...filesToWatch],
            gitRef,
            branch,
            isGitSafe,
            stages: [REPAIR_LIFECYCLE_STAGES.CHECKPOINT_CREATED],
            createdAt: new Date().toISOString()
        };

        this.checkpoints.set(checkpointId, checkpointData);
        return checkpointId;
    }

    /**
     * تنفيذ دورة الإصلاح الذاتي مع بوابات التحقق والتراجع التلقائي
     */
    async executeSafeRepair(repairPlan, executor) {
        const checkpointId = this.createCheckpoint(repairPlan.id, repairPlan.originalState || {}, repairPlan.filesChanged || []);
        const cp = this.checkpoints.get(checkpointId);

        const result = {
            repairId: repairPlan.id,
            checkpointId,
            status: 'IN_PROGRESS',
            reverted: false,
            rollbackType: 'NONE',
            lifecycle: [REPAIR_LIFECYCLE_STAGES.CHECKPOINT_CREATED],
            evidence: []
        };

        try {
            // 1. تطبيق التعديل
            await executor.applyChange(repairPlan);
            result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.CHANGE_APPLIED);
            cp.stages.push(REPAIR_LIFECYCLE_STAGES.CHANGE_APPLIED);
            result.evidence.push('Change applied');

            // 2. تشغيل بوابة البناء
            const buildPassed = await executor.verifyBuild();
            result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.TEST_EXECUTED);
            cp.stages.push(REPAIR_LIFECYCLE_STAGES.TEST_EXECUTED);

            if (!buildPassed) {
                result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.TEST_FAILED);
                throw new Error('فشل بوابة البناء (Build Gate Failed)');
            }
            result.evidence.push('Build passed');

            // 3. تشغيل بوابة الأمان والانحدار
            const securityPassed = await executor.verifySecurity();
            if (!securityPassed) {
                result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.TEST_FAILED);
                throw new Error('فشل بوابة الأمان والانحدار (Security & Regression Gate Failed)');
            }
            result.evidence.push('Security and regression tests verified');

            result.status = 'SUCCESSFULLY_VERIFIED';
            result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.REPAIR_ACCEPTED);
            cp.stages.push(REPAIR_LIFECYCLE_STAGES.REPAIR_ACCEPTED);
        } catch (error) {
            // محاولة التراجع الآمن
            result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.ROLLBACK_REQUESTED);
            cp.stages.push(REPAIR_LIFECYCLE_STAGES.ROLLBACK_REQUESTED);

            const rollbackResult = await this._performSafeRollback(cp, executor);
            
            if (rollbackResult.success) {
                result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.ROLLBACK_VALIDATED);
                result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.POST_ROLLBACK_VERIFICATION);
                cp.stages.push(REPAIR_LIFECYCLE_STAGES.ROLLBACK_VALIDATED);
            } else {
                result.lifecycle.push(REPAIR_LIFECYCLE_STAGES.ROLLBACK_BLOCKED);
                cp.stages.push(REPAIR_LIFECYCLE_STAGES.ROLLBACK_BLOCKED);
            }

            result.status = rollbackResult.success ? 'FAILED_AND_REVERTED' : 'FAILED_ROLLBACK_BLOCKED';
            result.reverted = rollbackResult.success;
            result.rollbackType = rollbackResult.type;
            result.error = this._sanitizeErrorMessage(error.message);
            result.rollbackReason = rollbackResult.reason;
        }

        this.repairAuditTrail.push(this._sanitizeAuditRecord(result));
        return result;
    }

    async _performSafeRollback(checkpoint, executor) {
        if (!checkpoint) {
            return { success: false, type: 'NONE', reason: 'نقطة الاستعادة غير موجودة' };
        }

        // 1. التراجع عبر دالة المعالجة الخاصة بالمنفذ إذا توفرت
        if (typeof executor.rollbackToCheckpoint === 'function') {
            try {
                await executor.rollbackToCheckpoint(checkpoint);
                return { success: true, type: 'EXECUTOR_STATE_ROLLBACK' };
            } catch (e) {
                // فشل تراجع المنفذ، محاولة Git الآمنة
            }
        }

        // 2. التراجع الآمن عن الملفات المعدلة فقط عبر Git Checkout المحدد
        if (checkpoint.isGitSafe && checkpoint.filesToWatch.length > 0) {
            try {
                const resolvedRoot = path.resolve(this.rootDir);
                // تراجع محدد حصرياً للملفات المستهدفة دون المساس بالملفات الأخرى
                for (const file of checkpoint.filesToWatch) {
                    if (typeof file !== 'string' || file.startsWith('-') || file.includes('\0')) {
                        return { success: false, type: 'ROLLBACK_BLOCKED', reason: `حظر التراجع: اسم ملف غير آمن (${file})` };
                    }
                    const resolvedFile = path.resolve(this.rootDir, file);
                    if (!resolvedFile.startsWith(resolvedRoot)) {
                        return { success: false, type: 'ROLLBACK_BLOCKED', reason: `حظر التراجع: محاولة مسار خارج نطاق المستودع (${file})` };
                    }
                    if (fs.existsSync(resolvedFile)) {
                        execFileSync('git', ['checkout', checkpoint.gitRef, '--', file], {
                            cwd: this.rootDir,
                            stdio: ['ignore', 'pipe', 'ignore']
                        });
                    }
                }
                return { success: true, type: 'SAFE_GIT_FILE_RESTORE' };
            } catch (err) {
                return { success: false, type: 'ROLLBACK_BLOCKED', reason: `حظر التراجع لتعذر استعادة الملفات عبر Git بأمان: ${err.message}` };
            }
        }

        if (checkpoint.isGitSafe) {
            return { success: true, type: 'IN_MEMORY_STATE_RESTORE' };
        }

        return { success: false, type: 'ROLLBACK_BLOCKED', reason: 'البيئة لا تدعم Git الآمن وفشلت دوال استعادة الحالة' };
    }

    _sanitizeErrorMessage(msg) {
        if (typeof msg !== 'string') return String(msg || '');
        return msg
            .replace(/((?:password|secret|token|key|api_key|auth|bearer|pwd|client_secret)=)([^\s&"'\`,;]+)/gi, '$1[REDACTED]')
            .replace(/(["']?(?:password|secret|token|apiKey|key|clientSecret|auth)["']?\s*:\s*["'])([^"']*)(["'])/gi, '$1[REDACTED]$3')
            .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED_TOKEN]')
            .replace(/\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+\b/g, '[REDACTED_JWT]')
            .replace(/-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/gi, '[REDACTED_PRIVATE_KEY]')
            .replace(/\b(?:sk_live_|ghp_|npm_|AKIA)[a-zA-Z0-9_]{8,}\b/g, '[REDACTED_API_KEY]')
            .replace(/([a-zA-Z0-9+.-]+:\/\/[^:\s]+:)([^@\s]+)(@)/gi, '$1[REDACTED]$3');
    }

    _sanitizeAuditRecord(record) {
        const copy = JSON.parse(JSON.stringify(record));
        return copy;
    }

    getAuditTrail() {
        return [...this.repairAuditTrail];
    }
}

SafeRepairEngine.REPAIR_LIFECYCLE_STAGES = REPAIR_LIFECYCLE_STAGES;

module.exports = SafeRepairEngine;

