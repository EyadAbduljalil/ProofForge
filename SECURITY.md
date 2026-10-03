# Security Policy

## Overview

Security is a foundational pillar of **WebForge OS**. As an AI Engineering Rulebook & Quality Framework, WebForge OS enforces zero-trust architecture, strict input validation, fail-closed boundaries, and cognitive verification against adversarial threats, prompt injection, and evidence poisoning.

We take the security of WebForge OS, its rule definitions, validators, contracts, and core engines seriously.

---

## Supported Versions

Only the latest active version on the primary branch is currently supported for security updates.

| Version | Supported          |
| :------ | :----------------- |
| `1.x`   | :white_check_mark: |
| `< 1.0` | :x:                |

---

## Reporting a Vulnerability

We request and appreciate responsible disclosure for any identified security issues or vulnerabilities.

### Responsible Disclosure Protocol

1. **Do NOT report security vulnerabilities via public GitHub issues, discussions, or pull requests.**
2. **Submit a Private Vulnerability Report**:
   - Navigate to the repository's **Security** tab on GitHub: `Security > Vulnerability reporting > Report a vulnerability`.
   - Provide detailed information including:
     - Component / Module affected (e.g., `packages/security`, `EvidenceGraph`, `GroundingGate`, `UntrustedRepoGuard`).
     - Vulnerability classification (e.g., Prompt Injection, IDOR, Broken Authentication, Fail-Open condition, Evidence Poisoning).
     - Step-by-step reproduction instructions or Proof-of-Concept (PoC).
     - Potential security and operational impact.
     - Any suggested remediation or patch.
3. If GitHub Private Vulnerability Reporting is unavailable, open a confidential draft advisory or contact project maintainers through authenticated repository administration channels. **No third-party or arbitrary personal email addresses are used for vulnerability reporting.**

---

## Vulnerability Handling & Response Process

When a vulnerability report is submitted:

1. **Acknowledgment**: The maintainers will acknowledge receipt of the advisory within **48 hours**.
2. **Triage & Reproduction**: The reported finding will be reproduced, classified (Critical, High, Medium, Low), and its root cause identified within **5 business days**.
3. **Remediation**: A minimal, non-breaking security fix will be prepared and tested against full regression and adversarial verification suites.
4. **Coordinated Disclosure**: A security advisory and patched release will be published once the patch is confirmed. Credit will be given to the reporter (unless anonymity is requested).

---

## Scope & Security Boundaries

### In Scope
- Vulnerabilities in core security modules (`packages/security`, `packages/security-governance`).
- Bypass of cognitive verification gates (`EvidenceGraph`, `ClaimVerificationEngine`, `GroundingGate`, `OutputVerificationEngine`).
- Fail-open vulnerabilities where untrusted inputs improperly bypass validation.
- Prompt injection, evidence tampering, citation spoofing, or tenant isolation bypass.
- Accidental credential exposure or audit log sanitization failures.

### Out of Scope
- Attacks requiring physical access to the local developer machine.
- Theoretical attacks without demonstrable impact or working PoC.
- Vulnerabilities in downstream projects or external platforms using WebForge OS rules (report those to the respective project owners).
- Denial of Service on local developer workstations during intentional stress testing.
