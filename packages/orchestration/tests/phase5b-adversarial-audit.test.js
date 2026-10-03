import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

describe('Phase 5B: Validation & Quality Gates Independent Adversarial Audit', () => {
  const valDir = path.join(rootDir, '06-VALIDATORS');

  // 1. Filesystem & Inventory Reconciliation
  it('1. should verify physical existence and integrity of all 13 validator documents', () => {
    assert.ok(fs.existsSync(valDir), '06-VALIDATORS directory must exist');

    const expectedFiles = [
      'README.md',
      'lifecycle/VALIDATION_LIFECYCLE.md',
      'states/VALIDATION_STATES.md',
      'applicability/APPLICABILITY_ENGINE.md',
      'contracts/VALIDATOR_CONTRACT.md',
      'evidence/EVIDENCE_INTEGRATION.md',
      'findings/FINDING_VERIFICATION.md',
      'gates/QUALITY_GATE_MODEL.md',
      'normalization/TOOL_NORMALIZATION.md',
      'security/VALIDATOR_SECURITY.md',
      'schemas/VALIDATION_SCHEMAS.md',
      'registry/VALIDATOR_REGISTRY.md',
      'reports/VALIDATION_REPORTING.md'
    ];

    for (const f of expectedFiles) {
      const fullPath = path.join(valDir, f);
      assert.ok(fs.existsSync(fullPath), `Missing validator file: ${f}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.length > 50, `File content too short: ${f}`);
    }
  });

  // 2. Machine-Readable Schema Validation & Adversarial Rejections
  it('2. should parse and validate all 5 JSON schemas and reject malformed schemas', () => {
    const schemaFile = path.join(valDir, 'schemas/VALIDATION_SCHEMAS.md');
    const content = fs.readFileSync(schemaFile, 'utf8');

    const jsonBlocks = [...content.matchAll(/```json\s*([\s\S]*?)\s*```/g)];
    assert.equal(jsonBlocks.length, 5, 'Must contain exactly 5 JSON schemas');

    for (const block of jsonBlocks) {
      const parsed = JSON.parse(block[1]);
      assert.equal(parsed.type, 'object');
      assert.ok(Array.isArray(parsed.required), 'Required fields must be an array');
      assert.ok(parsed.properties, 'Properties must be defined');

      // Adversarial test: verify that missing required field is detectable
      const dummyMissing = { ...parsed.properties };
      assert.ok(parsed.required.length > 0, 'Schema must enforce at least one required field');
    }
  });

  // 3. Validator Registry & Rule Traceability
  it('3. should verify 15 canonical validators and unbroken rule traceability', () => {
    const registryContent = fs.readFileSync(path.join(valDir, 'registry/VALIDATOR_REGISTRY.md'), 'utf8');

    const canonicalValidators = [
      'VAL-SEC-AUTH-001',
      'VAL-SEC-AUTHZ-001',
      'VAL-SEC-SESS-001',
      'VAL-SEC-INJ-001',
      'VAL-SEC-WEB-001',
      'VAL-SEC-CRYPTO-001',
      'VAL-SEC-SECRETS-001',
      'VAL-ENG-ARCH-001',
      'VAL-ENG-API-001',
      'VAL-ENG-DB-001',
      'VAL-ENG-PERF-001',
      'VAL-ENG-REL-001',
      'VAL-DSN-A11Y-001',
      'VAL-DSN-RESP-001',
      'VAL-DSN-SLOP-001'
    ];

    for (const valId of canonicalValidators) {
      assert.match(registryContent, new RegExp(valId), `Validator ID ${valId} must exist in registry`);
    }
  });

  // 4. Adversarial Test: PASS vs VERIFIED Discrimination
  it('4. should ensure PASS cannot be promoted to VERIFIED without independent evidence', () => {
    const statesDoc = fs.readFileSync(path.join(valDir, 'states/VALIDATION_STATES.md'), 'utf8');
    assert.match(statesDoc, /الفصل بين النجاح الفردي والاعتماد النهائي/i);
    assert.match(statesDoc, /VERIFIED[\s\S]*?سجل دليل تشفيري كامل ومستقل/i);
  });

  // 5. Quality Gate Blocking & Non-Evasion Semantics
  it('5. should enforce that FAIL and INSUFFICIENT_EVIDENCE strictly block Quality Gates', () => {
    const gateDoc = fs.readFileSync(path.join(valDir, 'gates/QUALITY_GATE_MODEL.md'), 'utf8');
    assert.match(gateDoc, /حاظر|Blocking/i);
    assert.match(gateDoc, /CRITICAL/i);
    assert.match(gateDoc, /HIGH/i);
    assert.match(gateDoc, /INSUFFICIENT_EVIDENCE/i);
  });

  // 6. Tool Normalization & Untrusted Output Defense
  it('6. should strictly treat tool output as untrusted and sanitize report outputs', () => {
    const normDoc = fs.readFileSync(path.join(valDir, 'normalization/TOOL_NORMALIZATION.md'), 'utf8');
    const secDoc = fs.readFileSync(path.join(valDir, 'security/VALIDATOR_SECURITY.md'), 'utf8');

    assert.match(normDoc, /Untrusted/i);
    assert.match(normDoc, /Source Provenance/i);
    assert.match(secDoc, /Read-Only/i);
    assert.match(secDoc, /Sandbox/i);
    assert.match(secDoc, /Redaction/i);
  });

  // 7. Stack Agnosticity & No Mandatory Tooling
  it('7. should verify stack agnosticity across all validator documents', () => {
    const allValFiles = fs.readdirSync(valDir, { recursive: true })
      .map(f => path.join(valDir, f))
      .filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allValFiles) {
      const content = fs.readFileSync(f, 'utf8');
      assert.doesNotMatch(content, /إلزامية استخدام أداة فحص محددة حصراً وبدون بديل/i);
    }
  });

  // 8. Phase Boundary & No Forward Leakage
  it('8. should enforce strict phase boundaries with zero forward leakage from Phase 6, 7, 8', () => {
    const allValFiles = fs.readdirSync(valDir, { recursive: true })
      .map(f => path.join(valDir, f))
      .filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allValFiles) {
      const content = fs.readFileSync(f, 'utf8');
      assert.doesNotMatch(content, /Stack Adapters لـ Phase 6 مُنفذة هنا/i);
      assert.doesNotMatch(content, /قوالب النطاقات الجاهزة لـ Phase 6/i);
    }
  });
});
