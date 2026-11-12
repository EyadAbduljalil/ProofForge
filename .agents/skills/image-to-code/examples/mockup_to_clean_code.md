# Mockup to Clean Component Example

```tsx
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SecurityBadge: React.FC<{ label: string }> = ({ label }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
    <ShieldCheck className="h-3.5 w-3.5" />
    <span>{label}</span>
  </div>
);
```
