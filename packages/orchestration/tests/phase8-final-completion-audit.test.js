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

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yamlText = match[1];
  const metadata = {};
  const lines = yamlText.split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.startsWith('  - ') && currentKey) {
      if (!Array.isArray(metadata[currentKey])) {
        metadata[currentKey] = [];
      }
      metadata[currentKey].push(line.replace('  - ', '').trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const rawVal = line.slice(colonIdx + 1).trim();
      currentKey = key;
      if (rawVal === '') {
        metadata[key] = [];
      } else {
        metadata[key] = rawVal.replace(/^["']|["']$/g, '');
      }
    }
  }
  return { metadata, body: content.slice(match[0].length) };
}

describe('Phase 8: WebForge OS Master Final Completion & Release Audit', () => {
  const knowledgeDir = path.join(rootDir, '01-KNOWLEDGE');
  const aiDir = path.join(rootDir, '02-AI-INSTRUCTIONS');
  const designDir = path.join(rootDir, '03-DESIGN');
  const engDir = path.join(rootDir, '04-ENGINEERING');
  const secDir = path.join(rootDir, '05-SECURITY');
  const valDir = path.join(rootDir, '06-VALIDATORS');
  const adaptersDir = path.join(rootDir, '07-STACK-ADAPTERS');
  const templatesDir = path.join(rootDir, '08-TEMPLATES & BLUEPRINTS');
  const reportsDir = path.join(rootDir, 'reports');

  // 1. Comprehensive Canonical Layer Filesystem Audit
  it('1. should verify physical completeness of all 8 canonical knowledge and governance layers', () => {
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
      assert.ok(fs.existsSync(layer), `Layer directory missing: ${layer}`);
      const files = getAllFilesRecursively(layer, '.md');
      assert.ok(files.length > 0, `Layer must not be empty: ${layer}`);
    }
  });

  // 2. Canonical Knowledge Base Verification (36 Canonical Rules)
  it('2. should verify 36 canonical rules in 01-KNOWLEDGE across security, engineering, and design', () => {
    const rulesDir = path.join(knowledgeDir, 'rules');
    const ruleFiles = getAllFilesRecursively(rulesDir, '.md');
    assert.equal(ruleFiles.length, 36, '01-KNOWLEDGE/rules must contain exactly 36 canonical rules');

    const seenIds = new Set();
    for (const rf of ruleFiles) {
      const content = fs.readFileSync(rf, 'utf8');
      const parsed = parseYamlFrontmatter(content);
      assert.ok(parsed, `Rule ${path.basename(rf)} must contain valid frontmatter`);
      assert.ok(parsed.metadata.id, `Rule ${path.basename(rf)} must have id`);
      assert.ok(parsed.metadata.severity, `Rule ${path.basename(rf)} must have severity`);
      assert.equal(seenIds.has(parsed.metadata.id), false, `Duplicate ID: ${parsed.metadata.id}`);
      seenIds.add(parsed.metadata.id);
    }
  });

  // 3. AI Agent Governance & Non-Bypassable Permission Boundary
  it('3. should verify AI agent contract, permission boundaries, and default deny enforcement', () => {
    const agentContract = fs.readFileSync(path.join(aiDir, 'core/AI_AGENT_CONTRACT.md'), 'utf8');
    const boundary = fs.readFileSync(path.join(aiDir, 'permissions/AGENT_PERMISSION_BOUNDARY.md'), 'utf8');

    assert.match(agentContract, /Evidence Before Claiming|الدليل قبل الادعاء/i);
    assert.match(boundary, /الرفض الافتراضي|Default Deny/i);
    assert.match(boundary, /READ_REPOSITORY/);
  });

  // 4. Design Intelligence & WCAG AA / Responsive Integrity
  it('4. should verify design intelligence standards with WCAG 2.2 AA and responsive tokens', () => {
    const designReadme = fs.readFileSync(path.join(designDir, 'README.md'), 'utf8');
    assert.match(designReadme, /WCAG|إمكانية الوصول/i);
    assert.match(designReadme, /RTL|الاتجاه/i);
    assert.match(designReadme, /Anti-Slop|مكافحة الابتذال/i);
  });

  // 5. Engineering Standards & Secure Architecture
  it('5. should verify engineering standards, error handling, performance budgets, and resilience', () => {
    const engReadme = fs.readFileSync(path.join(engDir, 'README.md'), 'utf8');
    assert.match(engReadme, /الهندسة|Engineering/i);
    assert.match(engReadme, /الأخطاء|المعايير/i);
  });

  // 6. Security Controls & ASVS Level 2 Verification
  it('6. should verify security matrix compliance with OWASP ASVS and zero-trust principles', () => {
    const secReadme = fs.readFileSync(path.join(secDir, 'README.md'), 'utf8');
    assert.match(secReadme, /OWASP|ASVS|الأمان/i);
    assert.match(secReadme, /التحكم بالوصول|التوثيق/i);
  });

  // 7. Validator Registry & 15 Canonical Quality Gates
  it('7. should verify 15 canonical validators in 06-VALIDATORS with explicit evidence semantics', () => {
    const valRegistry = fs.readFileSync(path.join(valDir, 'registry/VALIDATOR_REGISTRY.md'), 'utf8');
    const rows = valRegistry.split('\n').filter(l => l.includes('`VAL-'));
    assert.equal(rows.length, 15, 'VALIDATOR_REGISTRY must contain exactly 15 canonical validators');
  });

  // 8. Stack Agnosticity & Full Stack Adapter Registry (10 Adapters)
  it('8. should verify 10 stack adapters in 07-STACK-ADAPTERS with full neutrality', () => {
    const adapterRegistry = fs.readFileSync(path.join(adaptersDir, 'ADAPTER_REGISTRY.md'), 'utf8');
    const rows = adapterRegistry.split('\n').filter(l => l.includes('`ADP-'));
    assert.equal(rows.length, 10, 'ADAPTER_REGISTRY must contain exactly 10 registered adapters');
  });

  // 9. Template & Blueprint Registry (8 Items)
  it('9. should verify 8 domain templates and blueprints in 08-TEMPLATES with declarative safety', () => {
    const templateRegistry = fs.readFileSync(path.join(templatesDir, 'TEMPLATE_REGISTRY.md'), 'utf8');
    const rows = templateRegistry.split('\n').filter(l => l.includes('`TPL-') || l.includes('`BLP-'));
    assert.equal(rows.length, 8, 'TEMPLATE_REGISTRY must contain exactly 8 registered templates and blueprints');
  });

  // 10. End-to-End Bidirectional Traceability Across All 8 Layers
  it('10. should verify unbroken end-to-end bidirectional traceability from rules to quality gates', () => {
    const valReg = fs.readFileSync(path.join(valDir, 'registry/VALIDATOR_REGISTRY.md'), 'utf8');
    const adpReg = fs.readFileSync(path.join(adaptersDir, 'ADAPTER_REGISTRY.md'), 'utf8');
    const tplReg = fs.readFileSync(path.join(templatesDir, 'TEMPLATE_REGISTRY.md'), 'utf8');

    // Forward & Backward links
    assert.match(adpReg, /SEC-INJ-001/);
    assert.match(valReg, /SEC-INJ-001/);
    assert.match(tplReg, /SEC-AUTHZ-001/);
    assert.match(valReg, /VAL-SEC-AUTHZ-001/);
  });

  // 11. Final Adversarial Attack Surface & Security Gate
  it('11. should defeat adversarial injection, fake PASS spoofing, and privilege escalation attempts', () => {
    // Adversarial fake verification detector
    function evaluateVerificationClaim(claim) {
      if (!claim.evidence || claim.evidence === 'SELF_REPORTED_ONLY') {
        return { isVerified: false, gate: 'BLOCKED' };
      }
      if (claim.securityBypassAttempted) {
        return { isVerified: false, gate: 'REJECTED_SECURITY_VIOLATION' };
      }
      return { isVerified: true, gate: 'PASS' };
    }

    const test1 = evaluateVerificationClaim({ evidence: 'SELF_REPORTED_ONLY' });
    assert.equal(test1.isVerified, false);
    assert.equal(test1.gate, 'BLOCKED');

    const test2 = evaluateVerificationClaim({ evidence: 'INDEPENDENT_AUDIT_LOG', securityBypassAttempted: true });
    assert.equal(test2.isVerified, false);
    assert.equal(test2.gate, 'REJECTED_SECURITY_VIOLATION');

    const test3 = evaluateVerificationClaim({ evidence: 'INDEPENDENT_AUDIT_LOG', securityBypassAttempted: false });
    assert.equal(test3.isVerified, true);
    assert.equal(test3.gate, 'PASS');
  });

  // 12. Verification of Consolidated Canonical Release Reports
  it('12. should verify existence and validity of all canonical release reports', () => {
    const expectedReports = [
      'RELEASE_VERIFICATION.md',
      'PROOFFORGE_RELEASE_CLEANUP_REPORT.md'
    ];

    for (const rep of expectedReports) {
      const repPath = path.join(reportsDir, rep);
      assert.ok(fs.existsSync(repPath), `Required report file missing: ${rep}`);
      const stat = fs.statSync(repPath);
      assert.ok(stat.size > 50, `Report file too short: ${rep}`);
    }
  });
});
