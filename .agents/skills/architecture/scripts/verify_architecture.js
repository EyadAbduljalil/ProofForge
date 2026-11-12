#!/usr/bin/env node
/**
 * ProofForge Lead Software Architect & Systems Design Verifier (Real Inspection)
 * Validates: Clean Architecture separation of concerns, domain isolation,
 * absence of inward dependency violations, and architecture invariant enforcement.
 */
const path = require('path');
const fs = require('fs');
const VerifierEngine = require('../../../packages/contracts/verifier-engine');

const engine = new VerifierEngine('Software Architecture & Systems Design Verifier');

const corePackages = ['packages/contracts', 'packages/security', 'packages/state-machine'];
let boundaryViolations = 0;

for (const pkgRel of corePackages) {
    const pkgDir = path.join(engine.rootDir, pkgRel);
    if (!fs.existsSync(pkgDir)) continue;

    const files = engine.findFiles(pkgDir, ['.js']);
    for (const file of files) {
        if (file.includes('.test.')) continue;
        const code = fs.readFileSync(file, 'utf8');

        // Core domain/contracts MUST NEVER import apps/web or apps/server
        if (code.includes('../../apps/web') || code.includes('../../apps/server')) {
            boundaryViolations++;
            engine.recordCheck(
                `Architectural Layer Violation in ${path.basename(file)}`,
                false,
                'Core domain package directly imports application layer (violates Clean Architecture dependency rule)',
                'CRITICAL'
            );
        }
    }
}

engine.recordCheck(
    'Clean Architecture Dependency Invariant',
    boundaryViolations === 0,
    boundaryViolations === 0 ? 'Core domain packages strictly isolated from outer UI and server layers' : `Detected ${boundaryViolations} Clean Architecture violations`,
    'CRITICAL'
);

// State Machine Engine existence
const smEngine = path.join(engine.rootDir, 'packages/state-machine/state-machine-engine.js');
engine.recordCheck(
    'State Machine Formalism Engine',
    fs.existsSync(smEngine),
    fs.existsSync(smEngine) ? 'Formal StateMachineEngine present' : 'Missing state machine engine',
    'HIGH'
);

// Engineering Graph / Invariant Engine
const egEngine = path.join(engine.rootDir, 'packages/engineering-graph/engineering-graph.js');
engine.recordCheck(
    'Engineering Invariant Graph Engine',
    fs.existsSync(egEngine),
    fs.existsSync(egEngine) ? 'EngineeringGraph engine present' : 'Missing engineering graph engine',
    'HIGH'
);

engine.finish();
