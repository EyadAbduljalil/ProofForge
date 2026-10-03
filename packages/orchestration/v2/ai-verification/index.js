/**
 * @file index.js
 * @description WebForge V2.3 — Canonical AI / LLM Verification & Security Layer
 * نقطة التصدير الموحدة لمحركات ونماذج فحص وأمان نظم الذكاء الاصطناعي لـ V2.3
 */

'use strict';

const { TRUST_LEVELS, AiProfileBoundaryVerifier } = require('./ai-profile-boundary');
const { PromptContextVerifier } = require('./prompt-context-verifier');
const { ToolCallVerifier } = require('./tool-call-verifier');
const { RagCitationVerifier } = require('./rag-citation-verifier');
const { HitlDecisionTracer } = require('./hitl-decision-tracer');

module.exports = {
    // 1. Profile, Trust Boundary & Instruction Hierarchy
    TRUST_LEVELS,
    AiProfileBoundaryVerifier,

    // 2. Prompt Injection & Context Integrity
    PromptContextVerifier,

    // 3. Tool Calling & Output Boundary
    ToolCallVerifier,

    // 4. RAG, Citation & Provenance
    RagCitationVerifier,

    // 5. Human-in-the-Loop & Multi-Agent Delegation
    HitlDecisionTracer
};
