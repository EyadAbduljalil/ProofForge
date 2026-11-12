# Tokenized Component Example

```tsx
import React from 'react';

export interface ActionCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ title, description, actionText, onAction }) => (
  <div className="border border-border bg-card text-card-foreground p-6 rounded-lg transition-colors hover:border-slate-700">
    <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
    <div className="mt-4 flex justify-end">
      <button
        onClick={onAction}
        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {actionText}
      </button>
    </div>
  </div>
);
```
