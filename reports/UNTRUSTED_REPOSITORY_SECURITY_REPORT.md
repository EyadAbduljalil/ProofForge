# تقرير حماية النظام من المستودعات غير الموثوقة — UNTRUSTED_REPOSITORY_SECURITY_REPORT.md
## WebForge OS Untrusted Repository Protection Report

> **تاريخ التقرير**: 2026-10-02  
> **المحرك**: [UntrustedRepoGuard](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/security/untrusted-repo-guard.js)

---

### 1. مبدأ "المدخلات غير الموثوقة" (Untrusted Input Paradigm)
تعتبر كافة ملفات المشروع المحلل (بما فيها `README.md`, `AGENTS.md`, والتعليقات والبرمجيات النصية) مدخلات غير موثوقة (Untrusted Data) ولا تُعامل إطلاقاً كتعليمات عليا للنظام.

### 2. الحراسات المطبقة
- **مكافحة حقن التوجيهات (Prompt Injection Defense)**: رصد وتحييد أنماط `ignore previous instructions` أو محاولات التلاعب بالوكيل.
- **عزل الأوامر (Command Sandboxing)**: التحقق الصارم من الأوامر ومنع الأوامر الخبيثة أو التدميرية.
- **منع تسريب البيانات (Anti-Exfiltration)**: منع استدعاءات الشبكة الخارجية المشبوهة أو تنزيل ملفات تنفيذية عائمة.
