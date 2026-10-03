# المواصفة القياسية لتوكنات التصميم الدلالية
## Semantic Design Tokens Specification

---

## 1. التوكنات اللونية الدلالية (Semantic Color Tokens)

```css
:root {
  /* Surfaces & Backgrounds */
  --surface-canvas: #f8fafc;
  --surface-card: #ffffff;
  --surface-raised: #ffffff;
  --surface-overlay: rgba(15, 23, 42, 0.6);
  --surface-sunken: #f1f5f9;

  /* Text & Content */
  --text-main: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --text-inverse: #ffffff;
  --text-link: #0284c7;

  /* Borders & Dividers */
  --border-subtle: #e2e8f0;
  --border-default: #cbd5e1;
  --border-strong: #94a3b8;
  --border-focus: #0284c7;

  /* Functional & Feedback */
  --state-success: #16a34a;
  --state-success-subtle: #f0fdf4;
  --state-warning: #d97706;
  --state-warning-subtle: #fffbeb;
  --state-danger: #dc2626;
  --state-danger-subtle: #fef2f2;
  --state-info: #0284c7;
  --state-info-subtle: #f0f9ff;
}
```

---

## 2. توكنات المسافات المرنة (Fluid Spacing & Layout Tokens)

```css
:root {
  --space-0: 0px;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Containers */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

---

## 3. توكنات الحركة والتوقيت (Motion & Timing Tokens)

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;

  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```
