const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function writeDoc(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
    console.log(`[TEMPLATE] Created: ${filePath}`);
}

module.exports = function buildTemplates() {
    console.log('>>> Building Templates Layer...');

    // 1. Project
    writeDoc('templates/project/PROJECT.md', `# ميثاق المشروع (Project Charter)

## 1. نبذة عامة
- **اسم المشروع**: [أدخل اسم المشروع]
- **النوع**: [Landing Page / SaaS / Dashboard / Ecommerce / LMS / Marketplace / Corporate / Web App]
- **الهدف الاستراتيجي**: [وصف الهدف الرئيسي للمشروع والقيمة المقدمة للمستخدمين]
- **الجمهور المستهدف**: [تحديد الفئات المستهدفة واللغات المدعومة]

## 2. المكدس التقني المعتمد (Tech Stack)
- **الواجهة الأمامية (Frontend)**: [React / Next.js / Vue / Vanilla HTML/CSS]
- **الواجهة الخلفية (Backend)**: [Node.js / Express / NestJS / FastAPI / Go / Laravel]
- **قاعدة البيانات (Database)**: [PostgreSQL / MySQL / MongoDB / SQLite]
- **المصادقة وإدارة الجلسات (Auth)**: [Custom JWT HttpOnly / Supabase / Auth0 / NextAuth]
- **بوابات الدفع (Payments)**: [Stripe / Moyasar / Tap / PayPal]
- **البنية التحتية والاستضافة (Deployment)**: [Docker / VPS / Vercel / AWS]

## 3. معايير النجاح (Success Criteria)
- اكتمال كافة الميزات المحددة في \`REQUIREMENTS.md\`.
- اجتياز كافة الفحوصات الأمنية والتحقق المبني على الأدلة بنسبة 100%.
- توافق كامل مع معايير الأداء وإمكانية الوصول والتصميم المتجاوب.
`);

    writeDoc('templates/project/REQUIREMENTS.md', `# وثيقة المتطلبات الوظيفية وغير الوظيفية (Requirements Specification)

## 1. المتطلبات الوظيفية (Functional Requirements)
- **[REQ-01] وحدة المصادقة والحسابات**:
  - تسجيل مستخدم جديد مع التحقق من البريد الإلكتروني.
  - تسجيل الدخول مع الحماية ضد الهجمات المتكررة (Rate Limiting & Brute Force).
- **[REQ-02] الوحدة الرئيسية / النطاق**:
  - [حدد متطلبات الميزات الأساسية بالتفصيل].

## 2. المتطلبات غير الوظيفية (Non-Functional Requirements)
- **الأمان والحماية**: نموذج انعدام الثقة (Zero Trust)، حماية من ثغرات IDOR وحقن الاستعلامات.
- **الأداء والسرعة**: زمن استجابة الـ API أقل من 200ms، وتحميل الصفحة في أقل من ثانيتين.
- **التوافقية والوصول**: دعم RTL/LTR بالكامل، التوافق مع WCAG 2.2 AA، والتجاوب التام مع كافة أحجام الشاشات.
`);

    writeDoc('templates/project/DECISIONS.md', `# سجل القرارات الهندسية (Project Architecture Decisions Log)

| الرقم | القرار | الحالة | التاريخ | الرابط |
|---|---|---|---|---|
| ADR-001 | اختيار قاعدة بيانات PostgreSQL | معتمد | 2026-10-02 | [docs/decisions/ADR-001.md](docs/decisions/ADR-001.md) |
| ADR-002 | اعتماد المصادقة عبر ملفات تعريف ارتباط HttpOnly | معتمد | 2026-10-02 | [docs/decisions/ADR-002.md](docs/decisions/ADR-002.md) |
`);

    // 2. Architecture
    writeDoc('templates/architecture/ARCHITECTURE.md', `# الوثيقة المعمارية للنظام (System Architecture Specification)

## 1. الهيكل المعماري العام (High-Level Architecture)
\`\`\`mermaid
graph TD
    Client["العميل (Browser / Mobile)"] --> CDN["شبكة توصيل المحتوى & حائط الحماية (WAF/CDN)"]
    CDN --> ReverseProxy["خادم التوجيه العكسي (Nginx / Caddy)"]
    ReverseProxy --> API["خادم التطبيق & المنطق البرمجي (Backend API)"]
    API --> DB[("قاعدة البيانات الأساسية (PostgreSQL)")]
    API --> Cache[("خادم التخزين المؤقت & الرتل (Redis)")]
    API --> Storage["خدمة تخزين الملفات السحابية (S3 / Object Storage)"]
    API --> Gateways["بوابات الدفع والخدمات الخارجية"]
\`\`\`

## 2. الطبقات البرمجية والمسؤوليات
- **طبقة الواجهات (Presentation Layer)**: معالجة العرض، التفاعل، والحالات دون احتواء منطق أعمال.
- **طبقة الخدمات (Domain / Service Layer)**: تنفيذ قواعد الأعمال والمعاملات والتحقق الأمني.
- **طبقة الوصول للبيانات (Persistence Layer)**: استعلامات قاعدة البيانات المجهزة والترحيلات.

## 3. تدفق البيانات والأمان
- تشفير كافة الاتصالات عبر TLS 1.3.
- التحقق الصارم من المدخلات وتفويض الصلاحيات عند كل نقطة وصول.
`);

    writeDoc('templates/architecture/ADR_TEMPLATE.md', `# سجل قرار معماري: [عنوان القرار] (ADR-XXX)

## الحالة
[مقترح / معتمد / ملغى / مستبدل بـ ADR-YYY]

## السياق والدافع (Context)
[شرح المشكلة الهندسية أو المعمارية والدوافع وراء الحاجة لاتخاذ قرار جديد].

## الخيارات التي تمت دراستها (Options Considered)
1. **الخيار الأول**: [الوصف، الإيجابيات، السلبيات]
2. **الخيار الثاني**: [الوصف، الإيجابيات، السلبيات]

## القرار المعتمد والسبب (Decision & Rationale)
[بيان الخيار المعتمد وتوضيح أسباب اختياره وفقاً للأمان، الأداء، وقابلية التوسع].

## العواقب والآثار المترتبة (Consequences)
- **الإيجابيات**: [الفوائد المحققة]
- **التحديات والمخاطر**: [التحديات وكيفية معالجتها]
`);

    // 3. Design
    writeDoc('templates/design/DESIGN.md', `# مواصفات التصميم وهوية الواجهات (Design System & UI Spec)

## 1. لغة التصميم والهوية البصرية
- **الطابع العام**: [تصميم أصيل، احترافي، خالي من التدرجات العشوائية والبطاقات المفرطة (Anti-Slop)].
- **الألوان الأساسية والدلالية**:
  - لون العلامة (Primary): \`#2563EB\`
  - لون الخلفية الأساسي (Background): \`#0F172A\` (الوضع الداكن) / \`#FFFFFF\` (الوضع الفاتح)
  - لون السطوح والبطاقات (Surface): \`#1E293B\` / \`#F8FAFC\`
  - لون النصوص الرئيسية (Text Primary): \`#F8FAFC\` / \`#0F172A\`
  - لون النصوص الثانوية (Text Muted): \`#94A3B8\` / \`#64748B\`
  - ألوان الحالات (Success, Warning, Danger, Info).

## 2. المقياس الطباعي (Typography Scale)
- الخط الإنجليزي: \`Inter\` / \`Geist\`
- الخط العربي: \`IBM Plex Sans Arabic\` / \`Readex Pro\`
- مقياس الحجوم: \`xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px)\`.
`);

    writeDoc('templates/design/DESIGN_SYSTEM.md', `# دليل نظام التصميم والرموز البرمجية (Design System Guide)

## 1. متغيرات CSS المعتمدة
\`\`\`css
:root {
  --font-sans: 'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
\`\`\`

## 2. قواعد المكونات والتفاعل
- الأزرار: حالات التفاعل (Hover, Active, Focus-visible, Disabled, Loading).
- الحقول: تسميات واضحة، رسائل خطأ محاذاة، وتلميحات دقيقة.
`);

    // 4. Security
    writeDoc('templates/security/SECURITY.md', `# خطة وسياسة الأمن الشاملة (Security Architecture Plan)

## 1. آليات الحماية المطبقة
- **المصادقة والتفويض**: نموذج الصلاحيات المرتكز على الأدوار (RBAC) مع فحص ملكية الموارد ضد ثغرات IDOR.
- **حماية المدخلات والبيانات**: التحقق الصارم من المخططات (Schema Validation) والاستعلامات المجهزة (Parameterized Queries).
- **إدارة الجلسات والأسرار**: تخزين الرموز في ملفات تعريف ارتباط HttpOnly آمنة، وعزل مفاتيح البيئة.
- **رؤوس الأمان (HTTP Security Headers)**:
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin

## 2. مصفوفة الصلاحيات (Permission Matrix)
| الدور | استعراض المنتجات | إنشاء طلب | تعديل الأسعار | إدارة المستخدمين |
|---|---|---|---|---|
| زائر (Guest) | نعم | لا | لا | لا |
| عميل (Customer) | نعم | نعم (طلبه فقط) | لا | لا |
| مدير متجر (Store Admin) | نعم | نعم | نعم | لا |
| مدير النظام (Super Admin) | نعم | نعم | نعم | نعم |
`);

    writeDoc('templates/security/SECURITY_ASSESSMENT_TEMPLATE.md', `# تقرير التقييم والفحص الأمني (Security Assessment Report)

## 1. ملخص تنفيذي للأمن (Security Summary)
- **حالة النظام الإجمالية**: [آمن / يحتوي على ملاحظات حرجة / قيد المعالجة]
- **عدد الثغرات المكتشفة**: [إجمالي الثغرات] (حرجة: X, عالية: Y, متوسطة: Z, منخفضة: W)

## 2. قائمة الثغرات المكتشفة (Detected Vulnerabilities)

### الثغرة رقم [SEC-01]: [اسم الثغرة، مثال: انعدام التحقق من ملكية الطلب IDOR]
- **مستوى الخطورة**: [Critical / High / Medium / Low]
- **التفسير التقني**: [شرح دقيق لكيفية حدوث الثغرة والمسار المتأثر].
- **تقييم الأثر (Impact Assessment)**: [شرح الأثر الواقع في حال استغلال الثغرة مثل تسريب بيانات العملاء].
- **خطوات إعادة الإنتاج (Reproduction Steps)**:
  1. إرسال طلب GET للمسار \`/api/orders/999\` بحساب مستخدم عادي.
  2. ملاحظة استجابة الخادم ببيانات الطلب 999 العائد لمستخدم آخر.
- **توصيات وإجراءات الإصلاح (Fix Recommendations)**:
  - إضافة شرط فحص ملكية السجل: \`WHERE id = :orderId AND user_id = :currentUserId\`.

## 3. قائمة المهام القابلة للتنفيذ (Actionable TODO Checklist)
- [ ] إصلاح ثغرة IDOR في مسار جلب الطلبات \`GET /api/orders/:id\`.
- [ ] تعزيز إعدادات ملفات تعريف الارتباط وإضافة السمة \`Secure; HttpOnly; SameSite=Strict\`.
- [ ] تطبيق تحديد معدل الطلبات على مسار استعادة كلمة المرور \`POST /api/auth/forgot-password\`.
`);

    writeDoc('templates/security/IAM_HARDENING.md', `# دليل تعزيز أمن الهوية والوصول (IAM Hardening Guide)

1. فرض كلمات مرور معقدة لا تقل عن 12 حرفاً مع أرقام ورموز خاصة.
2. تدوير رموز التحديث (Refresh Token Rotation) وإلغاء كافة الرموز السابقة عند كل طلب تجديد.
3. قفل الحساب مؤقتاً لمدة 15 دقيقة بعد 5 محاولات تسجيل دخول فاشلة متتالية.
`);

    // 5. Testing
    writeDoc('templates/testing/TESTING.md', `# خطة واستراتيجية الاختبار (Testing Strategy Plan)

## 1. مستويات الاختبار المطلوبة
- **اختبارات الوحدة (Unit Tests)**: تغطية 100% لمنطق حسابات الأسعار، التحقق من المخططات، ودوال التحويل.
- **اختبارات التكامل (Integration Tests)**: فحص مسارات الـ API بالكامل مع قاعدة بيانات تجريبية.
- **اختبارات النظام الشاملة (E2E Tests)**: فحص مسار التسجيل والشراء ولوحة التحكم.

## 2. الأوامر وسير العمل
\`\`\`bash
# تشغيل اختبارات الوحدة
npm run test:unit

# تشغيل اختبارات التكامل
npm run test:integration

# تشغيل الفحص الأمني
npm run test:security
\`\`\`
`);

    writeDoc('templates/testing/VERIFICATION_REPORT_TEMPLATE.md', `# تقرير التحقق المبني على الأدلة (Evidence-Based Verification Report)

## 1. جدول الفحوصات والنتائج
| المعرف | بند الفحص | طريقة الفحص | النتيجة (PASS/FAIL) | الدليل المرفق | ملاحظات |
|---|---|---|---|---|---|
| VER-01 | فحص منع ثغرة IDOR في مسار الطلبات | استدعاء API بمستخدم غير مخول | PASS | رمز الاستجابة 403 Forbidden | تم التحقق من سلامة العزل |
| VER-02 | فحص التجاوب على شاشات الهواتف 375px | فحص بصري عبر المحاكي | PASS | لقطة شاشة توضح غياب التمرير الأفقي | القائمة المنسدلة تعمل بسلاسة |
| VER-03 | فحص التباين اللوني وفق WCAG AA | فحص عبر أداة Axe / Lighthouse | PASS | نسبة التباين لكافة النصوص > 4.5:1 | لا توجد مخالفات |

## 2. المشكلات المتبقية والمخاطر
- لا توجد مشكلات حرجة متبقية تعيق الإطلاق للإنتاج.
`);

    // 6. Deployment
    writeDoc('templates/deployment/DEPLOYMENT.md', `# دليل النشر والإطلاق للإنتاج (Production Deployment Guide)

## 1. المتطلبات المسبقة
- خادم الإنتاج مزود بنظام حماية وجدار ناري مفعل (UFW / Cloudflare).
- إعداد شهادات SSL/TLS صالحة ومحدثة تلقائياً عبر Let's Encrypt.
- تكوين قاعدة البيانات في شبكة خاصة معزولة عن الوصول العام.

## 2. خطوات النشر الآمن
1. سحب الإصدار المستقر المعتمد من الفرع الرئيسي \`main\`.
2. فحص وتطبيق ترحيلات قاعدة البيانات: \`npm run db:migrate\`.
3. بناء النسخة الإنتاجية المحسنة: \`npm run build\`.
4. إعادة تشغيل الخدمة بدون انقطاع (Zero-downtime Rolling Restart).
5. التحقق من نقطة الفحص الصحي: \`curl https://example.com/healthz\`.
`);

    writeDoc('templates/deployment/PRODUCTION_CONFIG.md', `# مصفوفة متغيرات بيئة الإنتاج (Production Environment Variables Matrix)

\`\`\`ini
# إعدادات التطبيق
NODE_ENV=production
PORT=3000
APP_ORIGIN=https://example.com

# أمان الجلسات والتشفير
JWT_SECRET=super_secret_high_entropy_key_minimum_64_chars_length
SESSION_SECRET=another_super_secure_entropy_key_for_cookies

# قاعدة البيانات
DATABASE_URL=postgresql://app_user:secure_password@internal-db.host:5432/app_db?sslmode=require

# بوابات الدفع
PAYMENT_GATEWAY_KEY=live_key_xxx
PAYMENT_WEBHOOK_SECRET=whsec_xxx

# التخزين السحابي
STORAGE_BUCKET=app-production-assets
STORAGE_ACCESS_KEY=xxx
STORAGE_SECRET_KEY=yyy
\`\`\`
`);

    // 7. Feature, API, Database
    writeDoc('templates/feature/FEATURE_SPEC.md', `# مواصفات الميزة البرمجية (Feature Specification)

## 1. بطاقة الميزة
- **عنوان الميزة**: [اسم الميزة]
- **النطاق**: [Frontend / Backend / Fullstack]
- **الهدف**: [شرح الهدف المباشر للميزة]

## 2. معايير القبول (Acceptance Criteria)
- [ ] معيار 1: [سلوك متوقع محدد بدقة].
- [ ] معيار 2: [سلوك التحقق ومعالجة الأخطاء].
- [ ] معيار 3: [اختبار الأمان والصلاحيات للميزة].
`);

    writeDoc('templates/api/API_SPEC.md', `# مواصفات واجهات برمجة التطبيقات (API Specification)

## 1. المسارات ونقاط النهاية (Endpoints)

### \`POST /api/v1/orders\`
- **الوصف**: إنشاء طلب جديد بعد تثبيت الأسعار والتحقق من المخزون.
- **الصلاحية المطلوبة**: مستخدم مسجل (\`customer\`).
- **جسم الطلب (Request Body)**:
\`\`\`json
{
  "items": [
    { "productId": "prod_123", "quantity": 2 }
  ],
  "shippingAddressId": "addr_456",
  "couponCode": "DISCOUNT10"
}
\`\`\`
- **الاستجابة الناجحة (\`201 Created\`)**:
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "ord_789",
    "status": "PENDING_PAYMENT",
    "totalAmount": 19900,
    "currency": "SAR"
  }
}
\`\`\`
`);

    writeDoc('templates/api/OPENAPI_STARTER.yaml', `openapi: 3.1.0
info:
  title: WebForge OS Unified API Specification
  version: 1.0.0
  description: المواصفة المرجعية الموحدة لواجهات برمجة التطبيقات الآمنة.
paths:
  /healthz:
    get:
      summary: فحص صحة وجاهزية النظام
      responses:
        '200':
          description: النظام يعمل بكفاءة
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: ok
`);

    writeDoc('templates/database/SCHEMA_SPEC.md', `# مواصفات مخطط قاعدة البيانات (Database Schema Specification)

## 1. الجداول الأساسية والعلاقات

### جدول المستخدمين (\`users\`)
- \`id\`: UUID (Primary Key)
- \`email\`: VARCHAR(255) UNIQUE NOT NULL
- \`password_hash\`: VARCHAR(255) NOT NULL
- \`role\`: VARCHAR(50) DEFAULT 'customer' NOT NULL
- \`created_at\`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- \`updated_at\`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

### جدول الطلبات (\`orders\`)
- \`id\`: UUID (Primary Key)
- \`user_id\`: UUID REFERENCES users(id) ON DELETE RESTRICT
- \`status\`: VARCHAR(50) NOT NULL
- \`total_amount\`: BIGINT NOT NULL (بالهللات/السنتات)
- \`currency\`: VARCHAR(3) DEFAULT 'SAR' NOT NULL
- \`created_at\`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
`);

    console.log('>>> Templates Layer Built Successfully.');
};
