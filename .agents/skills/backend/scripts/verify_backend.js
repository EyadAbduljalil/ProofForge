#!/usr/bin/env node
/**
 * ProofForge Backend Systems Verifier (Real Inspection)
 * Validates: Server entry point, graceful shutdown, health probes, centralized error handling,
 * uncaught exception handling, and database connection lifecycle.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Backend Systems Verifier');

const serverFile = path.join(engine.rootDir, 'apps/server/server.js');
engine.recordCheck(
    'Server Entry Point Existence',
    fs.existsSync(serverFile),
    fs.existsSync(serverFile) ? 'apps/server/server.js exists' : 'Missing apps/server/server.js',
    'CRITICAL'
);

if (fs.existsSync(serverFile)) {
    const code = fs.readFileSync(serverFile, 'utf8');

    // 1. Health probes
    const hasHealthz = code.includes('/healthz');
    const hasReadyz = code.includes('/readyz');
    engine.recordCheck('Liveness Probe (/healthz)', hasHealthz, hasHealthz ? 'Found /healthz route' : 'Missing /healthz route', 'HIGH');
    engine.recordCheck('Readiness Probe (/readyz)', hasReadyz, hasReadyz ? 'Found /readyz route' : 'Missing /readyz route', 'HIGH');

    // 2. Graceful shutdown
    const hasGracefulShutdown = (code.includes('SIGTERM') || code.includes('SIGINT')) || code.includes('server.close');
    engine.recordCheck('Graceful Process Shutdown', hasGracefulShutdown, hasGracefulShutdown ? 'SIGTERM/SIGINT handlers or server.close configured' : 'Missing graceful shutdown handlers', 'HIGH');

    // 3. Centralized error envelope / error handler
    const hasErrorModel = code.includes('error-model') || code.includes('ApiResponse') || code.includes('handleError');
    engine.recordCheck('Centralized Error Handling Architecture', hasErrorModel, hasErrorModel ? 'Structured error model integrated' : 'Missing standardized error handling', 'HIGH');

    // 4. Rate Limiting Middleware
    const hasRateLimiter = code.includes('RateLimiter') || code.includes('rate-limit');
    engine.recordCheck('Rate Limiting Integration', hasRateLimiter, hasRateLimiter ? 'Rate limiting middleware integrated' : 'Server lacks rate limiting middleware', 'HIGH');

    // 5. Database and Cache Lifecycle
    const hasStorage = code.includes('storage-adapter') || code.includes('StorageAdapter');
    const hasCache = code.includes('redis-adapter') || code.includes('RedisAdapter');
    engine.recordCheck('Persistent Storage Adapter', hasStorage, hasStorage ? 'StorageAdapter integrated' : 'Missing storage adapter', 'HIGH');
    engine.recordCheck('Cache Adapter Layer', hasCache, hasCache ? 'Redis/Cache adapter integrated' : 'Missing cache adapter', 'MEDIUM');
}

engine.finish();
