# Server-Side Search, Filtering & Pagination

نفّذ محرك بحث وفلترة عالي الأداء من جانب السيرفر (Server-Side Search & Filtering Engine) للاستعلام عن المنتجات بكفاءة وبدون تحميل كامل البيانات إلى Frontend.

## 1. البحث الشامل (Server-Side Full-Text / Pattern Search)
* إجراء البحث حصرياً من الباك إند عبر قاعدة البيانات (مثل SQL `ILIKE` أو Postgres Full-Text Search).
* نطاق البحث يشمل الحقول التالية:
  * اسم المنتج (`name`).
  * رمز المنتج الفريد (`SKU`).
  * العلامة التجارية (`brand`).
  * اسم التصنيف (`category`).
  * الوصف (`description`).

## 2. الفلترة المتقدمة (Dynamic Filtering Criteria)
* إمكانية دمج وتطبيق فلاتر متعددة في استعلام واحد:
  * **Category Filter**: فلترة بحسب التصنيف الرئيسي أو الفرعي (`categoryId`).
  * **Brand Filter**: فلترة بحسب العلامة التجارية (`brandId` / `brand`).
  * **Price Range Filter**: فلترة بالحد الأدنى والأقصى للسعر (`minPrice`, `maxPrice`).
  * **Rating Filter**: فلترة بحد متوسط التقييم الأدنى (`minRating` e.g. 4+ stars).
  * **Availability Filter**: فلترة بحسب التوفر في المخزون (`inStockOnly = true`).

## 3. الترتيب والتقسيم الصفحي (Sorting & Pagination)
* **خيارات الترتيب (Sorting Options)**:
  * `relevance`: بحسب ملاءمة مطابقة البحث.
  * `newest`: أحدث المنتجات المضافة (تاريخ الإنشاء).
  * `price_asc`: السعر من الأقل إلى الأعلى.
  * `price_desc`: السعر من الأعلى إلى الأقل.
  * `rating`: الأعلى تقييماً.
  * `best_selling`: الأكثر مبيعاً (بناءً على إجمالي الكميات المباعة).
* **التقسيم الصفحي المتجاوب (Server-Side Pagination)**:
  * استقبال معاملات `page` (الافتراضي 1) و `limit` (الافتراضي 12 أو 24).
  * إرجاع استجابة قياسية تحتوي على: `items`, `totalCount`, `page`, `totalPages`, `hasNextPage`, `hasPrevPage`.
  * ربط الفلاتر والتقسيم الصفحي بـ URL Query Parameters في Frontend لسهولة المشاركة والحفاظ على حالة الصفحة عند التحديث.

## 4. أداء قاعدة البيانات ومنع التحميل الزائد (Database Optimization & Indexing)
* **الفهارس (Database Indexes)**:
  * إنشاء Indexes مخصصة في قاعدة البيانات على الحقول الأكثر استخداماً في البحث والفلترة والترتيب (`category_id`, `brand_id`, `price`, `created_at`, `average_rating`, `is_active`).
* **تحسين الاستعلامات والـ Payloads**:
  * جلب الحقول المطلوبة للعرض فقط في القائمة (عدم جلب الأوصاف الطويلة أو العلاقات غير الضرورية).
  * حظر وتحريم تحميل كافة منتجات المتجر إلى الـ Frontend وإجراء الفلترة في المتصفح مطلقاً.
