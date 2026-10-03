---
id: "DB-TENANT-001"
title: "فرض نطاق عزل بيانات المستأجرين في استعلامات قواعد البيانات"
category: "database"
subcategory: "multi-tenancy"
severity: "CRITICAL"
applies_to:
  - "all"
  - "database"
  - "backend"
tags:
  - "database"
  - "multi-tenant"
  - "isolation"
  - "security"
cwe: "CWE-639"
status: "ACTIVE"
---

# DB-TENANT-001: فرض نطاق عزل بيانات المستأجرين في استعلامات قواعد البيانات

## 1. المتطلب الإلزامي (Requirement)
في الأنظمة متعددة المستأجرين (Multi-Tenant Applications)، يجب أن تحتوي كافة استعلامات قواعد البيانات (SELECT, UPDATE, DELETE, INSERT) على شرط تقييد صريح وحتمي بمعرّف المستأجر (`tenant_id = currentTenantId`) يتم استخلاصه حصراً من سياق الجلسة الآمن الموثق، ويُحظر الاعتماد على معرّفات ممررة في معلمات الطلب.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
نسيان شرط المستأجر في استعلام واحد قد يؤدي إلى تسريب كامل سجلات شركة أو مستأجر لمستأجر آخر منافس، مما يدمر سرية البيانات ويتسبب في كوارث امتثال قانونية.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// استعلام عام بدون تقييد بنطاق المستأجر
const invoices = await db('invoices').where('status', 'PENDING');
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// تقييد إلزامي بنطاق المستأجر المستخلص من التوكن الآمن
const invoices = await db('invoices')
  .where('tenant_id', req.user.tenantId)
  .where('status', 'PENDING');
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استعلامات قواعد البيانات والتحقق من وجود حقل `tenant_id` في جداول البيانات المشتركة.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار أمني يثبت استحالة استرجاع بيانات مستأجر آخر عبر استعلامات متبادلة.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تطبيق ORM Scopes أو Row-Level Security (RLS) على مستوى قاعدة البيانات.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الجداول العامة المشتركة للنظام (مثل جدول اللغات وقوائم الدول).

## 9. المراجع والمعايير الدولية (References)
- Multi-Tenant Architecture Security Guidelines
- CWE-639: Authorization Bypass Through User-Controlled Key
