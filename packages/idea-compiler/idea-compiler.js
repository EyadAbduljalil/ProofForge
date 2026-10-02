/**
 * @file idea-compiler.js
 * @description محرك استكشاف وتجميع الأفكار وهندسة المتطلبات وتوليد حزم التنفيذ لـ WebForge OS
 * WebForge OS Idea Compiler & Project Intake Engine
 */

class IdeaCompiler {
    constructor() {
        this.context = {
            idea: '',
            problem: '',
            solution: '',
            targetUsers: [],
            roles: [],
            features: [],
            businessRules: [],
            stateMachines: [],
            dataEntities: [],
            securityRequirements: [],
            uxPreferences: {},
            assumptions: [],
            unknowns: [],
            contradictions: [],
            decisions: []
        };
    }

    /**
     * تحليل الفكرة المبدئية واستخراج النواقص والتناقضات
     * @param {Object} rawInput 
     * @returns {Object} نتيجة التحليل المبدئي
     */
    analyzeInitialIdea(rawInput = {}) {
        this.context.idea = rawInput.idea || 'UNKNOWN';
        this.context.problem = rawInput.problem || 'UNKNOWN';
        this.context.solution = rawInput.solution || 'UNKNOWN';

        // 1. كشف الأدوار والمستخدمين
        if (rawInput.roles && Array.isArray(rawInput.roles)) {
            this.context.roles = rawInput.roles;
        } else {
            this.context.unknowns.push({
                field: 'roles',
                impact: 'BLOCKING',
                question: 'ما هي أنواع وأدوار المستخدمين في النظام؟ (مثال: عميل، بائع، مشرف)'
            });
        }

        // 2. كشف التناقضات (Contradiction Detection)
        if (rawInput.noAuthRequired === true && rawInput.hasPersonalDashboard === true) {
            this.context.contradictions.push({
                type: 'AUTH_CONTRADICTION',
                message: 'تم تحديد النظام كـ (بدون تسجيل دخول) مع طلب (لوحة تحكم شخصية لكل مستخدم).'
            });
        }

        // 3. كشف الميزات الأساسية
        if (rawInput.features && Array.isArray(rawInput.features)) {
            this.context.features = rawInput.features.map(f => ({
                name: f.name || f,
                priority: f.priority || 'MUST',
                acceptanceCriteria: f.criteria || 'Given valid input When executed Then expect success response.'
            }));
        } else {
            this.context.unknowns.push({
                field: 'features',
                impact: 'BLOCKING',
                question: 'ما هي الميزات الأساسية الثلاث الأولى التي يجب توفرها في المنتج؟'
            });
        }

        return {
            status: this.context.contradictions.length > 0 ? 'CONTRADICTIONS_DETECTED' : (this.context.unknowns.some(u => u.impact === 'BLOCKING') ? 'NEEDS_CLARIFICATION' : 'READY_TO_COMPILE'),
            unknownsCount: this.context.unknowns.length,
            contradictionsCount: this.context.contradictions.length,
            context: this.context
        };
    }

    /**
     * تجميع الفكرة والمواصفة إلى حزمة تنفيذية نهائية موحدة (WebForge Execution Package)
     * @returns {Object} مواصفة المشروع وحزمة التنفيذ
     */
    compileToExecutionPackage() {
        if (this.context.contradictions.length > 0) {
            throw new Error(`Cannot compile idea with active contradictions: ${this.context.contradictions.map(c => c.message).join(' | ')}`);
        }

        const projectSpec = {
            title: `WebForge OS Project Specification: ${this.context.idea.substring(0, 30)}`,
            compiledAt: new Date().toISOString(),
            problem: this.context.problem,
            solution: this.context.solution,
            roles: this.context.roles.length > 0 ? this.context.roles : ['user', 'admin'],
            features: this.context.features,
            governance: {
                securityLevel: 'P0_MANDATORY_ASVS_L2',
                authority: 'WEBFORGE_CONSTITUTION',
                mode: 'STRICT'
            }
        };

        const executionPackageText = `
================================================================================
⚡ WEBFORGE EXECUTION PACKAGE (COPY EVERYTHING BELOW)
================================================================================
PROJECT CONTEXT:
  Idea: ${this.context.idea}
  Problem: ${this.context.problem}
  Solution: ${this.context.solution}

AUTHORITATIVE REQUIREMENTS:
  Roles: ${projectSpec.roles.join(', ')}
  Features:
${projectSpec.features.map(f => `    - [${f.priority}] ${f.name} (Acceptance: ${f.acceptanceCriteria})`).join('\n')}

GOVERNANCE DIRECTIVE:
  - Do not reinterpret confirmed requirements.
  - Do not invent missing APIs or libraries.
  - Enforce WebForge Constitution and Zero-Trust Security controls.
  - Execute full verification pipeline (Build -> Test -> Security -> A11y -> Performance).
================================================================================
`;

        return {
            projectSpecification: projectSpec,
            executionPackage: executionPackageText.trim()
        };
    }
}

module.exports = IdeaCompiler;
