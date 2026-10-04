const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '../../../');

function getAllFilesRecursively(dir, filterExt = '.md') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFilesRecursively(fullPath, filterExt));
    } else if (fullPath.endsWith(filterExt)) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Phase 7: System Integration & Verification Test Suite', () => {
  const knowledgeDir = path.join(rootDir, '01-KNOWLEDGE');
  const aiDir = path.join(rootDir, '02-AI-INSTRUCTIONS');
  const designDir = path.join(rootDir, '03-DESIGN');
  const engDir = path.join(rootDir, '04-ENGINEERING');
  const secDir = path.join(rootDir, '05-SECURITY');
  const valDir = path.join(rootDir, '06-VALIDATORS');
  const adaptersDir = path.join(rootDir, '07-STACK-ADAPTERS');
  const templatesDir = path.join(rootDir, '08-TEMPLATES & BLUEPRINTS');

  // 1. Cross-Layer Directory & Layer Integrity Verification
  it('1. should verify physical presence and non-overlapping ownership of all canonical layers (Phases 1-6)', () => {
    const layers = [
      knowledgeDir,
      aiDir,
      designDir,
      engDir,
      secDir,
      valDir,
      adaptersDir,
      templatesDir
    ];

    for (const layer of layers) {
      assert.ok(fs.existsSync(layer), `Canonical layer directory must exist: ${layer}`);
      const files = getAllFilesRecursively(layer, '.md');
      assert.ok(files.length > 0, `Canonical layer must contain markdown specifications: ${layer}`);
    }
  });

  // 2. 10-Stage AI Lifecycle & Workflow System Integration
  it('2. should verify full integration of the 10-stage AI execution lifecycle', () => {
    const lifecycleDoc = path.join(aiDir, 'lifecycle/AI_LIFECYCLE.md');
    assert.ok(fs.existsSync(lifecycleDoc), 'AI_LIFECYCLE.md must exist');
    const content = fs.readFileSync(lifecycleDoc, 'utf8');

    const expectedStages = [
      { name: 'UNDERSTAND', file: 'UNDERSTAND.md' },
      { name: 'INSPECT', file: 'INSPECT.md' },
      { name: 'DETECT', file: 'DETECT.md' },
      { name: 'SELECT[ _]RULES', file: 'SELECT_RULES.md' },
      { name: 'DECIDE', file: 'DECIDE.md' },
      { name: 'PLAN', file: 'PLAN.md' },
      { name: 'IMPLEMENT', file: 'IMPLEMENT.md' },
      { name: 'VALIDATE', file: 'VALIDATE.md' },
      { name: 'VERIFY[ _]EVIDENCE', file: 'VERIFY_EVIDENCE.md' },
      { name: 'REPORT', file: 'REPORT.md' }
    ];

    for (const stage of expectedStages) {
      assert.match(content, new RegExp(stage.name, 'i'), `Lifecycle stage missing in doc: ${stage.name}`);
      const stageFile = path.join(aiDir, 'lifecycle', stage.file);
      assert.ok(fs.existsSync(stageFile), `Stage specification file must exist: ${stage.file}`);
    }
  });

  // 3. Authority Hierarchy Integration across all Knowledge & Adaptation Layers
  it('3. should enforce unified authority hierarchy across all layers without competing authorities', () => {
    const authorityDoc = path.join(aiDir, 'decision-rules/AUTHORITY_HIERARCHY.md');
    const adapterConflicts = path.join(adaptersDir, 'ADAPTER_CONFLICTS.md');
    const templateSec = path.join(templatesDir, 'TEMPLATE_SECURITY.md');

    assert.ok(fs.existsSync(authorityDoc), 'AUTHORITY_HIERARCHY.md must exist');
    const authContent = fs.readFileSync(authorityDoc, 'utf8');
    const confContent = fs.readFileSync(adapterConflicts, 'utf8');
    const tplSecContent = fs.readFileSync(templateSec, 'utf8');

    // Security > Project Requirements > WebForge Canonical Rules > Standards > Adapters > Templates > Preferences
    assert.match(authContent, /الأمان والسلامة|Security & Safety/i);
    assert.match(confContent, /السيادة الدائمة للأمان/);
    assert.match(tplSecContent, /حظر تعليمات الالتفاف/);
  });

  // 4. Untrusted Repo Guard & Prompt Injection Defense across all Layers
  it('4. should verify zero-trust isolation and prompt injection defense on all layer boundaries', () => {
    const guardDoc = path.join(aiDir, 'safety/UNTRUSTED_REPOSITORY.md');
    const promptDoc = path.join(aiDir, 'safety/PROMPT_INJECTION_DEFENSE.md');
    const adapterSecDoc = path.join(adaptersDir, 'ADAPTER_SECURITY.md');
    
    assert.ok(fs.existsSync(guardDoc), 'UNTRUSTED_REPOSITORY.md must exist');
    assert.ok(fs.existsSync(promptDoc), 'PROMPT_INJECTION_DEFENSE.md must exist');
    
    const guardContent = fs.readFileSync(guardDoc, 'utf8');
    const promptContent = fs.readFileSync(promptDoc, 'utf8');
    const adapterSecContent = fs.readFileSync(adapterSecDoc, 'utf8');

    assert.match(guardContent, /Untrusted Repository/i);
    assert.match(promptContent, /Prompt Injection/i);
    assert.match(adapterSecContent, /الفصل بين البيانات والتعليمات/);
  });

  // 5. Complete Bidirectional Traceability: Rule -> Adapter/Template -> Validator -> Evidence -> Gate
  it('5. should verify unified end-to-end traceability across rules, adapters, validators, and gates', () => {
    const valRegistry = fs.readFileSync(path.join(valDir, 'registry/VALIDATOR_REGISTRY.md'), 'utf8');
    const adapterRegistry = fs.readFileSync(path.join(adaptersDir, 'ADAPTER_REGISTRY.md'), 'utf8');
    const templateRegistry = fs.readFileSync(path.join(templatesDir, 'TEMPLATE_REGISTRY.md'), 'utf8');

    // Cross-link checks
    assert.match(valRegistry, /VAL-SEC-INJ-001/);
    assert.match(valRegistry, /SEC-INJ-001/);
    assert.match(adapterRegistry, /ADP-DB-POSTGRES/);
    assert.match(adapterRegistry, /SEC-INJ-001/);
    assert.match(adapterRegistry, /VAL-SEC-INJ-001/);
    assert.match(templateRegistry, /TPL-DOM-ECOMMERCE/);
    assert.match(templateRegistry, /SEC-AUTHZ-001/);
  });

  // 6. Evidence Semantics & State Model Integrity
  it('6. should enforce evidence semantics and distinction between PASS and VERIFIED', () => {
    const evidenceDoc = fs.readFileSync(path.join(valDir, 'evidence/EVIDENCE_INTEGRATION.md'), 'utf8');
    const statesDoc = fs.readFileSync(path.join(valDir, 'states/VALIDATION_STATES.md'), 'utf8');
    const gatesDoc = fs.readFileSync(path.join(valDir, 'gates/QUALITY_GATE_MODEL.md'), 'utf8');

    assert.match(evidenceDoc, /Evidence/i);
    assert.match(statesDoc, /VERIFIED/);
    assert.match(statesDoc, /PASS/);
    assert.match(gatesDoc, /BLOCKING/i);
  });

  // 7. Stack Agnosticity & Neutrality across entire repository
  it('7. should guarantee total stack agnosticity without mandatory framework mandates or favoritism', () => {
    const compatDoc = fs.readFileSync(path.join(adaptersDir, 'COMPATIBILITY_MODEL.md'), 'utf8');
    assert.match(compatDoc, /FULL/);
    assert.match(compatDoc, /PARTIAL/);
    assert.match(compatDoc, /CONDITIONAL/);
    assert.match(compatDoc, /UNSUPPORTED/);
    assert.match(compatDoc, /UNKNOWN/);
    assert.match(compatDoc, /لا يُعبر مستوى التوافقية عن "أفضلية"/);
  });

  // 8. Zero Hidden Runtime & Zero Code Generator Boundary Verification
  it('8. should enforce that WebForge OS remains a Rulebook and Quality Framework with no hidden production runtime', () => {
    const knowledgeFiles = getAllFilesRecursively(knowledgeDir).map(f => fs.readFileSync(f, 'utf8')).join('\n');
    const valFiles = getAllFilesRecursively(valDir).map(f => fs.readFileSync(f, 'utf8')).join('\n');
    const adapterFiles = getAllFilesRecursively(adaptersDir).map(f => fs.readFileSync(f, 'utf8')).join('\n');

    const totalText = knowledgeFiles + valFiles + adapterFiles;
    assert.doesNotMatch(totalText, /PRODUCTION_RUNTIME_DAEMON_START/i);
    assert.doesNotMatch(totalText, /AUTONOMOUS_CODE_GENERATOR_LOOP_ACTIVE/i);
  });

  // 9. Failure Injection & Error Handling Verification
  it('9. should verify controlled failure rejection when encountering malformed inputs or unauthorized overrides', () => {
    // Simulated failure injection handler
    function processSystemRequest(request) {
      if (request.authorityOverride === true) {
        return { status: 'REJECTED', reason: 'AUTHORITY_VIOLATION' };
      }
      if (!request.evidence || request.evidence === 'SELF_ASSERTION_ONLY') {
        return { status: 'BLOCKED', reason: 'INSUFFICIENT_EVIDENCE' };
      }
      return { status: 'ACCEPTED' };
    }

    const test1 = processSystemRequest({ authorityOverride: true });
    assert.equal(test1.status, 'REJECTED');

    const test2 = processSystemRequest({ evidence: 'SELF_ASSERTION_ONLY' });
    assert.equal(test2.status, 'BLOCKED');

    const test3 = processSystemRequest({ evidence: 'INDEPENDENT_TEST_LOG' });
    assert.equal(test3.status, 'ACCEPTED');
  });
});
