# WEBFORGE OS

# EXISTING PROJECT REENGINEERING & DESIGN INTELLIGENCE MASTER MISSION

## Mission Type

EXISTING PROJECT AUDIT + REENGINEERING + HARDENING + OPTIMIZATION + DESIGN INTELLIGENCE + CONTINUOUS IMPROVEMENT

---

# 0. PRIMARY OBJECTIVE

عند إضافة WebForge OS إلى مشروع موجود بالفعل، يجب ألا يتعامل WebForge معه كمشروع جديد أو كصفحة تحتاج إلى تنفيذ بعض التعديلات فقط.

يجب التعامل مع المشروع باعتباره:

> Existing Production/Development System Requiring Deep Inspection, Reengineering, Hardening, Optimization, Modernization and Continuous Verification.

المطلوب:

1. فهم المشروع بالكامل قبل التعديل.
2. اكتشاف المشاكل الموجودة فعليًا.
3. اكتشاف المشاكل المخفية التي لم يذكرها المطور.
4. إعادة بناء ما يحتاج إلى إعادة بناء فقط.
5. إصلاح Bugs.
6. إصلاح Security Issues.
7. إصلاح Business Logic Issues.
8. إصلاح API/Database Issues.
9. تحسين Architecture.
10. تحسين Performance.
11. تحسين UX/UI.
12. تحسين Responsive Behavior.
13. تحسين Accessibility.
14. تحسين RTL/LTR.
15. تحسين Localization.
16. تحسين Light/Dark Mode.
17. تحسين Animation وMotion.
18. تحسين Loading States.
19. تحسين Forms وErrors.
20. تحسين Icons.
21. تحسين Typography.
22. تحسين Color System.
23. اكتشاف AI Design Convergence.
24. منع التصميم من التحول إلى AI-generated generic template.
25. تنفيذ Visual Regression.
26. تنفيذ Functional Regression.
27. تنفيذ Security Regression.
28. قياس Before/After.
29. إنشاء Evidence لكل تغيير مهم.
30. عدم اعتبار المشروع مكتملًا لمجرد أن الكود يعمل.

---

# 1. ABSOLUTE RULES

## 1.1 Inspect Before Modify

ممنوع تعديل أي جزء جوهري قبل فهم:

* architecture
* directory structure
* dependencies
* runtime
* frontend
* backend
* database
* API
* authentication
* authorization
* business logic
* state management
* design system
* CSS
* responsive behavior
* animations
* assets
* icons
* typography
* localization
* RTL
* themes
* tests
* infrastructure
* deployment
* observability

---

# 2. NEVER TRUST EXISTING CLAIMS

أي:

* README
* Audit Report
* Completion Percentage
* Security Score
* Production Ready
* Fully Tested
* 100% Complete
* WCAG Compliant
* Fully Responsive
* Fully Translated
* Secure
* Optimized

يُعتبر:

> CLAIM

وليس:

> VERIFIED FACT

يجب إعادة التحقق من الواقع الفعلي.

لا تفترض:

```text
READY = Production Ready
PASS = Complete
Implemented = Integrated
Mock = Real
Static Audit = Runtime Verification
HTTP E2E = Browser E2E
Documentation = Enforcement
Configured = Working
Exists = Used
Test Exists = Test Is Meaningful
```

---

# 3. WEBFORGE PRINCIPLE

كل قاعدة يجب أن تتحول قدر الإمكان إلى:

```text
RULE
↓
VALIDATOR
↓
TEST
↓
QUALITY GATE
↓
EVIDENCE
↓
ENFORCEMENT
```

ولكل تغيير مهم:

```text
BASELINE
↓
UNDERSTAND
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
MEASURE
↓
COMPARE
↓
REGRESSION TEST
↓
EVIDENCE
```

---

# 4. EXISTING PROJECT DISCOVERY

ابدأ بعمل Inventory كامل:

* files
* directories
* packages
* applications
* services
* APIs
* databases
* migrations
* caches
* queues
* workers
* authentication
* authorization
* state machines
* external services
* environment variables
* secrets
* infrastructure
* CI/CD
* tests
* design system
* components
* routes
* pages
* forms
* assets
* fonts
* icons
* translations
* themes
* animations
* observability

اكتشف أيضًا:

* dead code
* duplicate implementations
* obsolete code
* orphan components
* unused dependencies
* conflicting systems
* duplicated utilities
* duplicated design tokens
* inconsistent patterns
* temporary workarounds
* TODO/FIXME
* commented-out production logic
* fake/mock implementations
* incomplete implementations

---

# 5. PROJECT BASELINE

قبل التعديل، سجّل:

## Engineering

* build time
* test time
* bundle size
* dependency count
* build warnings
* runtime errors

## Frontend

* initial load
* LCP
* INP
* CLS
* TTFB
* JS payload
* CSS payload
* image payload
* font payload

## Backend

