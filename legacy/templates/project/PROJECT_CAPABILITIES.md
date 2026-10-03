# مصفوفة قدرات بيئة التنفيذ (Project Execution Capabilities Matrix)

| القدرة في بيئة العمل | متوفرة (YES / NO) | الأداة المعتمدة | ملاحظات وقيود البيئة |
|---|---|---|---|
| **متصفح حقيقي (Browser E2E)** | YES | Playwright (Chromium/WebKit) | متوفر لاختبارات الواجهة والتقاط الشاشات |
| **سطر أوامر (Terminal / Shell)** | YES | PowerShell / Node.js | متاح لتشغيل الأوامر والاختبارات والبناء |
| **نظام الملفات (Filesystem)** | YES | Local FS | صلاحيات كاملة للقراءة والكتابة والتدقيق |
| **مشغل الاختبارات (Test Runner)** | YES | Vitest / Jest / Playwright | تشغيل اختبارات الوحدة والتكامل |
| **قاعدة بيانات (Database)** | YES | PostgreSQL / SQLite | متاح لتشغيل الاستعلامات وفحص المعاملات |
| **أدوات الفحص الأمني (SAST/DAST)** | YES | Semgrep / ZAP / ASVS | متاح للفحص الساكن والديناميكي |
| **مراقبة الأخطاء (Observability)** | YES | Sentry / Structured Logs | متاح لتسجيل الاستثناءات ومراقبة الأداء |
| **بيئة النشر والإنتاج (CI/CD / Deployment)** | NO | N/A | غير متاح في هذه الجلسة ويُصنف كـ NOT TESTED |
