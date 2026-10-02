/**
 * Claude.ai Artifact Template — Single-File React
 *
 * Optimized for claude.ai artifacts. Everything inlined — reset CSS, tokens,
 * fonts, textures. No external dependencies except React (already available).
 *
 * Key artifact constraints:
 * - No localStorage (doesn't persist across sessions)
 * - No form submissions (can't POST anywhere)
 * - prefers-color-scheme doesn't work reliably — use React state for dark mode
 * - Google Fonts loaded via useEffect link injection
 *
 * {{THEME_MARKER}} — Domain token customization points marked below.
 *
 * Usage: Copy this entire file into a claude.ai artifact. Customize the color
 * tokens, font URLs, and content. Dark mode toggle is built in.
 */

import React, { useState, useEffect } from 'react';

export default function ArtifactApp() {
  const [darkMode, setDarkMode] = useState(false);

  // THEME: Replace with domain font URL from Google Fonts or Fontshare
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const styles = `
    /* Inlined CSS Reset (condensed modern-reset) */
    *, *::before, *::after { box-sizing: border-box; }
    * { margin: 0; padding: 0; }
    body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
    img, picture, video, canvas, svg { display: block; max-width: 100%; }
    input, button, textarea, select { font: inherit; }
    p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

    /* THEME: Domain color tokens — replace with your palette */
    :root {
      --color-bg-base: oklch(98.5% 0.005 280);
      --color-bg-surface: oklch(100% 0 0);
      --color-bg-elevated: oklch(99% 0.005 280);
      --color-border: oklch(88% 0.01 280);
      --color-text-primary: oklch(22% 0.02 280);
      --color-text-secondary: oklch(50% 0.02 280);
      --color-accent: oklch(55% 0.18 260);
      --color-accent-hover: oklch(50% 0.20 260);
      --color-accent-surface: oklch(96% 0.03 260);
    }

    [data-theme="dark"] {
      /* THEME: Dark mode color tokens */
      --color-bg-base: oklch(18% 0.01 280);
      --color-bg-surface: oklch(22% 0.01 280);
      --color-bg-elevated: oklch(26% 0.02 280);
      --color-border: oklch(30% 0.02 280);
      --color-text-primary: oklch(92% 0.01 280);
      --color-text-secondary: oklch(70% 0.02 280);
      --color-accent: oklch(65% 0.18 260);
      --color-accent-hover: oklch(70% 0.20 260);
      --color-accent-surface: oklch(25% 0.05 260);
    }

    /* THEME: Typography from domain tokens */
    :root {
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', 'Courier New', monospace;
    }

    /* THEME: Fluid type scale */
    :root {
      --step--1: clamp(0.875rem, 0.85rem + 0.125vw, 1rem);
      --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
      --step-1: clamp(1.25rem, 1.15rem + 0.5vw, 1.75rem);
      --step-2: clamp(1.75rem, 1.55rem + 1vw, 2.75rem);
    }

    /* THEME: Fluid space scale */
    :root {
      --space-xs: clamp(0.5rem, 0.45rem + 0.25vw, 0.75rem);
      --space-sm: clamp(0.75rem, 0.65rem + 0.5vw, 1.25rem);
      --space-md: clamp(1rem, 0.85rem + 0.75vw, 1.75rem);
      --space-lg: clamp(1.5rem, 1.2rem + 1.5vw, 3rem);
      --space-xl: clamp(2rem, 1.5rem + 2.5vw, 4.5rem);
    }

    /* THEME: Motion tokens */
    :root {
      --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --duration-fast: 150ms;
      --duration-normal: 250ms;
    }

    /* THEME: Shape tokens */
    :root {
      --radius-sm: 0.375rem;
      --radius-md: 0.5rem;
      --radius-lg: 0.75rem;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    body {
      font-family: var(--font-sans);
      background: var(--color-bg-base);
      color: var(--color-text-primary);
      padding: var(--space-md);
      min-height: 100vh;
      transition: background var(--duration-normal) var(--ease-smooth),
                  color var(--duration-normal) var(--ease-smooth);
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    /* THEME: Header with dark mode toggle */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .header h1 {
      font-size: var(--step-2);
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .theme-toggle {
      padding: 0.5rem 1rem;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-smooth);
    }

    .theme-toggle:hover {
      border-color: var(--color-accent);
      transform: translateY(-1px);
    }

    /* THEME: Card component */
    .card {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
      margin-bottom: var(--space-md);
    }

    /* THEME: Grain texture overlay — adjust opacity per domain */
    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.35'/%3E%3C/svg%3E");
      opacity: 0.03;
      pointer-events: none;
    }

    .card-content {
      position: relative;
      z-index: 1;
    }

    .card h2 {
      font-size: var(--step-1);
      font-weight: 600;
      margin-bottom: var(--space-xs);
    }

    .card p {
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    /* THEME: Button styling */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--color-accent);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-smooth);
    }

    .btn:hover {
      background: var(--color-accent-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .btn:active {
      transform: translateY(0);
    }

    /* THEME: Code block styling */
    .code-block {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-sm);
      font-family: var(--font-mono);
      font-size: var(--step--1);
      overflow-x: auto;
      margin-block: var(--space-sm);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }

    .stat-card {
      background: var(--color-accent-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      text-align: center;
    }

    .stat-value {
      font-size: var(--step-2);
      font-weight: 700;
      color: var(--color-accent);
      margin-bottom: var(--space-xs);
    }

    .stat-label {
      font-size: var(--step--1);
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--color-accent-surface);
      color: var(--color-accent);
      border-radius: var(--radius-sm);
      font-size: var(--step--1);
      font-weight: 600;
      margin-right: var(--space-xs);
    }
  `;

  return (
    <div data-theme={darkMode ? 'dark' : 'light'}>
      <style>{styles}</style>

      <div className="container">
        <header className="header">
          <h1>Artifact Template</h1>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        <main>
          {/* THEME: Hero section */}
          <div className="card">
            <div className="card-content">
              <h2>Built with anti-slop design principles</h2>
              <p>
                This artifact uses domain-aware color tokens, fluid typography,
                and subtle grain texture. Dark mode doesn't just invert colors —
                it uses proper OKLCH values that respect human perception.
              </p>
              <div style={{ marginTop: 'var(--space-md)' }}>
                <span className="badge">OKLCH Colors</span>
                <span className="badge">Fluid Scale</span>
                <span className="badge">Accessible</span>
              </div>
            </div>
          </div>

          {/* THEME: Example content section */}
          <div className="card">
            <div className="card-content">
              <h2>Customize this template</h2>
              <p>
                All the customization points are marked with <code>/* THEME */</code> comments.
                Replace the color tokens, font URLs, and content to match your domain.
              </p>
              <div className="code-block">
                --color-accent: oklch(55% 0.18 260);
              </div>
              <p>
                Change the hue value (260) to shift the accent color. Fintech uses 230 (blue),
                healthcare uses 180 (teal), creative uses 310 (purple).
              </p>
            </div>
          </div>

          {/* THEME: Stats grid example */}
          <div className="grid">
            <div className="stat-card">
              <div className="stat-value">12.5k</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">98%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">4.8</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>

          {/* THEME: CTA section */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <button className="btn" onClick={() => alert('Button clicked!')}>
              Get Started
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