* API latency
* error rate
* throughput
* CPU
* memory

## Database

* query latency
* slow queries
* indexes
* connection behavior
* N+1
* transaction behavior

## UX

* interaction latency
* loading behavior
* error recovery
* form completion
* responsive issues

## Security

* vulnerabilities
* authentication issues
* authorization issues
* dependency issues
* secrets
* configuration issues

احفظ النتائج في:

```text
reports/EXISTING_PROJECT_BASELINE.md
```

---

# 6. FUNCTIONAL CORRECTNESS

افحص كل User Journey حقيقي.

مثل:

```text
Landing
→ Register
→ Login
→ Dashboard
→ Create
→ Edit
→ Delete
→ Search
→ Filter
→ Checkout
→ Payment
→ Confirmation
→ Logout
```

حسب طبيعة المشروع.

اختبر:

* happy paths
* invalid inputs
* empty states
* loading states
* errors
* retries
* duplicate requests
* concurrent requests
* expired sessions
* unauthorized actions
* ownership violations
* invalid state transitions

أي Bug يتم إصلاحه يجب أن ينتج عنه Regression Test متى كان ذلك عمليًا.

---

# 7. ARCHITECTURE REENGINEERING

افحص:

* coupling
* cohesion
* circular dependencies
* separation of concerns
* layering
* boundaries
* dependency direction
* API boundaries
* frontend/backend boundaries
* database boundaries
* shared utilities
* duplicated logic

لا تقم بإعادة كتابة المشروع بالكامل لمجرد تحسين الشكل.

أعد البناء فقط عندما يوجد:

* measurable problem
* architectural risk
* security issue
* maintainability issue
* performance issue
* duplication
* broken abstraction

---

# 8. SECURITY REENGINEERING

افحص على الأقل:

* Authentication
* Authorization
* RBAC
* ABAC
* IDOR
* BOLA
* privilege escalation
* session fixation
* session hijacking
* JWT
* token rotation
* cookies
* CSRF
* CORS
* CSP
* XSS
* SQL Injection
* NoSQL Injection
* Command Injection
* Code Injection
* SSRF
* XXE
* Path Traversal
* Zip Slip
* Prototype Pollution
* Open Redirect
* File Upload
* Deserialization
* Race Conditions
* TOCTOU
* ReDoS
* Rate Limit Bypass
* Brute Force
* Account Takeover
* Mass Assignment
* Security Misconfiguration
* Secrets
* Dependency vulnerabilities
* Supply Chain
* Sensitive Data Exposure
* Logging leakage
* Error leakage
* Webhook abuse
* API abuse
* Business Logic Abuse

---

# 9. AI / AGENT SECURITY

إذا كان المشروع يستخدم AI أو Agents:

افحص:

* Prompt Injection
* Indirect Prompt Injection
* RAG Leakage
* Cross-Tenant Leakage
* Sensitive Context Exposure
* Tool Abuse
* Unauthorized Tool Execution
* Excessive Agency
* System Prompt Leakage
* Insecure Output Handling
* Agent Permission Boundaries
* Data Poisoning
* Model Manipulation
* AI Supply Chain
* Vector/Embedding Security
* Model DoS
* Resource Abuse

أي Tool حساس يجب أن يمتلك:

```text
Permission
→ Policy
→ Validation
→ Authorization
→ Execution
→ Evidence
```

والعمليات عالية الخطورة يجب أن تدعم Human Approval عندما يكون ذلك مناسبًا.

---

# 10. DATABASE

افحص:

* schema
* migrations
* indexes
* foreign keys
* unique constraints
* check constraints
* transactions
* isolation
* race conditions
* deadlocks
* orphan records
* cascading behavior
* soft delete
* pagination
* query performance
* N+1
* tenant isolation
* RLS
* connection pooling

إذا كان المشروع يدعم PostgreSQL، اختبر PostgreSQL فعليًا وليس فقط In-Memory Adapter.

إذا كان Redis مستخدمًا، اختبر Redis الحقيقي متى كان ذلك متاحًا.

---

# 11. API

افحص:

* contracts
* validation
* authentication
* authorization
* error model
* status codes
* rate limits
* pagination
* filtering
* sorting
* idempotency
* retries
* caching
* concurrency
* transactions
* webhook verification
* request size
* response size
* schema consistency

يجب ألا يكون:

```text
Frontend
→ undocumented assumptions
→ Backend
```

بل:

```text
Contract
→ Validation
→ API
→ Client
→ Tests
```

---

# 12. ERROR HANDLING

أنشئ أو حسّن Error Intelligence.

افحص:

* API errors
* form errors
* validation errors
* authentication errors
* authorization errors
* network errors
* timeout
* server errors
* empty states
* offline state
* payment errors
* upload errors

ممنوع:

* generic useless errors
* exposing stack traces
* exposing secrets
* technical messages للمستخدم النهائي بدون معالجة
* silent failures
* errors بدون recovery path

