# مخطط القواعد الهندسية (Engineering Rule Schema)

## نظرة عامة
يحدد هذا المخطط البنية الهيكلية المعيارية لجميع القواعد الهندسية وإرشادات التنفيذ المعتمدة في نظام WebForge OS، لضمان اتساق الصياغة والتطبيق والتحقق الآلي.

---

## 1. البنية الهيكلية للمخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeEngineeringRule",
  "type": "object",
  "required": [
    "id",
    "title",
    "domain",
    "severity",
    "scope",
    "rationale",
    "enforcement",
    "anti_patterns",
    "verification_strategy"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^ENG-[A-Z]+-[0-9]{3}$",
      "description": "المعرف الفريد للقاعدة الهندسية"
    },
    "title": {
      "type": "string",
      "description": "عنوان وصفي واضح وموجز للقاعدة"
    },
    "domain": {
      "type": "string",
      "enum": [
        "architecture",
        "frontend",
        "backend",
        "api",
        "database",
        "state",
        "concurrency",
        "caching",
        "queues",
        "transactions",
        "errors",
        "configuration",
        "observability",
        "testing",
        "performance",
        "reliability"
      ]
    },
    "severity": {
      "type": "string",
      "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW", "ADVISORY"]
    },
    "scope": {
      "type": "string",
      "enum": ["universal", "backend", "frontend", "infrastructure", "data_layer"]
    },
    "rationale": {
      "type": "string",
      "description": "التعليل الهندسي والتأثير المعماري لتطبيق هذه القاعدة"
    },
    "enforcement": {
      "type": "object",
      "required": ["mandatory_rules", "prohibited_actions"],
      "properties": {
        "mandatory_rules": {
          "type": "array",
          "items": { "type": "string" }
        },
        "prohibited_actions": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "anti_patterns": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "description", "consequence"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "consequence": { "type": "string" }
        }
      }
    },
    "verification_strategy": {
      "type": "object",
      "required": ["automated_checks", "manual_review_criteria"],
      "properties": {
        "automated_checks": {
          "type": "array",
          "items": { "type": "string" }
        },
        "manual_review_criteria": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 2. معايير الامتثال
- يجب أن تخضع كل وثيقة توجيهية في `04-ENGINEERING/` لبنود هذا المخطط عند صياغة قواعدها الفردية.
- يجب التحقق من صحة القواعد برمجياً عبر محرك الحوكمة لضمان عدم وجود تناقضات بين المجالات المختلفة.
