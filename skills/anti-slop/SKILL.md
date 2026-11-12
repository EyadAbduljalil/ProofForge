---
name: anti-slop
description: >-
  Lead Design Craft and Anti-Slop Visual Intelligence from ProofForge.
  Use when designing or reviewing user interfaces to ban generic AI design tropes,
  enforce semantic design tokens, ensure WCAG AAA contrast, maintain purposeful typographic hierarchy,
  and prevent excessive purple gradients, bloated cards, and fake trust metrics.
---

# 🎨 ProofForge Anti-Slop Visual Intelligence Skill

## 1. الفلسفة الحاكمة (The Anti-Slop Doctrine)
الذكاء الاصطناعي يميل بطبيعته إلى إنتاج تصاميم مكررة ومبتذلة (Generic AI Slop) تعتمد على تدرجات لونية بنفسجية عشوائية، بطاقات متراكمة دون حاجة وظيفية، ومقاييس ثقة وهمية. مهمة هذه المهارة هي فرض **الحرفية البصرية الرفيعة (High-Craft Engineering)** وجماليات النظم البرمجية الاحترافية.

---

## 2. قائمة المحظورات البصرية الصارمة (Banned Slop Catalog)

1. ❌ **حظر التدرجات البنفسجية/الوردية العشوائية (No Random Purple Gradients):**
   - يُمنع استخدام `bg-gradient-to-r from-purple-600 to-indigo-600` كخلفيات أو نصوص بدون هوية بصرية مبررة.
   - البديل المعتمد: ألوان صلبة مدروسة (Solid Slate / Obsidian / Deep Neutral) مع لمسات إضاءة وظيفية (Accent Tint).
2. ❌ **حظر تكديس البطاقات غير المبرر (No Card Overload):**
   - لا تضع كل سطر أو زر داخل `Card` مع حواف مستديرة مبالغ فيها وظلال ثقيلة.
   - البديل: تباعد فراغي مدروس (Generous Whitespace)، وفواصل بصرية دقيقة (`border-slate-800`).
3. ❌ **حظر إشارات الثقة الوهمية (No Fake Trust Signals):**
   - حظر وضع "تقييم 5 نجوم من 10,000 عميل" أو شعارات شركات وهمية في صفحات المشاريع الهندسية.
4. ❌ **حظر الألوان ذات التباين الضعيف:**
   - يجب أن يطابق النص معايير WCAG 2.2 AA على الأقل (نسبة تباين 4.5:1 للنصوص العادية و 3:1 للعناوين الكبيرة)، ويفضل WCAG AAA (7:1).

---

## 3. مصفوفة التحقق والتنفيذ (Execution Protocol)

1. **مراجعة تصنيف الابتذال:** اطلع على قائمة الأنماط المبتذلة في [slop_taxonomy.md](./references/slop_taxonomy.md).
2. **فحص الفروقات والمقارنات:** قارن بين الكود المبتذل والكود المتقن في [anti_slop_showcase.md](./examples/anti_slop_showcase.md).
3. **تشغيل الفاحص البصري:**
   ```bash
   node skills/anti-slop/scripts/audit_slop.js
   ```

---

## 4. شروط اكتمال المراجعة البصرية
* خطوط متسقة وواضحة (Geist / Inter / JetBrains Mono / IBM Plex Sans Arabic).
* تماثل بصري كامل بين اللغتين (العربية RTL والإنجليزية LTR) دون أي خلل في المحاذاة.
* احترام تفضيل المستخدم في تقليل الحركة (`prefers-reduced-motion`).
