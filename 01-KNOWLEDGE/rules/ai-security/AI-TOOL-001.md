---
id: "AI-TOOL-001"
title: "تقييد صلاحيات استدعاء الأدوات للوكلاء الأذكياء ومبدأ الصلاحية الأدنى"
category: "ai-security"
subcategory: "tool-execution"
severity: "CRITICAL"
applies_to:
  - "all"
  - "ai"
  - "agents"
tags:
  - "ai"
  - "security"
  - "tool-calling"
  - "least-privilege"
cwe: "CWE-250"
status: "ACTIVE"
---

# AI-TOOL-001: تقييد صلاحيات استدعاء الأدوات للوكلاء الأذكياء ومبدأ الصلاحية الأدنى

## 1. المتطلب الإلزامي (Requirement)
يجب حظر منح الوكلاء الأذكياء (Autonomous Agents) أدوات ذات صلاحيات غير مقيدة أو تدميرية على النظام (مثل تنفيذ أوامر Shell عشوائية، الوصول غير المشروط لملفات النظام، أو التعديل المباشر على خوادم الإنتاج)، وتطبيق مبدأ الصلاحية الأدنى (Least Privilege) مع التحقق الصارم من مدخلات الأداة ومطابقتها لمخطط JSON Schema مقيد قبل التنفيذ.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
منح الوكيل أدوات قوية دون قيود يجعل النظام عرضة للتدمير أو اختراق البيانات عند تعرض الوكيل لحقن توجيه خبيث أو حدوث هلوسة برمجية.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// منح الوكيل وصولاً كاملاً لتنفيذ أي أمر bash
const tools = [
  { name: 'run_bash', execute: (cmd) => execSync(cmd) }
];
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { z } from 'zod';

const ReadFileSchema = z.object({
  filename: z.string().regex(/^[a-zA-Z0-9_\-.]+\.json$/) // حصر الملفات بصيغة json وبلا مسارات نسبية
});

const safeTools = [
  {
    name: 'read_config_json',
    schema: ReadFileSchema,
    execute: async (args) => {
      const valid = ReadFileSchema.parse(args);
      return await fs.promises.readFile(path.join('/safe/configs', valid.filename), 'utf8');
    }
  }
];
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- التحقق من وجود Schema محدد ومقيد لكل أداة مسجلة للوكيل الذكي.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير مراجعة صلاحيات الأدوات يثبت انعدام الأدوات المدمرة غير المحمية.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. إلغاء الأدوات العامة واستبدالها بأدوات دقيقة ومقيدة النطاق.
2. تفعيل تأكيد المستخدم البشري (Human-in-the-Loop) للعمليات الحرجة.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
بيئات العزل المعقمة (Secure Containers) المخصصة للتجميع والاختبار.

## 9. المراجع والمعايير الدولية (References)
- OWASP Top 10 for LLM: LLM08 Excessive Agency
- NIST AI Risk Management Framework (AI RMF 1.0)
