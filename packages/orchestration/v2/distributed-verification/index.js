/**
 * @file index.js
 * @description WebForge V2.2 — Canonical Data, API & Distributed Systems Verification Layer
 * نقطة التصدير الموحدة لمحركات التحقق من البيانات والـ APIs والأنظمة الموزعة لـ V2.2
 */

'use strict';

const { DataIntegrityVerifier } = require('./data-integrity-verifier');
const { ApiContractVerifier } = require('./api-contract-verifier');
const { EventMessageVerifier } = require('./event-message-verifier');
const { WebhookVerifier } = require('./webhook-verifier');
const { DistributedWorkflowVerifier } = require('./distributed-workflow-verifier');

module.exports = {
    // 1. Data Integrity, Database Contracts & Migrations
    DataIntegrityVerifier,

    // 2. API Contracts, Breaking Changes & Versioning
    ApiContractVerifier,

    // 3. Events, Messages, Queue Policies & DLQ
    EventMessageVerifier,

    // 4. Webhooks, Signatures & Anti-Replay
    WebhookVerifier,

    // 5. Distributed Sagas, Workflows & External Integrations
    DistributedWorkflowVerifier
};
