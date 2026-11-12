# Fluid Responsive Grid Example

```tsx
import React from 'react';

export const MetricGrid: React.FC<{ metrics: { label: string; value: string; change: string }[] }> = ({ metrics }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
    {metrics.map((m, i) => (
      <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
        <p className="text-xs font-medium text-slate-400">{m.label}</p>
        <p className="text-2xl font-bold font-mono text-slate-100 mt-1">{m.value}</p>
        <span className="text-xs text-emerald-400 mt-2 inline-block font-mono">{m.change}</span>
      </div>
    ))}
  </div>
);
```
