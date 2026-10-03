/**
 * WebForge OS - Knowledge Core Automated Verification Suite
 * Verifies the integrity, schema compliance, uniqueness, and consistency of 01-KNOWLEDGE/
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../../');
const KNOWLEDGE_DIR = path.resolve(REPO_ROOT, '01-KNOWLEDGE');

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

function getAllFiles(dir, filterExt = '.md') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, filterExt));
    } else if (fullPath.endsWith(filterExt)) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('WebForge Knowledge Core Integrity Verification', () => {
  it('01-KNOWLEDGE directory and core subdirectories exist', () => {
    assert.strictEqual(fs.existsSync(KNOWLEDGE_DIR), true, '01-KNOWLEDGE directory must exist');
    const requiredSubdirs = ['principles', 'standards', 'policies', 'patterns', 'anti-patterns', 'rules'];
    for (const subdir of requiredSubdirs) {
      const fullPath = path.join(KNOWLEDGE_DIR, subdir);
      assert.strictEqual(fs.existsSync(fullPath), true, `Subdirectory ${subdir} must exist in 01-KNOWLEDGE`);
    }
  });

  it('README.md and index.json exist and are well-formed', () => {
    const readmePath = path.join(KNOWLEDGE_DIR, 'README.md');
    assert.strictEqual(fs.existsSync(readmePath), true, '01-KNOWLEDGE/README.md must exist');
    
    const indexPath = path.join(KNOWLEDGE_DIR, 'index.json');
    assert.strictEqual(fs.existsSync(indexPath), true, '01-KNOWLEDGE/index.json must exist');
    const indexContent = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    assert.strictEqual(typeof indexContent, 'object');
    assert.strictEqual(indexContent.knowledge_summary.total_rules, 36, 'Index summary must report exactly 36 canonical rules');
    assert.strictEqual(indexContent.rules.length, 36, 'Rules array in index must contain exactly 36 rules');
  });

  it('All 36 canonical rule files have valid YAML frontmatter and required fields', () => {
    const rulesDir = path.join(KNOWLEDGE_DIR, 'rules');
    const ruleFiles = getAllFiles(rulesDir, '.md');
    assert.strictEqual(ruleFiles.length, 36, `Must find exactly 36 rule files, found ${ruleFiles.length}`);

    const requiredFields = ['id', 'title', 'category', 'subcategory', 'severity', 'applies_to', 'tags', 'cwe', 'status'];
    const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'];
    const validStatuses = ['DRAFT', 'REVIEW', 'ACTIVE', 'DEPRECATED', 'ARCHIVED'];
    const seenIds = new Set();

    for (const file of ruleFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const parsed = parseYamlFrontmatter(content);
      assert.ok(parsed, `File ${path.basename(file)} must contain valid YAML frontmatter`);
      
      const { metadata, body } = parsed;
      for (const field of requiredFields) {
        assert.ok(metadata[field] !== undefined, `Rule ${path.basename(file)} missing required field: ${field}`);
      }

      assert.strictEqual(validSeverities.includes(metadata.severity), true, `Rule ${metadata.id} has invalid severity: ${metadata.severity}`);
      assert.strictEqual(validStatuses.includes(metadata.status), true, `Rule ${metadata.id} has invalid status: ${metadata.status}`);
      assert.strictEqual(metadata.status, 'ACTIVE', `Rule ${metadata.id} status must be ACTIVE`);
      
      // Filename to ID consistency
      const expectedId = path.basename(file, '.md');
      assert.strictEqual(metadata.id, expectedId, `Filename ${path.basename(file)} does not match rule id ${metadata.id}`);

      // ID uniqueness check
      assert.strictEqual(seenIds.has(metadata.id), false, `Duplicate Rule ID detected: ${metadata.id}`);
      seenIds.add(metadata.id);

      // Markdown body sections check
      assert.ok(body.includes('المتطلب الإلزامي') || body.includes('Requirement'), `Rule ${metadata.id} missing Requirement section`);
      assert.ok(body.includes('مبررات') || body.includes('Rationale'), `Rule ${metadata.id} missing Rationale section`);
      assert.ok(body.includes('الأنماط المعيبة') || body.includes('Bad Patterns'), `Rule ${metadata.id} missing Bad Patterns section`);
      assert.ok(body.includes('الأنماط السليمة') || body.includes('Good Patterns'), `Rule ${metadata.id} missing Good Patterns section`);
      assert.ok(body.includes('التحقق') || body.includes('Validation'), `Rule ${metadata.id} missing Validation section`);
      assert.ok(body.includes('خطوات الإصلاح') || body.includes('Remediation'), `Rule ${metadata.id} missing Remediation section`);
    }
  });

  it('All files referenced in index.json physically exist on disk and vice versa', () => {
    const indexPath = path.join(KNOWLEDGE_DIR, 'index.json');
    const indexContent = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

    const allSections = ['principles', 'standards', 'policies', 'patterns', 'anti_patterns', 'rules'];
    const indexedPaths = new Set();

    for (const section of allSections) {
      const items = indexContent[section] || [];
      for (const item of items) {
        const itemPath = path.join(KNOWLEDGE_DIR, item.path);
        assert.strictEqual(fs.existsSync(itemPath), true, `Item ${item.id} path not found on disk: ${itemPath}`);
        indexedPaths.add(path.normalize(itemPath));
      }
    }

    // Verify no orphan markdown files exist in rules/
    const allRuleFiles = getAllFiles(path.join(KNOWLEDGE_DIR, 'rules'), '.md');
    for (const ruleFile of allRuleFiles) {
      assert.strictEqual(indexedPaths.has(path.normalize(ruleFile)), true, `Rule file ${ruleFile} is missing from index.json`);
    }
  });

  it('Standards and Policies files conform to specifications', () => {
    const standardsDir = path.join(KNOWLEDGE_DIR, 'standards');
    const standardFiles = getAllFiles(standardsDir, '.md');
    assert.strictEqual(standardFiles.length, 3, 'Must have exactly 3 standards files');

    const policiesDir = path.join(KNOWLEDGE_DIR, 'policies');
    const policyFiles = getAllFiles(policiesDir, '.md');
    assert.strictEqual(policyFiles.length, 3, 'Must have exactly 3 policy files');

    const patternsDir = path.join(KNOWLEDGE_DIR, 'patterns');
    const patternFiles = getAllFiles(patternsDir, '.md');
    assert.strictEqual(patternFiles.length, 4, 'Must have exactly 4 pattern files');

    const antiPatternsDir = path.join(KNOWLEDGE_DIR, 'anti-patterns');
    const antiPatternFiles = getAllFiles(antiPatternsDir, '.md');
    assert.strictEqual(antiPatternFiles.length, 4, 'Must have exactly 4 anti-pattern files');
  });

  it('Accessibility rules strictly reference WCAG 2.2 AA', () => {
    const a11yDir = path.join(KNOWLEDGE_DIR, 'rules', 'accessibility');
    const a11yFiles = getAllFiles(a11yDir, '.md');
    for (const file of a11yFiles) {
      const content = fs.readFileSync(file, 'utf8');
      assert.strictEqual(content.includes('WCAG 2.1'), false, `File ${path.basename(file)} still has stale WCAG 2.1 reference`);
      assert.strictEqual(content.includes('WCAG 2.2'), true, `File ${path.basename(file)} must reference WCAG 2.2`);
    }
  });

  it('Knowledge Core is stack-agnostic and does not impose mandatory technologies', () => {
    const allRuleFiles = getAllFiles(path.join(KNOWLEDGE_DIR, 'rules'), '.md');
    for (const file of allRuleFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const parsed = parseYamlFrontmatter(content);
      assert.ok(parsed, `File ${file} parse failed`);
      const { body } = parsed;
      // Requirements section should not mandate postgres or redis as absolute requirements
      assert.strictEqual(
        body.includes('يجب استخدام PostgreSQL إجبارياً') || body.includes('يجب استخدام Redis إجبارياً'),
        false,
        `Rule ${file} violates stack agnosticity`
      );
    }
  });
});
