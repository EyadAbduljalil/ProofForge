/**
 * ProofForge V2 — Skill Quality Contract Upgrader
 * Restructures all 26 SKILL.md files to satisfy the complete Skill Quality Contract
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../');
const skillsDir = path.join(rootDir, 'skills');
const skills = fs.readdirSync(skillsDir);

const domainMap = {
  'accessibility': {
    title: '♿ ProofForge Accessibility (a11y) & WCAG 2.2 Skill',
    script: 'node skills/accessibility/scripts/audit_a11y.js',
    files: ['apps/web/index.html', 'apps/web/app.js', 'packages/design-system/*.css']
  },
  'anti-laziness': {
    title: '⚡ ProofForge Anti-Laziness & Zero-Truncation Enforcement Skill',
    script: 'node skills/anti-laziness/scripts/scan_laziness.js',
    files: ['apps/**/*.js', 'packages/**/*.js', 'skills/**/*.js']
  },
  'anti-slop': {
    title: '🎨 ProofForge Anti-Slop Visual Intelligence & Aesthetic Integrity Skill',
    script: 'node skills/anti-slop/scripts/audit_slop.js',
    files: ['apps/web/index.html', 'packages/design-system/*.css']
  },
  'api': {
    title: '🔌 ProofForge API Contract & Protocol Engineering Skill',
    script: 'node skills/api/scripts/verify_api.js',
    files: ['apps/server/server.js', 'packages/contracts/envelope.js']
  },
  'architecture': {
    title: '🏛️ ProofForge Software Architecture & Clean Systems Design Skill',
    script: 'node skills/architecture/scripts/verify_architecture.js',
    files: ['packages/contracts/**', 'packages/security/**', 'packages/state-machine/**']
  },
  'backend': {
    title: '⚙️ ProofForge Backend Engineering & Systems Architecture Skill',
    script: 'node skills/backend/scripts/verify_backend.js',
    files: ['apps/server/server.js', 'apps/server/db/**', 'apps/server/cache/**']
  },
  'code-review': {
    title: '🔍 ProofForge Adversarial Code Review & Bug Hunting Skill',
    script: 'node skills/code-review/scripts/review_code.js',
    files: ['apps/**/*.js', 'packages/**/*.js']
  },
  'dashboards': {
    title: '📊 ProofForge Dashboard Architecture & High-Density UI Skill',
    script: 'node skills/dashboards/scripts/verify_dashboards.js',
    files: ['apps/web/index.html', 'apps/web/app.js', 'packages/components/**']
  },
  'database': {
    title: '🗄️ ProofForge Database & Multi-Tenant Data Integrity Skill',
    script: 'node skills/database/scripts/verify_database.js',
    files: ['apps/server/db/storage-adapter.js', 'apps/server/db/migrations/**']
  },
  'deployment': {
    title: '🚢 ProofForge DevOps & Production Deployment Security Skill',
    script: 'node skills/deployment/scripts/verify_deployment.js',
    files: ['packages/infrastructure/Dockerfile.hardened', 'package-lock.json']
  },
  'design-system': {
    title: '📐 ProofForge Design System & Token Architecture Skill',
    script: 'node skills/design-system/scripts/verify_tokens.js',
    files: ['packages/design-system/tokens.css', 'packages/design-system/index.css']
  },
  'ecommerce': {
    title: '💳 ProofForge E-Commerce & Transaction Systems Architecture Skill',
    script: 'node skills/ecommerce/scripts/verify_ecommerce.js',
    files: ['apps/server/server.js', 'apps/server/payments/**']
  },
  'forms': {
    title: '📝 ProofForge Form Architect & Schema Validation Specialist Skill',
    script: 'node skills/forms/scripts/verify_forms.js',
    files: ['apps/web/index.html', 'apps/server/server.js', 'packages/security/input-security.js']
  },
  'frontend': {
    title: '💻 ProofForge Frontend Architecture & Client Engineering Skill',
    script: 'node skills/frontend/scripts/verify_frontend.js',
    files: ['apps/web/index.html', 'apps/web/app.js', 'packages/components/**']
  },
  'image-to-code': {
    title: '🖼️ ProofForge Design-to-Code & Visual Reconstruction Skill',
    script: 'node skills/image-to-code/scripts/verify_image_code.js',
    files: ['apps/web/index.html', 'packages/components/**']
  },
  'motion': {
    title: '🎬 ProofForge Motion Engineering & GPU Animation Skill',
    script: 'node skills/motion/scripts/audit_motion.js',
    files: ['packages/design-system/motion.css', 'packages/design-system/accessibility.css']
  },
  'performance': {
    title: '⚡ ProofForge Web Performance & Core Web Vitals Skill',
    script: 'node skills/performance/scripts/audit_performance.js',
    files: ['apps/web/index.html', 'apps/web/app.js', 'apps/server/server.js']
  },
  'production-readiness': {
    title: '🛡️ ProofForge Production Readiness & SRE Operations Skill',
    script: 'node skills/production-readiness/scripts/audit_readiness.js',
    files: ['apps/server/server.js', 'packages/security/secrets.js']
  },
  'project-audit': {
    title: '📋 ProofForge Comprehensive Technical Project Audit Skill',
    script: 'node skills/project-audit/scripts/run_audit.js',
    files: ['skills/*/scripts/*.js', 'bin/webforge.js']
  },
  'responsive': {
    title: '📱 ProofForge Responsive & Mobile-First Engineering Skill',
    script: 'node skills/responsive/scripts/verify_responsive.js',
    files: ['apps/web/index.html', 'packages/design-system/fluid.css']
  },
  'rtl': {
    title: '🌍 ProofForge RTL & Bidirectional Localization Engineering Skill',
    script: 'node skills/rtl/scripts/verify_rtl.js',
    files: ['apps/web/index.html', 'packages/design-system/fluid.css']
  },
  'security': {
    title: '🛡️ ProofForge Security Engineering & Penetration Defense Skill',
    script: 'node skills/security/scripts/verify_security.js',
    files: ['packages/security/**', 'apps/server/server.js']
  },
  'seo': {
    title: '🌐 ProofForge Technical SEO & Structured Metadata Skill',
    script: 'node skills/seo/scripts/verify_seo.js',
    files: ['apps/web/index.html']
  },
  'taste-craft': {
    title: '💎 ProofForge Taste, Tactile Polish & Visual Craft Skill',
    script: 'node skills/taste-craft/scripts/audit_craft.js',
    files: ['packages/design-system/*.css', 'apps/web/index.html']
  },
  'testing': {
    title: '🧪 ProofForge Quality Assurance & Deterministic Testing Skill',
    script: 'node skills/testing/scripts/verify_evidence.js',
    files: ['tests/**', 'packages/*/tests/**']
  },
  'ui-ux': {
    title: '🎯 ProofForge UI/UX Resilient State Machine & Product Design Skill',
    script: 'node skills/ui-ux/scripts/verify_ux.js',
    files: ['apps/web/index.html', 'apps/web/app.js']
  }
};

