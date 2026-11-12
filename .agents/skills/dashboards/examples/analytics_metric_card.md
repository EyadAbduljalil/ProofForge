# Analytics Metric Card Example

```tsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MetricCard: React.FC<{ title: string; value: string; trend: number; timeframe: string }> = ({
  title, value, trend, timeframe
}) => {
  const isPositive = trend >= 0;
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
      <p className="text-xs font-medium text-slate-400">{title}</p>
      <p className="text-2xl font-bold font-mono tracking-tight text-slate-100 mt-1 tabular-nums">{value}</p>
      <div className="flex items-center gap-1.5 mt-2 text-xs">
        <span className={`inline-flex items-center font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(trend)}%
        </span>
        <span className="text-slate-500">{timeframe}</span>
      </div>
    </div>
  );
};
```
