import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

describe('Phase 4A: Engineering & Security Framework Verification', () => {
  const engineeringDir = path.join(rootDir, '04-ENGINEERING');
  const securityDir = path.join(rootDir, '05-SECURITY');

  it('should verify that 04-ENGINEERING directory and all required files exist', () => {
    assert.ok(fs.existsSync(engineeringDir), '04-ENGINEERING directory must exist');

    const requiredEngFiles = [
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

    for (const relPath of requiredEngFiles) {
      const fullPath = path.join(engineeringDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Engineering file missing: ${relPath}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.length > 50, `Engineering file too short: ${relPath}`);
    }
  });

  it('should verify that 05-SECURITY directory and all required files exist', () => {
    assert.ok(fs.existsSync(securityDir), '05-SECURITY directory must exist');

    const requiredSecFiles = [
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
      'schemas/THREAT_MODEL_SCHEMA.md'
    ];

    for (const relPath of requiredSecFiles) {
      const fullPath = path.join(securityDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Security file missing: ${relPath}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.length > 50, `Security file too short: ${relPath}`);
    }
  });

  it('should validate JSON schemas embedded in schema definition markdown files', () => {
    const schemaFiles = [
      path.join(engineeringDir, 'schemas/ENGINEERING_RULE_SCHEMA.md'),
      path.join(securityDir, 'schemas/SECURITY_FINDING_SCHEMA.md'),
      path.join(securityDir, 'schemas/THREAT_MODEL_SCHEMA.md')
    ];

    for (const schemaFile of schemaFiles) {
      const content = fs.readFileSync(schemaFile, 'utf8');
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      assert.ok(jsonMatch, `Schema file must contain JSON code block: ${schemaFile}`);
      const parsed = JSON.parse(jsonMatch[1]);
      assert.ok(parsed.$schema || parsed.title, `Valid schema JSON required in ${schemaFile}`);
      assert.equal(parsed.type, 'object');
      assert.ok(Array.isArray(parsed.required), 'Required fields array must be present');
    }
  });

  it('should verify critical security principles across security files', () => {
    const secPrinciples = fs.readFileSync(path.join(securityDir, 'principles/SECURITY_PRINCIPLES.md'), 'utf8');
    assert.match(secPrinciples, /Default Deny/i, 'Must enforce Default Deny principle');
    assert.match(secPrinciples, /Zero Trust/i, 'Must enforce Zero Trust architecture');
    assert.match(secPrinciples, /Least Privilege/i, 'Must enforce Least Privilege principle');

    const authSpec = fs.readFileSync(path.join(securityDir, 'authentication/AUTHENTICATION_SPEC.md'), 'utf8');
    assert.match(authSpec, /Argon2id|bcrypt/i, 'Must specify approved password hashing algorithms');
    assert.match(authSpec, /MFA|TOTP/i, 'Must cover Multi-Factor Authentication');

    const authzSpec = fs.readFileSync(path.join(securityDir, 'authorization/AUTHORIZATION_SPEC.md'), 'utf8');
    assert.match(authzSpec, /IDOR|BOLA/i, 'Must address IDOR / BOLA defense');
    assert.match(authzSpec, /Ownership/i, 'Must enforce ownership validation');

    const webSec = fs.readFileSync(path.join(securityDir, 'web/WEB_SECURITY.md'), 'utf8');
    assert.match(webSec, /Strict-Transport-Security|HSTS/i, 'Must enforce HSTS');
    assert.match(webSec, /CORS/i, 'Must specify CORS rules');

    const secretsDoc = fs.readFileSync(path.join(securityDir, 'secrets/SECRETS_MANAGEMENT.md'), 'utf8');
    assert.match(secretsDoc, /Hardcoded/i, 'Must prohibit hardcoded secrets');
  });

  it('should verify stack-agnostic posture and rule-engine alignment', () => {
    const engReadme = fs.readFileSync(path.join(engineeringDir, 'README.md'), 'utf8');
    const secReadme = fs.readFileSync(path.join(securityDir, 'README.md'), 'utf8');

    assert.match(engReadme, /Stack-Agnostic/i, 'Engineering framework must be stack-agnostic');
    assert.match(secReadme, /Stack-Agnostic/i, 'Security framework must be stack-agnostic');
  });
});
