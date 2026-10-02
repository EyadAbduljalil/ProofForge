# تقرير توحيد وتطبيع نتائج الأدوات — TOOL_NORMALIZATION_REPORT.md
## WebForge OS Tool Result Normalization Report

> **تاريخ التقرير**: 2026-10-02  
> **المحرك**: [ToolResultNormalizer](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tool-normalizer.js)

---

### 1. النموذج الموحد للنتائج (Unified Finding Schema)
يوحد المحرك نتائج كافة أدوات الفحص والأمان (Semgrep, OWASP ZAP, Trivy, OSV, ESLint, Lighthouse, Playwright) في بنية موحدة:
```json
{
  "id": "FND_SEMGREP_17278789_a1b2",
  "source": "SEMGREP",
  "title": "Potential Injection Flaw",
  "category": "SECURITY_CODE_QUALITY",
  "severity": "HIGH",
  "confidence": "VERY_HIGH",
  "status": "OPEN",
  "affected_files": ["apps/server/server.js"],
  "line_number": 42,
  "evidence": "Code snippet...",
  "remediation": "Use Parameterized Queries",
  "regression_test": "test_security.js"
}
```

### 2. إزالة التكرارات ودمج الأدلة (Deduplication & Corroboration)
يقوم المحرك بدمج النتائج المتطابقة من أدوات مختلفة على نفس السطر والملف، مع رفع درجة الثقة (`confidence`) إلى `VERY_HIGH` وتجميع مصادر الأدلة دون تكرار البلاغات.
