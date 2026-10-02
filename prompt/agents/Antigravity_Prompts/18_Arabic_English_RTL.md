# Internationalization (i18n), Bidi & RTL/LTR Support

نفّذ نظام دعم اللغات المتعددة (Arabic / English) والتوجيه البرمجي والتصميمي (RTL / LTR) عبر المتجر بالكامل.

## 1. محرك اللغات والاتجاهات (i18n Engine & RTL Switcher)
* **اللغات المدعومة**: العربية (`ar`) والإنجليزية (`en`).
* **تبديل اتجاه الصفحة (Dynamic Direction & Attribute Control)**:
  * عند اختيار العربية (`ar`): ضبط `dir="rtl"` و `lang="ar"` على عنصر `<html>` في المستند.
  * عند اختيار الإنجليزية (`en`): ضبط `dir="ltr"` و `lang="en"` على عنصر `<html>`.
  * حفظ تفضيل اللغة للعميل في `localStorage` كفرعي، واسترجاعه تلقائياً أو الاعتماد على ترويسة المتصفح `Accept-Language`.
* **التوافق الهيكلي للتصميم (CSS RTL Rules & Logical Properties)**:
  * استخدام خصائص CSS Logical Properties (مثل `margin-inline-start`, `padding-inline-end`, `inset-inline-start`) أو مكتبة تنسيق تضمن انقلابات هوامش ومحاذاة التخطيط تلقائياً عند تغيير الاتجاه.

## 2. تغطية العناصر والمكونات (Full UI Components i18n Coverage)
* جعل كافة النصوص في Frontend قابلة للترجمة الديناميكية بدقة دون أي نصوص صلبة (No Hardcoded Strings) لجميع المكونات والصفحات:
  * Header, Navigation & Search Bar.
  * Product Cards & Grid.
  * Product Details Page (المواصفات، التقييمات، المخزون).
  * Cart & Wishlist Drawers / Pages.
  * Forms & Validation Messages (نماذج الدخول، التسجيل، العناوين).
  * Checkout Steps & Summaries.
  * User Account & Order History / Tracking Pages.
  * Admin Dashboard, Charts & Tables.

## 3. تهيئة البيانات وتدويل الأرقام والعملات والتواريخ (Localization Formatting)
* **تنسيق العملات (Currency Formatting)**:
  * دعم التنسيق المحلي للعملات بحسب اللغة والموقع (مثل `100 ر.س` باللغة العربية أو `100 SAR` باللغة الإنجليزية / `EGP` / `USD`).
  * استخدام API القياسي `Intl.NumberFormat`.
* **تنسيق التواريخ والأرقام (Date & Number Formatting)**:
  * تنسيق التواريخ بحسب اللغة النشطة باستعمال `Intl.DateTimeFormat` أو مكتبة تواريخ خفيفة (إظهار التواريخ بالأرقام العربية/اللاتينية والأسماء المحلية للموضوع).
  * تنسيق الأرقام القياسية والمخزون بشكل متوافق محلياً.
* **دعم لغة البيانات في قاعدة البيانات (Database Multi-Language Schema)**:
  * دعم الحقول المترجمة لأسماء المنتجات والتصنيفات في الباك إند (إما عبر أثواب JSON تحتوي على `name_ar` و `name_en` أو جداول الترجيع المترجمة) لإرجاع اللغة المناسبة بحسب ترويسة الطلب `Accept-Language` أو Query Parameter.
