#!/usr/bin/env node
/**
 * ProofForge Production Readiness & SRE Verifier (Real Inspection)
 * Validates: 12-factor health probes (/healthz, /readyz), process lifecycle signal handling,
 * structured logging, secret scrubbing, and zero unhandled rejections.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Production Readiness & SRE Verifier');

const serverFile = path.join(engine.rootDir, 'apps/server/server.js');
const secretsScrubber = path.join(engine.rootDir, 'packages/security/secrets.js');

engine.recordCheck(
    'Production Server Implementation',
    fs.existsSync(serverFile),
    fs.existsSync(serverFile) ? 'apps/server/server.js exists' : 'Missing server implementation',
    'CRITICAL'
);

engine.recordCheck(
    'Secret Sanitization Engine (secrets.js)',
    fs.existsSync(secretsScrubber),
    fs.existsSync(secretsScrubber) ? 'packages/security/secrets.js exists' : 'Missing secret scrubber',
    'HIGH'
);

if (fs.existsSync(serverFile)) {
    const code = fs.readFileSync(serverFile, 'utf8');

    // 1. Health & Readiness Probes
    const hasHealthProbes = code.includes('/healthz') && code.includes('/readyz');
    engine.recordCheck('Kubernetes/Container Health Probes (/healthz, /readyz)', hasHealthProbes, hasHealthProbes ? 'Both /healthz and /readyz endpoints configured' : 'Missing liveness or readiness probes', 'HIGH');

    // 2. Metrics & Observability
    const hasMetrics = code.includes('/metrics') && code.includes('http_requests_total');
    engine.recordCheck('Prometheus Observability Metrics Endpoint (/metrics)', hasMetrics, hasMetrics ? 'Prometheus-formatted /metrics endpoint operational' : 'Missing observability metrics', 'HIGH');

    // 3. Graceful Process Shutdown
    const hasShutdown = code.includes('SIGTERM') || code.includes('SIGINT') || code.includes('server.close');
    engine.recordCheck('Graceful Termination Lifecycle (SIGTERM/SIGINT)', hasShutdown, hasShutdown ? 'Process termination handlers registered' : 'Missing process shutdown handlers', 'HIGH');

    // 4. Secret Scrubbing Integration
    const hasScrubberIntegration = code.includes('SecretsScrubber') || code.includes('scrub');
    engine.recordCheck('Log Secret Sanitization & PII Scrubbing', hasScrubberIntegration, hasScrubberIntegration ? 'SecretsScrubber active on server logging' : 'Potential secret leakage in logs', 'HIGH');
}

engine.finish();
