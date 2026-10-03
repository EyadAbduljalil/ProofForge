# العقد المعياري للمدققات (Validator Contract Specification)

## 1. متطلبات العقد المعياري للمدقق
يجب أن يلتزم كل مدقق في نظام WebForge OS بعقد هيكلي حتمي يحدد كافة خصائصه ومسؤولياته وحدوده الأمنية:

```json
{
  "validator_id": "VAL-SEC-AUTH-001",
  "name": "Password Hashing Validator",
  "domain": "security",
  "target_rules": ["SEC-AUTH-001"],
  "validation_method": "source-code-analysis",
  "required_capabilities": ["ast-parsing", "crypto-inventory"],
  "inputs": {
    "scope": "repository",
    "patterns": ["**/*.js", "**/*.ts", "**/*.py", "**/*.go"]
  },
  "execution_constraints": {
    "read_only": true,
    "network_access": false,
    "timeout_ms": 5000,
    "max_memory_mb": 256
  },
  "output_contract": {
    "generates_evidence": true,
    "produces_findings": true,
    "deterministic": true
  }
}
```

---

## 2. المحظورات الصارمة على المدققات (Validator Prohibitions)
- **يُحظر تماماً**: قيام المدقق بتعديل الشيفرة المصدرية للمشروع أثناء الفحص (المدققات للقراءة والتحقق فقط).
- **يُحظر تماماً**: تثبيت تبعيات خارجية غير مصرح بها أو تنفيذ أوامر في الصدفة (Shell) بدون عزل.
- **يُحظر تماماً**: تجاوز حدود الثقة أو كشف الأسرار والبيانات الحساسة في تقارير المخرجات.
- **يُحظر تماماً**: إعلان اجتياز أو اعتماد أي فحص دون توفير الدليل التثبيتي المتوافق مع مخطط الأدلة.
