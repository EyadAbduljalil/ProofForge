# Anti-Slop Component Showcase: Before vs After

## Hero Callout Component

### ❌ Slop Implementation (Generic AI)
```tsx
// Nested bloated card with purple gradient text and heavy drop shadows
<div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 rounded-3xl shadow-2xl border border-purple-500/30">
  <span className="bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-xs font-semibold">
    ✨ AI-Powered Super Magic
  </span>
  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mt-4">
    The Ultimate Next-Gen SaaS Platform
  </h1>
  <p className="text-gray-400 mt-2">Trusted by 100,000+ happy enterprises globally.</p>
</div>
```

### ✅ High-Craft Implementation (ProofForge Standard)
```tsx
// Purposeful, clean, high-contrast, semantic tokens
<div className="border border-slate-800 bg-slate-950/60 backdrop-blur-md p-6 rounded-lg">
  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
    <span>Deterministic Verification Engine v1.0</span>
  </div>
  <h1 className="text-3xl font-semibold tracking-tight text-slate-100 mt-3">
    Evidence-Driven Engineering Governance
  </h1>
  <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
    Enforcing formal invariants, fail-closed security gates, and mathematical proof across agentic workflows.
  </p>
</div>
```