---

# 13. RESPONSIVE INTELLIGENCE

اختبر:

```text
320
375
390
414
480
768
834
1024
1280
1440
1920
```

و:

* portrait
* landscape
* touch
* mouse
* keyboard

افحص:

* overflow
* clipping
* broken layouts
* fixed elements
* navigation
* tables
* dialogs
* forms
* images
* typography
* spacing
* buttons
* charts
* cards
* animations

لا تعتبر:

```text
Desktop + Mobile CSS
```

دليلًا على Responsive Quality.

---

# 14. DESIGN INTELLIGENCE ENGINE

التصميم ليس مجرد:

```text
CSS
+ Components
+ Colors
```

بل:

```text
Brand
+ Audience
+ Context
+ Information Architecture
+ Typography
+ Color
+ Layout
+ Components
+ Interaction
+ Motion
+ Accessibility
+ Responsive
+ Localization
+ Theme
+ Originality
```

---

# 15. MOTION INTELLIGENCE

WebForge يجب أن يمتلك Motion Intelligence وليس مجرد مكتبة Animation.

يدعم عند الحاجة:

* Parallax
* Micro-interactions
* Entrance Reveal
* Exit Animation
* Scroll Reveal
* Scroll-linked Motion
* 3D Motion
* 3D Transform
* Hover Effects
* Magnetic Hover
* Image Hover
* Card Hover
* Button Interaction
* Cursor Interaction
* Smooth Loader
* Skeleton Loading
* Page Transition
* Route Transition
* Modal Transition
* Drawer Transition
* Accordion Motion
* Tabs Motion
* Dropdown Motion
* Toast Motion
* Notification Motion
* Progress Motion
* Number Counter
* Stagger Animation
* Text Reveal
* Image Reveal
* Mask Reveal
* Clip-path Motion
* Morphing
* Scale/Opacity Motion
* Spring Motion
* Gesture Motion

لكن:

> لا تستخدم Animation لمجرد أن المستخدم طلب "Animation".

استخدم:

```text
PURPOSE
→ CONTEXT
→ INTERACTION
→ DEVICE
→ PERFORMANCE
→ ACCESSIBILITY
→ MOTION TYPE
→ IMPLEMENTATION
```

ثم القرار:

```text
KEEP
ADD
IMPROVE
SIMPLIFY
REPLACE
REMOVE
```

---

# 16. MOTION QUALITY GATE

كل Animation يجب أن يمر على:

### UX

* هل له غرض؟
* هل يوضح حالة؟
* هل يساعد على فهم التفاعل؟
* هل يحسن feedback؟

### Performance

* transform/opacity عند الإمكان
* تجنب layout thrashing
* تجنب forced reflow
* تجنب long tasks
* تجنب scroll jank
* تقليل GPU pressure

### Accessibility

* prefers-reduced-motion
* keyboard
* focus
* screen reader implications

### Responsive

* Desktop
* Tablet
* Mobile
* Touch

---

# 17. MOTION SYSTEM

إذا لم يكن موجودًا، أنشئ أو حسّن:

```text
MotionPreference
MotionTokens
MotionPresets
MotionUtilities
```

مثل:

```text
duration
easing
distance
scale
spring
stagger
```

يجب ألا يكون لكل Component فلسفة Motion مختلفة.

---

# 18. 3D MOTION

يمكن استخدام:

* perspective
* rotateX
* rotateY
* translateZ
* scaleZ
* 3D cards
* depth
* layered parallax
* tilt

لكن:

* لا تستخدم 3D بلا هدف.
* لا تستخدم WebGL لمجرد الاستعراض.
* لا تستخدم تأثيرات ثقيلة على mobile.
* يجب وجود fallback.
* يجب احترام reduced motion.
* يجب مراقبة GPU/memory.

---

# 19. SMOOTH LOADING INTELLIGENCE

حدد Loading UX بناءً على مدة العملية:

### Fast

Minimal feedback.

### Medium

Skeleton / progress.

### Long

Progress + status.

### Unknown

Skeleton / progress indication.

ممنوع:

* endless spinner
* fake progress
* artificial delays
* layout jumps
* blocking غير ضروري

فرق بين:

* initial load
* route load
* data load
* mutation
* upload
* processing

---

# 20. MICRO-INTERACTION SYSTEM

### Buttons

* hover
* press
* focus
* loading
* success
* error
* disabled

### Forms

* focus
* typing
* validation
* error
* success
* submit
* loading

كل Interaction يجب أن يكون:

```text
Clear
Fast
Consistent
Accessible
Purposeful
```

---

# 21. EMOJI BAN — HARD RULE

ممنوع استخدام Emoji داخل:

* source code
* JSX
* HTML
* CSS
* UI
* buttons
* navigation
* cards
* alerts
* toast
* forms
* errors
* loading
* placeholders
* frontend copy

