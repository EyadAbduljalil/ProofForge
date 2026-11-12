# Responsive Picture & Layout Shift Prevention Example

```tsx
import React from 'react';

export const OptimizedHeroImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
    <picture>
      <source srcSet={`${src}?format=avif`} type="image/avif" />
      <source srcSet={`${src}?format=webp`} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1280}
        height={720}
        className="w-full h-full object-cover"
      />
    </picture>
  </div>
);
```
