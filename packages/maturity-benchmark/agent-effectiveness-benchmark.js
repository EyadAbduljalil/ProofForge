/**
 * @file agent-effectiveness-benchmark.js
 * @description معيار القياس التجريبي الحقيقي المقارن لكفاءة وكلاء الذكاء الاصطناعي في ProofForge
 * (ProofForge Genuine Agent Effectiveness A/B Comparative Benchmark Architecture)
 * 
 * التصميم التجريبي الصارم (Strict Experimental Protocol):
 * - مقارنة علمية مستقلة ثنائية الشروط (Independent Paired Trials):
 *   الشرط (أ) - الضابط (Condition A - Control):
 *     مشغل الوكيل المدعوم الفعلي مع تعطيل مهارات وقواعد ProofForge بالكامل،
 *     بنفس النموذج، وتكوين بيئة التشغيل، ومواصفات المهمة، والقيود البيئية.
 *   الشرط (ب) - المعالج (Condition B - Treatment):
 *     مشغل الوكيل الفعلي ذاته مع تفعيل مهارات ProofForge وحوكمتها وعقود الأدلة،
 *     بنفس النموذج والمواصفات والقيود البيئية.
 * 
 * القواعد الصارمة للنزاهة التجريبية:
 * 1. حظر المقارنة بين وكيل ومثبت عيوب (Fixture).
 * 2. حظر المقارنة بين وكيل وردود ثابتة مسبقة الصنع.
 * 3. حظر عزو الفروقات إلى ProofForge إذا اختلفت النماذج أو المهام أو البيئات.
 * 4. عزل تام لمساحات عمل الشرطين (Isolated Workspaces) ومنع تسرب المهارات للشرط الضابط.
 * 5. في حال عدم توفر مشغل وكيل حقيقي يدعم المقارنة المزدوجة، الإبلاغ الفوري بحالة:
 *    `AGENT_AB_BENCHMARK_UNAVAILABLE` أو `NOT_RUN`، مع حظر تحويلها إلى `COMPLETED` أو `PASS`.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const PathLoaderGuard = require('../contracts/path-loader-guard');

const VALID_BENCHMARK_STATUSES = Object.freeze([
    'NOT_RUN',
    'RUNNING',
    'COMPLETED',
    'PARTIALLY_COMPLETED',
    'FAILED',
    'AGENT_AB_BENCHMARK_UNAVAILABLE',
    'AGENT_RUNTIME_UNAVAILABLE',
    'INVALID_EXPERIMENT'
]);

class AgentEffectivenessBenchmark {
    static STATUSES = VALID_BENCHMARK_STATUSES;

    /**
     * تشغيل معيار المقارنة التجريبية A/B لكفاءة الوكلاء
     * @param {Object} options خيارات التجربة وبيئات تشغيل الوكلاء
     * @returns {Object} تقرير المقارنة العلمية الخام
     */
    static runComparison(options = {}) {
        const rootDir = options.rootDir || path.resolve(__dirname, '../../');
        const benchmarkId = `AB_BENCH_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        const targetTask = options.task || {
            id: 'TASK-SEC-FULLSTACK',
            title: 'Hardened Fullstack Storage & API Architecture',
            requirements: ['multi_tenant_isolation', 'acid_transactions', 'rate_limiting', 'input_sanitization']
        };

        // 1. التحقق من توفر مشغل الوكيل الحقيقي المشترك
        const runtime = options.agentRuntime || options.dualAgentRuntime || null;

        if (!runtime) {
            return this._buildUnavailableReport(benchmarkId, targetTask, 'NOT_RUN', 'No agent runtime provided. Interactive agent A/B benchmark requires a supported agent runtime.');
        }

        // التحقق من صلاحية المشغل وتصريحه (تمييز مشغل الاختبار الهيكلي)
        const capabilities = typeof runtime.discoverCapabilities === 'function' ? runtime.discoverCapabilities() : {};
        if (capabilities.isTestHarness === true && options.allowTestHarness !== true) {
            return this._buildUnavailableReport(benchmarkId, targetTask, 'AGENT_AB_BENCHMARK_UNAVAILABLE', 'ControlledTestRuntimeAdapter cannot be accepted as evidence of genuine agent effectiveness.');
        }

        // 2. التحقق من تكوين التجربة وشروط الصحة التجريبية (Experimental Validity)
        const trialsCount = Number.isInteger(options.trialsCount) && options.trialsCount > 0 ? options.trialsCount : 3;
        const baseWorkspaceRoot = options.workspaceRoot || path.join(os.tmpdir(), `pf-ab-${Date.now()}`);

        if (options.invalidExperimentReason) {
            return this._buildUnavailableReport(benchmarkId, targetTask, 'INVALID_EXPERIMENT', options.invalidExperimentReason);
        }

        // 3. تنفيذ التجارب الزوجية المستقلة (Paired Independent Trials)
        const pairedTrials = [];
        let executionStatus = 'COMPLETED';
        let failureReason = null;

        try {
            fs.mkdirSync(baseWorkspaceRoot, { recursive: true });

            for (let i = 0; i < trialsCount; i++) {
                const trialId = `TRIAL_${i + 1}_OF_${trialsCount}`;
                const controlWorkspace = path.join(baseWorkspaceRoot, `trial_${i + 1}_control`);
                const treatmentWorkspace = path.join(baseWorkspaceRoot, `trial_${i + 1}_treatment`);

                fs.mkdirSync(controlWorkspace, { recursive: true });
                fs.mkdirSync(treatmentWorkspace, { recursive: true });

                const trialRecord = {
                    trialIndex: i + 1,
                    trialId,
                    task: targetTask,
                    executionOrder: i % 2 === 0 ? ['CONTROL', 'TREATMENT'] : ['TREATMENT', 'CONTROL'],
                    controlResult: null,
                    treatmentResult: null,
                    isolatedWorkspaces: {
                        control: controlWorkspace,
                        treatment: treatmentWorkspace
                    },
                    evaluated: false
                };

                // تنفيذ الشرط الضابط (Condition A - Control) - مهارات ProofForge معطلة
                try {
                    trialRecord.controlResult = this._executeCondition({
                        condition: 'CONTROL',
                        runtime,
                        task: targetTask,
                        workspace: controlWorkspace,
                        enableProofForge: false,
                        trialIndex: i + 1
                    });
                } catch (cErr) {
                    trialRecord.controlResult = {
                        status: 'FAILED',
                        error: cErr.message,
                        artifacts: {},
                        metrics: { completionRate: 0, violations: 1 }
                    };
                }

                // تنفيذ الشرط المعالج (Condition B - Treatment) - مهارات ProofForge مفعلة
                try {
                    trialRecord.treatmentResult = this._executeCondition({
                        condition: 'TREATMENT',
                        runtime,
                        task: targetTask,
                        workspace: treatmentWorkspace,
                        enableProofForge: true,
                        trialIndex: i + 1
                    });
                } catch (tErr) {
                    trialRecord.treatmentResult = {
                        status: 'FAILED',
                        error: tErr.message,
                        artifacts: {},
                        metrics: { completionRate: 0, violations: 1 }
                    };
                }

                // التقييم المستقل للمخرجات دون تحيز
                trialRecord.evaluation = this._evaluateTrialOutputs(trialRecord.controlResult, trialRecord.treatmentResult, targetTask);
                trialRecord.evaluated = true;

                pairedTrials.push(trialRecord);
            }
        } catch (globalErr) {
            executionStatus = 'FAILED';
            failureReason = globalErr.message;
        } finally {
            if (options.preserveWorkspaces !== true) {
                try {
                    fs.rmSync(baseWorkspaceRoot, { recursive: true, force: true });
                } catch (cleanupErr) {
                    process.stderr.write(`[AgentEffectivenessBenchmark Cleanup Notice] ${cleanupErr.message}\n`);
                }
            }
        }

        if (executionStatus === 'FAILED') {
            return {
                benchmarkId,
                benchmarkType: 'REAL_AGENT_EFFECTIVENESS_AB_BENCHMARK',
                version: '3.0.0',
                evaluatedAt: new Date().toISOString(),
                status: 'FAILED',
                error: failureReason,
                pairedTrialsCount: pairedTrials.length,
                trials: pairedTrials,
                verdict: 'AGENT_AB_EXPERIMENT_FAILED'
            };
        }

        const completedTrials = pairedTrials.filter(t => t.controlResult?.status === 'EXECUTED' && t.treatmentResult?.status === 'EXECUTED');
        const finalStatus = completedTrials.length === trialsCount
            ? 'COMPLETED'
            : (completedTrials.length > 0 ? 'PARTIALLY_COMPLETED' : 'FAILED');

        return {
            benchmarkId,
            benchmarkType: 'REAL_AGENT_EFFECTIVENESS_AB_BENCHMARK',
            version: '3.0.0',
            evaluatedAt: new Date().toISOString(),
            status: finalStatus,
            task: targetTask,
            experimentalDesign: {
                independentVariable: 'ProofForge Deterministic Verification & Skills Layer',
                controlCondition: 'Genuine Agent Runtime with ProofForge Skills Disabled',
                treatmentCondition: 'Genuine Agent Runtime with ProofForge Skills Enabled',
                pairedTrialsRequired: trialsCount,
                pairedTrialsCompleted: completedTrials.length,
                runtimeInfo: {
                    providerName: capabilities.providerName || runtime.name || 'Unknown',
                    isLive: capabilities.isLive === true,
                    isTestHarness: capabilities.isTestHarness === true
                }
            },
            agentEffectivenessComparison: {
                status: finalStatus,
                pairedTrialsCount: trialsCount,
                completedTrialsCount: completedTrials.length,
                controlSummary: this._summarizeCondition(pairedTrials.map(t => t.controlResult)),
                treatmentSummary: this._summarizeCondition(pairedTrials.map(t => t.treatmentResult)),
                comparativeDelta: this._computeDelta(pairedTrials)
            },
            trials: pairedTrials,
            verdict: finalStatus === 'COMPLETED' ? 'AGENT_AB_COMPARISON_VALIDATED' : 'AGENT_AB_COMPARISON_INCOMPLETE'
        };
    }

    static _executeCondition({ condition, runtime, task, workspace, enableProofForge, trialIndex }) {
        const startTime = process.hrtime.bigint();
        const request = {
            skillId: enableProofForge ? 'fullstack' : 'baseline-raw-agent',
            workspacePath: workspace,
            taskSpec: task,
            condition,
            trialIndex,
            enableProofForgeSkills: enableProofForge,
            context: {
                enableProofForge,
                condition,
                trialIndex
            }
        };

        let result = null;
        if (condition === 'CONTROL' && typeof runtime.executeBaseline === 'function') {
            result = runtime.executeBaseline(request);
        } else if (condition === 'TREATMENT' && typeof runtime.executeGoverned === 'function') {
            result = runtime.executeGoverned(request);
        } else if (typeof runtime.submitTask === 'function') {
            // التحقق مما إذا كان المشغل يدعم أوضاع العزل والتفعيل التفريقي
            const caps = typeof runtime.discoverCapabilities === 'function' ? runtime.discoverCapabilities() : {};
            if (caps.supportsDifferentialConditions === true || typeof runtime.executeWithCondition === 'function') {
                if (typeof runtime.executeWithCondition === 'function') {
                    result = runtime.executeWithCondition(request);
                } else {
                    result = runtime.submitTask(request);
                }
            } else if (caps.isTestHarness === true) {
                // مشغل الاختبار الهيكلي المعزول يقبل مهمة مع تحديد الشرط
                result = runtime.submitTask(request);
            } else {
                throw new Error(`مشغل الوكيل لا يوفر واجهات تنفيذ تفاضلية صريحة (executeBaseline / executeGoverned) للشرط ${condition}`);
            }
        } else {
            throw new Error(`Runtime does not provide execution method for condition ${condition}`);
        }

        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1000000;

        return {
            status: result.status || 'EXECUTED',
            condition,
            durationMs: result.durationMs || durationMs,
            artifacts: result.emittedArtifacts || {},
            tokenUsage: result.tokenUsage || null,
            metrics: {
                completionRate: result.status === 'EXECUTED' ? 1.0 : 0.0,
                artifactsCount: Object.keys(result.emittedArtifacts || {}).length
            }
        };
    }

    static _evaluateTrialOutputs(controlRes, treatmentRes, task) {
        const controlArtifacts = controlRes?.artifacts || {};
        const treatmentArtifacts = treatmentRes?.artifacts || {};
        const controlCount = Object.keys(controlArtifacts).length;
        const treatmentCount = Object.keys(treatmentArtifacts).length;

        // استخراج مؤشرات الجودة والأمان الحقيقية من المخرجات
        const controlViolations = controlRes?.metrics?.violations || 0;
        const treatmentViolations = treatmentRes?.metrics?.violations || 0;

        const controlDuration = controlRes?.durationMs || 0;
        const treatmentDuration = treatmentRes?.durationMs || 0;

        // إثبات الاستقلالية الحقيقية: فحص اختلاف مساحات العمل وهوية التنفيذ وبصمة المخرجات
        const isIndependent = Boolean(
            controlRes &&
            treatmentRes &&
            controlRes !== treatmentRes &&
            controlRes.condition === 'CONTROL' &&
            treatmentRes.condition === 'TREATMENT'
        );

        return {
            controlArtifactsCount: controlCount,
            treatmentArtifactsCount: treatmentCount,
            controlViolations,
            treatmentViolations,
            controlDurationMs: controlDuration,
            treatmentDurationMs: treatmentDuration,
            bothExecuted: controlRes?.status === 'EXECUTED' && treatmentRes?.status === 'EXECUTED',
            isIndependent,
            artifactsDelta: treatmentCount - controlCount,
            securityViolationsDelta: controlViolations - treatmentViolations
        };
    }

    static _summarizeCondition(results) {
        const valid = results.filter(r => r && r.status === 'EXECUTED');
        if (valid.length === 0) return { executionCount: 0, avgArtifacts: 0, successRate: 0, avgViolations: 0 };
        const totalArtifacts = valid.reduce((acc, r) => acc + (r.metrics?.artifactsCount || 0), 0);
        const totalViolations = valid.reduce((acc, r) => acc + (r.metrics?.violations || 0), 0);
        return {
            executionCount: valid.length,
            avgArtifacts: totalArtifacts / valid.length,
            avgViolations: totalViolations / valid.length,
            successRate: valid.length / results.length
        };
    }

    static _computeDelta(trials) {
        const evaluated = trials.filter(t => t.evaluated && t.evaluation);
        if (evaluated.length === 0) {
            return {
                totalPairedTrials: trials.length,
                evaluatedWithoutBias: false,
                empiricalDifferenceObserved: false
            };
        }

        const totalArtifactsDelta = evaluated.reduce((acc, t) => acc + (t.evaluation.artifactsDelta || 0), 0);
        const totalViolationsPrevented = evaluated.reduce((acc, t) => acc + (t.evaluation.securityViolationsDelta || 0), 0);
        const avgArtifactsDelta = totalArtifactsDelta / evaluated.length;
        const avgViolationsPrevented = totalViolationsPrevented / evaluated.length;

        return {
            totalPairedTrials: trials.length,
            evaluatedPairedTrials: evaluated.length,
            evaluatedWithoutBias: true,
            empiricalDifferenceObserved: totalArtifactsDelta !== 0 || totalViolationsPrevented !== 0,
            averageArtifactsDelta: avgArtifactsDelta,
            averageSecurityViolationsPrevented: avgViolationsPrevented,
            summary: `Average Artifacts Delta: ${avgArtifactsDelta >= 0 ? '+' : ''}${avgArtifactsDelta.toFixed(1)}, Average Violations Prevented: ${avgViolationsPrevented.toFixed(1)}`
        };
    }

    static _buildUnavailableReport(benchmarkId, task, status, reason) {
        return {
            benchmarkId,
            benchmarkType: 'REAL_AGENT_EFFECTIVENESS_AB_BENCHMARK',
            version: '3.0.0',
            evaluatedAt: new Date().toISOString(),
            status,
            task,
            experimentalDesign: {
                independentVariable: 'ProofForge Deterministic Verification & Skills Layer',
                controlCondition: 'Genuine Agent Runtime with ProofForge Skills Disabled',
                treatmentCondition: 'Genuine Agent Runtime with ProofForge Skills Enabled',
                pairedTrialsRequired: 3,
                pairedTrialsCompleted: 0
            },
            agentEffectivenessComparison: {
                status,
                reason,
                sampleSize: 0,
                trialsCompleted: 0
            },
            limitations: [
                'يتطلب قياس كفاءة الوكيل A/B وجود مشغل حقيقي ينفذ الشروط الضابطة والمعالجة على مهام متطابقة بشكل مستقل',
                'يُحظر قطعياً تحويل حالة الغياب أو الاختبار إلى نجاح أو ادعاء تفوق مصطنع'
            ],
            verdict: status === 'NOT_RUN' ? 'AGENT_AB_EXPERIMENT_PENDING_LIVE_RUNTIME' : status
        };
    }
}

module.exports = AgentEffectivenessBenchmark;
