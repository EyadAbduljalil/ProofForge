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
    console.log(`[REFERENCE] Created: ${filePath}`);
}

module.exports = function buildReferences() {
    console.log('>>> Building References Layer...');

    // 1. Design References
    writeDoc('references/design/curated_design_systems.md', `# مرجع أنظمة التصميم العالمية (Curated Design Systems Reference)

## 1. مصادر الإلهام والتصاميم المعتمدة
- **21st.dev**: مكتبة مكونات حديثة تعتمد على تفاعلات أنيقة و Tailwind/CSS نقي.
- **Refero Design**: أرشيف حقيقي لتدفقات واجهات المستخدم من أفضل التطبيقات العالمية (Fintech, SaaS, Ecommerce).
- **Supahero.io**: استعراض احترافي لأقسام البطل (Hero Sections) عالية التحويل وتجنب النمطية.
- **Awesome Design MD**: أنظمة تصميم موثقة لأكبر الشركات التقنية (Apple, Linear, Stripe, Airbnb, Figma).

## 2. المبادئ المستخلصة
- الابتعاد عن النسخ الحرفي؛ استخراج المبادئ وتطبيقها بما يناسب متطلبات المشروع وهوية العلامة.
`);

    writeDoc('references/design/typography_scales.md', `# مرجع المقاييس الطباعية السائلة (Fluid Typography Scale Reference)

\`\`\`css
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.65rem + 1.1vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3.25rem);
}
\`\`\`
`);

    writeDoc('references/design/fluid_spacing.md', `# مرجع مقاييس التباعد السائلة (Fluid Spacing System Reference)

\`\`\`css
:root {
  --space-2xs: clamp(0.25rem, 0.2rem + 0.2vw, 0.375rem);
  --space-xs: clamp(0.5rem, 0.45rem + 0.25vw, 0.625rem);
  --space-sm: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --space-md: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --space-lg: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --space-xl: clamp(2rem, 1.75rem + 1.25vw, 3rem);
  --space-2xl: clamp(3rem, 2.5rem + 2.5vw, 4.5rem);
}
\`\`\`
`);

    writeDoc('references/design/color_primitives.md', `# مرجع لوحات الألوان الأساسية والدلالية (Color Systems Reference)

- **الرماديات المحايدة (Neutral / Slate)**: للخلفيات، الحدود، والنصوص لتوفير هدوء بصري وتباين عالي.
- **ألوان الهوية (Brand Accent)**: استخدام لون رئيسي واحد أو لونين متناغمين مع حصر استخدامهما في أزرار الإجراء والدلالات الهامة.
- **ألوان الحالات الوظيفية**:
  - Success: أخضر مريح غير مشبع (\`#10B981\`).
  - Warning: كهرماني متزن (\`#F59E0B\`).
  - Danger: أحمر صريح للتحذيرات (\`#EF4444\`).
  - Info: أزرق هادئ للمعلومات (\`#3B82F6\`).
`);

    // 2. Animation & Motion
    writeDoc('references/animation/motion_tokens.md', `# مرجع رموز الحركات والانتقالات (Motion Tokens Reference)

\`\`\`css
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
\`\`\`
`);

    writeDoc('references/animation/easing_curves.md', `# مرجع منحنيات التسارع (Easing Curves Reference)

- **Decelerate (Ease-Out)**: لعناصر الواجهة القادمة للشاشة (نوافذ منبثقة، قوائم منسدلة).
- **Accelerate (Ease-In)**: لعناصر الواجهة التي تغادر الشاشة وتختفي.
- **Standard (Ease-in-out)**: للتحولات الموضعية وتغيير الأبعاد داخل الشاشة.
`);

    writeDoc('references/animation/animation_patterns.md', `# أنماط الحركات التفاعلية (Interactive Motion Patterns)

- **ظهور متدرج خفيف (Fade & Slide Up)**: انتقال 8px للأعلى مع تغيير الشفافية من 0 إلى 1 خلال 200ms.
- **الاستجابة للضغط (Active Micro-scale)**: تقليص خفيف للزر بمقدار \`scale(0.98)\` عند الضغط لتقديم إحساس ميكانيكي ممتع.
`);

    // 3. Accessibility
    writeDoc('references/accessibility/aria_patterns.md', `# مرجع أنماط ARIA القياسية (ARIA Design Patterns Reference)

- **Dialog / Modal**: \`role="dialog"\`, \`aria-modal="true"\`, \`aria-labelledby="dialog-title"\`.
- **Dropdown / Menu**: \`aria-expanded="true/false"\`, \`aria-haspopup="menu"\`, \`role="menu"\`.
- **Alert / Notification**: \`role="alert"\` أو \`aria-live="polite"\` لتنبيه قارئات الشاشة دون مقاطعة المستخدم.
`);

    writeDoc('references/accessibility/keyboard_navigation.md', `# دليل التنقل عبر لوحة المفاتيح (Keyboard Navigation Reference)

- \`Tab\`: الانتقال للعنصر التفاعلي التالي.
- \`Shift + Tab\`: الانتقال للعنصر التفاعلي السابق.
- \`Space / Enter\`: تفعيل الزر أو الرابط أو صندوق الاختيار.
- \`Arrow Keys\`: التنقل داخل القوائم، علامات التبويب (Tabs)، ومجموعات الراديو.
- \`Escape\`: إغلاق القوائم المنسدلة والنوافذ المنبثقة.
`);

    // 4. APIs Reference Catalog
    writeDoc('references/APIs/public_apis_catalog.md', `# فهرس وتصنيف واجهات برمجة التطبيقات المعتمدة (Public & Specialized APIs Catalog)

## 1. الفئات الرئيسية للواجهات البرمجية
- **الذكاء الاصطناعي ومعالجة اللغات**: OpenAI, Anthropic, Google Gemini, Mistral, HuggingFace.
- **المدفوعات والمعاملات المالية**: Stripe, PayPal, Moyasar, Tap, LemonSqueezy.
- **الاتصالات والإشعارات والبريد**: Twilio, Resend, SendGrid, Pusher, Novu.
- **الخرائط والمواقع الجغرافية**: Mapbox, Google Maps, OpenStreetMap.
- **التخزين السحابي والوسائط**: Cloudinary, AWS S3, Cloudflare R2, Uploadthing.
- **الهوية والمصادقة**: Supabase Auth, Clerk, Auth0, Kinde.

## 2. قواعد الاستخدام
- حظر استدعاء الواجهات الخارجية مباشرة من المتصفح إذا كانت تتطلب مفاتيح سرية (API Keys)؛ تمرير كافة الاستدعاءات عبر الواجهة الخلفية الآمنة (Backend Proxy).
`);

    writeDoc('references/APIs/category_index.md', `# دليل فئات الـ APIs المفهرسة (API Category Index)

| الفئة | الوصف | أمثلة معتمدة |
|---|---|---|
| E-commerce & Payments | بوابات الدفع وإدارة الفواتير والضرائب | Stripe, Moyasar, TaxJar |
| Storage & Media | رفع وتحسين وضغط الصور والفيديوهات | Cloudinary, S3, R2 |
| AI & Automation | نماذج التوليد والتحليل الذكي | OpenAI, Gemini, Replicate |
| Auth & Security | خدمات الهوية والمصادقة متعددة العوامل | Clerk, Supabase, Auth0 |
`);

    // 5. Platforms & Prompts
    writeDoc('references/platforms/ai_tool_capabilities.md', `# مرجع قدرات وأدوات منصات الذكاء الاصطناعي (AI Tools Capabilities Reference)

- **Antigravity / Gemini CLI**: دعم تنفيذ الأوامر، فحص المجلدات، استعراض الملفات، ومراجعة الواجهات عبر المتصفح.
- **Cursor / Windsurf**: تكامل عميق مع المحرر، ميزات التوليد الموضعي والتحرير المباشر للملفات.
- **Claude / ChatGPT**: قدرات تحليل معماري واستكشاف الثغرات المنطقية وتصميم المخططات.
- **Lovable / v0**: توليد واجهات سريعة؛ يجب إخضاع مخرجاتها لكافة قواعد المستودع لتطهيرها من الكسل والابتذال الأمني والواجهي.
`);

    writeDoc('references/platforms/agent_prompt_patterns.md', `# أنماط التوجيه المتقدمة للعملاء الأذكياء (Agent Prompt Patterns)

- نمط التحليل قبل التنفيذ (Plan-First Pattern).
- نمط التحقق بالأدلة وتفادي الادعاء الزائف (Evidence Verification Pattern).
- نمط الهندسة المعمارية العكسية ومكافحة الكسل (Anti-Laziness Enforcement Pattern).
`);

    // 6. Inspiration & Brands
    writeDoc('references/inspiration/brand_references_index.md', `# فهرس مراجع التصميم العالمية (World-Class Brand Design Index)

- **Apple**: الدقة الطباعية، التباعد المريح، التركيز على المنتج، والرسوم الهادئة.
- **Linear**: الواجهات الداكنة الفاخرة (Dark Mode Craftsmanship)، لوحات المفاتيح السريعة، الحركات فائقة الدقة.
- **Stripe**: الوضوح التوثيقي، الجداول المتقنة، وتدفقات الدفع الخالية من التعقيد.
- **Airbnb**: بساطة العرض، التركيز على الصور، والخرائط التفاعلية والبطاقات الواضحة.
- **Figma / Framer**: الحرفية في أدوات التصميم والأداء العالي والتفاعلات اللحظية.
`);

    writeDoc('references/inspiration/world_class_ui_styles.md', `# أنماط الواجهات الراقية وتطبيقاتها (World-Class UI Styles)

1. **الأسلوب البسيط المتقن (Minimalist Craft)**: خطوط واضحة، مساحات واسعة، تباين دقيق، وتجريد من العناصر الزائدة.
2. **الأسلوب التفاعلي الناعم (Soft / Tactile UI)**: حدود رقيقة خفيفة، ظلال متراكبة واقعية، واستجابة تفاعلية لمسية.
3. **الأسلوب التقني المركز (Developer / High-Density)**: خطوط ثابتة العرض (Monospace) عند اللزوم، جداول بيانات مكثفة، واختصارات لوحة مفاتيح سريعة.
`);

    console.log('>>> References Layer Built Successfully.');
};
