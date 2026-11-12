# Smooth Physics-Based Transition Example

```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FadeSlidePanel: React.FC<{ isVisible: boolean; children: React.ReactNode }> = ({ isVisible, children }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-lg"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
```