إلا إذا كان الـEmoji جزءًا صريحًا من Content Requirement.

ممنوع استخدام:

```text
🚀 Launch
🔥 Popular
🔒 Secure
⚡ Fast
```

كبديل عن Design أو Icons.

---

# 22. PROFESSIONAL ICON INTELLIGENCE

أنشئ أو حسّن Icon System.

افحص:

* consistency
* stroke width
* visual weight
* size
* alignment
* optical balance
* semantic meaning
* accessibility
* dark mode
* RTL
* contrast
* scaling

تجنب خلط:

```text
Lucide
Font Awesome
Material
Random SVG
```

بدون سبب واضح.

اختر Primary Icon System.

---

# 23. AI ICON CONVERGENCE

اكتشف الإفراط في استخدام:

* AI Spark
* Magic Wand
* Brain
* Robot
* Magic Stars
* Purple Sparkles
* Generic AI Gradient Icons

ليست ممنوعة بشكل مطلق.

لكن إذا أصبحت اللغة البصرية الافتراضية للمشروع:

> CONVERGENCE SIGNAL

ويجب اقتراح بدائل أكثر ملاءمة للـBrand.

---

# 24. DARK MODE INTELLIGENCE

إذا طلب المطور Dark Mode:

ممنوع تنفيذ:

```text
background: black;
color: white;
```

فقط.

يجب تشغيل:

> DARK MODE COMPLETENESS AUDIT

---

# 25. SEMANTIC THEME TOKENS

يجب دعم:

```text
background
surface
surface-elevated
surface-muted
text-primary
text-secondary
text-muted
border
divider
accent
success
warning
error
info
focus
selection
overlay
```

ويجب وجود Mapping واضح:

```text
LIGHT
↕
DARK
```

---

# 26. DARK MODE VERIFICATION

اختبر:

* text
* secondary text
* placeholders
* borders
* buttons
* links
* icons
* disabled
* focus
* alerts
* cards
* tables
* charts
* dialogs
* dropdowns
* tooltips
* loaders
* empty states
* error states
* success states

Component Matrix:

```text
LIGHT
DARK
HOVER
ACTIVE
FOCUS
DISABLED
ERROR
SUCCESS
LOADING
```

---

# 27. THEME DRIFT DETECTOR

اكتشف:

* hardcoded colors
* random component colors
* incorrect dark mappings
* missing tokens
* unreadable text
* invisible icons
* broken borders
* broken shadows
* broken charts
* image/background conflicts

افحص جميع:

* pages
* components
* dialogs
* dropdowns
* forms
* tables
* charts
* tooltips
* notifications
* loaders
* empty states
* error states

---

# 28. LOCALIZATION INTELLIGENCE

إذا كان المشروع Multilingual:

لا تعتبر وجود:

```text
en.json
ar.json
```

دليلًا على Translation Completeness.

افحص:

* Missing Keys
* Unused Keys
* Fallback Keys
* Hard-coded Text
* Mixed Languages
* Broken Placeholders
* Pluralization
* Dates
* Numbers
* Currency
* Text expansion
* RTL
* Overflow

---

# 29. HARD-CODED TEXT DETECTION

مثال:

```jsx
<button>Submit</button>
```

إذا كان المشروع Multilingual:

```text
I18N VIOLATION
```

إلا إذا كان:

* Brand
* Code
* Technical Identifier
* User-generated Content
* Explicitly excluded content

---

# 30. TRANSLATION VISUAL QA

اختبر:

```text
English + Light
English + Dark
Arabic + Light
Arabic + Dark
```

إذا كان المشروع يدعمها.

افحص:

* text overflow
* buttons
* navigation
* forms
* tables
* dialogs
* cards
* headings
* placeholders
* validation messages
* notifications

---

# 31. RTL INTELLIGENCE

افحص:

* text alignment
* icons
* arrows
* navigation
* sidebar
* forms
* tables
* dialogs
* dropdowns
* charts
* spacing
* layout
* animations
* transitions

Directional animations يجب أن تتكيف مع الاتجاه عندما يكون ذلك منطقيًا.

---

# 32. COLOR INTELLIGENCE ENGINE

لا تختار الألوان بناءً على:

> Modern / Beautiful / AI-looking

فقط.

حلل:

* Brand
* Industry
* Audience
* Context
* Content
* Tone
* Accessibility
* Contrast
* Competition
* Existing identity

---

# 33. AI COLOR ANTI-CONVERGENCE

راقب الاستخدام الافتراضي المفرط لـ:

* purple
* blue
* cyan
* pink gradients
* dark navy
* white cards
* neon gradients

هذه الألوان ليست ممنوعة.

لكن:

> لا تجعلها default visual language لكل مشروع.

---

# 34. COLOR PERSONALITY

حدد Color Personality حسب المشروع، مثل:

