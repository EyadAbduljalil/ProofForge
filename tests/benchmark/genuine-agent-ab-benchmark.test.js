/**
 * @file genuine-agent-ab-benchmark.test.js
 * @description اختبارات التحقق من بنية معيار مقارنة كفاءة الوكلاء A/B التجريبية الحقيقية
 * (ProofForge Genuine Agent A/B Benchmark Test Suite)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const os = require('os');
const fs = require('fs');
const AgentEffectivenessBenchmark = require('../../packages/maturity-benchmark/agent-effectiveness-benchmark');
const { ControlledTestRuntimeAdapter } = require('../../packages/orchestration/agent-runtime-provider');

console.log('======================================================');
console.log('🧪 ProofForge — Genuine Agent A/B Benchmark Tests');
console.log('======================================================');

const tempSandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-ab-test-'));

try {
    // ----------------------------------------------------
    // اختبار 1: غياب مشغل الوكيل يُرجع NOT_RUN أو AGENT_AB_BENCHMARK_UNAVAILABLE صراحة
    // ----------------------------------------------------
    console.log('>>> [1/7] Testing Missing Runtime Returns NOT_RUN / Unavailable Status...');
    const noRuntimeReport = AgentEffectivenessBenchmark.runComparison({ agentRuntime: null });
    assert(noRuntimeReport.status === 'NOT_RUN' || noRuntimeReport.status === 'AGENT_AB_BENCHMARK_UNAVAILABLE');
    assert(noRuntimeReport.agentEffectivenessComparison.status === 'NOT_RUN' || noRuntimeReport.agentEffectivenessComparison.status === 'AGENT_AB_BENCHMARK_UNAVAILABLE');
    assert(noRuntimeReport.limitations.length > 0);
    console.log('  [PASS] 1. Missing runtime handled strictly without mock fabrication');

    // ----------------------------------------------------
    // اختبار 2: مشغل الاختبار الهيكلي (ControlledTestRuntimeAdapter) يُرفض كدليل كفاءة لوكيل حقيقي
    // ----------------------------------------------------
    console.log('>>> [2/7] Testing Test-Harness Runtime Rejection as Evidence...');
    const testHarness = new ControlledTestRuntimeAdapter();
    const harnessReport = AgentEffectivenessBenchmark.runComparison({ agentRuntime: testHarness });
    assert.strictEqual(harnessReport.status, 'AGENT_AB_BENCHMARK_UNAVAILABLE');
    assert(harnessReport.agentEffectivenessComparison.reason.includes('cannot be accepted as evidence'));
    console.log('  [PASS] 2. Test-harness cannot manufacture real agent effectiveness claims');

    // ----------------------------------------------------
    // اختبار 3: تنفيذ المقارنة المزدوجة المستقلة (Condition A vs Condition B) عند السماح باختبار الواجهة
    // ----------------------------------------------------
    console.log('>>> [3/7] Testing Independent Paired Trials Execution with Protocol Checks...');
    let controlExecuted = false;
    let treatmentExecuted = false;

    const mockDualAgentRuntime = {
        name: 'MockDualAgentProtocolRuntime',
        discoverCapabilities: () => ({ providerName: 'MockDualAgentProtocolRuntime', isLive: true, isTestHarness: false }),
        executeBaseline: (req) => {
            controlExecuted = true;
            assert.strictEqual(req.condition, 'CONTROL');
            assert.strictEqual(req.enableProofForgeSkills, false);
            return {
                status: 'EXECUTED',
                durationMs: 120,
                emittedArtifacts: { 'RAW_OUTPUT': { size: 100 } }
            };
        },
        executeGoverned: (req) => {
            treatmentExecuted = true;
            assert.strictEqual(req.condition, 'TREATMENT');
            assert.strictEqual(req.enableProofForgeSkills, true);
            return {
                status: 'EXECUTED',
                durationMs: 140,
                emittedArtifacts: { 'ADR_DOCUMENT': { path: 'ADR-001.md' }, 'PROOF_GRAPH': { verified: true } }
            };
        }
    };

    const pairedReport = AgentEffectivenessBenchmark.runComparison({
        agentRuntime: mockDualAgentRuntime,
        trialsCount: 3,
        workspaceRoot: path.join(tempSandbox, 'paired-runs')
    });

    assert.strictEqual(pairedReport.status, 'COMPLETED');
    assert.strictEqual(controlExecuted, true);
    assert.strictEqual(treatmentExecuted, true);
    assert.strictEqual(pairedReport.agentEffectivenessComparison.pairedTrialsCount, 3);
    assert.strictEqual(pairedReport.agentEffectivenessComparison.completedTrialsCount, 3);
    assert.strictEqual(pairedReport.trials.length, 3);
    console.log('  [PASS] 3. Paired trials executed with full isolation and protocol adherence');

    // ----------------------------------------------------
    // اختبار 4: عزل مساحات العمل ومنع تسرب المخرجات بين الشرطين
    // ----------------------------------------------------
    console.log('>>> [4/7] Testing Workspace Isolation Between Control and Treatment...');
    for (const trial of pairedReport.trials) {
        assert(trial.isolatedWorkspaces.control !== trial.isolatedWorkspaces.treatment);
        assert(trial.isolatedWorkspaces.control.includes('control'));
        assert(trial.isolatedWorkspaces.treatment.includes('treatment'));
    }
    console.log('  [PASS] 4. Workspaces completely isolated between conditions');

    // ----------------------------------------------------
    // اختبار 5: التكوين التجريبي غير الصالح يُسجل INVALID_EXPERIMENT
    // ----------------------------------------------------
    console.log('>>> [5/7] Testing Invalid Experimental Configuration Flagging...');
    const invalidReport = AgentEffectivenessBenchmark.runComparison({
        agentRuntime: mockDualAgentRuntime,
        invalidExperimentReason: 'Models differed between Condition A (model-X) and Condition B (model-Y)'
    });
    assert.strictEqual(invalidReport.status, 'INVALID_EXPERIMENT');
    assert.strictEqual(invalidReport.agentEffectivenessComparison.status, 'INVALID_EXPERIMENT');
    console.log('  [PASS] 5. Invalid experiment correctly flagged');

    // ----------------------------------------------------
    // اختبار 6: معالجة الإخفاقات الجزئية وتسجيل PARTIALLY_COMPLETED
    // ----------------------------------------------------
    console.log('>>> [6/7] Testing Partial Execution Handling...');
    let callCount = 0;
    const partialRuntime = {
        name: 'PartialFailureRuntime',
        discoverCapabilities: () => ({ isLive: true, isTestHarness: false }),
        executeBaseline: () => ({ status: 'EXECUTED', emittedArtifacts: {} }),
        executeGoverned: () => {
            callCount++;
            if (callCount === 2) {
                throw new Error('Simulated runtime timeout on trial 2');
            }
            return { status: 'EXECUTED', emittedArtifacts: {} };
        }
    };

    const partialReport = AgentEffectivenessBenchmark.runComparison({
        agentRuntime: partialRuntime,
        trialsCount: 3,
        workspaceRoot: path.join(tempSandbox, 'partial-runs')
    });

    assert.strictEqual(partialReport.status, 'PARTIALLY_COMPLETED');
    assert.strictEqual(partialReport.agentEffectivenessComparison.completedTrialsCount, 2);
    console.log('  [PASS] 6. Partial execution recorded accurately as PARTIALLY_COMPLETED');

    // ----------------------------------------------------
    // اختبار 7: حظر تحويل NOT_RUN أو الغياب إلى PASS دون إثبات
    // ----------------------------------------------------
    console.log('>>> [7/7] Testing Prohibition of Converting NOT_RUN to PASS...');
    const defaultReport = AgentEffectivenessBenchmark.runComparison();
    assert.notStrictEqual(defaultReport.status, 'PASS');
    assert.notStrictEqual(defaultReport.status, 'COMPLETED');
    assert(defaultReport.status === 'AGENT_AB_BENCHMARK_UNAVAILABLE' || defaultReport.status === 'NOT_RUN');
    console.log('  [PASS] 7. Unexecuted benchmark strictly blocked from reporting success');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All 7 Genuine Agent A/B Benchmark Tests PASSED 100%.');
    console.log('======================================================');
} finally {
    try { fs.rmSync(tempSandbox, { recursive: true, force: true }); } catch (_) {}
}
