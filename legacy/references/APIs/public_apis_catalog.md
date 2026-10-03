# فهرس وتصنيف واجهات برمجة التطبيقات المعتمدة (Public & Specialized APIs Catalog)

## 1. الفئات الرئيسية للواجهات البرمجية
- **الذكاء الاصطناعي ومعالجة اللغات**: OpenAI, Anthropic, Google Gemini, Mistral, HuggingFace.
- **المدفوعات والمعاملات المالية**: Stripe, PayPal, Moyasar, Tap, LemonSqueezy.
- **الاتصالات والإشعارات والبريد**: Twilio, Resend, SendGrid, Pusher, Novu.
- **الخرائط والمواقع الجغرافية**: Mapbox, Google Maps, OpenStreetMap.
- **التخزين السحابي والوسائط**: Cloudinary, AWS S3, Cloudflare R2, Uploadthing.
- **الهوية والمصادقة**: Supabase Auth, Clerk, Auth0, Kinde.

## 2. قواعد الاستخدام
- حظر استدعاء الواجهات الخارجية مباشرة من المتصفح إذا كانت تتطلب مفاتيح سرية (API Keys)؛ تمرير كافة الاستدعاءات عبر الواجهة الخلفية الآمنة (Backend Proxy).
