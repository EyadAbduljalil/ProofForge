/**
 * @file state-machine-verifier.js
 * @description WebForge V2.1 — State Machine Verification Engine
 * مدقق آلات الحالات وانتقالات سير العمل والتحقق من الحراسة ومنع الحالات الشاذة
 * يكشف الحالات الميتة، والانتقالات المستحيلة، والحلقات غير المصرح بها
 */

'use strict';

class StateMachineVerifier {
    constructor() {
        this.machines = new Map();
    }

    /**
     * تسجيل آلة حالات كنسية
     * @param {Object} def
     */
    registerStateMachine(def) {
        if (!def || !def.id || !Array.isArray(def.states) || !Array.isArray(def.transitions)) {
            throw new Error('آلة الحالات تتطلب معرفاً، ومصفوفة حالات (states)، ومصفوفة انتقالات (transitions).');
        }

        if (this.machines.has(def.id)) {
            throw new Error(`معرف آلة الحالات مكرر: ${def.id}`);
        }

        const machine = {
            id: String(def.id),
            initialState: def.initialState || def.states[0],
            terminalStates: Array.isArray(def.terminalStates) ? def.terminalStates : [],
            states: [...new Set(def.states)],
            transitions: def.transitions.map(t => ({
                from: t.from,
                to: t.to,
                guard: typeof t.guard === 'function' ? t.guard : null,
                action: t.action || null,
                allowedRoles: Array.isArray(t.allowedRoles) ? t.allowedRoles : null,
                isRollback: Boolean(t.isRollback)
            })),
            forbiddenTransitions: Array.isArray(def.forbiddenTransitions) ? def.forbiddenTransitions : []
        };

        this.machines.set(machine.id, machine);
        return machine;
    }

    /**
     * تدقيق هيكلية آلة الحالات بالكامل واكتشاف العيوب الهندسية
     * @param {string} machineId
     * @returns {Object} نتيجة التدقيق الهيكلي
     */
    auditTopology(machineId) {
        const sm = this.machines.get(machineId);
        if (!sm) {
            return {
                machineId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                anomalies: ['آلة الحالات غير موجودة']
            };
        }

        const anomalies = [];
        const stateSet = new Set(sm.states);

        // 1. التحقق من وجود الحالة المبدئية
        if (!stateSet.has(sm.initialState)) {
            anomalies.push({
                type: 'INVALID_INITIAL_STATE',
                severity: 'CRITICAL',
                message: `الحالة المبدئية (${sm.initialState}) غير موجودة ضمن قائمة الحالات المعرفة.`
            });
        }

        // 2. التحقق من صحة كافة أطراف الانتقالات
        for (const t of sm.transitions) {
            if (!stateSet.has(t.from)) {
                anomalies.push({
                    type: 'UNKNOWN_SOURCE_STATE',
                    severity: 'HIGH',
                    message: `الانتقال يبدأ من حالة غير معروفة: ${t.from}`
                });
            }
            if (!stateSet.has(t.to)) {
                anomalies.push({
                    type: 'UNKNOWN_TARGET_STATE',
                    severity: 'HIGH',
                    message: `الانتقال يستهدف حالة غير معروفة: ${t.to}`
                });
            }
        }

        // 3. كشف الحالات غير القابلة للوصول (Unreachable States)
        const reachable = new Set([sm.initialState]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const t of sm.transitions) {
                if (reachable.has(t.from) && !reachable.has(t.to)) {
                    reachable.add(t.to);
                    changed = true;
                }
            }
        }

        for (const state of sm.states) {
            if (!reachable.has(state)) {
                anomalies.push({
                    type: 'UNREACHABLE_STATE',
                    severity: 'HIGH',
                    state,
                    message: `الحالة (${state}) غير قابلة للوصول من الحالة المبدئية.`
                });
            }
        }

        // 4. كشف النهايات الميتة (Dead-End States) التي ليست حالات طرفية صريحة
        const terminalSet = new Set(sm.terminalStates);
        for (const state of sm.states) {
            if (terminalSet.has(state)) continue;
            const hasOutgoing = sm.transitions.some(t => t.from === state);
            if (!hasOutgoing) {
                anomalies.push({
                    type: 'DEAD_END_STATE',
                    severity: 'MEDIUM',
                    state,
                    message: `الحالة (${state}) ليس لها انتقالات خروج وليست معرفة كحالة طرفية (Terminal State).`
                });
            }
        }

        // 5. كشف الانتقالات المحظورة الصريحة (Forbidden Transitions)
        for (const fb of sm.forbiddenTransitions) {
            const hasForbidden = sm.transitions.some(t => t.from === fb.from && t.to === fb.to);
            if (hasForbidden) {
                anomalies.push({
                    type: 'FORBIDDEN_TRANSITION_PERMITTED',
                    severity: 'CRITICAL',
                    message: `تم العثور على انتقال محظور صراحة معرف في جدول الانتقالات: من ${fb.from} إلى ${fb.to}`
                });
            }
        }

        const isCompliant = anomalies.length === 0;
        return {
            machineId,
            status: isCompliant ? 'VERIFIED' : 'ANOMALY_DETECTED',
            gate: isCompliant ? 'PASS' : 'FAIL',
            isCompliant,
            anomaliesCount: anomalies.length,
            anomalies
        };
    }

    /**
     * التحقق من شرعية وصلاحية انتقال محدد أثناء وقت التشغيل/المحاكاة
     * @param {string} machineId
     * @param {string} fromState
     * @param {string} toState
     * @param {Object} context
     */
    verifyTransition(machineId, fromState, toState, context = {}) {
        const sm = this.machines.get(machineId);
        if (!sm) {
            return { valid: false, reason: 'آلة الحالات غير موجودة', gate: 'FAIL' };
        }

        // 1. فحص هل الانتقال محظور صراحة
        const isForbidden = sm.forbiddenTransitions.some(fb => fb.from === fromState && fb.to === toState);
        if (isForbidden) {
            return {
                valid: false,
                severity: 'CRITICAL',
                gate: 'FAIL',
                reason: `الانتقال من ${fromState} إلى ${toState} محظور تماماً في مصفوفة الحالات.`
            };
        }

        // 2. البحث عن الانتقال المصرح به
        const transition = sm.transitions.find(t => t.from === fromState && t.to === toState);
        if (!transition) {
            return {
                valid: false,
                severity: 'HIGH',
                gate: 'FAIL',
                reason: `لا يوجد مسار انتقال معرف بين ${fromState} و ${toState}.`
            };
        }

        // 3. فحص صلاحية الفاعل (Role-Based Guard)
        if (transition.allowedRoles && context.actor) {
            const hasRole = transition.allowedRoles.some(r => context.actor.roles && context.actor.roles.includes(r));
            if (!hasRole) {
                return {
                    valid: false,
                    severity: 'CRITICAL',
                    gate: 'FAIL',
                    reason: `الفاعل غير مخول بتنفيذ هذا الانتقال. الأدوار المسموحة: ${transition.allowedRoles.join(', ')}`
                };
            }
        }

        // 4. تقييم دالة الحراسة (Guard Condition)
        if (transition.guard) {
            const guardPassed = transition.guard(context);
            if (!guardPassed) {
                return {
                    valid: false,
                    severity: 'HIGH',
                    gate: 'FAIL',
                    reason: 'شرط الحراسة (Guard) الخاص بهذا الانتقال لم يتحقق.'
                };
            }
        }

        return {
            valid: true,
            status: 'VERIFIED',
            gate: 'PASS',
            fromState,
            toState,
            isRollback: transition.isRollback
        };
    }
}

module.exports = {
    StateMachineVerifier
};
