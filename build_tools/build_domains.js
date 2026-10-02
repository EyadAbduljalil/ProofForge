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
    console.log(`[DOMAIN] Created: ${filePath}`);
}

module.exports = function buildDomains() {
    console.log('>>> Building Domain Layer...');

    // 1. Ecommerce
    writeDoc('domains/ecommerce/rules.md', `# قواعد المتاجر والتجارة الإلكترونية (Ecommerce Domain Rules)

1. **حسابات الأسعار والضرائب**:
   - كافة الحسابات المالية تنفذ حصراً في الخادم وتخزن بوحدات العملة الصغرى (مثل السنتات/الهللات) كأعداد صحيحة (Integers) لتجنب أخطاء الفاصلة العائمة.
   - يتم تجميد أسعار العناصر، تكلفة الشحن، ونسب الضرائب فور إنشاء الطلب وتخزينها في جدول \`order_items\` لمنع تغير تكلفة الطلب عند تغير أسعار المنتجات مستقبلاً.

2. **عربة التسوق والمخزون**:
   - التحقق من توفر المخزون قبل الإضافة للسلة وقبل إتمام الدفع مباشرة.
   - قفل سجلات المخزون مؤقتاً أثناء عملية الدفع لتفادي البيع الزائد (Overselling / Stock Race).
`);

    writeDoc('domains/ecommerce/state_machines.md', `# آلة حالات الطلبات (Ecommerce Order State Machine)

\`\`\`mermaid
stateDiagram-v2
    [*] --> DRAFT : إنشاء المسودة
    DRAFT --> PENDING_PAYMENT : تقديم الطلب
    PENDING_PAYMENT --> PAID : تأكيد الدفع
    PENDING_PAYMENT --> PAYMENT_FAILED : فشل الدفع
    PAYMENT_FAILED --> PENDING_PAYMENT : إعادة المحاولة
    PAYMENT_FAILED --> CANCELLED : إلغاء الطلب
    PAID --> PROCESSING : بدء التجهيز
    PROCESSING --> SHIPPED : الشحن
    SHIPPED --> DELIVERED : التسليم
    DELIVERED --> COMPLETED : إتمام فترة الضمان
    DELIVERED --> RETURN_REQUESTED : طلب إرجاع
    RETURN_REQUESTED --> RETURNED : قبول واستلام المرتجع
    RETURNED --> REFUNDED : استرجاع المبلغ
    PAID --> REFUNDED : إلغاء واسترجاع مباشر
\`\`\`

- **حظر القفزات غير الشرعية**: يُحظر نقل الطلب من DRAFT إلى SHIPPED أو من CANCELLED إلى PAID دون المرور بالمسار المعتمد.
`);

    writeDoc('domains/ecommerce/workflows.md', `# تدفقات الشراء والإرجاع (Ecommerce Workflows)

1. **تدفق الشراء**:
   - تصفح المنتجات ← إضافة للسلة ← صفحة إتمام الطلب (Checkout) ← اختيار العنوان وطريقة الشحن ← التحقق من الكوبون ← تحويل الدفع ← استلام رد البوابة عبر Webhook مع التوقيع الرقمي ← تحديث حالة الطلب ← إرسال إشعار للمشتري.

2. **تدفق الإرجاع والاسترداد**:
   - طلب الإرجاع من العميل مع ذكر السبب ← مراجعة الإدارة ← إصدار بوليصة الإرجاع ← استلام وفحص المنتج في المستودع ← معالجة الاسترداد المالي للبطاقة الأصلية.
`);

    writeDoc('domains/ecommerce/security.md', `# أمان المتاجر الإلكترونية (Ecommerce Security)

1. **التحقق من إشعارات الدفع (Webhooks)**: التحقق الإلزامي من التوقيع الرقمي (HMAC Signature) لكل إشعار دفع قادم من البوابة ومقارنته بالسر المشترك.
2. **منع التلاعب بالأسعار (Price Tampering)**: تجاهل أي سعر مرسل من العميل في طلبات الشراء والاعتماد الحصري على السعر المسجل في قاعدة البيانات.
3. **مفاتيح عدم التكرار (Idempotency Keys)**: فرض مفتاح فريد لكل معاملة دفع لمنع تكرار الخصم من حساب العميل عند تكرار الضغط أو انقطاع الشبكة.
`);

    // 2. SaaS
    writeDoc('domains/saas/rules.md', `# قواعد منصات البرمجيات كخدمة (SaaS Domain Rules)

1. **عزل المستأجرين (Tenant Isolation)**:
   - عزل بيانات كل عميل (Tenant) بشكل صارم على مستوى قاعدة البيانات مع إرفاق \`tenant_id\` في كل استعلام لقاعدة البيانات.
   - منع أي وصول عابر بين المستأجرين (Cross-tenant Data Leakage).

2. **إدارة الاشتراكات والحدود (Quotas & Limits)**:
   - فحص حصص الاستخدام (مثل عدد المستخدمين، المساحة التخزينية، وعدد الطلبات) في الواجهة الخلفية قبل السماح بأي عملية إنشاء أو رفع.
`);

    writeDoc('domains/saas/multi_tenancy.md', `# بنية تعدد المستأجرين (Multi-Tenancy Architecture)

- **استراتيجية العزل**: Row-Level Isolation مع فلاتر استعلام تلقائية (Middleware Tenant Context) أو Schema-per-Tenant للمشاريع المؤسسية الضخمة.
- **إدارة المستخدمين والأدوار**: دعم دعوة أعضاء الفريق، وتعيين أدوار مخصصة (Owner, Admin, Member, Viewer) لكل مساحة عمل (Workspace).
`);

    writeDoc('domains/saas/billing.md', `# إدارة الفواتير والاشتراكات (SaaS Billing & Subscriptions)

- ربط بوابات الاشتراكات (Stripe / LemonSqueezy) مع مزامنة الحالات عبر Webhooks.
- معالجة فترات التجربة (Trial Periods)، الترقية والتخفيض النسبي (Proration)، وإلغاء الاشتراك عند انتهاء دورة الفوترة.
`);

    // 3. LMS
    writeDoc('domains/lms/rules.md', `# قواعد منصات إدارة التعلم (LMS Domain Rules)

1. **صلاحيات المحتوى والمساقات**:
   - حظر الوصول للمواد التعليمية والفيديوهات والاختبارات إلا للطلاب المسجلين والموثق دفعهم للمساق.
   - حماية روابط الفيديوهات عبر روابط موقعة ومؤقتة (Signed URLs / HLS Encryption).

2. **تتبع التقدم وإصدار الشهادات**:
   - تسجيل إكمال الدروس واحتساب نسبة التقدم تلقائياً مع حظر التلاعب اليدوي بنسبة الإنجاز من طرف العميل.
   - إصدار شهادات موثقة برمز استجابة سريعة (QR Code) ورقم تسلسلي فريد يمكن التحقق منه علنياً.
`);

    writeDoc('domains/lms/grading_courses.md', `# إدارة الاختبارات والتقييمات (LMS Grading & Quizzes)

- تسجيل توقيت بدء الاختبار وحساب الوقت بدقة في الخادم.
- منع كشف الإجابات الصحيحة للواجهة الأمامية قبل تسليم الاختبار واعتماده من الخادم.
- دعم التصحيح الآلي للاختبارات الموضوعية والتصحيح اليدوي للمهام المقالية مع تسجيل ملاحظات المعلم.
`);

    writeDoc('domains/lms/security.md', `# أمان منصات التعلم (LMS Security)

- منع مشاركة الحسابات المتزامنة إن تطلب نموذج العمل ذلك عبر تتبع الجلسات النشطة.
- حماية حقوق الملكية الفكرية للمحتوى التعليمي ومنع التنزيل المباشر غير المصرح به للمواد الحصرية.
`);

    // 4. Dashboard
    writeDoc('domains/dashboard/rules.md', `# قواعد لوحات التحكم والتحليلات (Dashboard Domain Rules)

1. **كفاءة الاستعلامات والتجميع**:
   - استخدام استعلامات التجميع المحسنة وجداول التلخيص المسبق (Materialized Views) للتقارير الثقيلة لمنع إبطاء قاعدة البيانات الرئيسية.
   - التخزين المؤقت للبيانات التحليلية مع تحديثها دورياً عبر Background Jobs.

2. **تجربة التصفية والبحث**:
   - حفظ حالات التصفية والبحث والصفحات في معلمات الـ URL لتسهيل مشاركة الروابط والرجوع للحالة السابقة.
`);

    writeDoc('domains/dashboard/dataviz.md', `# معايير تصوير البيانات والمخططات (Data Visualization Standards)

- اختيار نوع المخطط المناسب للبيانات (Line Charts للاتجاهات الزمنية، Bar Charts للمقارنات الفئوية، Donut Charts للنسب المحدودة).
- توفير تلميحات بصرية تفاعلية (Tooltips) دقيقة وتوضيح وحدات القياس بوضوح.
- مراعاة التباين اللوني للمستخدمين المصابين بعمى الألوان.
`);

    // 5. Marketplace
    writeDoc('domains/marketplace/rules.md', `# قواعد منصات المتاجر المتعددة (Marketplace Domain Rules)

1. **الضمان المالي وحجز الأموال (Escrow Logic)**:
   - احتجاز قيمة المعاملة حتى تأكيد استلام المشتري للخدمة أو المنتج قبل تحويل المستحقات للبائع.
   - احتساب عمولة المنصة تلقائياً وتوثيقها في سجلات محاسبية منفصلة.

2. **إدارة البائعين والمتاجر**:
   - التحقق من هوية البائعين (KYC) قبل تفعيل صلاحيات البيع واستقبال الأموال.
`);

    // 6. Corporate
    writeDoc('domains/corporate/rules.md', `# قواعد المواقع التعريفية والشركات (Corporate & Landing Domain Rules)

1. **السرعة والظهور**: سرعة تحميل فورية (LCP < 1.5s) مع تهيئة كاملة لمحركات البحث وشبكات التواصل الاجتماعي (Open Graph / Twitter Cards).
2. **التقاط العملاء المحتملين (Lead Generation)**: نماذج اتصال سريعة، مؤمنة ضد الرسائل المزعجة (Spam Protection / Turnstile)، ومتصلة بنظام CRM الداخلي.
`);

    // 7. Fintech
    writeDoc('domains/fintech/rules.md', `# قواعد الأنظمة المالية والمصرفية (Fintech Domain Rules)

1. **الامتثال المحاسبي والقيد المزدوج (Double-Entry Bookkeeping)**:
   - كافة المعاملات المالية تسجل كقيدين متوازنين (مدين ودائن)؛ لا يجوز تعديل أي سجل مالي سابق بل تسجل حركة تسوية جديدة.
2. **سجلات التدقيق غير القابلة للتعديل (Immutable Audit Trail)**:
   - تسجيل كل عملية مالية وتوقيعها مع تشفير بيانات الحسابات المصرفية وفق معايير PCI-DSS.
`);

    // 8. Healthcare
    writeDoc('domains/healthcare/rules.md', `# قواعد الأنظمة الصحية والطبية (Healthcare Domain Rules)

1. **سرية وسجلات المرضى (HIPAA / Privacy Compliance)**:
   - تشفير السجلات الطبية الشخصية (PHI) أثناء النقل والتخزين وفصل بيانات التعريف عن السجلات التشخيصية.
2. **الوصول المشروط**: منح الكوادر الطبية حق الوصول لسجلات المريض فقط أثناء فترة المتابعة النشطة والمصرح بها مع تسجيل كل عملية استعراض.
`);

    console.log('>>> Domain Layer Built Successfully (8 Domains).');
};
