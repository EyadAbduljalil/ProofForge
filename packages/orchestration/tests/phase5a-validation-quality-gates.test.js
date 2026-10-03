import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

describe('Phase 5A: Validation & Quality Gates Verification', () => {
  const valDir = path.join(rootDir, '06-VALIDATORS');

  // 1. Filesystem & Artifact Inventory
  it('1. should verify that 06-VALIDATORS directory and all required files exist', () => {
    assert.ok(fs.existsSync(valDir), '06-VALIDATORS directory must exist');

    const requiredFiles = [
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

    for (const relPath of requiredFiles) {
      const fullPath = path.join(valDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Missing validator file: ${relPath}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.length > 50, `File too short: ${relPath}`);
    }
  });

  // 2. Schema Validation (All 5 Schemas in VALIDATION_SCHEMAS.md)
  it('2. should validate all 5 JSON schemas in VALIDATION_SCHEMAS.md', () => {
    const schemaFile = path.join(valDir, 'schemas/VALIDATION_SCHEMAS.md');
    const content = fs.readFileSync(schemaFile, 'utf8');

    const jsonBlocks = [...content.matchAll(/```json\s*([\s\S]*?)\s*```/g)];
    assert.equal(jsonBlocks.length, 5, 'Must contain exactly 5 JSON schemas');

    const titles = [];
    for (const block of jsonBlocks) {
      const parsed = JSON.parse(block[1]);
      assert.equal(parsed.type, 'object');
      assert.ok(Array.isArray(parsed.required), 'Required fields array must be present');
      assert.ok(parsed.properties, 'Properties object must be present');
      titles.push(parsed.title);
    }

    assert.ok(titles.includes('WebForgeValidationResult'));
    assert.ok(titles.includes('WebForgeValidatorContract'));
    assert.ok(titles.includes('WebForgeQualityGate'));
    assert.ok(titles.includes('WebForgeValidationReport'));
    assert.ok(titles.includes('WebForgeEvidenceReference'));
  });

  // 3. Validation States & Semantics
  it('3. should verify canonical 8 validation states and their blocking behavior', () => {
    const statesDoc = fs.readFileSync(path.join(valDir, 'states/VALIDATION_STATES.md'), 'utf8');

    const expectedStates = [
      'PASS',
      'VERIFIED',
      'FAIL',
      'WARNING',
      'NOT_APPLICABLE',
      'ENVIRONMENT_LIMITATION',
      'NOT_TESTED',
      'INSUFFICIENT_EVIDENCE'
    ];

    for (const state of expectedStates) {
      assert.match(statesDoc, new RegExp(state, 'i'), `State ${state} must be defined`);
    }

    assert.match(statesDoc, /FAIL[\s\S]*?Blocking/i, 'FAIL must be blocking');
    assert.match(statesDoc, /INSUFFICIENT_EVIDENCE[\s\S]*?Blocking/i, 'INSUFFICIENT_EVIDENCE must be blocking for security');
  });

  // 4. Applicability & Non-Evasion Rules
  it('4. should enforce strict applicability rules and forbid evidence omission evasion', () => {
    const appDoc = fs.readFileSync(path.join(valDir, 'applicability/APPLICABILITY_ENGINE.md'), 'utf8');

    assert.match(appDoc, /حظر التحايل بحذف الأدلة/i);
    assert.match(appDoc, /INSUFFICIENT_EVIDENCE/i);
    assert.match(appDoc, /NOT_APPLICABLE/i);
  });

  // 5. Tool Normalization & Provenance
  it('5. should enforce tool result normalization and untrusted output handling', () => {
    const normDoc = fs.readFileSync(path.join(valDir, 'normalization/TOOL_NORMALIZATION.md'), 'utf8');

    assert.match(normDoc, /Source Provenance|أصل البيانات/i);
    assert.match(normDoc, /Untrusted/i);
    assert.match(normDoc, /تجريد|تنقية/i);
  });

  // 6. Security Boundaries for Validators
  it('6. should enforce read-only and sandboxed execution constraints on validators', () => {
    const secDoc = fs.readFileSync(path.join(valDir, 'security/VALIDATOR_SECURITY.md'), 'utf8');
    const contractDoc = fs.readFileSync(path.join(valDir, 'contracts/VALIDATOR_CONTRACT.md'), 'utf8');

    assert.match(secDoc, /Read-Only/i);
    assert.match(secDoc, /Sandbox/i);
    assert.match(secDoc, /Untrusted Repository Guard/i);
    assert.match(contractDoc, /read_only/i);
    assert.match(contractDoc, /network_access/i);
  });

  // 7. Negative & Adversarial Tests
  it('7. should pass adversarial negative tests (rejecting unsafe validation behaviors)', () => {
    const allValFiles = fs.readdirSync(valDir, { recursive: true })
      .map(f => path.join(valDir, f))
      .filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allValFiles) {
      const content = fs.readFileSync(f, 'utf8');
      // No claim that tool output alone without verification is sufficient
      assert.doesNotMatch(content, /اعتبار مخرجات الأداة دليلاً كافياً دون فحص/i);
      // No claim that agent can silently waive security rules
      assert.doesNotMatch(content, /السماح للوكيل بتجاوز القواعد الأمنية تلقائياً/i);
    }
  });

  // 8. Phase Boundary Audit
  it('8. should preserve strict phase boundaries without premature Phase 6 domain templates', () => {
    const allValFiles = fs.readdirSync(valDir, { recursive: true })
      .map(f => path.join(valDir, f))
      .filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allValFiles) {
      const content = fs.readFileSync(f, 'utf8');
      assert.doesNotMatch(content, /محرك محولات المكدس الخاص بـ Phase 6/i);
      assert.doesNotMatch(content, /قوالب التطبيقات الجاهزة لـ Phase 6 مُنفذة هنا/i);
    }
  });
});
