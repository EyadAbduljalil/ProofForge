# Resilient State UI Implementation Example

```tsx
import React from 'react';
import { AlertCircle, RefreshCw, PlusCircle, Inbox } from 'lucide-react';

interface ListProps<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onCreateNew: () => void;
}

export function DataListView<T>({ data, isLoading, error, onRetry, onCreateNew }: ListProps<T>) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-800/50 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  // 2. Error & Recovery State
  if (error) {
    return (
      <div className="p-6 text-center border border-red-500/20 bg-red-500/5 rounded-lg">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
        <h3 className="mt-2 text-sm font-semibold text-slate-100">Failed to load data</h3>
        <p className="text-xs text-slate-400 mt-1">{error.message}</p>
        <button onClick={onRetry} className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-xs text-slate-200 rounded hover:bg-slate-700">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
        <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
        <h3 className="mt-3 text-sm font-medium text-slate-200">No items created yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Get started by creating your first entry.</p>
        <button onClick={onCreateNew} className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded">
          <PlusCircle className="h-4 w-4" /> Create New
        </button>
      </div>
    );
  }

  // 4. Success / Data State
  return <div className="space-y-2">{/* Render items */}</div>;
}
```
