# Accessible Dialog Component Example

```tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AccessibleDialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      dialogRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-2xl focus:outline-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 id="dialog-title" className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
```
