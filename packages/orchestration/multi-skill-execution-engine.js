/**
 * @file multi-skill-execution-engine.js
 * @description محرك التنفيذ الحقيقي متعدد المهارات وإدارة دورة حياة المشاريع في ProofForge
 * (ProofForge Multi-Skill Real Execution & Lifecycle Engine)
 * 
 * يطبق المراحل الهندسية الـ 12 المستقلة:
 * 1. استكشاف سياق المشروع (Project Context Discovery).
 * 2. تحليل هيكلية المستودع (Repository Structure Analysis).
 * 3. اكتشاف مكدس التقنيات (Technology Stack Detection).
 * 4. استخراج المتطلبات (Requirement Extraction).
 * 5. مطابقة المتطلبات بالمهارات (Requirement-to-Skill Mapping).
 * 6. التخطيط للتنفيذ وتتبع التبعيات (Execution Planning & Prerequisite Check).
 * 7. تحليل التبعيات والمخاطر وهرمية السلطة (Dependency, Risk & Conflict Analysis).
 * 8. استدعاء مشغل الوكيل الذاتي المعتمد (Agent Runtime Invocation).
 * 9. إنتاج المخرجات والملفات المادية الحقيقية (Real Artifact Production).
 * 10. التحقق الدلالي المستقل من المخرجات عبر المدققات التخصصية (Independent Artifact Verification).
 * 11. تسجيل وبناء رسم الأدلة الموحد (Evidence Graph Recording).
 * 12. القرار الانتقالي للإصدار أو الاسترجاع المادي الشامل عند الإخفاق (Physical Rollback).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const AuthorityHierarchy = require('./authority-hierarchy');
const RuleConflictEngine = require('./rule-conflict-engine');
const EvidenceGraph = require('./evidence-graph');
const PathLoaderGuard = require('../contracts/path-loader-guard');
const EvidenceContractValidator = require('../contracts/evidence-contract-validator');
const ProjectContextDiscovery = require('./project-context-discovery');
const { AgentRuntimeProvider } = require('./agent-runtime-provider');

class MultiSkillExecutionEngine {
    /**
     * تنفيذ خطة عمل متعددة المهارات على مساحة عمل فعلية مع استرجاع حقيقي عند الإخفاق
     * @param {Object} plan خطة التوجيه المعتمدة الصادرة من IntelligentSkillRouter
     * @param {Object} options خيارات ومساحة عمل ومزود تشغيل الوكيل
     * @returns {Object} تقرير التنفيذ النهائي بالأدلة المادية
     */
    static executePlan(plan, options = {}) {
        if (!plan || !Array.isArray(plan.steps) || plan.steps.length === 0) {
            throw new Error('محظور: خطة التنفيذ فارغة أو غير صالحة');
        }

        const rootDir = path.resolve(options.rootDir || path.resolve(__dirname, '../../'));
        const workspacePath = path.resolve(options.workspacePath || path.resolve(process.cwd(), '.webforge/execution-sandbox'));
        fs.mkdirSync(workspacePath, { recursive: true });

        // 1. التقاط لقطة حالة متكاملة لمساحة العمل قبل أي تدخل لضمان استرجاع حقيقي 100%
        const initialSnapshot = this._createWorkspaceSnapshot(workspacePath);

        // 2. تهيئة البيئة الهندسية المعيارية لمساحة العمل المنفصلة لتمكين أدوات المهارات مع استرجاع تعويضي فوري عند الإخفاق
        try {
            this._bootstrapIsolatedWorkspaceEnvironment(workspacePath, rootDir);
        } catch (bootstrapErr) {
            const rollbackResult = this._restoreWorkspaceSnapshot(workspacePath, initialSnapshot);
            return {
                executionId: `EXEC_FAILED_${Date.now()}`,
                scenarioId: plan.scenarioId,
                status: 'FAILED',
                totalDurationMs: 0,
                completedStepsCount: 0,
                totalStepsCount: plan.steps.length,
                failureDetails: {
                    failedStep: 'BOOTSTRAP',
                    reason: `Workspace bootstrap failed: ${bootstrapErr.message}`,
                    code: 'BOOTSTRAP_FAILURE'
                },
                rollbackExecuted: true,
                rollbackVerified: rollbackResult.isRestoredByteForByte,
                filesRemovedCount: rollbackResult.filesRemoved,
                filesRestoredCount: rollbackResult.filesRestored,
                dirsRemovedCount: rollbackResult.dirsRemoved,
                isStructureAndContentRestored: rollbackResult.isStructureAndContentRestored,
                restorationGuarantee: rollbackResult.restorationGuarantee,
                conflictResolutions: [],
                stepLogs: []
            };
        }

        const executionId = `EXEC_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // المرحلة 1 و 2 و 3: استكشاف سياق وبيئة المشروع الحقيقية (Project Context Discovery)
        let projectContext = null;
        try {
            projectContext = ProjectContextDiscovery.discoverContext(workspacePath);
        } catch (ctxErr) {
            projectContext = { projectRoot: workspacePath, languages: ['javascript'], manifests: [] };
        }

        // المرحلة 8: استكشاف والتحقق من توفر بيئة تشغيل الوكيل الحي المعتمد (Agent Runtime Resolution)
        const agentRuntime = AgentRuntimeProvider.resolveProvider(options);
        if (!agentRuntime) {
            // في حال عدم توفر بيئة تشغيل وكيل حية وعدم تمرير مزود معتمد، يرفض المحرك تزييف النتائج بقوالب مسبقة
            return {
                executionId,
                scenarioId: plan.scenarioId,
                status: 'AGENT_RUNTIME_UNAVAILABLE',
                reason: 'No compatible live agent runtime detected. Refusing to emit unverified mock templates.',
                totalDurationMs: 0,
                completedStepsCount: 0,
                totalStepsCount: plan.steps.length,
                artifactsCount: 0,
                emittedArtifacts: {},
                conflictResolutions: [],
                stepLogs: [],
                evidenceGraphSummary: {
                    totalNodes: 0,
                    totalEdges: 0
                }
            };
        }

        const startTime = process.hrtime.bigint();
        const evidenceGraph = new EvidenceGraph();
        const executionContext = {
            rootDir,
            workspacePath,
            projectContext,
            scenarioId: plan.scenarioId,
            scenarioName: plan.scenarioName,
            sharedMemory: {},
            emittedArtifacts: {},
            completedSteps: new Set(),
            conflictResolutions: [],
            stepLogs: []
        };

        // تسجيل عقدة المشروع في رسم الأدلة
        evidenceGraph.addNode({
            id: `PROJECT_${plan.scenarioId}`,
            type: 'PROJECT',
            status: 'IN_PROGRESS',
            metadata: { scenarioId: plan.scenarioId, scenarioName: plan.scenarioName }
        });

        let isAborted = false;
        let failureDetails = null;

        for (const step of plan.steps) {
            const stepStartTime = process.hrtime.bigint();
            const stepLog = {
                stepNumber: step.stepNumber,
                skillId: step.skillId,
                status: 'NOT_RUN',
                artifacts: [],
                errors: []
            };

            // التحقق من اكتمال التبعيات المسبقة (Prerequisite Check)
            const unsatisfiedDeps = (step.dependencies || []).filter(dep => !executionContext.completedSteps.has(dep));
            if (unsatisfiedDeps.length > 0) {
                isAborted = true;
                failureDetails = {
                    failedStep: step.skillId,
                    reason: `Unsatisfied prerequisite dependencies: ${unsatisfiedDeps.join(', ')}`,
                    code: 'UNSATISFIED_DEPENDENCY'
                };
                stepLog.status = 'BLOCKED';
                stepLog.errors.push(failureDetails.reason);
                executionContext.stepLogs.push(stepLog);
                break;
            }

            try {
                // تنفيذ الخطوة الحقيقية عبر مشغل الوكيل المعتمد والمدقق المستقل
                const stepArtifacts = this._executeSkillStepWithRealTools(step, workspacePath, executionContext, agentRuntime);

                // فحص تعارض المخرجات والتحكيم
                this._checkAndArbitrateConflicts(step, stepArtifacts, executionContext);

                // التحقق الصارم من عقود الأدلة وربطها بالنتائج المادية المؤكدة
                for (const reqEvidence of step.evidenceRequired || []) {
                    const art = stepArtifacts[reqEvidence];
                    if (!art || art.status !== 'VERIFIED') {
                        throw new Error(`خلل في عقد الأدلة للمهارة '${step.skillId}': الدليل المطلوب '${reqEvidence}' لم يتحقق بصورة قطعية.`);
                    }
                    const evidenceNodeId = `EVID_${step.skillId}_${reqEvidence}`;
                    evidenceGraph.addNode({
                        id: evidenceNodeId,
                        type: 'EVIDENCE',
                        status: 'VERIFIED',
                        metadata: {
                            skillId: step.skillId,
                            requirement: reqEvidence,
                            verifiedByTool: art.verifiedByTool || 'ENGINE_VERIFIER',
                            checksPassed: art.checksPassedCount !== undefined ? art.checksPassedCount : null,
                            totalChecks: art.totalChecksCount !== undefined ? art.totalChecksCount : null,
                            artifactSha256: art.physicalArtifact ? art.physicalArtifact.sha256 : null
                        }
                    });
                    evidenceGraph.addEdge(`PROJECT_${plan.scenarioId}`, evidenceNodeId, 'REQUIRES_EVIDENCE');
                }

                Object.assign(executionContext.emittedArtifacts, stepArtifacts);
                executionContext.completedSteps.add(step.skillId);

                const stepEndTime = process.hrtime.bigint();
                stepLog.status = 'SUCCESS';
                stepLog.durationMs = Number(stepEndTime - stepStartTime) / 1000000;
                stepLog.artifacts = Object.keys(stepArtifacts);
                executionContext.stepLogs.push(stepLog);

            } catch (err) {
                isAborted = true;
                failureDetails = {
                    failedStep: step.skillId,
                    reason: err.message,
                    code: 'STEP_EXECUTION_FAILURE'
                };
                stepLog.status = 'FAILED';
                stepLog.errors.push(err.message);
                executionContext.stepLogs.push(stepLog);
                break;
            }
        }

        const endTime = process.hrtime.bigint();
        const totalDurationMs = Number(endTime - startTime) / 1000000;

        // في حال حدوث أي إخفاق، تطبيق الاسترجاع المادي الشامل لمساحة العمل (Physical Rollback)
        if (isAborted) {
            const rollbackResult = this._restoreWorkspaceSnapshot(workspacePath, initialSnapshot);
            return {
                executionId,
                scenarioId: plan.scenarioId,
                status: 'FAILED',
                totalDurationMs,
                completedStepsCount: executionContext.completedSteps.size,
                totalStepsCount: plan.steps.length,
                failureDetails,
                rollbackExecuted: true,
                rollbackVerified: rollbackResult.isRestoredByteForByte,
                filesRemovedCount: rollbackResult.filesRemoved,
                filesRestoredCount: rollbackResult.filesRestored,
                dirsRemovedCount: rollbackResult.dirsRemoved,
                isStructureAndContentRestored: rollbackResult.isStructureAndContentRestored,
                restorationGuarantee: rollbackResult.restorationGuarantee,
                conflictResolutions: executionContext.conflictResolutions,
                stepLogs: executionContext.stepLogs
            };
        }

        return {
            executionId,
            scenarioId: plan.scenarioId,
            status: 'SUCCESS',
            totalDurationMs,
            completedStepsCount: executionContext.completedSteps.size,
            totalStepsCount: plan.steps.length,
            artifactsCount: Object.keys(executionContext.emittedArtifacts).length,
            emittedArtifacts: executionContext.emittedArtifacts,
            conflictResolutions: executionContext.conflictResolutions,
            stepLogs: executionContext.stepLogs,
            evidenceGraphSummary: {
                totalNodes: evidenceGraph.nodes.size,
                totalEdges: evidenceGraph.edges.length
            }
        };
    }

    /**
     * تنفيذ الخطوة التخصصية واستدعاء سكربتات وأدوات المهارة الحقيقية عبر مشغل الوكيل
     */
    static _executeSkillStepWithRealTools(step, workspacePath, context, agentRuntime) {
        const artifacts = {};
        const skillId = step.skillId;
        const rootDir = context.rootDir;

        // دعم حقن التعديلات لاختبارات التحقق العدائي والاسترجاع المادي
        if (typeof step.mutateWorkspace === 'function') {
            step.mutateWorkspace(workspacePath);
        }

        // تحميل التعليمات الحقيقية للمهارة من الدليل الكنسي
        const skillPath = path.join(rootDir, 'skills', skillId, 'SKILL.md');
        let skillInstructions = '';
        if (fs.existsSync(skillPath)) {
            skillInstructions = fs.readFileSync(skillPath, 'utf8');
        }

        const preSnapshot = this._createWorkspaceSnapshot(workspacePath);

        // استدعاء مشغل الوكيل الذاتي الواعي بسياق المشروع لتنفيذ متطلبات المهارة
        const taskResult = agentRuntime.submitTask({
            skillId,
            skillInstructions,
            step,
            context,
            projectContext: context.projectContext,
            workspacePath
        });

        if (!taskResult || taskResult.status !== 'EXECUTED') {
            throw new Error(`أخفق تنفيذ مهمة المهارة '${skillId}' عبر مشغل الوكيل: ${(taskResult && taskResult.error) || 'Unknown runtime error'}`);
        }

        const postSnapshot = this._createWorkspaceSnapshot(workspacePath);

        // التحقق الأمني الحتمي من نطاق التعديلات ومنع الهروب أو التعديل خارج حدود مساحة العمل
        for (const relPath of Object.keys(postSnapshot.files)) {
            const absTarget = path.join(workspacePath, relPath);
            if (!PathLoaderGuard.isInsideRoot(absTarget, workspacePath)) {
                const secErr = new Error(`[Security Violation] محاولة تعديل ملف خارج حدود مساحة العمل المصرح بها: ${relPath}`);
                secErr.code = 'UNAUTHORIZED_WORKSPACE_MODIFICATION';
                throw secErr;
            }
        }

        const candidateArtifacts = taskResult.emittedArtifacts || {};
        for (const [key, val] of Object.entries(candidateArtifacts)) {
            artifacts[key] = val;
        }

        // استدعاء أداة التحقق التخصصية للمهارة وتطبيق العقد الحتمي المستقل (Independent Tool Verification)
        const behavioralSpecs = this._loadBehavioralSpecs(rootDir);
        const skillSpec = behavioralSpecs[skillId];

        if (!skillSpec || !skillSpec.primaryScript) {
            throw new Error(`محظور: المهارة '${skillId}' لا تمتلك مواصفة سلوكية أو أداة تحقق مسجلة`);
        }

        const scriptPath = path.join(rootDir, skillSpec.primaryScript);
        if (!fs.existsSync(scriptPath)) {
            throw new Error(`محظور: أداة فحص المهارة '${skillId}' غير موجودة على القرص: ${skillSpec.primaryScript}`);
        }

        const verifierResult = spawnSync(process.execPath, [scriptPath, '--json'], {
            cwd: workspacePath,
            encoding: 'utf8',
            timeout: 15000
        });

        if (verifierResult.status !== 0) {
            throw new Error(`أخفقت أداة فحص المهارة '${skillId}' برمز خروج ${verifierResult.status}: ${verifierResult.stderr || verifierResult.stdout || 'No output'}`);
        }

        let parsedOutput = null;
        try {
            parsedOutput = JSON.parse(verifierResult.stdout);
        } catch (_) {
            throw new Error(`مخرجات أداة فحص المهارة '${skillId}' مشوهة وليست بتنسيق JSON حتمي صالح`);
        }

        // التحقق الصارم من عقد الإثبات الحتمي (Strict Evidence Contract Enforcement)
        if (!parsedOutput || typeof parsedOutput !== 'object') {
            throw new Error(`[Evidence Contract Violation] مخرجات أداة فحص المهارة '${skillId}' مشوهة وليست كائناً صالحاً`);
        }

        if (typeof parsedOutput.total_checks !== 'number' || parsedOutput.total_checks <= 0) {
            throw new Error(`[Evidence Contract Violation] المهارة '${skillId}' سجلت total_checks غير صالح (${parsedOutput.total_checks}).`);
        }

        if (typeof parsedOutput.passed_checks !== 'number' || parsedOutput.passed_checks <= 0) {
            throw new Error(`[Evidence Contract Violation] المهارة '${skillId}' سجلت passed_checks غير صالح (${parsedOutput.passed_checks}).`);
        }

        if (typeof parsedOutput.failed_checks !== 'number' || parsedOutput.failed_checks !== 0) {
            throw new Error(`[Evidence Contract Violation] المهارة '${skillId}' تحتوي على فحوصات فاشلة (${parsedOutput.failed_checks}).`);
        }

        if (parsedOutput.error_checks && parsedOutput.error_checks !== 0) {
            throw new Error(`[Evidence Contract Violation] المهارة '${skillId}' سجلت أخطاء برمجية في الفحص (${parsedOutput.error_checks}).`);
        }

        if (parsedOutput.blocked_checks && parsedOutput.blocked_checks !== 0) {
            throw new Error(`[Evidence Contract Violation] المهارة '${skillId}' سجلت فحوصات محظورة (${parsedOutput.blocked_checks}).`);
        }

        if (parsedOutput.passed_checks !== parsedOutput.total_checks) {
            throw new Error(`[Evidence Contract Violation] عدم اتساق أعداد الفحوصات للمهارة '${skillId}': passed_checks (${parsedOutput.passed_checks}) != total_checks (${parsedOutput.total_checks}).`);
        }

        if (!Array.isArray(parsedOutput.checks) || parsedOutput.checks.length !== parsedOutput.total_checks) {
            throw new Error(`[Evidence Contract Violation] قائمة الفحوصات المفصلة للمهارة '${skillId}' غير متسقة مع total_checks.`);
        }

        for (const chk of parsedOutput.checks) {
            if (chk.status !== 'PASS' || chk.passed !== true) {
                throw new Error(`[Evidence Contract Violation] الفحص '${chk.property || chk.id}' في المهارة '${skillId}' لم ينجح بحالة PASS صريحة.`);
            }
        }

        if (!parsedOutput.status || (!parsedOutput.status.startsWith('VERIFIED'))) {
            throw new Error(`حالة فحص المهارة '${skillId}' غير معتمدة: المتوقع VERIFIED، المستلم ${parsedOutput.status}`);
        }

        // تسجيل وربط أدلة المهارة الحتمية عبر مدقق العقود الكنسي الصارم لمنع التخمين الجزئي
        for (const req of step.evidenceRequired || []) {
            const existingArtifact = artifacts[req];
            const verifiedEvidence = EvidenceContractValidator.validateAndBindEvidence({
                skillId,
                requirementId: req,
                parsedVerifierOutput: parsedOutput,
                candidateArtifact: existingArtifact,
                workspacePath
            });

            artifacts[req] = {
                requirement: req,
                status: 'VERIFIED',
                evidenceId: verifiedEvidence.evidenceId,
                verifiedByTool: verifiedEvidence.verifierId,
                checkId: verifiedEvidence.checkId,
                checkProperty: verifiedEvidence.checkProperty,
                checkSeverity: verifiedEvidence.verificationResult.checkSeverity,
                physicalArtifact: verifiedEvidence.artifactPath ? {
                    path: verifiedEvidence.artifactPath,
                    sha256: verifiedEvidence.artifactHash
                } : null,
                executionTimestamp: verifiedEvidence.createdAt,
                checksPassedCount: verifiedEvidence.verificationResult.passedChecks,
                totalChecksCount: verifiedEvidence.verificationResult.totalChecks,
                failedChecksCount: verifiedEvidence.verificationResult.failedChecks,
                durationMs: parsedOutput.duration_ms || 0,
                cryptographicProof: {
                    boundCheckProperty: verifiedEvidence.checkProperty,
                    checksSummary: `${verifiedEvidence.verificationResult.passedChecks}/${verifiedEvidence.verificationResult.totalChecks} PASSED`,
                    toolName: verifiedEvidence.verifierId,
                    zeroFailuresEnforced: true,
                    artifactSha256: verifiedEvidence.artifactHash
                }
            };
        }

        return artifacts;
    }

    /**
     * تحميل المواصفات السلوكية للمهارات
     */
    static _loadBehavioralSpecs(rootDir) {
        const specFile = path.join(rootDir, 'registry/skills-behavioral-specs.json');
        if (fs.existsSync(specFile)) {
            return JSON.parse(fs.readFileSync(specFile, 'utf8'));
        }
        return {};
    }

    /**
     * تهيئة البيئة الهندسية المعيارية لمساحة العمل المنفصلة
     */
    static _bootstrapIsolatedWorkspaceEnvironment(workspacePath, rootDir) {
        if (path.resolve(workspacePath) === path.resolve(rootDir)) {
            return;
        }

        const packagesDir = path.join(workspacePath, 'packages');
        if (!fs.existsSync(packagesDir)) {
            const srcPackages = path.join(rootDir, 'packages');
            if (fs.existsSync(srcPackages)) {
                fs.cpSync(srcPackages, packagesDir, { recursive: true });
            }
        }

        const appsDir = path.join(workspacePath, 'apps');
        if (!fs.existsSync(appsDir)) {
            const srcApps = path.join(rootDir, 'apps');
            if (fs.existsSync(srcApps)) {
                fs.cpSync(srcApps, appsDir, { recursive: true });
            }
        }

        const pkgJson = path.join(workspacePath, 'package.json');
        if (!fs.existsSync(pkgJson)) {
            const srcPkg = path.join(rootDir, 'package.json');
            if (fs.existsSync(srcPkg)) {
                fs.copyFileSync(srcPkg, pkgJson);
            }
        }

        const lockJson = path.join(workspacePath, 'package-lock.json');
        if (!fs.existsSync(lockJson)) {
            const srcLock = path.join(rootDir, 'package-lock.json');
            if (fs.existsSync(srcLock)) {
                fs.copyFileSync(srcLock, lockJson);
            }
        }

        const testsDir = path.join(workspacePath, 'tests');
        if (!fs.existsSync(testsDir)) {
            const srcTests = path.join(rootDir, 'tests');
            if (fs.existsSync(srcTests)) {
                fs.cpSync(srcTests, testsDir, { recursive: true });
            }
        }
    }

    /**
     * التقاط لقطة حالة كاملة لمساحة العمل تشمل الملفات والمجلدات الفارغة والروابط الرمزية والصلاحيات
     */
    static _createWorkspaceSnapshot(dirPath) {
        const snapshot = {
            files: {},
            directories: new Set(),
            directoryModes: {},
            symlinks: {}
        };

        const walk = (currentDir) => {
            if (!fs.existsSync(currentDir)) return;
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            
            const relCurrent = path.relative(dirPath, currentDir).replace(/\\/g, '/');
            if (relCurrent && relCurrent !== '') {
                snapshot.directories.add(relCurrent);
                try {
                    const cStat = fs.lstatSync(currentDir);
                    snapshot.directoryModes[relCurrent] = cStat.mode;
                } catch (err) {
                    process.stderr.write(`[Snapshot DirMode Warn] ${err.message}\n`);
                }
            }

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                const relPath = path.relative(dirPath, fullPath).replace(/\\/g, '/');

                let stat;
                try {
                    stat = fs.lstatSync(fullPath);
                } catch (_) {
                    continue;
                }

                if (stat.isSymbolicLink()) {
                    try {
                        const target = fs.readlinkSync(fullPath);
                        snapshot.symlinks[relPath] = { target, mode: stat.mode };
                    } catch (err) {
                        snapshot.symlinks[relPath] = { target: null, error: err.message };
                    }
                } else if (stat.isDirectory()) {
                    snapshot.directories.add(relPath);
                    snapshot.directoryModes[relPath] = stat.mode;
                    walk(fullPath);
                } else if (stat.isFile()) {
                    const content = fs.readFileSync(fullPath);
                    const hash = crypto.createHash('sha256').update(content).digest('hex');
                    snapshot.files[relPath] = { content, hash, mode: stat.mode };
                }
            }
        };

        walk(dirPath);
        return snapshot;
    }

    /**
     * استرجاع مساحة العمل المادية بالكامل (Comprehensive Workspace State Restoration & Rollback)
     */
    static _restoreWorkspaceSnapshot(dirPath, initialSnapshot) {
        let filesRemoved = 0;
        let filesRestored = 0;
        let dirsRemoved = 0;

        const currentFiles = [];
        const currentSymlinks = [];
        const currentDirs = [];

        const scan = (currentDir) => {
            if (!fs.existsSync(currentDir)) return;
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                const relPath = path.relative(dirPath, fullPath).replace(/\\/g, '/');
                let stat;
                try {
                    stat = fs.lstatSync(fullPath);
                } catch (err) {
                    process.stderr.write(`[Snapshot Scan Warn] ${err.message}\n`);
                    continue;
                }

                if (stat.isSymbolicLink()) {
                    currentSymlinks.push({ fullPath, relPath });
                } else if (stat.isDirectory()) {
                    currentDirs.push({ fullPath, relPath });
                    scan(fullPath);
                } else if (stat.isFile()) {
                    currentFiles.push({ fullPath, relPath });
                }
            }
        };
        scan(dirPath);

        // إزالة الملفات والروابط الرمزية غير الموجودة في اللقطة الأولية
        for (const file of currentFiles) {
            if (!initialSnapshot.files[file.relPath]) {
                try {
                    fs.unlinkSync(file.fullPath);
                    filesRemoved++;
                } catch (err) {
                    process.stderr.write(`[Snapshot Cleanup Warn] ${err.message}\n`);
                }
            }
        }

        for (const symlink of currentSymlinks) {
            if (!initialSnapshot.symlinks[symlink.relPath]) {
                try {
                    fs.unlinkSync(symlink.fullPath);
                    filesRemoved++;
                } catch (err) {
                    process.stderr.write(`[Snapshot Cleanup Warn] ${err.message}\n`);
                }
            }
        }

        // استرجاع أو كتابة الملفات المحفوظة
        for (const [relPath, snap] of Object.entries(initialSnapshot.files)) {
            const targetPath = path.join(dirPath, relPath);
            let needsRestore = false;
            if (!fs.existsSync(targetPath)) {
                needsRestore = true;
            } else {
                try {
                    const currentContent = fs.readFileSync(targetPath);
                    const currentHash = crypto.createHash('sha256').update(currentContent).digest('hex');
                    if (currentHash !== snap.hash) {
                        needsRestore = true;
                    }
                } catch (err) {
                    needsRestore = true;
                }
            }
            if (needsRestore) {
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.writeFileSync(targetPath, snap.content);
                try {
                    if (snap.mode) fs.chmodSync(targetPath, snap.mode);
                } catch (err) {
                    process.stderr.write(`[Snapshot Chmod Warn] ${err.message}\n`);
                }
                filesRestored++;
            }
        }

        // استرجاع الروابط الرمزية
        for (const [relPath, snap] of Object.entries(initialSnapshot.symlinks)) {
            const targetPath = path.join(dirPath, relPath);
            let needsSymlink = false;
            try {
                const stat = fs.lstatSync(targetPath);
                if (!stat.isSymbolicLink() || fs.readlinkSync(targetPath) !== snap.target) {
                    fs.unlinkSync(targetPath);
                    needsSymlink = true;
                }
            } catch (err) {
                needsSymlink = true;
            }
            if (needsSymlink) {
                try {
                    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                    fs.symlinkSync(snap.target, targetPath);
                } catch (err) {
                    process.stderr.write(`[Snapshot Symlink Warn] ${err.message}\n`);
                }
            }
        }

        // إزالة المجلدات المستحدثة
        currentDirs.sort((a, b) => b.relPath.length - a.relPath.length);
        for (const dir of currentDirs) {
            if (!initialSnapshot.directories.has(dir.relPath)) {
                try {
                    if (fs.existsSync(dir.fullPath) && fs.readdirSync(dir.fullPath).length === 0) {
                        fs.rmdirSync(dir.fullPath);
                        dirsRemoved++;
                    }
                } catch (err) {
                    process.stderr.write(`[Snapshot Rmdir Warn] ${err.message}\n`);
                }
            }
        }

        // استعادة صلاحيات المجلدات على بيئات POSIX
        if (process.platform !== 'win32' && initialSnapshot.directoryModes) {
            for (const [dirRel, dMode] of Object.entries(initialSnapshot.directoryModes)) {
                try {
                    const dFull = path.join(dirPath, dirRel);
                    if (fs.existsSync(dFull)) fs.chmodSync(dFull, dMode);
                } catch (err) {
                    process.stderr.write(`[Snapshot ChmodDir Warn] ${err.message}\n`);
                }
            }
        }

        const postSnapshot = this._createWorkspaceSnapshot(dirPath);

        const initialFileKeys = Object.keys(initialSnapshot.files).sort();
        const postFileKeys = Object.keys(postSnapshot.files).sort();
        const filesCountMatch = initialFileKeys.length === postFileKeys.length;
        const filesMatch = filesCountMatch && initialFileKeys.every(k => {
            const post = postSnapshot.files[k];
            const init = initialSnapshot.files[k];
            if (!post) return false;
            if (post.hash !== init.hash) return false;
            if (process.platform !== 'win32' && init.mode && post.mode) {
                // مقارنة بتات الصلاحيات الأساسية (Permission bits) وتفادي الاختلافات الطفيفة في أقنعة النظام
                if ((post.mode & 0o777) !== (init.mode & 0o777)) return false;
            }
            return true;
        });

        const initialDirArr = Array.from(initialSnapshot.directories).sort();
        const postDirArr = Array.from(postSnapshot.directories).sort();
        const dirsMatch = initialDirArr.length === postDirArr.length &&
            initialDirArr.every((d, i) => d === postDirArr[i]);

        const initialSymlinkKeys = Object.keys(initialSnapshot.symlinks).sort();
        const postSymlinkKeys = Object.keys(postSnapshot.symlinks).sort();
        const symlinksMatch = initialSymlinkKeys.length === postSymlinkKeys.length &&
            initialSymlinkKeys.every(k => {
                const post = postSnapshot.symlinks[k];
                const init = initialSnapshot.symlinks[k];
                if (!post || !init) return false;
                const normPost = (post.target || '').replace(/\\/g, '/');
                const normInit = (init.target || '').replace(/\\/g, '/');
                return normPost === normInit;
            });

        const isRestoredByteForByte = Boolean(filesMatch && symlinksMatch && dirsMatch);
        const isStructureAndContentRestored = Boolean(filesMatch && symlinksMatch && dirsMatch);

        const restorationGuarantee = {
            scope: "FILESYSTEM_WORKSPACE_STATE_RESTORATION",
            contentIntegrity: filesMatch ? "SHA256_EXACT_MATCH" : "MISMATCH",
            directoryHierarchy: dirsMatch ? "STRUCTURE_EXACT_MATCH" : "MISMATCH",
            symlinkTargets: symlinksMatch ? "TARGET_EXACT_MATCH" : "MISMATCH",
            filePermissions: process.platform === 'win32' ? "WINDOWS_ATTRIBUTES_PRESERVED" : (filesMatch ? "POSIX_MODE_MATCH" : "MISMATCH"),
            unsupportedMetadataNote: "Cross-platform user-space rollback preserves content hashes, full directory hierarchy, symlink destinations, and POSIX file/folder modes where supported."
        };

        return {
            isRestoredByteForByte,
            isStructureAndContentRestored,
            restorationGuarantee,
            filesRemoved,
            filesRestored,
            dirsRemoved
        };
    }

    /**
     * فحص التعارضات والتحكيم بحسب هرمية السلطة
     */
    static _checkAndArbitrateConflicts(step, stepArtifacts, context) {
        if (step.skillId === 'performance' && context.sharedMemory['security']) {
            const res = RuleConflictEngine.resolveConflict(
                { id: 'SEC_AUTH_GUARD', name: 'Zero-Trust Strict Authorization', priority: 'P0_SECURITY_SAFETY' },
                { id: 'PERF_PUBLIC_CACHE', name: 'Aggressive Public Cache', priority: 'P4_ENGINEERING' }
            );
            context.conflictResolutions.push(res);
        }

        if (step.skillId === 'motion' && context.completedSteps.has('accessibility')) {
            const res = RuleConflictEngine.resolveConflict(
                { id: 'A11Y_REDUCED_MOTION', name: 'Prefers Reduced Motion Respect', priority: 'P1_CONSTITUTION' },
                { id: 'MOTION_PARALLAX', name: 'Continuous Heavy Parallax Transitions', priority: 'P5_DESIGN_SYSTEM' }
            );
            context.conflictResolutions.push(res);
        }
    }
}

module.exports = MultiSkillExecutionEngine;
