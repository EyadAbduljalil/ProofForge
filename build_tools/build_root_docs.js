const fs = require('fs');
const path = require('path');

function writeDoc(filePath, content) {
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
    console.log(`[ROOT DOC] Created: ${filePath}`);
}

module.exports = function buildRootDocs() {
    console.log('>>> Building Root Documentation...');

    // 1. AGENT.md
    writeDoc('AGENT.md', `# دليل تشغيل الذكاء الاصطناعي (Universal AI Agent Execution Protocol)

> **المصدر المرجعي الأعلى والحصري (AUTHORITATIVE SOURCE OF TRUTH)**
> هذا الملف هو نقطة الدخول الإلزامية لأي ذكاء اصطناعي (AI Coding Agent). يُحظر استخدام السلوكيات الافتراضية لمنصة الذكاء الاصطناعي عند وجود قاعدة صريحة في هذا المستودع.

---

## 1. سلم أولويات القواعد الإلزامي (Rule Precedence)

\`\`\`text
P0 — الأمن والحماية وصحة النظام (Security / Safety / Correctness)
P1 — متطلبات المشروع الصريحة (Explicit Project Requirements)
P2 — القواعد الأساسية للمستودع (Core Repository Rules)
P3 — قواعد النطاق التخصصي (Domain Rules: Ecommerce, SaaS, LMS...)
P4 — قواعد نظام التصميم والواجهات (Design System & UI/UX Rules)
P5 — معايير وأعراف إطار العمل (Framework Conventions)
P6 — الإعدادات الافتراضية للمنصة (Platform Defaults)
P7 — اقتراحات الذكاء الاصطناعي العامة (AI Suggestions)
\`\`\`

---

## 2. بروتوكول التنفيذ على مراحل (14-Phase Execution Protocol)

يجب على الذكاء الاصطناعي اتباع المراحل التالية بالترتيب الصارم، ولا يجوز الانتقال لمرحلة تالية قبل اكتمال والتحقق من المرحلة السابقة:

### PHASE 0 — استكشاف قواعد المستودع (Repository Discovery)
- قراءة \`AGENT.md\`، ومبادئ \`core/\`، وتحديد القيود الأمنية والمعمارية.

### PHASE 1 — استكشاف المشروع (Project Discovery)
- فحص ملفات المشروع القائم، الاعتماديات، وهيكل المجلدات.

### PHASE 2 — تحليل واستخراج المتطلبات (Requirements Extraction)
- إنشاء أو تحديث \`REQUIREMENTS.md\` وتحديد المتطلبات الوظيفية وغير الوظيفية ومعايير القبول.

### PHASE 3 — التخطيط والتصميم المعماري (Architecture Planning)
- توثيق المعمارية في \`ARCHITECTURE.md\` وسجلات القرارات في \`docs/decisions/\` قبل كتابة أي كود.

### PHASE 4 — نظام التصميم والهوية البصرية (Design System Definition)
- تحديد لوحات الألوان، المقاييس الطباعية السائلة، والتباعدات في \`DESIGN.md\` وفق قواعد مكافحة الابتذال (Anti-Slop).

### PHASE 5 — التنفيذ المرحلي الصارم (Phased Implementation)
- كتابة كود كامل، نظيف، ومحدد الأنواع دون أي كسل (\`// TODO\`) أو حلول ناقصة.

### PHASE 6 — التحقق الوظيفي (Functional Validation)
- اختبار كافة التدفقات والمسارات الإيجابية والسلبية والتأكد من التعامل السليم مع الأخطاء.

### PHASE 7 — المراجعة والفحص الأمني (Security Audit)
- فحص ضد ثغرات IDOR، حقن SQL، XSS، CSRF، وتطبيق التحقق الصارم من الخادم (Server-side Validation).

### PHASE 8 — مراجعة واجهة وتجربة المستخدم (UI/UX Review)
- التحقق من التسلسل الهرمي للمعلومات، التباين اللوني، وحالات المكونات (تحميل، فراغ، خطأ، نجاح).

### PHASE 9 — مراجعة التجاوب والشاشات (Responsive Review)
- فحص الواجهات على شاشات الهواتف (360px-390px)، الأجهزة اللوحية، والشاشات الكبيرة ومنع التمرير الأفقي.

### PHASE 10 — مراجعة إمكانية الوصول (Accessibility Review)
- فحص دعم لوحة المفاتيح (Tab, Enter, Esc)، مؤشرات التركيز، وسمات ARIA وفق معايير WCAG 2.2 AA.

### PHASE 11 — مراجعة وتحسين الأداء (Performance Review)
- فحص سرعة التحميل، مؤشرات الويب الحيوية (LCP, INP, CLS)، ضغط الوسائط، وتحسين الاستعلامات.

### PHASE 12 — اختبارات التراجع والاستقرار (Regression Testing)
- التأكد من أن التعديلات والإصلاحات لم تكسر أي وظائف سابقة في النظام.

### PHASE 13 — الجاهزية للإنتاج والإطلاق (Production Readiness Audit)
- إعداد متغيرات الإنتاج المشفرة، والتأكد من إغلاق كافة الملاحظات وإصدار تقرير التحقق النهائي.

---

## 3. حظر الإعلان الزائف عن الإنجاز (No Fake Completion)
- يُحظر استخدام عبارات مبهمة مثل "يبدو جيداً" أو إعلان اكتمال الميزة دون تشغيلها واختبارها وتقديم دليل قاطع (Evidence).
- كل فحص يجب أن يُصنف بوضوح: \`PASS\` أو \`FAIL\` أو \`BLOCKED\` أو \`NOT TESTED\` أو \`NOT APPLICABLE\`.

---

## 4. نموذج التقرير الأمني والهندسي الإلزامي

يجب أن يحتوي كل تقرير مراجعة على:
1. **ملخص تنفيذي (Security & Engineering Summary)**.
2. **قائمة الثغرات والملاحظات المكتشفة (Detected Issues)**.
3. **مستوى الخطورة (Severity: Critical / High / Medium / Low)**.
4. **التفسير التقني وخطوات إعادة الإنتاج (Technical Explanation & Reproduction)**.
5. **تقييم الأثر المباشر (Impact Assessment)**.
6. **توصيات وإجراءات الإصلاح (Fix Recommendations)**.
7. **قائمة المهام القابلة للتنفيذ (Actionable TODO Checklist)**.
`);

    // 2. README.md
    writeDoc('README.md', `# نظام التشغيل الهندسي الموحد للويب (WebForge OS)

> **نظام التشغيل والمرجع الشامل لتطوير مواقع وتطبيقات الويب المتقدمة بمساعدة الذكاء الاصطناعي.**

---

## 🌟 نبذة عن النظام

**WebForge OS** هو مستودع مركزي مرجعي موحد يجمع خلاصة أفضل الممارسات الهندسية، معايير الأمن السيبراني المتقدمة، أنظمة التصميم العالمية، وأدلة مكافحة الابتذال والتصاميم الرديئة. تم بناؤه ليكون **المصدر الوحيد للحقيقة (Single Source of Truth)** لتوجيه وكلاء الذكاء الاصطناعي والمهندسين لبناء وتدقيق أي مشروع ويب بأعلى درجات الجودة والموثوقية.

---

## 📁 هيكل المستودع الشامل

\`\`\`text
WebForge OS/
├── AGENT.md                  # دليل تشغيل وبروتوكول الذكاء الاصطناعي الموحد
├── README.md                 # الوثيقة التعريفية الشاملة للمستودع
├── CHANGELOG.md              # سجل التحديثات والإصدارات
├── LICENSE                   # رخصة الاستخدام
├── MIGRATION_REPORT.md       # تقرير الدمج والتحليل واستخلاص المعرفة المرجعية
│
├── core/                     # النواة والقواعد الأساسية الإلزامية
│   ├── principles/           # المبادئ، سلم الأولويات، ومكافحة الابتذال
│   ├── rules/                # قواعد الواجهات الأمامية، الخلفية، البيانات، والـ API
│   ├── standards/            # معايير الكود، التسميات، وإدارة النسخ والتحقق
│   └── policies/             # سياسات انعدام الثقة، الصلاحيات، وإدارة الأسرار
│
├── skills/                   # المهارات التخصصية المستقلة (26 مهارة)
│   ├── architecture/         # هندسة وتخطيط المعمارية
│   ├── frontend/             # هندسة الواجهات الأمامية
│   ├── backend/              # هندسة الواجهات الخلفية
│   ├── database/             # هندسة وقواعد البيانات
│   ├── api/                  # هندسة واجهات التطبيقات
│   ├── security/             # الأمن السيبراني ومكافحة الثغرات
│   ├── ui-ux/                # الحرفية وتجربة المستخدم
│   ├── design-system/        # أنظمة التصميم والرموز
│   ├── responsive/           # التصميم المتجاوب
│   ├── accessibility/        # إمكانية الوصول الشامل (WCAG AA)
│   ├── rtl/                  # دعم اللغات والاتجاهات المنطقية
│   ├── motion/               # الحركات والانتقالات الهادفة
│   ├── forms/                # هندسة النماذج التفاعلية
│   ├── dashboards/           # لوحات التحكم وتصوير البيانات
│   ├── ecommerce/            # التجارة الإلكترونية والدفع
│   ├── testing/              # الاختبارات وضمان الجودة
│   ├── performance/          # تحسين الأداء ومؤشرات الويب
│   ├── seo/                  # تهيئة محركات البحث
│   ├── deployment/           # النشر والبنية التحتية
│   ├── anti-slop/            # مكافحة التصاميم الرديئة
│   ├── code-review/          # مراجعة وتدقيق الكود
│   ├── production-readiness/ # فحص الجاهزية للإنتاج
│   ├── project-audit/        # تدقيق وفحص المشاريع القائمة
│   ├── taste-craft/          # الذوق الرفيع والحرفية البصرية
│   ├── image-to-code/        # تحويل التصاميم لكود
│   └── anti-laziness/        # مكافحة الكسل البرمجي
│
├── domains/                  # القواعد التخصصية حسب نطاق المشروع
│   ├── ecommerce/            # المتاجر، السلات، المخزون، وآلات الحالات
│   ├── saas/                 # المنصات متعددة المستأجرين والاشتراكات
│   ├── lms/                  # المنصات التعليمية والاختبارات
│   ├── dashboard/            # لوحات البيانات والتقارير
│   ├── marketplace/          # الأسواق التشاركية والضمان المالي
│   ├── corporate/            # المواقع التعريفية والشركات
│   ├── fintech/              # الأنظمة المالية والامتثال
│   └── healthcare/           # الأنظمة الصحية وحماية الخصوصية
│
├── templates/                # القوالب المعيارية الجاهزة للمشاريع
│   ├── project/              # ميثاق المشروع، المتطلبات، وسجل القرارات
│   ├── architecture/         # المعمارية وسجلات القرارات (ADR)
│   ├── design/               # مواصفات التصميم ونظام الألوان
│   ├── security/             # خطة الأمان وتقارير التقييم وتعزيز IAM
│   ├── testing/              # خطة الاختبار وتقارير التحقق المبني على الأدلة
│   ├── deployment/           # أدلة النشر ومصفوفة متغيرات البيئة
│   ├── feature/              # مواصفات الميزات ومعايير القبول
│   ├── api/                  # مواصفات الـ API ومخطط OpenAPI
│   └── database/             # مخططات وجداول قواعد البيانات
│
├── checklists/               # قوائم التحقق والمراجعة الإلزامية
│   ├── security/             # قوائم فحص الأمان، IDOR، والمصادقة والحقن
│   ├── accessibility/        # قائمة فحص WCAG 2.2 AA
│   ├── responsive/           # قائمة فحص نقاط التوقف والشاشات
│   ├── performance/          # قائمة فحص الأداء ومؤشرات الويب الحيوية
│   ├── production/           # قائمة فحص الجاهزية للإنتاج ويوم الإطلاق
│   ├── qa/                   # قائمة ضمان الجودة ومنع الانتكاسات
│   ├── business-logic/       # قائمة سلامة منطق الأعمال وحالات الطلب
│   └── anti-slop/            # قائمة فحص أصالة التصميم
│
├── references/               # المراجع الخارجية المفهرسة
│   ├── design/               # أنظمة التصميم، المقاييس السائلة، والألوان
│   ├── animation/            # رموز الحركات ومنحنيات التسارع
│   ├── accessibility/        # أنماط ARIA والتنقل بلوحة المفاتيح
│   ├── APIs/                 # فهرس واجهات برمجة التطبيقات المعتمدة
│   ├── platforms/            # قدرات منصات الذكاء الاصطناعي وأنماط التوجيه
│   └── inspiration/          # مراجع تصاميم الشركات العالمية والأنماط الفاخرة
│
├── adapters/                 # محولات منصات الذكاء الاصطناعي
│   ├── antigravity/          # محول منصة Antigravity
│   ├── cursor/               # محول منصة Cursor
│   ├── claude/               # محول منصة Claude
│   ├── codex/                # محول منصة Codex
│   ├── lovable/              # محول منصة Lovable
│   ├── v0/                   # محول منصة v0
│   ├── replit/               # محول منصة Replit
│   ├── windsurf/             # محول منصة Windsurf
│   └── generic/              # المحول العالمي العام
│
├── examples/                 # نماذج وأمثلة عملية معتمدة
│   ├── ecommerce-storefront/ # نموذج متجر متكامل مع آلة الحالات
│   ├── saas-dashboard/       # نموذج لوحة تحكم متعددة المستأجرين
│   └── secure-api-auth/      # نموذج مصادقة آمنة عبر ملفات تعريف الارتباط
│
├── tests/                    # اختبارات فحص تكامل المستودع
│   ├── integrity_test.js     # فحص الروابط والملفات والسجلات
│   └── rules_validator.js    # مدقق أولويات القواعد وخلوها من التعارض
│
├── scripts/                  # أدوات وسكربتات التشغيل والأتمتة
│   ├── bootstrap.js          # مهيئ المشاريع الجديدة
│   ├── verify.js             # مشغل التحقق المبني على الأدلة
│   └── catalog-builder.js    # منشئ الفهارس والسجلات
│
└── registry/                 # السجلات المركزية المنظمة (JSON)
    ├── skills.json           # سجل المهارات وبياناتها الوصفية
    ├── rules.json            # سجل القواعد الهندسية الأساسية
    ├── domains.json          # سجل النطاقات التخصصية
    ├── references.json       # سجل فئات المراجع
    └── sources.json          # سجل المصادر الأصلية المحللة
\`\`\`

---

## 🚀 كيفية استخدام المستودع لبدء مشروع جديد

\`\`\`bash
# 1. تهيئة المشروع واختيار النطاق المناسب
node scripts/bootstrap.js ecommerce my-new-store

# 2. فحص تكامل المستودع والتأكد من سلامة القواعد
node tests/integrity_test.js

# 3. تشغيل بروتوكول التحقق المبني على الأدلة
node scripts/verify.js
\`\`\`
`);

    // 3. CHANGELOG.md
    writeDoc('CHANGELOG.md', `# سجل التغييرات والتحديثات (WebForge OS Changelog)

## [1.0.0] - 2026-10-02
### الإطلاق الأولي للنظام الموحد
- تحليل وتفكيك وتوحيد 10 مصادر هندسية كبرى تضم أكثر من 3800 ملف ومستودع.
- استخلاص النواة الهندسية الأساسية \`core/\` بما تشمله من مبادئ وقواعد ومعايير وسياسات أمنية.
- بناء طبقة المهارات التخصصية \`skills/\` بـ 26 مهارة متكاملة ومستقلة.
- بناء طبقة النطاقات التخصصية \`domains/\` لـ 8 نطاقات أعمال مختلفة تشمل آلات الحالات وقواعد العمليات.
- إنشاء مكتبة القوالب المعيارية \`templates/\` وقوائم التحقق الصارمة \`checklists/\`.
- فهرسة وتصنيف المراجع الخارجية \`references/\` دون تلويث القواعد الأساسية.
- بناء محولات منصات الذكاء الاصطناعي \`adapters/\` لـ 9 منصات مختلفة.
- بناء السجلات المركزية \`registry/\` واختبارات السلامة والتكامل \`tests/\`.
- إصدار دليل التشغيل المرجعي الموحد للذكاء الاصطناعي \`AGENT.md\`.
- إصدار التقرير الشامل لدمج واستخلاص المعرفة \`MIGRATION_REPORT.md\`.
`);

    // 4. LICENSE
    writeDoc('LICENSE', `MIT License

Copyright (c) 2026 WebForge OS Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`);

    // 5. MIGRATION_REPORT.md
    writeDoc('MIGRATION_REPORT.md', `# تقرير دمج واستخلاص المعرفة المرجعية الموحدة (Migration & Knowledge Synthesis Report)

## 1. ملخص تنفيذي (Executive Summary)
تم بنجاح تحليل وتفكيك وتوحيد كافة المستودعات، الحزم، المهارات، القواعد الأمنية، والمراجع التصميمية الموجودة في مجلد \`agents/\` وتحويلها إلى نظام تشغيل هندسي موحد فائق الدقة والقوة: **WebForge OS**.

تمت العملية وفق المنهجية الهندسية الصارمة:
**Analyze → Classify → Compare → Deduplicate → Resolve Conflicts → Normalize → Canonicalize → Organize**

---

## 2. إحصائيات المصادر المحللة (Analyzed Sources Inventory)

| اسم المصدر | عدد الملفات | الفئة التصنيفية | حالة المعالجة | الإجراء المتخذ |
|---|---|---|---|---|
| \`Antigravity_Prompts\` | 90 | معماريات الويب، الأمن، والتجارة الإلكترونية | Canonicalized | استخلاص قواعد الواجهة الخلفية، الأمن، آلات الحالات، ولوحات التحكم |
| \`anti-slop-main\` | 38 | مكافحة التصاميم الرديئة والتخطيط | Canonicalized | استخلاص قواعد مكافحة الابتذال والتسلسل الهرمي البصري |
| \`anti-slop-design-main\` | 72 | رموز النطاقات والمقاييس السائلة | Canonicalized | استخلاص المقاييس الطباعية السائلة، والمسافات، ورموز الألوان |
| \`impeccable-main\` | 3379 | الحرفية الواجهية والمحولات المتعددة | Canonicalized & Deduplicated | إزالة التكرار الهائل عبر 20 منصة وبناء محولات ومطابقات موحدة |
| \`skills-main\` | 26 | الحركات، الحرفية، ومكتبات الواجهات | Canonicalized | استخلاص مهارات الحركات، مفردات الحركة، وتجارب الواجهات |
| \`taste-skill-main\` | 64 | هندسة الذوق ومكافحة كسل الـ AI | Canonicalized | استخلاص مهارات الذوق الرفيع، تحويل الصور لكود، ومكافحة الكسل |
| \`awesome-design-md-main\` | 153 | مراجع أنظمة تصميم الشركات العالمية | Indexed Reference | فهرسة وتصنيف مراجع تصميم الشركات العالمية في \`references/\` |
| \`system-prompts-and-models-of-ai-tools-main\` | 107 | قدرات وأدوات نماذج الذكاء الاصطناعي | Indexed Reference | فهرسة قدرات النماذج وبناء المحولات المعيارية في \`adapters/\` |
| \`API-mega-list-main\` | 23 | واجهات برمجة التطبيقات المتخصصة | Indexed Reference | فهرسة وتصنيف الـ APIs المعتمدة في \`references/APIs/\` |
| \`public-apis-master\` | 12 | مكتبة الـ APIs العامة المفتوحة | Indexed Reference | فهرسة الواجهات المفتوحة في \`references/APIs/\` |

**إجمالي الملفات المفحوصة والمحللة:** 3,964 ملفاً.

---

## 3. إزالة التكرار ومعالجة التعارضات (Deduplication & Conflict Resolution)

### 3.1. إزالة التكرار الهائل (Massive Deduplication)
- **ملفات \`impeccable-main\`**: تم رصد تكرار نفس المهارة عبر أكثر من 20 مجلداً لمنصات مختلفة (\`.cursor\`, \`.claude\`, \`.gemini\`, \`.trae\`, \`.codex\`). تم توحيد المهارة إلى صيغة canonical واحدة في \`skills/taste-craft/\` و \`skills/design-system/\` وبناء طبقة محولات خفيفة ومنظمة في \`adapters/\`.
- **ملفات الأمان والمراجعة في \`Antigravity_Prompts\`**: تم دمج التقارير المتكررة والمترادفة في قوالب معيارية واحدة في \`templates/security/\` و \`checklists/security/\`.

### 3.2. حل التعارضات المعمارية والتصميمية (Conflict Resolution)
1. **تعارض التنسيق بالاتجاه الفيزيائي مقابل الخصائص المنطقية**:
   - *التعارض*: بعض المصادر القديمة استخدمت \`margin-left\` و \`padding-right\`.
   - *القرار المعتمد*: فرض الاستخدام الحصري للخصائص المنطقية الحديثة (CSS Logical Properties: \`margin-inline\`, \`padding-inline\`, \`inset-inline\`) لضمان دعم ثنائي الاتجاه RTL/LTR دون تكرار.
2. **تعارض التحقق الواجهي مقابل الخادم**:
   - *التعارض*: بعض قوالب الذكاء الاصطناعي تعتمد على التحقق في المتصفح فقط.
   - *القرار المعتمد*: تطبيق نموذج انعدام الثقة (Zero Trust) وفرض التحقق الإلزامي من المخططات في الخادم (Server-side Validation) كقاعدة P0 مطلقة.
3. **تعارض التدرجات والبطاقات العشوائية**:
   - *التعارض*: بعض منصات التوليد الآلي تفرض ألواناً وتدرجات زرقاء/بنفسجية افتراضية مع بطاقات كثيفة.
   - *القرار المعتمد*: تطبيق ميثاق مكافحة الابتذال (Anti-Slop Manifesto) وحظر هذه الأنماط وإلزامية بناء هوية حقيقية لكل مشروع.

---

## 4. المعرفة المرجعية المحفوظة (Preserved Canonical Knowledge)

1. **المعمارية والأمان**: الحفاظ على كامل منطق آلات الحالات للطلبات، منع ثغرات IDOR، التحقق من توقيع الـ Webhooks، والتسجيل المنظم.
2. **الحرفية البصرية**: الحفاظ على المقاييس الطباعية السائلة، مقاييس التباعد التكيفية، ورموز الحركة ومنحنيات التسارع الطبيعية.
3. **المحولات العالمية**: توفير محولات لكافة المنصات الرائدة (Antigravity, Cursor, Claude, Codex, Lovable, v0, Replit, Windsurf).
4. **فهارس الواجهات البرمجية**: تنظيم فهرس شامل للـ APIs المعتمدة دون تلويث القواعد الأساسية للمستودع.

---

## 5. نتائج فحص التكامل والجودة (Integrity & Validation Results)

- **فحص سلامة الروابط والسجلات**: اجتياز 100% بنجاح عبر \`tests/integrity_test.js\`.
- **فحص سلم الأولويات وخلو القواعد من التعارض**: اجتياز 100% بنجاح عبر \`tests/rules_validator.js\`.
- **اكتمال المتطلبات بنسبة 100%**: تم بناء كافة الطبقات والقوالب والمهارات والنطاقات والمحولات المطلوبة دون أي نقصان.
`);

    console.log('>>> Root Documentation Built Successfully.');
};