```text
Industrial
Editorial
Luxury
Technical
Organic
Cultural
Financial
Playful
Minimal
Brutalist
Corporate
Experimental
```

ثم ابنِ Palette منطقية حول هوية المشروع.

---

# 35. COLOR TOKEN ARCHITECTURE

استخدم:

```text
Brand
Primary
Secondary
Accent
Neutral
Success
Warning
Danger
Info
Surface
Background
Text
Border
Focus
```

ممنوع Random Colors داخل Components.

---

# 36. COLOR USAGE AUDIT

اكتشف:

* too many colors
* too few contrast levels
* random accents
* inconsistent CTA
* inconsistent success
* inconsistent error
* inconsistent warning
* equal visual weight لكل الأزرار

---

# 37. COLOR ACCESSIBILITY

اختبر Contrast لجميع الحالات المهمة:

* text
* links
* buttons
* icons
* borders
* focus
* disabled
* alerts
* dark mode
* light mode

---

# 38. TYPOGRAPHY INTELLIGENCE

افحص:

* font family
* font availability
* Arabic support
* weights
* font size
* line height
* letter spacing
* hierarchy
* readability
* performance
* fallback

لا تستخدم:

> Inter everywhere

كخيار افتراضي بدون سبب.

---

# 39. LAYOUT INTELLIGENCE

افحص:

* container
* grid
* spacing
* alignment
* density
* whitespace
* hierarchy
* rhythm
* visual flow

لا تستخدم:

> Card + Card + Card + Card

في كل شيء.

---

# 40. ANTI-CARD / ANTI-BENTO

استخدم الشكل المناسب للمعلومة:

* table
* list
* timeline
* editorial layout
* split layout
* data visualization
* structured sections
* comparison
* hierarchy

استخدم Bento فقط عندما يخدم Information Architecture.

---

# 41. GRADIENT ABUSE DETECTION

لا تجعل:

* hero
* button
* card
* background
* text
* border

كلها Gradients.

يجب أن يكون Gradient جزءًا من Visual Language وليس default decoration.

---

# 42. HOVER INTELLIGENCE

حدد هل العنصر:

* informational
* interactive
* clickable
* draggable
* decorative

ممنوع إضافة Hover Animation إلى عناصر غير تفاعلية فقط لإظهار "الحركة".

---

# 43. MOBILE MOTION POLICY

على Mobile:

* simplify heavy parallax
* reduce 3D
* reduce cursor effects
* disable mouse-specific effects
* reduce expensive animations
* respect device capability

---

# 44. REDUCED MOTION

يجب وجود Global Policy:

```text
prefers-reduced-motion
→ MotionPreference
→ Motion System
→ Components
```

لا تجعل كل Component يطبق Reduced Motion بطريقة مختلفة.

---

# 45. DESIGN STATE MATRIX

