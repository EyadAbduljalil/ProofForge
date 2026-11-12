# ProofForge Security Matrix & ASVS Level 2 Standard

## 1. Attack Vectors & Mitigations
| Threat Category | Severity | Exploit Scenario | Enforced Control |
|---|:---:|---|---|
| **IDOR / BOLA** | P0 Critical | Modifying query ID parameter to access another tenant's record | Mandatory `tenantId` & `userId` ownership query condition |
| **SQLi / NoSQLi** | P0 Critical | Injecting syntax via raw concatenation into query | Parameterized queries or strongly-typed ORM query builders |
| **Stored / Reflected XSS** | P0 High | Injecting `<script>` or event handlers into user profile | Contextual output encoding + strict Content-Security-Policy |
| **SSRF** | P0 Critical | Passing internal IP (`169.254.169.254`, `127.0.0.1`) to webhook | Fail-closed IP resolution block on private & loopback ranges |
| **Race Conditions** | P0 High | Double-spending or concurrent voucher redemption | Atomic transactions / distributed locking / idempotency keys |
| **Mass Assignment** | P0 High | Sending `isAdmin: true` in user update JSON payload | Strict DTO validation whitelist (Zod / Joi) stripping extra keys |
| **Broken Auth / Session** | P0 High | Predictable session IDs, unrotated refresh tokens | Cryptographic CSPRNG tokens, short lifetimes, rotation on refresh |

## 2. Invariant Rules
- Every mutating endpoint must validate CSRF tokens or use SameSite=Strict cookies.
- Constant-time comparison (`crypto.timingSafeEqual`) must be used for HMACs and sensitive token verification.
- Passwords must be hashed using Argon2id or Scrypt with appropriate cost parameters.
