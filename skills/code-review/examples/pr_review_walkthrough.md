# ProofForge Adversarial Code Review Walkthrough Example

## Scenario: Pull Request Modifying Payment Webhook Handler

### 1. Inbound Diff Inspection
```diff
- const isVerified = crypto.timingSafeEqual(expectedBuf, receivedBuf);
+ const isVerified = (expectedSignature === receivedSignature);
```

### 2. Adversarial Finding
- **Severity:** HIGH
- **Vulnerability:** Timing Attack on Webhook Signature Comparison (CWE-208).
- **Explanation:** Replacing `timingSafeEqual` with strict equality `===` leaks timing differences byte-by-byte, allowing signature forgery.

### 3. Remediation
Revert to constant-time comparison using `crypto.timingSafeEqual`.
