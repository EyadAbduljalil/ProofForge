const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeDoc(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
    console.log(`[DESIGN-SYSTEM] Created: ${filePath}`);
}

module.exports = function buildDesignSystemPackage() {
    console.log('>>> Building Executable Design System Package (packages/design-system)...');

    // 1. Tokens CSS
    writeDoc('packages/design-system/tokens.css', `/* WebForge OS - Primitives & Base Tokens */
:root {
  /* Neutral Color Scale (Zinc / Slate) */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-400: #a1a1aa;
  --color-neutral-500: #71717a;
  --color-neutral-600: #52525b;
  --color-neutral-700: #3f3f46;
  --color-neutral-800: #27272a;
  --color-neutral-900: #18181b;
  --color-neutral-950: #09090b;

  /* Brand Accents */
  --color-brand-primary: #2563eb;
  --color-brand-primary-hover: #1d4ed8;
  --color-brand-secondary: #0f172a;

  /* Functional Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* Radii */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows (Controlled, Layered, Anti-Slop) */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
`);

    // 2. Semantic CSS (Light / Dark)
    writeDoc('packages/design-system/semantic.css', `/* WebForge OS - Semantic Color Tokens */
:root {
  --bg-app: var(--color-neutral-50);
  --bg-surface: #ffffff;
  --bg-surface-elevated: #ffffff;
  --border-subtle: var(--color-neutral-200);
  --border-strong: var(--color-neutral-300);
  --text-primary: var(--color-neutral-950);
  --text-secondary: var(--color-neutral-600);
  --text-muted: var(--color-neutral-400);
  --text-inverse: #ffffff;
}

[data-theme="dark"], .dark {
  --bg-app: var(--color-neutral-950);
  --bg-surface: var(--color-neutral-900);
  --bg-surface-elevated: var(--color-neutral-800);
  --border-subtle: var(--color-neutral-800);
  --border-strong: var(--color-neutral-700);
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-400);
  --text-muted: var(--color-neutral-500);
  --text-inverse: var(--color-neutral-950);
}
`);

    // 3. Fluid CSS (Typography & Spacing)
    writeDoc('packages/design-system/fluid.css', `/* WebForge OS - Fluid Typography & Spacing Scales */
:root {
  /* Fluid Type Scale */
  --font-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --font-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem);
  --font-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --font-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --font-3xl: clamp(1.875rem, 1.65rem + 1.1vw, 2.5rem);
  --font-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3.25rem);

  /* Fluid Spacing Scale */
  --space-2xs: clamp(0.25rem, 0.2rem + 0.2vw, 0.375rem);
  --space-xs: clamp(0.5rem, 0.45rem + 0.25vw, 0.625rem);
  --space-sm: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --space-md: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --space-lg: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --space-xl: clamp(2rem, 1.75rem + 1.25vw, 3rem);
  --space-2xl: clamp(3rem, 2.5rem + 2.5vw, 4.5rem);
}
`);

    // 4. Motion CSS
    writeDoc('packages/design-system/motion.css', `/* WebForge OS - Motion & Easing Curves */
:root {
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`);

    // 5. Reset CSS
    writeDoc('packages/design-system/reset.css', `/* WebForge OS - Modern Resilient Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}

body {
  font-family: var(--font-family-base, system-ui, -apple-system, sans-serif);
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-app);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  background: none;
  border: none;
}
`);

    // 6. Accessibility CSS
    writeDoc('packages/design-system/accessibility.css', `/* WebForge OS - Accessibility Utilities */
:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.skip-to-content {
  position: absolute;
  inset-inline-start: var(--space-md);
  top: -100px;
  z-index: 9999;
  background: var(--bg-surface-elevated);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-strong);
  transition: top var(--duration-fast) var(--ease-standard);
}

.skip-to-content:focus {
  top: var(--space-md);
}
`);

    // 7. Consolidated index.css
    writeDoc('packages/design-system/index.css', `/* WebForge OS - Consolidated Design System Bundle */
@import './tokens.css';
@import './semantic.css';
@import './fluid.css';
@import './motion.css';
@import './reset.css';
@import './accessibility.css';
`);

    // 8. Automated Design System Test
    writeDoc('packages/design-system/tests/design_system.test.js', `// اختبارات تكامل نظام التصميم البرمجي (Design System Integration Test)
const fs = require('fs');
const assert = require('assert');

console.log('>>> Running Design System CSS Tokens Validation...');

const requiredCssFiles = [
    'tokens.css',
    'semantic.css',
    'fluid.css',
    'motion.css',
    'reset.css',
    'accessibility.css',
    'index.css'
];

requiredCssFiles.forEach(file => {
    const fullPath = \`packages/design-system/\${file}\`;
    assert.strictEqual(fs.existsSync(fullPath), true, \`الملف \${file} غير موجود\`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.strictEqual(content.length > 50, true, \`محتوى \${file} فارغ أو غير كافٍ\`);
});

// التحقق من دعم الخصائص الحيوية
const motionCss = fs.readFileSync('packages/design-system/motion.css', 'utf8');
assert.strictEqual(motionCss.includes('prefers-reduced-motion'), true, 'يجب دعم prefers-reduced-motion في ملف الحركة');

const fluidCss = fs.readFileSync('packages/design-system/fluid.css', 'utf8');
assert.strictEqual(fluidCss.includes('clamp('), true, 'يجب استخدام معادلات clamp للمقاييس السائلة');

console.log('>>> [SUCCESS] All Design System Package Files & Tokens Verified 100%.');
`);

    console.log('>>> Design System Package Built Successfully.');
};
