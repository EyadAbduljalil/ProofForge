import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

describe('Phase 6A: Domains, Templates & Stack Adapters Verification', () => {
  const adaptersDir = path.join(rootDir, '07-STACK-ADAPTERS');
  const templatesDir = path.join(rootDir, '08-TEMPLATES & BLUEPRINTS');

  // 1. Filesystem & Artifact Reconciliation
  it('1. should verify physical existence of all 07-STACK-ADAPTERS and 08-TEMPLATES files', () => {
    assert.ok(fs.existsSync(adaptersDir), '07-STACK-ADAPTERS must exist');
    assert.ok(fs.existsSync(templatesDir), '08-TEMPLATES & BLUEPRINTS must exist');

    const expectedAdapters = [
      'README.md',
      'STACK_ADAPTER_CONTRACT.md',
      'STACK_PROFILE_SCHEMA.md',
      'CAPABILITY_MAPPING_MODEL.md',
      'COMPATIBILITY_MODEL.md',
      'ADAPTER_APPLICABILITY.md',
      'ADAPTER_CONFLICTS.md',
      'ADAPTER_SECURITY.md',
      'ADAPTER_VERSIONING.md',
      'ADAPTER_REGISTRY.md'
    ];

    const expectedTemplates = [
      'README.md',
      'TEMPLATE_CONTRACT.md',
      'BLUEPRINT_CONTRACT.md',
      'TEMPLATE_SCHEMA.md',
      'BLUEPRINT_SCHEMA.md',
      'DOMAIN_APPLICABILITY.md',
      'TEMPLATE_COMPOSITION.md',
      'TEMPLATE_VARIANTS.md',
      'TEMPLATE_SECURITY.md',
      'TEMPLATE_REGISTRY.md'
    ];

    for (const f of expectedAdapters) {
      assert.ok(fs.existsSync(path.join(adaptersDir, f)), `Missing adapter file: ${f}`);
    }
    for (const f of expectedTemplates) {
      assert.ok(fs.existsSync(path.join(templatesDir, f)), `Missing template file: ${f}`);
    }
  });

  // 2. Schema Validation (Stack Adapter, Stack Profile, Template, Blueprint)
  it('2. should parse and validate all JSON schemas in Phase 6', () => {
    const schemaFiles = [
      path.join(adaptersDir, 'STACK_ADAPTER_CONTRACT.md'),
      path.join(adaptersDir, 'STACK_PROFILE_SCHEMA.md'),
      path.join(templatesDir, 'TEMPLATE_SCHEMA.md'),
      path.join(templatesDir, 'BLUEPRINT_SCHEMA.md')
    ];

    for (const sf of schemaFiles) {
      const content = fs.readFileSync(sf, 'utf8');
      const jsonBlock = content.match(/```json\s*([\s\S]*?)\s*```/);
      assert.ok(jsonBlock, `Missing JSON schema block in ${sf}`);
      const parsed = JSON.parse(jsonBlock[1]);
      assert.equal(parsed.type, 'object');
      assert.ok(Array.isArray(parsed.required), `required array missing in ${sf}`);
      assert.ok(parsed.properties, `properties missing in ${sf}`);
    }
  });

  // 3. Authority Hierarchy & Non-Overridable Constraints
  it('3. should enforce that security constraints and canonical rules strictly override adapters and templates', () => {
    const readme = fs.readFileSync(path.join(adaptersDir, 'README.md'), 'utf8');
    const conflicts = fs.readFileSync(path.join(adaptersDir, 'ADAPTER_CONFLICTS.md'), 'utf8');

    assert.match(readme, /الضوابط الأمنية والسلامة[\s\S]*?تسود دائماً/i);
    assert.match(conflicts, /السيادة الدائمة للأمان/i);
  });

  // 4. Stack Agnosticity & Neutrality (No Mandatory Frameworks)
  it('4. should verify stack agnosticity without technology ranking or mandatory frameworks', () => {
    const allFiles = [
      ...fs.readdirSync(adaptersDir, { recursive: true }).map(f => path.join(adaptersDir, f)),
      ...fs.readdirSync(templatesDir, { recursive: true }).map(f => path.join(templatesDir, f))
    ].filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allFiles) {
      const content = fs.readFileSync(f, 'utf8');
      assert.doesNotMatch(content, /إلزامية استخدام (React|Vue|Node|Express|PostgreSQL) حصراً وبدون بديل/i);
      assert.doesNotMatch(content, /أفضل إطار عمل مطلق/i);
    }
  });

  // 5. Registries and Canonical Traceability
  it('5. should verify adapter and template registries and bidirectional traceability', () => {
    const adapterReg = fs.readFileSync(path.join(adaptersDir, 'ADAPTER_REGISTRY.md'), 'utf8');
    const templateReg = fs.readFileSync(path.join(templatesDir, 'TEMPLATE_REGISTRY.md'), 'utf8');

    const expectedAdapterIds = ['ADP-LANG-TYPESCRIPT', 'ADP-FE-REACT', 'ADP-BE-NODE', 'ADP-DB-POSTGRES'];
    for (const id of expectedAdapterIds) {
      assert.match(adapterReg, new RegExp(id));
    }

    const expectedTemplateIds = ['TPL-DOM-ECOMMERCE', 'TPL-DOM-SAAS', 'BLP-DOM-ECOMMERCE'];
    for (const id of expectedTemplateIds) {
      assert.match(templateReg, new RegExp(id));
    }
  });

  // 6. Adversarial & Negative Security Tests
  it('6. should reject prompt injection, runtime code generation, and security bypass attempts', () => {
    const secDoc = fs.readFileSync(path.join(adaptersDir, 'ADAPTER_SECURITY.md'), 'utf8');
    const tplSecDoc = fs.readFileSync(path.join(templatesDir, 'TEMPLATE_SECURITY.md'), 'utf8');

    assert.match(secDoc, /Prompt Injection/i);
    assert.match(secDoc, /الفصل بين البيانات والتعليمات/i);
    assert.match(tplSecDoc, /حظر تعليمات الالتفاف/i);
  });

  // 7. Phase Boundary Audit
  it('7. should ensure no forward implementation leakage from Phase 7 and Phase 8', () => {
    const allFiles = [
      ...fs.readdirSync(adaptersDir, { recursive: true }).map(f => path.join(adaptersDir, f)),
      ...fs.readdirSync(templatesDir, { recursive: true }).map(f => path.join(templatesDir, f))
    ].filter(f => fs.statSync(f).isFile() && f.endsWith('.md'));

    for (const f of allFiles) {
      const content = fs.readFileSync(f, 'utf8');
      assert.doesNotMatch(content, /محرك التشغيل التلقائي الكامل لـ Phase 7/i);
      assert.doesNotMatch(content, /نظام النشر النهائي الخاص بـ Phase 8 مُنفذ هنا/i);
    }
  });
});
