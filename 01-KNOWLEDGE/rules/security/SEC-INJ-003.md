---
id: "SEC-INJ-003"
title: "منع حقن أوامر النظام وتجاوز مسارات الملفات"
category: "security"
subcategory: "injection"
severity: "CRITICAL"
applies_to:
  - "all"
  - "nodejs"
  - "backend"
tags:
  - "security"
  - "rce"
  - "command-injection"
  - "path-traversal"
cwe: "CWE-78"
status: "ACTIVE"
---

# SEC-INJ-003: منع حقن أوامر النظام وتجاوز مسارات الملفات

## 1. المتطلب الإلزامي (Requirement)
يُحظر تماماً تمرير مدخلات المستخدمين إلى دوال تنفيذ الأوامر (`exec`, `system`, `popen`, `child_process.exec`) أو استخدامها في إنشاء مسارات الملفات دون التحقق الصارم من القائمة البيضاء (Whitelisting) واستخدام دوال الفصل الآمنة (مثل `execFile` أو `spawn` مع مصفوفة معاملات منفصلة)، ومنع ثغرات مسارات الملفات (`../` Path Traversal) عبر التحقق من المسار الحقيقي المقيد.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
حقن الأوامر يسمح للمهاجم بتنفيذ أوامر برمجية مباشرة على نظام التشغيل المستضيف (Remote Code Execution - RCE) والسيطرة الكاملة على الخادم أو قراءة الملفات الحساسة مثل `/etc/passwd`.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// خطير جداً: تنفيذ أوامر القشرة مباشرة
exec(`ping -c 4 ${req.body.ip}`);

// قراءة ملفات غير مقيدة
const filePath = path.join('/var/uploads', req.query.fileName);
fs.readFileSync(filePath);
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { execFile } from 'child_process';
import path from 'path';

// تنفيذ آمن عبر مصفوفة وسائط
execFile('ping', ['-c', '4', validatedIp]);

// قراءة آمنة مع التحقق من النطاق المسموح
const safeBase = path.resolve('/var/uploads');
const safeTarget = path.resolve(safeBase, path.basename(req.query.fileName));
if (!safeTarget.startsWith(safeBase)) {
  throw new Error('ACCESS_DENIED: Path traversal detected');
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استدعاءات `child_process.exec` والتحقق من استخدام `packages/security/file-security.js`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير تدقيق أمني يثبت حصر الأوامر البرمجية وتأمين مسارات الملفات.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استبدال `exec` بـ `execFile` أو `spawn`.
2. حصر أسماء الملفات باستخدام `path.basename()` والمطابقة مع القائمة البيضاء.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات.

## 9. المراجع والمعايير الدولية (References)
- OWASP Command Injection
- CWE-78: Improper Neutralization of Special Elements used in an OS Command
