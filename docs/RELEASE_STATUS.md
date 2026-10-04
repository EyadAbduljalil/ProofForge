# ProofForge Release Status

**Current release gate:** RELEASE READY WITH LIMITATIONS

## Verified

- Clean install with npm ci
- npm audit: 0 known vulnerabilities in the audited dependency state
- npm run integrity
- npm run proofforge
- Full regression: 276/276 tests passed
- Contract, security, hardening, CVGF, and independent-trial verification
- GitHub Actions workflow configured for Node.js 18/20/22
- Machine-readable verification through webforge verify --json

## Limitations

- Direct cloud execution of GitHub Actions cannot be independently confirmed from the current execution environment.
- The independent project trial is bounded and local rather than a distributed production deployment.
- Prompt-injection defenses are bounded by tested attack families and cannot guarantee protection against every future novel technique.

## Trust Boundary

AI_CLAIMED != CODE_CHANGED != TEST_PASSED != EVIDENCE_EXISTS != PROOFFORGE_VERIFIED

Passing tests establish evidence for the tested scope; they do not prove the absence of all undiscovered defects.

## Release Verification Commands

~~~bash
npm ci
npm audit --audit-level=high
npm run integrity
npm run proofforge
npm test
~~~
