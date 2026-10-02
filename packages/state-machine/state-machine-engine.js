/**
 * @file state-machine-engine.js
 * @description محرك آلات الحالة المحددة والتحقق من الانتقالات والحراس والتراجع
 * WebForge OS State Machine Engine
 */

class StateMachineEngine {
    /**
     * @param {Object} config تكوين آلة الحالة
     * {
     *   initialState: 'PENDING',
     *   states: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'CANCELLED'],
     *   transitions: {
     *     'PENDING': ['PAID', 'CANCELLED'],
     *     'PAID': ['PROCESSING', 'CANCELLED'],
     *     'PROCESSING': ['SHIPPED'],
     *     'SHIPPED': [],
     *     'CANCELLED': []
     *   },
     *   guards: { 'PENDING->PAID': (context) => context.paymentVerified === true }
     * }
     */
    constructor(config) {
        this.initialState = config.initialState;
        this.currentState = config.initialState;
        this.states = new Set(config.states);
        this.transitions = config.transitions || {};
        this.guards = config.guards || {};
        this.history = [{ state: this.currentState, timestamp: new Date().toISOString() }];
    }

    /**
     * تنفيذ انتقال آمن بين الحالات مع فحص القواعد والحراس
     * @param {string} nextState 
     * @param {Object} context 
     * @returns {Object} نتيجة الانتقال
     */
    transition(nextState, context = {}) {
        if (!this.states.has(nextState)) {
            throw new Error(`محظور: الحالة الهدف '${nextState}' غير معرفة في آلة الحالة.`);
        }

        const allowedNextStates = this.transitions[this.currentState] || [];
        if (!allowedNextStates.includes(nextState)) {
            throw new Error(`محظور: الانتقال غير قانوني من '${this.currentState}' إلى '${nextState}'. الانتقالات المسموحة: [${allowedNextStates.join(', ')}]`);
        }

        // فحص الحارس (Guard Condition)
        const transitionKey = `${this.currentState}->${nextState}`;
        const guardFn = this.guards[transitionKey];
        if (guardFn && typeof guardFn === 'function') {
            const guardPassed = guardFn(context);
            if (!guardPassed) {
                throw new Error(`محظور: فشل شرط الأمان (Guard) للانتقال من '${this.currentState}' إلى '${nextState}'.`);
            }
        }

        const previousState = this.currentState;
        this.currentState = nextState;
        this.history.push({ state: nextState, timestamp: new Date().toISOString(), from: previousState });

        return {
            success: true,
            from: previousState,
            to: nextState,
            historyLength: this.history.length
        };
    }

    /**
     * التراجع إلى الحالة السابقة في حال فشل العمليات التابعة
     */
    rollback() {
        if (this.history.length <= 1) {
            throw new Error('لا توجد حالة سابقة للتراجع إليها.');
        }

        this.history.pop();
        const previous = this.history[this.history.length - 1];
        this.currentState = previous.state;

        return {
            rolledBackTo: this.currentState,
            historyLength: this.history.length
        };
    }
}

module.exports = StateMachineEngine;
