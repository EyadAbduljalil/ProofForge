/**
 * SaaS Application Shell — React + TypeScript
 *
 * Starting point for SaaS product interfaces. Top nav, command palette (⌘K),
 * content area with breadcrumbs, empty states, toast notifications.
 *
 * Not trying to be Notion or Linear, just a solid foundation that doesn't
 * force you into a specific aesthetic. Customize via domain tokens.
 *
 * {{THEME_MARKER}} — Domain token injection points marked with /* THEME */
 *
 * Features:
 * - Command palette with keyboard shortcuts
 * - Toast notification system
 * - Empty state components
 * - Breadcrumb navigation
 * - Dark mode support
 */

import React, { useState, useEffect } from 'react';

// {{THEME_MARKER}} — Domain tokens get injected here
const styles = `
  :root {
    /* THEME: Replace with domain color tokens */
    --color-bg-base: oklch(98% 0.005 280);
    --color-bg-surface: oklch(100% 0 0);
    --color-bg-overlay: oklch(100% 0 0 / 0.95);
    --color-border: oklch(88% 0.01 280);
    --color-text-primary: oklch(22% 0.02 280);
    --color-text-secondary: oklch(50% 0.02 280);
    --color-text-tertiary: oklch(65% 0.01 280);
    --color-accent: oklch(55% 0.18 260);
    --color-accent-surface: oklch(96% 0.03 260);
    --color-success: oklch(55% 0.14 145);
    --color-warning: oklch(65% 0.16 85);
    --color-error: oklch(55% 0.18 25);

    /* THEME: Typography tokens */
    --font-sans: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;

    /* THEME: Motion tokens */
    --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --duration-fast: 150ms;
    --duration-normal: 250ms;

    /* THEME: Shape tokens */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-full: 9999px;

    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  [data-theme="dark"] {
    /* THEME: Dark mode tokens */
    --color-bg-base: oklch(18% 0.01 280);
    --color-bg-surface: oklch(22% 0.01 280);
    --color-bg-overlay: oklch(22% 0.01 280 / 0.95);
    --color-border: oklch(30% 0.02 280);
    --color-text-primary: oklch(92% 0.01 280);
    --color-text-secondary: oklch(70% 0.02 280);
    --color-text-tertiary: oklch(55% 0.02 280);
    --color-accent-surface: oklch(25% 0.05 260);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font-sans);
    background: var(--color-bg-base);
    color: var(--color-text-primary);
    line-height: 1.5;
  }

  /* THEME: Top navigation bar */
  .topnav {
    background: var(--color-bg-surface);
    border-bottom: 1px solid var(--color-border);
    padding: 0.875rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    position: sticky;
    top: 0;
    z-index: 40;
    backdrop-filter: blur(8px);
  }

  .logo {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-text-primary);
  }

  .nav-search {
    flex: 1;
    max-width: 400px;
  }

  /* THEME: Command palette trigger button */
  .search-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: var(--color-bg-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-tertiary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-smooth);
  }

  .search-trigger:hover {
    border-color: var(--color-accent);
    color: var(--color-text-secondary);
  }

  .kbd {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .app-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* THEME: Breadcrumb navigation */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .breadcrumb a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--duration-fast);
  }

  .breadcrumb a:hover {
    color: var(--color-accent);
  }

  .breadcrumb-current {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  /* THEME: Command palette modal */
  .palette-overlay {
    position: fixed;
    inset: 0;
    background: oklch(0% 0 0 / 0.4);
    backdrop-filter: blur(4px);
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 2rem;
  }

  .palette {
    background: var(--color-bg-overlay);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 600px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .palette-input {
    padding: 1rem 1.25rem;
    border: none;
    border-bottom: 1px solid var(--color-border);
    background: transparent;
    font-size: 1rem;
    color: var(--color-text-primary);
    outline: none;
  }

  .palette-results {
    overflow-y: auto;
    padding: 0.5rem;
  }

  .palette-item {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: background var(--duration-fast);
  }

  .palette-item:hover {
    background: var(--color-accent-surface);
  }

  .palette-icon {
    width: 2rem;
    height: 2rem;
    background: var(--color-accent-surface);
    border-radius: var(--radius-sm);
    display: grid;
    place-items: center;
  }

  /* THEME: Empty state component */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .empty-state-icon {
    width: 4rem;
    height: 4rem;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    display: grid;
    place-items: center;
    margin: 0 auto 1rem;
    font-size: 1.5rem;
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }

  /* THEME: Toast notifications */
  .toast-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 60;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .toast {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 300px;
    animation: toast-in var(--duration-normal) var(--ease-spring);
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateY(1rem); }
    to { opacity: 1; transform: translateY(0); }
  }

  .toast.success { border-left: 3px solid var(--color-success); }
  .toast.warning { border-left: 3px solid var(--color-warning); }
  .toast.error { border-left: 3px solid var(--color-error); }

  .btn {
    padding: 0.625rem 1.25rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-smooth);
  }

  .btn:hover {
    background: oklch(from var(--color-accent) calc(l - 0.05) c h);
  }
`;

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export default function SaaSApp() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
      // Escape to close palette
      if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const commands = [
    { icon: '📄', label: 'New Document', action: 'create-doc' },
    { icon: '👥', label: 'Invite Team Member', action: 'invite' },
    { icon: '⚙️', label: 'Settings', action: 'settings' },
    { icon: '🌙', label: 'Toggle Dark Mode', action: 'theme' },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* THEME: Top navigation bar */}
      <nav className="topnav" role="navigation" aria-label="Main navigation">
        <div className="logo">AppName</div>
        <div className="nav-search">
          <button
            className="search-trigger"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <span>Search or run a command...</span>
            <span className="kbd">⌘K</span>
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>
            🔔
          </button>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--color-accent)' }} />
        </div>
      </nav>

      <main className="app-content">
        {/* THEME: Breadcrumb navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/projects">Projects</a>
          <span>/</span>
          <span className="breadcrumb-current">Dashboard</span>
        </nav>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Dashboard
        </h1>

        {/* THEME: Empty state example */}
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No data yet</h3>
          <p>Get started by creating your first project or importing existing data.</p>
          <button
            className="btn"
            onClick={() => addToast('Project created successfully!', 'success')}
          >
            Create Project
          </button>
        </div>
      </main>

      {/* THEME: Command palette */}
      {paletteOpen && (
        <div
          className="palette-overlay"
          onClick={() => setPaletteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="palette" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className="palette-input"
              placeholder="Type a command or search..."
              autoFocus
            />
            <div className="palette-results">
              {commands.map((cmd, i) => (
                <div
                  key={i}
                  className="palette-item"
                  onClick={() => {
                    addToast(`Executed: ${cmd.label}`, 'success');
                    setPaletteOpen(false);
                  }}
                >
                  <div className="palette-icon">{cmd.icon}</div>
                  <span>{cmd.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* THEME: Toast notifications */}
      <div className="toast-container" role="region" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
