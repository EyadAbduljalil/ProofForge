# Robust Frontend Page Structure

```tsx
import React, { Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const HeavyDashboard = React.lazy(() => import('../components/HeavyDashboard'));

export const AnalyticsPage: React.FC = () => (
  <ErrorBoundary fallback={<div className="p-6 text-red-400">Failed to render dashboard module.</div>}>
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading module...</div>}>
      <HeavyDashboard />
    </Suspense>
  </ErrorBoundary>
);
```