let count = 0;
for (const s of skills) {
  const p = path.join(skillsDir, s, 'SKILL.md');
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '');
  const meta = domainMap[s] || { title: s, script: 'webforge verify', files: ['apps/**'] };

  const newContent = [
    '---',
    fm.trim(),
    '---',
    '',
    '# ' + meta.title,
    '',
    '## 1. الهوية ونطاق العمل (Identity & Scope)',
    '* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `' + s + '` ضمن منظومة ProofForge.',
    '* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `' + s + '`.',
    '* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `' + s + '`.',
    '',
    '## 2. استكشاف السياق (Context Discovery)',
    '* **الملفات والمكونات الإلزامية للفحص الأولي:**',
    meta.files.map(f => '  - `' + f + '`').join('\n'),
    '* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.',
    '',
    '## 3. منهجية التنفيذ الهندسية (Execution Methodology)',
    body.trim(),
    '',
    '## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)',
    '* **أمر التحقق المادي المستقل:**',
    '```bash',
    meta.script,
    '```',
    '* **معايير الاجتياز الحتمية:**',
    '  - تنفيذ فحص حقيقي شامل لكافة الخصائص المستهدفة دون أي مخرجات صورية.',
    '  - خروج بكود صفري (Exit Code 0) حصراً عند ثبوت المطابقة بالأدلة المادية.',
    '  - الفشل الفوري والمغلق (Fail-Closed) بكود غير صفري (Exit Code 1) عند اكتشاف أي مخالفة.',
    '',
    '## 5. ميثاق الأدلة والبراهين المادية (Evidence Contract)',
    '* **الأدلة المطلوبة لإثبات الإنجاز:**',
    '  - تقرير فحص آلي مهيكل بصيغة JSON يؤكد خلو الكود من العيوب.',
    '  - توثيق كافة التغييرات وسلسلة النسب في سجلات التدقيق الكنسية.',
    '  - الامتثال لقاعدة: `AI Output !== Evidence` والاعتماد حصراً على بوابات التحقق المستقلة في CVGF.',
    ''
  ].join('\n');

  fs.writeFileSync(p, newContent, 'utf8');
  count++;
}

console.log(`Successfully upgraded ${count} SKILL.md files to the complete Skill Quality Contract!`);
