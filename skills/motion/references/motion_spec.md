# ProofForge Motion & Physics Specification

## 1. Timing Standards
| Category | Duration | Easing Curve | Use Case |
|---|---|---|---|
| Micro | 150ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Hover, active click, icon rotation |
| Enter | 250ms | `cubic-bezier(0, 0, 0.2, 1)` | Modals, drawers, dropdown menus |
| Exit | 200ms | `cubic-bezier(0.4, 0, 1, 1)` | Dismissing dialogs, collapsing panels |

## 2. Invariant Accessibility Rule
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
