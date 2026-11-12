# Bidirectional Header Component Example

```tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

export const BreadcrumbNav: React.FC<{ items: string[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <span className={idx === items.length - 1 ? 'text-slate-100 font-medium' : ''}>{item}</span>
        {idx < items.length - 1 && (
          <ChevronRight className="h-4 w-4 text-slate-600 rtl:rotate-180 transition-transform" />
        )}
      </React.Fragment>
    ))}
  </nav>
);
```