لكل Component مهم:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
Selected
Checked
Expanded
Collapsed
Dark
RTL
Mobile
```

---

# 46. THEME STATE MATRIX

إذا كان المشروع يدعم Light/Dark + RTL/LTR:

```text
Light + LTR
Light + RTL
Dark + LTR
Dark + RTL
```

يجب اختبارها بصريًا.

---

# 47. AI DESIGN CONVERGENCE DETECTOR

اكتشف:

* generic hero
* generic SaaS layout
* excessive rounded cards
* excessive glassmorphism
* generic gradients
* excessive shadows
* excessive glow
* generic bento
* floating dashboard mockups
* pill UI everywhere
* generic AI icons
* excessive animation
* excessive cursor effects
* repeated typography
* repeated color palettes
* repeated component structures

لا تصدر حكمًا:

```text
AI Generated = TRUE
```

بل:

```text
CONVERGENCE SIGNALS
```

مع:

* detected pattern
* evidence
* affected area
* risk
* alternative direction

---

# 48. DESIGN ORIGINALITY ENGINE

قارن التصميم مع:

* project history
* existing components
* internal patterns
* selected references

لا تنسخ Reference واحدة.

استخدم:

```text
Research
→ Extract Principles
→ Combine
→ Adapt
→ Original Implementation
```

---

# 49. DESIGN DIRECTION

عند الحاجة اقترح Direction مناسب:

```text
Editorial
Brutalist
Technical
Minimal
Luxury
Industrial
Cultural
Data-first
Typographic
Image-led
Asymmetric
```

حسب المشروع وليس حسب Trend.

---

# 50. REFERENCE SOURCES

يمكن استخدام المصادر الموجودة في WebForge مثل:

* 21st.dev
* Refero
* Mobbin
* SiteInspire
* Awwwards
* Godly
* Land-book
* Lapa Ninja
* Coolors
* Motion libraries

لكن:

> Reference ≠ Source of Truth

ولا يجوز نسخ تصميم كامل.

---

# 51. DESIGN QUALITY GATE

أي Design Change مهم يجب أن يمر:

```text
Design Request
↓
Project Context
↓
Design System
↓
Color Intelligence
↓
Typography
↓
Layout
↓
Components
↓
Icons
↓
Motion
↓
Light/Dark
↓
RTL/LTR
↓
Responsive
↓
Accessibility
↓
Visual Regression
↓
AI Convergence Check
↓
Final Design Gate
```

---

# 52. AUTOMATIC DESIGN AUDITS

إذا طلب المطور:

## "Add Dark Mode"

نفذ:

```text
Dark Mode Completeness Audit
```

وليس فقط CSS.

---

## "Translate the Website"

نفذ:

```text
Translation Completeness Audit
+
RTL Audit
+
Text Expansion Audit
+
Visual Regression
```

---

## "Improve Design"

نفذ:

```text
Hierarchy
Spacing
Typography
Color
Components
States
Interaction
Responsive
Accessibility
Motion
Originality
```

---

## "Change Colors"

أعد فحص:

* contrast
* semantics
* themes
* states
* charts
* buttons
* alerts
* accessibility

---

## "Change Design Tokens"

شغل Visual Regression للصفحات المتأثرة.

---

## "Change Motion Tokens"

اختبر:

* duration
* interaction
* reduced motion
* mobile
* scroll behavior

---

## "Change Icon System"

اختبر:

* alignment
* size
* contrast
* semantic meaning
* dark mode
* RTL

---

# 53. DESIGN SYSTEM INTEGRATION

إذا كان WebForge يحتوي بالفعل على Design System أو Motion/Theme/Icon systems:

> EXTEND EXISTING SYSTEM.

لا تنشئ نسخة ثانية.

قبل إنشاء أي Package:

```text
SEARCH
→ IDENTIFY
→ REUSE
→ EXTEND
→ ONLY CREATE IF ABSENT
```

Packages المحتملة عند عدم وجود بديل:

```text
packages/motion-intelligence/
packages/motion-system/
packages/interaction-engine/
packages/icon-intelligence/
packages/icon-system/
packages/theme-intelligence/
packages/dark-mode-audit/
packages/localization-intelligence/
packages/rtl-intelligence/
packages/color-intelligence/
packages/design-originality/
packages/ai-convergence-detector/
packages/visual-intelligence/
packages/design-quality-gates/
```

---

# 54. PERFORMANCE REENGINEERING

افحص:

* bundle splitting
* lazy loading
* tree shaking
* images
* fonts
* caching
* network
* API latency
* database latency
* rendering
* hydration
* unnecessary rerenders
* memory leaks
* event listeners
* WebSocket lifecycle
* animations
* GPU
* CPU
* long tasks

أي تحسين يجب قياسه:

```text
BEFORE
→ CHANGE
→ AFTER
```

---

# 55. STATE MANAGEMENT

افحص:

* duplicated state
* stale state
* race conditions
* unnecessary global state
* synchronization
* cache invalidation
* optimistic updates
* rollback
* loading/error states

---

# 56. BUSINESS LOGIC

افحص:

* invalid transitions
* price manipulation
* quantity manipulation
* coupon abuse
* ownership
* concurrency
* duplicate operations
* refund logic
* payment state
* inventory
* permissions
* account state

---

# 57. OBSERVABILITY

افحص:

* structured logs
* metrics
* traces
* error monitoring
* audit logs
* health checks
* readiness
* alerts
* secrets scrubbing

---

# 58. INFRASTRUCTURE

افحص:

* Docker
* Docker Compose
* Nginx
* TLS
* headers
* healthcheck
* non-root
* secrets
* production config
* environment separation
* deployment scripts
* CI/CD

لا تقبل Docker/Deployment configuration بدون اختبار فعلي متى كان ذلك ممكنًا.

---

# 59. TESTING PYRAMID

استخدم:

```text
Unit
↓
Integration
↓
API
↓
E2E
↓
Browser
↓
Visual
↓
Accessibility
↓
Security
↓
Performance
↓
Regression
```

لا تعتبر Unit Tests بديلًا عن Browser Tests.

ولا تعتبر HTTP Tests بديلًا عن Browser E2E عندما تكون المشكلة Browser-specific.

---

# 60. REAL BROWSER VERIFICATION

إذا كان المشروع Web UI:

استخدم Playwright/Chromium عندما يكون متاحًا.

اختبر:

* real navigation
* clicks
* forms
* keyboard
* viewport
* screenshots
* responsive
* browser console
* network
* DOM
* visual states

إذا لم يكن متاحًا:

```text
NOT VERIFIED — ENVIRONMENT LIMITATION
```

ولا تدّعي Browser Verification.

---

# 61. VISUAL REGRESSION

استخدم Screenshots عندما يكون ذلك ممكنًا.

قارن:

```text
BEFORE
VS
AFTER
```

للصفحات والحالات المتأثرة.

خصوصًا:

```text
Light
Dark
LTR
RTL
Mobile
Tablet
Desktop
```

---

# 62. ACCESSIBILITY

افحص:

* WCAG
* keyboard
* focus
* focus trap
* labels
* semantics
* contrast
* screen readers
* reduced motion
* touch targets
* dialogs
* forms
* error messages

---

# 63. CI/CD

تحقق من وجود:

* test pipeline
* lint
* typecheck
* build
* security scan
* dependency scan
* secrets scan
* E2E
* accessibility
* performance
* deployment validation

إذا لم يكن موجودًا وكان مناسبًا للمشروع، اقترح أو أنشئه.

---

# 64. CLI INTEGRITY

أي CLI command يجب التحقق من:

* function name
* method type
* arguments
* return value
* error handling
* exit code
* actual execution

لا تقبل CLI شكليًا يعمل فقط في Documentation.

---

# 65. DUPLICATION CONTROL

قبل إنشاء:

* package
* utility
* component
* validator
* engine
* token
* helper

ابحث عن implementation موجود.

إذا وجد:

```text
EXTEND
```

وليس:

```text
DUPLICATE
```

---

# 66. CHANGE IMPACT ANALYSIS

قبل أي تغيير جوهري:

```text
Changed Component
↓
Dependencies
↓
Consumers
↓
API
↓
Database
↓
UI
↓
Tests
↓
Security
↓
Design
↓
Performance
```

ثم حدد Blast Radius.

---

# 67. NO BLIND REFACTORING

ممنوع:

* rewrite everything
* replace working architecture without evidence
* introduce unnecessary frameworks
* add dependencies without justification
* change design without reason
* add animation everywhere
* add gradients everywhere
* add cards everywhere
* add AI-style visuals everywhere

---

# 68. CONTINUOUS IMPROVEMENT LOOP

بعد كل مرحلة:

```text
DISCOVER
→ BASELINE
→ PLAN
→ IMPLEMENT
→ TEST
→ MEASURE
→ COMPARE
→ REGRESSION
→ IMPROVE
```

استمر حتى تصبح التحسينات marginal أو لا يوجد evidence-based improvement إضافي يستحق المخاطرة.

---

# 69. FINAL VERIFICATION

في النهاية شغل:

```text
BUILD
STATIC CHECKS
UNIT
INTEGRATION
API
E2E
BROWSER
VISUAL
RESPONSIVE
ACCESSIBILITY
SECURITY
PERFORMANCE
BUSINESS LOGIC
REGRESSION
PRODUCTION CHECK
```

---

# 70. FAILURE POLICY

إذا فشل شيء:

لا:

* تخفيه
* تتجاهله
* تعطل الاختبار
* تحذف الاختبار
* تغير threshold فقط
* suppress finding
* تدعي نجاحه

بل:

```text
IDENTIFY
→ CLASSIFY
→ FIX
→ RETEST
```

إذا تعذر التحقق:

```text
NOT VERIFIED
```

مع السبب.

---

# 71. SEVERITY

استخدم:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

---

# 72. EVIDENCE

كل نتيجة مهمة يجب أن يكون لها Evidence:

* command
* output
* test
* screenshot
* metric
* log
* file
* code reference

لا تستخدم:

> "يبدو أنه يعمل"

كدليل.

---

# 73. BEFORE / AFTER

أنشئ:

```text
reports/BEFORE_AFTER_METRICS.md
```

يشمل:

| Area          | Before | After | Delta | Evidence |
| ------------- | -----: | ----: | ----: | -------- |
| Build         |        |       |       |          |
| Bundle        |        |       |       |          |
| LCP           |        |       |       |          |
| INP           |        |       |       |          |
| CLS           |        |       |       |          |
| API           |        |       |       |          |
| DB            |        |       |       |          |
| Security      |        |       |       |          |
| Accessibility |        |       |       |          |
| Responsive    |        |       |       |          |
| Motion        |        |       |       |          |
| Visual        |        |       |       |          |

إذا لم يمكن قياس شيء:

```text
NOT MEASURED
```

---

# 74. REQUIRED REPORTS

أنشئ:

```text
reports/EXISTING_PROJECT_BASELINE.md
reports/PROJECT_IMPROVEMENT_REPORT.md
reports/PROJECT_REENGINEERING_FINAL.md
reports/BEFORE_AFTER_METRICS.md
reports/REGRESSION_FINAL_REPORT.md
reports/DESIGN_INTELLIGENCE_AUDIT.md
reports/MOTION_INTELLIGENCE_AUDIT.md
reports/THEME_LOCALIZATION_AUDIT.md
reports/DESIGN_ORIGINALITY_AUDIT.md
reports/FINAL_VERIFICATION.md
```

---

# 75. FINAL REPORT MUST INCLUDE

## Executive Summary

## Existing Architecture

## Actual Runtime Architecture

## Discovered Problems

## Hidden Problems

## Security Findings

## Business Logic Findings

## Database Findings

## API Findings

## Frontend Findings

## UX Findings

## Responsive Findings

## Accessibility Findings

## Motion Findings

## Icon Findings

## Typography Findings

## Color Findings

## Dark Mode Findings

## Localization Findings

## RTL Findings

## AI Convergence Signals

## Design Originality Findings

## Performance Findings

## Infrastructure Findings

## Testing Findings

## CI/CD Findings

## Before/After Metrics

## Changes Implemented

## Regression Tests Added

## Remaining Risks

## Environment Limitations

## Evidence Index

## Final Verification Matrix

## Recommended Next Steps

---

# 76. FINAL DESIGN QUALITY STANDARD

التصميم النهائي يجب أن يكون:

```text
Intentional
Distinctive
Consistent
Accessible
Responsive
Performant
Interactive
Professional
Maintainable
```

وليس:

```text
Generic
Template-like
AI-convergent
Over-animated
Over-rounded
Over-gradient
Over-carded
Over-glowing
```

---

# 77. FINAL ENGINEERING PRINCIPLE

لا تسأل:

> "هل يمكن تنفيذ طلب المطور؟"

فقط.

اسأل:

> "هل تنفيذ الطلب بهذه الطريقة يحافظ على جودة النظام ككل؟"

ثم افحص:

```text
Correctness
Security
Architecture
Business Logic
Performance
UX
UI
Responsive
Accessibility
Localization
RTL
Theme
Motion
Visual Quality
Originality
Maintainability
Observability
Testability
Production Safety
```

إذا كان الطلب ناقصًا أو ينتج عنه تصميم/كود غير مكتمل، لا تنفذه بشكل أعمى.

نفّذ المطلوب مع إكمال المتطلبات الضرورية المرتبطة به، بشرط:

```text
JUSTIFIED
TRACEABLE
TESTED
REGRESSION-PROTECTED
```

---

# 78. FINAL SUCCESS CRITERIA

لا تعلن:

```text
100% Secure
Zero Bugs
Perfect
Fully Complete
```

بدلًا من ذلك استخدم:

```text
VERIFIED
PARTIALLY VERIFIED
NOT VERIFIED
ENVIRONMENT LIMITATION
KNOWN RISK
```

الهدف:

> MAXIMUM PRACTICAL VERIFICATION

وليس ادعاء الكمال.

---

# 79. FINAL EXECUTION LOOP

نفذ المهمة بالكامل بهذا الترتيب:

```text
DISCOVER
↓
BASELINE
↓
PROFILE
↓
ARCHITECTURE ANALYSIS
↓
SECURITY ANALYSIS
↓
BUSINESS LOGIC ANALYSIS
↓
DATABASE ANALYSIS
↓
API ANALYSIS
↓
FRONTEND ANALYSIS
↓
UX/UI ANALYSIS
↓
RESPONSIVE ANALYSIS
↓
ACCESSIBILITY ANALYSIS
↓
MOTION ANALYSIS
↓
ICON ANALYSIS
↓
TYPOGRAPHY ANALYSIS
↓
COLOR ANALYSIS
↓
THEME ANALYSIS
↓
LOCALIZATION ANALYSIS
↓
RTL ANALYSIS
↓
AI CONVERGENCE ANALYSIS
↓
PERFORMANCE ANALYSIS
↓
INFRASTRUCTURE ANALYSIS
↓
TESTING ANALYSIS
↓
CHANGE IMPACT ANALYSIS
↓
PLAN
↓
IMPLEMENT
↓
BUILD
↓
TEST
↓
BROWSER
↓
VISUAL
↓
SECURITY
↓
PERFORMANCE
↓
REGRESSION
↓
MEASURE
↓
COMPARE
↓
FINAL VERIFICATION
↓
REPORT
```

---

# 80. NON-NEGOTIABLE FINAL RULE

WebForge ليس مجرد:

```text
Code Generator
```

بل:

```text
Engineering Intelligence
+
Security Intelligence
+
Architecture Intelligence
+
Design Intelligence
+
Motion Intelligence
+
Visual Intelligence
+
Localization Intelligence
+
Performance Intelligence
+
Verification Engine
+
Continuous Improvement Engine
```

وعند إضافته إلى Existing Project يجب أن يعمل كطبقة:

```text
UNDERSTAND
→ AUDIT
→ DETECT
→ REASON
→ REPAIR
→ IMPROVE
→ VERIFY
→ MEASURE
→ PROTECT
```

ولا ينتهي العمل بمجرد تنفيذ الطلب.

ينتهي فقط بعد أن يتم:

```text
IMPLEMENTED
+
TESTED
+
VERIFIED
+
MEASURED
+
REGRESSION-PROTECTED
+
DOCUMENTED
```

مع توثيق أي شيء لم يتم التحقق منه بوضوح.
