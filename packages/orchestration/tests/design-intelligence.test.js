/**
 * WebForge OS - Design Intelligence Automated Semantic Verification Suite
 * Phase 3A - Verifies the complete structure, 10-viewport responsive matrix,
 * WCAG 2.2 AA accessibility, RTL logical properties, anti-slop rules, schemas,
 * and stack-agnostic quality guidelines.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../../../');
const DESIGN_DIR = path.resolve(REPO_ROOT, '03-DESIGN');
const KNOWLEDGE_DIR = path.resolve(REPO_ROOT, '01-KNOWLEDGE');

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

describe('WebForge Design Intelligence Verification (Phase 3A)', () => {
  it('03-DESIGN directory exists with all canonical subdirectories', () => {
    assert.strictEqual(fs.existsSync(DESIGN_DIR), true, '03-DESIGN directory must exist');
    const requiredSubdirs = [
      'design-system',
      'typography',
      'color',
      'responsive',
      'accessibility',
      'rtl',
      'anti-slop',
      'layout',
      'interaction',
      'motion',
      'content',
      'icons',
      'imagery',
      'themes',
      'states',
      'patterns',
      'anti-patterns',
      'references',
      'schemas'
    ];
    for (const subdir of requiredSubdirs) {
      const fullPath = path.join(DESIGN_DIR, subdir);
      assert.strictEqual(fs.existsSync(fullPath), true, `Subdirectory ${subdir} must exist in 03-DESIGN`);
    }
  });

  it('README.md and all canonical design intelligence files exist and are populated', () => {
    const allMdFiles = getAllFiles(DESIGN_DIR, '.md');
    assert.ok(allMdFiles.length >= 20, `Expected at least 20 design documents, found ${allMdFiles.length}`);

    const criticalFiles = [
      'README.md',
      'design-system/DESIGN_SYSTEM_GUIDE.md',
      'design-system/TOKEN_GOVERNANCE.md',
      'design-system/SEMANTIC_TOKENS.md',
      'typography/TYPOGRAPHY_GUIDE.md',
      'typography/HIERARCHY_AND_SCALING.md',
      'typography/CONTENT_DENSITY.md',
      'color/COLOR_INTELLIGENCE.md',
      'color/SEMANTIC_PALETTES.md',
      'color/CONTRAST_ACCESSIBILITY.md',
      'responsive/RESPONSIVE_STRATEGY.md',
      'responsive/VIEWPORT_MATRIX.md',
      'accessibility/WCAG_2_2_AA_SPEC.md',
      'accessibility/KEYBOARD_AND_FOCUS.md',
      'accessibility/ARIA_AND_SEMANTICS.md',
      'rtl/RTL_LTR_BIDIRECTIONAL.md',
      'rtl/LOGICAL_PROPERTIES.md',
      'anti-slop/ANTI_SLOP_FRAMEWORK.md',
      'anti-slop/ANTI_CONVERGENCE_GUIDE.md',
      'anti-slop/SLOP_TAXONOMY.md',
      'layout/LAYOUT_INTELLIGENCE.md',
      'layout/VISUAL_RHYTHM.md',
      'interaction/INTERACTION_INTELLIGENCE.md',
      'interaction/AFFORDANCE_AND_FEEDBACK.md',
      'motion/MOTION_INTELLIGENCE.md',
      'motion/REDUCED_MOTION_GUIDE.md',
      'content/CONTENT_QUALITY.md',
      'content/ANTI_FAKE_SIGNALS.md',
      'icons/ICON_STANDARDS.md',
      'imagery/IMAGERY_GUIDELINES.md',
      'themes/THEME_ARCHITECTURE.md',
      'themes/DARK_MODE_STRATEGY.md',
      'states/COMPONENT_STATES_MATRIX.md',
      'patterns/NAV_PATTERNS.md',
      'patterns/FORM_PATTERNS.md',
      'patterns/DATA_DENSE_PATTERNS.md',
      'patterns/FLOW_STATE_PATTERNS.md',
      'anti-patterns/GENERIC_SAAS_ANTIPATTERN.md',
      'anti-patterns/EXCESSIVE_GRADIENTS_ANTIPATTERN.md',
      'anti-patterns/CARD_OVERLOAD_ANTIPATTERN.md',
      'anti-patterns/FAKE_TRUST_SIGNALS_ANTIPATTERN.md',
      'references/WCAG_2_2_AA_REFERENCE.md',
      'references/DESIGN_SYSTEM_REFERENCES.md',
      'schemas/DESIGN_DECISION_RECORD_SCHEMA.md',
      'schemas/DESIGN_EVALUATION_SCHEMA.md'
    ];

    for (const relPath of criticalFiles) {
      const fullPath = path.join(DESIGN_DIR, relPath);
      assert.strictEqual(fs.existsSync(fullPath), true, `Required file missing: ${relPath}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.length > 80, `File ${relPath} is unexpectedly short`);
    }
  });

  it('Responsive standards cover all 10 canonical viewports', () => {
    const viewportFile = path.join(DESIGN_DIR, 'responsive', 'VIEWPORT_MATRIX.md');
    const content = fs.readFileSync(viewportFile, 'utf8');
    const expectedViewports = ['320', '375', '390', '414', '768', '834', '1024', '1280', '1440', '1920'];
    for (const vp of expectedViewports) {
      assert.ok(content.includes(vp), `VIEWPORT_MATRIX.md must cover viewport: ${vp}`);
    }
  });

  it('Accessibility standards reference WCAG 2.2 Level AA and minimum 4.5:1 contrast', () => {
    const a11yFile = path.join(DESIGN_DIR, 'accessibility', 'WCAG_2_2_AA_SPEC.md');
    const contrastFile = path.join(DESIGN_DIR, 'color', 'CONTRAST_ACCESSIBILITY.md');
    
    const a11yContent = fs.readFileSync(a11yFile, 'utf8');
    const contrastContent = fs.readFileSync(contrastFile, 'utf8');

    assert.ok(a11yContent.includes('WCAG 2.2') || a11yContent.includes('2.2'), 'Must reference WCAG 2.2');
    assert.ok(contrastContent.includes('4.5') || contrastContent.includes('4.5 : 1'), 'Must specify 4.5:1 text contrast');
    assert.ok(contrastContent.includes('focus') || contrastContent.includes('التركيز'), 'Must enforce focus visibility');
  });

  it('RTL / LTR guidance enforces CSS Logical Properties and directional icon rules', () => {
    const logicalFile = path.join(DESIGN_DIR, 'rtl', 'LOGICAL_PROPERTIES.md');
    const iconFile = path.join(DESIGN_DIR, 'icons', 'ICON_STANDARDS.md');
    
    const logicalContent = fs.readFileSync(logicalFile, 'utf8');
    const iconContent = fs.readFileSync(iconFile, 'utf8');

    assert.ok(logicalContent.includes('margin-inline-start'), 'Must specify margin-inline-start');
    assert.ok(logicalContent.includes('padding-inline-start'), 'Must specify padding-inline-start');
    assert.ok(iconContent.includes('RTL'), 'Must include RTL icon direction rules');
  });

  it('Anti-Slop framework defines taxonomy, anti-convergence, and bans fake trust signals', () => {
    const antiSlopFile = path.join(DESIGN_DIR, 'anti-slop', 'ANTI_SLOP_FRAMEWORK.md');
    const antiConvFile = path.join(DESIGN_DIR, 'anti-slop', 'ANTI_CONVERGENCE_GUIDE.md');
    const fakeSignalsFile = path.join(DESIGN_DIR, 'content', 'ANTI_FAKE_SIGNALS.md');

    const antiSlopContent = fs.readFileSync(antiSlopFile, 'utf8');
    const antiConvContent = fs.readFileSync(antiConvFile, 'utf8');
    const fakeContent = fs.readFileSync(fakeSignalsFile, 'utf8');

    assert.ok(antiSlopContent.includes('Slop') || antiSlopContent.includes('التوليد البصري الرديء'), 'Must define Anti-Slop');
    assert.ok(antiConvContent.includes('Convergence') || antiConvContent.includes('التشابه النمطي'), 'Must define Anti-Convergence');
    assert.ok(fakeContent.includes('Fake') || fakeContent.includes('المزيفة'), 'Must prohibit fake credibility signals');
  });

  it('Component States Matrix covers 14 canonical interaction states', () => {
    const statesFile = path.join(DESIGN_DIR, 'states', 'COMPONENT_STATES_MATRIX.md');
    const content = fs.readFileSync(statesFile, 'utf8');
    const expectedStates = [
      'Default',
      'Hover',
      'Focus',
      'Active',
      'Selected',
      'Disabled',
      'Loading',
      'Success',
      'Warning',
      'Error',
      'Empty',
      'Partial',
      'Offline',
      'Permission Denied'
    ];
    for (const state of expectedStates) {
      assert.ok(content.includes(state), `States matrix must include: ${state}`);
    }
  });

  it('Design Decision Record Schema is syntactically valid JSON Schema', () => {
    const schemaFile = path.join(DESIGN_DIR, 'schemas', 'DESIGN_DECISION_RECORD_SCHEMA.md');
    const content = fs.readFileSync(schemaFile, 'utf8');
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    assert.ok(jsonMatch, 'Must contain JSON schema code block');
    const parsed = JSON.parse(jsonMatch[1]);
    assert.strictEqual(parsed.title, 'WebForgeDesignDecisionRecord');
    assert.ok(parsed.required.includes('design_problem'));
    assert.ok(parsed.required.includes('accessibility_impact'));
  });

  it('Design Evaluation Schema covers 15 quality evaluation dimensions', () => {
    const evalFile = path.join(DESIGN_DIR, 'schemas', 'DESIGN_EVALUATION_SCHEMA.md');
    const content = fs.readFileSync(evalFile, 'utf8');
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    assert.ok(jsonMatch, 'Must contain JSON schema code block');
    const parsed = JSON.parse(jsonMatch[1]);
    assert.strictEqual(parsed.title, 'WebForgeDesignEvaluationReport');
    assert.ok(parsed.required.includes('assessed_dimensions'));
  });

  it('Design Intelligence documents preserve stack-agnosticity without imposing frameworks', () => {
    const allDesignFiles = getAllFiles(DESIGN_DIR, '.md');
    for (const file of allDesignFiles) {
      const content = fs.readFileSync(file, 'utf8');
      assert.strictEqual(
        content.includes('يجب استخدام React إجبارياً') ||
        content.includes('يجب استخدام Tailwind إجبارياً') ||
        content.includes('يجب استخدام Bootstrap إجبارياً'),
        false,
        `Stack imposition detected in ${file}`
      );
    }
  });
});

describe('WebForge Design Intelligence Semantic & Adversarial Audit (Phase 3B)', () => {
  // 1. Contrast Ratio & WCAG 2.2 AA Semantics
  describe('Contrast & Accessibility Semantic Rules', () => {
    function evaluateContrastRequirement(elementType, fontSizePt, isBold, contrastRatio) {
      const isLargeText = fontSizePt >= 18 || (fontSizePt >= 14 && isBold);
      if (elementType === 'text') {
        const minRequired = isLargeText ? 3.0 : 4.5;
        return {
          compliant: contrastRatio >= minRequired,
          minRequired,
          level: contrastRatio >= (isLargeText ? 4.5 : 7.0) ? 'AAA' : (contrastRatio >= minRequired ? 'AA' : 'FAIL')
        };
      }
      if (elementType === 'ui_component' || elementType === 'focus_ring') {
        return {
          compliant: contrastRatio >= 3.0,
          minRequired: 3.0,
          level: contrastRatio >= 3.0 ? 'AA' : 'FAIL'
        };
      }
      return { compliant: true, minRequired: 1.0, level: 'N/A' };
    }

    it('Enforces 4.5:1 for normal body text and 3.0:1 for large text', () => {
      assert.strictEqual(evaluateContrastRequirement('text', 14, false, 4.6).compliant, true);
      assert.strictEqual(evaluateContrastRequirement('text', 14, false, 4.2).compliant, false);
      assert.strictEqual(evaluateContrastRequirement('text', 18, false, 3.2).compliant, true);
      assert.strictEqual(evaluateContrastRequirement('text', 14, true, 3.1).compliant, true);
    });

    it('Enforces 3.0:1 for interactive components and focus rings', () => {
      assert.strictEqual(evaluateContrastRequirement('ui_component', 0, false, 3.2).compliant, true);
      assert.strictEqual(evaluateContrastRequirement('focus_ring', 0, false, 2.8).compliant, false);
    });
  });

  // 2. Viewport Behavior Mapping
  describe('10-Viewport Behavior & Layout Bounds', () => {
    function getViewportCategory(width) {
      if (width < 640) return { category: 'MOBILE', nav: 'DRAWER_OR_BOTTOM', maxCols: 1 };
      if (width < 1024) return { category: 'TABLET', nav: 'COLLAPSIBLE_SIDEBAR', maxCols: 2 };
      if (width < 1600) return { category: 'DESKTOP', nav: 'PERSISTENT_SIDEBAR', maxCols: 4 };
      return { category: 'ULTRA_WIDE', nav: 'PERSISTENT_SIDEBAR', maxCols: 4, hasContainerConstraint: true };
    }

    it('Maps mobile viewports (320-414px) to single column and drawer navigation', () => {
      const v320 = getViewportCategory(320);
      assert.strictEqual(v320.category, 'MOBILE');
      assert.strictEqual(v320.maxCols, 1);
    });

    it('Constrains container width on ultra-wide viewports (1920px+)', () => {
      const v1920 = getViewportCategory(1920);
      assert.strictEqual(v1920.category, 'ULTRA_WIDE');
      assert.strictEqual(v1920.hasContainerConstraint, true);
    });
  });

  // 3. CSS Logical Properties & RTL Directional Semantics
  describe('CSS Logical Properties & Directional Direction', () => {
    const logicalPropertyMap = {
      'margin-left': 'margin-inline-start',
      'margin-right': 'margin-inline-end',
      'padding-left': 'padding-inline-start',
      'padding-right': 'padding-inline-end',
      'border-left': 'border-inline-start',
      'border-right': 'border-inline-end',
      'text-align: left': 'text-align: start',
      'text-align: right': 'text-align: end'
    };

    function shouldMirrorIconInRTL(iconName) {
      const mirrored = new Set(['arrow-left', 'arrow-right', 'chevron-left', 'chevron-right', 'history', 'reply', 'undo', 'redo']);
      const neutral = new Set(['search', 'lock', 'camera', 'play', 'pause', 'close', 'settings']);
      if (mirrored.has(iconName)) return true;
      if (neutral.has(iconName)) return false;
      return false;
    }

    it('Correctly translates physical CSS properties to logical counterparts', () => {
      assert.strictEqual(logicalPropertyMap['margin-left'], 'margin-inline-start');
      assert.strictEqual(logicalPropertyMap['padding-right'], 'padding-inline-end');
      assert.strictEqual(logicalPropertyMap['text-align: left'], 'text-align: start');
    });

    it('Mirrors directional flow icons in RTL while preserving universal physical icons', () => {
      assert.strictEqual(shouldMirrorIconInRTL('arrow-left'), true);
      assert.strictEqual(shouldMirrorIconInRTL('chevron-right'), true);
      assert.strictEqual(shouldMirrorIconInRTL('search'), false);
      assert.strictEqual(shouldMirrorIconInRTL('lock'), false);
      assert.strictEqual(shouldMirrorIconInRTL('play'), false);
    });
  });

  // 4. Anti-Slop & Anti-Fake Credibility Detection
  describe('Anti-Slop Framework & Anti-Convergence Rules', () => {
    function detectVisualSlopSignals(uiElement) {
      const issues = [];
      if (uiElement.hasDefaultGradient && !uiElement.isBrandSpecific) {
        issues.push({ code: 'SLOP-001', message: 'Default unmotivated gradient detected' });
      }
      if (uiElement.hasFakeTestimonial || uiElement.hasUnverifiedMetric) {
        issues.push({ code: 'SLOP-005', message: 'Fabricated credibility signal detected' });
      }
      if (uiElement.isGratuitousBento && uiElement.dataType === 'homogeneous') {
        issues.push({ code: 'SLOP-003', message: 'Unjustified Bento grid on homogeneous data' });
      }
      return { isSlop: issues.length > 0, issues };
    }

    it('Detects fabricated trust signals and unmotivated gradients as Slop', () => {
      const badElement = { hasDefaultGradient: true, isBrandSpecific: false, hasFakeTestimonial: true };
      const res = detectVisualSlopSignals(badElement);
      assert.strictEqual(res.isSlop, true);
      assert.strictEqual(res.issues.length, 2);
    });

    it('Allows clean functional UI without false positives', () => {
      const cleanElement = { hasDefaultGradient: false, isBrandSpecific: true, hasFakeTestimonial: false, isGratuitousBento: false };
      const res = detectVisualSlopSignals(cleanElement);
      assert.strictEqual(res.isSlop, false);
      assert.strictEqual(res.issues.length, 0);
    });
  });

  // 5. Knowledge Core Design Rules Traceability
  describe('Knowledge Core Design Rules Traceability', () => {
    it('All 10 canonical design rules exist and are indexed in 01-KNOWLEDGE/index.json', () => {
      const indexPath = path.join(KNOWLEDGE_DIR, 'index.json');
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      const ruleIds = new Set(index.rules.map(r => r.id));

      const canonicalDesignRules = [
        'UI-TYPE-001',
        'UI-COLOR-001',
        'UI-SLOP-001',
        'A11Y-NAME-001',
        'A11Y-KEYB-001',
        'A11Y-CONTRAST-001',
        'RESP-VIEWPORT-001',
        'RESP-OVERFLOW-001',
        'I18N-EXPAND-001',
        'RTL-LAYOUT-001'
      ];

      for (const ruleId of canonicalDesignRules) {
        assert.ok(ruleIds.has(ruleId), `Rule ${ruleId} must be indexed in 01-KNOWLEDGE`);
        const ruleEntry = index.rules.find(r => r.id === ruleId);
        const ruleFilePath = path.join(KNOWLEDGE_DIR, ruleEntry.path);
        assert.strictEqual(fs.existsSync(ruleFilePath), true, `File for ${ruleId} must exist at ${ruleFilePath}`);
      }
    });
  });
});

