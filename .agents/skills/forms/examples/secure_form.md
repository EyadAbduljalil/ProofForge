# Secure Form Implementation Example

```tsx
import React, { useState } from 'react';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters')
});

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = FormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', { method: 'POST', body: JSON.stringify(result.data) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-slate-300">Email</label>
        <input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-err' : undefined}
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 w-full p-2 bg-slate-900 border border-slate-800 rounded text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        {errors.email && <p id="email-err" className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>
      <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded font-medium disabled:opacity-50">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
```
