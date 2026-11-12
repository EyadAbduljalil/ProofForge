# Handcrafted Component Examples

## Tactile Button Component
```tsx
import React from 'react';

export const TactileButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button
    className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 rounded-md shadow-sm active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${className}`}
    {...props}
  >
    {children}
  </button>
);
```
