import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

describe('Phase 4B: Engineering & Security Adversarial Audit & Semantic Verification', () => {
  const engDir = path.join(rootDir, '04-ENGINEERING');
  const secDir = path.join(rootDir, '05-SECURITY');

  // 1. Filesystem & Inventory Integrity
  it('1. should verify complete engineering and security filesystem reconciliation', () => {
    assert.ok(fs.existsSync(engDir), '04-ENGINEERING must exist');
    assert.ok(fs.existsSync(secDir), '05-SECURITY must exist');

    const engFiles = [
      'README.md',
      'architecture/ARCHITECTURE_ENGINEERING.md',
      'frontend/FRONTEND_ENGINEERING.md',
      'backend/BACKEND_ENGINEERING.md',
      'api/API_ENGINEERING.md',
      'database/DATABASE_ENGINEERING.md',
      'state/STATE_ENGINEERING.md',
      'concurrency/CONCURRENCY_ENGINEERING.md',
      'caching/CACHING_ENGINEERING.md',
      'queues/QUEUES_ENGINEERING.md',
      'transactions/TRANSACTIONS_ENGINEERING.md',
      'errors/ERROR_ENGINEERING.md',
      'configuration/CONFIGURATION_ENGINEERING.md',
      'observability/OBSERVABILITY_GUIDANCE.md',
      'testing/TESTING_ENGINEERING.md',
      'performance/PERFORMANCE_ENGINEERING.md',
      'reliability/RELIABILITY_ENGINEERING.md',
      'patterns/ENGINEERING_PATTERNS.md',
      'anti-patterns/ENGINEERING_ANTIPATTERNS.md',
      'references/ENGINEERING_REFERENCES.md',
      'schemas/ENGINEERING_RULE_SCHEMA.md'
    ];

    const secFiles = [
      'README.md',
      'principles/SECURITY_PRINCIPLES.md',
      'authentication/AUTHENTICATION_SPEC.md',
      'authorization/AUTHORIZATION_SPEC.md',
      'sessions/SESSION_SECURITY.md',
      'input-validation/INPUT_VALIDATION.md',
      'output-encoding/OUTPUT_ENCODING.md',
      'injection/INJECTION_DEFENSE_TAXONOMY.md',
      'web/WEB_SECURITY.md',
      'api/API_SECURITY.md',
      'data/DATA_PROTECTION.md',
      'cryptography/CRYPTOGRAPHY_STANDARDS.md',
      'secrets/SECRETS_MANAGEMENT.md',
      'files/FILE_UPLOAD_SECURITY.md',
      'supply-chain/SUPPLY_CHAIN_SECURITY.md',
      'dependencies/DEPENDENCY_SECURITY.md',
      'business-logic/BUSINESS_LOGIC_SECURITY.md',
      'ai-security/AI_AGENT_SECURITY.md',
      'repository-security/REPOSITORY_SECURITY.md',
      'threat-modeling/THREAT_MODELING_GUIDE.md',
      'security-boundaries/TRUST_BOUNDARIES.md',
      'patterns/SECURITY_PATTERNS.md',
      'anti-patterns/SECURITY_ANTIPATTERNS.md',
      'references/OWASP_ASVS_REFERENCES.md',
      'schemas/SECURITY_FINDING_SCHEMA.md',
      'schemas/THREAT_MODEL_SCHEMA.md',
      'schemas/SECURITY_RULE_SCHEMA.md',
      'schemas/SECURITY_EVIDENCE_SCHEMA.md'
    ];

    for (const f of engFiles) {
      assert.ok(fs.existsSync(path.join(engDir, f)), `Missing engineering file: ${f}`);
    }
    for (const f of secFiles) {
      assert.ok(fs.existsSync(path.join(secDir, f)), `Missing security file: ${f}`);
    }
  });

  // 2. Schema Reconciliation & Structural Integrity (All 5 Canonical Schemas)
  it('2. should validate all 5 canonical engineering and security JSON schemas', () => {
    const schemas = [
      path.join(engDir, 'schemas/ENGINEERING_RULE_SCHEMA.md'),
      path.join(secDir, 'schemas/SECURITY_RULE_SCHEMA.md'),
      path.join(secDir, 'schemas/THREAT_MODEL_SCHEMA.md'),
      path.join(secDir, 'schemas/SECURITY_FINDING_SCHEMA.md'),
      path.join(secDir, 'schemas/SECURITY_EVIDENCE_SCHEMA.md')
    ];

    for (const schemaFile of schemas) {
      const content = fs.readFileSync(schemaFile, 'utf8');
      const jsonBlock = content.match(/```json\s*([\s\S]*?)\s*```/);
      assert.ok(jsonBlock, `Schema JSON block missing in ${schemaFile}`);
      const parsed = JSON.parse(jsonBlock[1]);
      assert.equal(parsed.type, 'object');
      assert.ok(Array.isArray(parsed.required), `required array missing in ${schemaFile}`);
      assert.ok(parsed.properties, `properties missing in ${schemaFile}`);
    }
  });

  // 3. Stack Agnosticity & Neutrality
  it('3. should verify stack agnosticity across engineering and security frameworks', () => {
    const allFiles = [
      ...fs.readdirSync(engDir, { recursive: true }).map(f => path.join(engDir, f)),
      ...fs.readdirSync(secDir, { recursive: true }).map(f => path.join(secDir, f))
    ].filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allFiles) {
      const content = fs.readFileSync(f, 'utf8');
      // No unconditional framework mandates
      assert.doesNotMatch(content, /إلزامية استخدام (React|Express|PostgreSQL|Redis|Docker) حصراً وبدون بديل/i, `Violates stack-neutrality: ${f}`);
    }
  });

  // 4. Adversarial & Negative Security Tests
  it('4. should fail if dangerous or insecure security guidance is present (Negative Tests)', () => {
    const allSecFiles = fs.readdirSync(secDir, { recursive: true })
      .map(f => path.join(secDir, f))
      .filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allSecFiles) {
      const content = fs.readFileSync(f, 'utf8');

      // Prohibit advocating plaintext storage
      assert.doesNotMatch(content, /تخزين كلمات المرور كنص صريح موصى به/i, `Unsafe plaintext password found in ${f}`);
      assert.doesNotMatch(content, /حفظ الأسرار في الشيفرة المصدرية/i, `Hardcoded secrets advocacy found in ${f}`);

      // Prohibit client-side only authorization
      assert.doesNotMatch(content, /الاكتفاء بفحص الصلاحيات في واجهة المستخدم/i, `Client-side auth advocacy found in ${f}`);

      // Prohibit MD5/SHA1 as secure password hash
      assert.doesNotMatch(content, /MD5 كخوارزمية تجزئة معتمدة لكلمات المرور/i, `Insecure hash recommendation in ${f}`);
    }
  });

  // 5. Authentication & Hashing Semantics
  it('5. should enforce modern password hashing, MFA, and user-enumeration mitigation', () => {
    const authSpec = fs.readFileSync(path.join(secDir, 'authentication/AUTHENTICATION_SPEC.md'), 'utf8');
    assert.match(authSpec, /Argon2id/i);
    assert.match(authSpec, /bcrypt/i);
    assert.match(authSpec, /TOTP|FIDO2|WebAuthn/i);
    assert.match(authSpec, /Rate Limit/i);
    assert.match(authSpec, /اسم المستخدم أو كلمة المرور غير صحيحة/i, 'Must unify authentication error messages');
  });

  // 6. Authorization & BOLA/IDOR Mitigation
  it('6. should enforce strict server-side authorization and ownership validation', () => {
    const authzSpec = fs.readFileSync(path.join(secDir, 'authorization/AUTHORIZATION_SPEC.md'), 'utf8');
    assert.match(authzSpec, /RBAC|ABAC|ReBAC/i);
    assert.match(authzSpec, /BOLA|IDOR/i);
    assert.match(authzSpec, /Resource Ownership/i);
    assert.match(authzSpec, /Default Deny/i);
  });

  // 7. Sessions & JWT Governance
  it('7. should enforce cookie security attributes and JWT token rotation', () => {
    const sessionDoc = fs.readFileSync(path.join(secDir, 'sessions/SESSION_SECURITY.md'), 'utf8');
    assert.match(sessionDoc, /HttpOnly/i);
    assert.match(sessionDoc, /Secure/i);
    assert.match(sessionDoc, /SameSite/i);
    assert.match(sessionDoc, /Refresh Token Rotation/i);
    assert.match(sessionDoc, /alg: none/i);
  });

  // 8. Injection Defense Taxonomy & Contextual Encoding
  it('8. should comprehensively classify SQLi, Command Injection, XSS, SSRF, and XXE', () => {
    const injDoc = fs.readFileSync(path.join(secDir, 'injection/INJECTION_DEFENSE_TAXONOMY.md'), 'utf8');
    assert.match(injDoc, /SQL Injection|SQLi/i);
    assert.match(injDoc, /Parameterized Queries|Prepared Statements/i);
    assert.match(injDoc, /Command Injection/i);
    assert.match(injDoc, /Cross-Site Scripting|XSS/i);
    assert.match(injDoc, /SSRF/i);
    assert.match(injDoc, /169\.254\.169\.254/i);
    assert.match(injDoc, /XXE/i);
  });

  // 9. Web Security, CORS & CSRF Defense
  it('9. should enforce security headers and strictly prohibit wildcard CORS with credentials', () => {
    const webSec = fs.readFileSync(path.join(secDir, 'web/WEB_SECURITY.md'), 'utf8');
    assert.match(webSec, /Strict-Transport-Security|HSTS/i);
    assert.match(webSec, /X-Content-Type-Options/i);
    assert.match(webSec, /X-Frame-Options/i);
    assert.match(webSec, /Access-Control-Allow-Origin: \*/i);
    assert.match(webSec, /Access-Control-Allow-Credentials: true/i);
    assert.match(webSec, /خرق أمني|محظور/i);
  });

  // 10. Cryptographic Rigor & Constant-Time Verification
  it('10. should differentiate hashing from encryption and require constant-time comparisons', () => {
    const cryptoDoc = fs.readFileSync(path.join(secDir, 'cryptography/CRYPTOGRAPHY_STANDARDS.md'), 'utf8');
    assert.match(cryptoDoc, /AES-256-GCM/i);
    assert.match(cryptoDoc, /CSPRNG/i);
    assert.match(cryptoDoc, /timingSafeEqual|Constant-Time/i);
    assert.match(cryptoDoc, /DES|RC4|MD5/i);
  });

  // 11. AI Agent Security & Repository Governance Alignment
  it('11. should align AI Agent security with Phase 2 and repository guards', () => {
    const aiSec = fs.readFileSync(path.join(secDir, 'ai-security/AI_AGENT_SECURITY.md'), 'utf8');
    const repoSec = fs.readFileSync(path.join(secDir, 'repository-security/REPOSITORY_SECURITY.md'), 'utf8');

    assert.match(aiSec, /Prompt Injection/i);
    assert.match(aiSec, /Tool Sandboxing|Least Privilege/i);
    assert.match(repoSec, /Signed Commits|Branch Protection/i);
  });

  // 12. Threat Modeling & Multi-Topology Trust Boundaries
  it('12. should ground threat modeling in STRIDE and flexible trust boundaries', () => {
    const tmDoc = fs.readFileSync(path.join(secDir, 'threat-modeling/THREAT_MODELING_GUIDE.md'), 'utf8');
    const tbDoc = fs.readFileSync(path.join(secDir, 'security-boundaries/TRUST_BOUNDARIES.md'), 'utf8');

    assert.match(tmDoc, /STRIDE/i);
    assert.match(tmDoc, /Spoofing|Tampering|Repudiation|Information Disclosure|Denial of Service|Elevation of Privilege/i);
    assert.match(tbDoc, /Trust Boundary/i);
  });

  // 13. Phase Boundaries & No Forward Leakage
  it('13. should ensure no forward implementation leakage from Phase 5, 6, 7, 8', () => {
    const allFiles = [
      ...fs.readdirSync(engDir, { recursive: true }).map(f => path.join(engDir, f)),
      ...fs.readdirSync(secDir, { recursive: true }).map(f => path.join(secDir, f))
    ].filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allFiles) {
      const content = fs.readFileSync(f, 'utf8');
      assert.doesNotMatch(content, /نظام الفحص البصري التلقائي لـ Phase 5 قيد التشغيل الفعلي/i);
      assert.doesNotMatch(content, /قوالب النطاقات الجاهزة لـ Phase 6 مُنفذة هنا/i);
    }
  });
});
