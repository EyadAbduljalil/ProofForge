/**
 * Dashboard Template — React + TypeScript
 *
 * Data-heavy SaaS dashboard with sidebar navigation, metric cards, and chart area.
 * Uses CSS custom properties from the domain token system. Not trying to be fancy,
 * just a solid starting point that doesn't look like every other admin panel.
 *
 * Customization points marked with /* THEME */ — that's where domain tokens get injected.
 * Dark mode via data-theme attribute on root element.
 *
 * Layout: Sidebar (collapsible) + header + metric grid + chart area.
 * Responsive: sidebar becomes overlay on mobile, metrics stack, chart fills width.
 */

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// {{THEME_MARKER}} — Domain tokens get injected here
const styles = `
  :root {
    /* THEME: Replace with domain color tokens */
    --color-bg-base: oklch(98% 0.01 280);
    --color-bg-surface: oklch(100% 0 0);
    --color-bg-surface-hover: oklch(97% 0.01 280);
    --color-border-subtle: oklch(90% 0.01 280);
    --color-border-strong: oklch(80% 0.02 280);
    --color-text-primary: oklch(25% 0.02 280);
    --color-text-secondary: oklch(45% 0.02 280);
    --color-accent-primary: oklch(55% 0.18 260);
    --color-accent-surface: oklch(96% 0.03 260);

    /* THEME: Typography from domain tokens */
    --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;

    /* THEME: Motion tokens */
    --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    --duration-fast: 150ms;

    /* THEME: Shape tokens */
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  [data-theme="dark"] {
    /* THEME: Dark mode color tokens */
    --color-bg-base: oklch(18% 0.01 280);
    --color-bg-surface: oklch(22% 0.01 280);
    --color-bg-surface-hover: oklch(26% 0.02 280);
    --color-border-subtle: oklch(30% 0.02 280);
    --color-border-strong: oklch(40% 0.03 280);
    --color-text-primary: oklch(92% 0.01 280);
    --color-text-secondary: oklch(70% 0.02 280);
    --color-accent-primary: oklch(65% 0.18 260);
    --color-accent-surface: oklch(25% 0.05 260);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font-sans);
    background: var(--color-bg-base);
    color: var(--color-text-primary);
    line-height: 1.5;
  }

  .dashboard-shell {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }

  @container (max-width: 768px) {
    .dashboard-shell { grid-template-columns: 1fr; }
    .sidebar { position: fixed; inset: 0; z-index: 50; transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
  }

  /* THEME: Sidebar styling */
  .sidebar {
    background: var(--color-bg-surface);
    border-right: 1px solid var(--color-border-subtle);
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .nav-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-item {
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-smooth);
  }

  .nav-item:hover {
    background: var(--color-bg-surface-hover);
    color: var(--color-text-primary);
  }

  .nav-item.active {
    /* THEME: Active nav item accent */
    background: var(--color-accent-surface);
    color: var(--color-accent-primary);
    font-weight: 600;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    container-type: inline-size;
  }

  .header {
    background: var(--color-bg-surface);
    border-bottom: 1px solid var(--color-border-subtle);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content-area {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* THEME: Metric card styling */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .metric-card {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .metric-value {
    /* THEME: Metric value typography */
    font-size: 2rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }

  .metric-label {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metric-change {
    font-size: 0.875rem;
    font-weight: 500;
    font-family: var(--font-mono);
  }

  .metric-change.positive { color: oklch(55% 0.14 145); }
  .metric-change.negative { color: oklch(55% 0.18 25); }

  /* THEME: Chart area styling */
  .chart-section {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
  }

  .chart-header {
    margin-bottom: 1rem;
  }

  .chart-title {
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, changeType }) => (
  <div className="metric-card" role="region" aria-label={`${label} metric`}>
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
    {change && <div className={`metric-change ${changeType}`}>{change}</div>}
  </div>
);

const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-shell" style={{ containerType: 'inline-size' }}>
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} role="navigation">
          <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Dashboard</div>
          <ul className="nav-list">
            {['overview', 'analytics', 'reports', 'settings'].map(item => (
              <li
                key={item}
                className={`nav-item ${activeNav === item ? 'active' : ''}`}
                onClick={() => setActiveNav(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content">
          <header className="header">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Overview</h1>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </header>

          <div className="content-area">
            <section className="metrics-grid" role="region" aria-label="Key metrics">
              <MetricCard label="Revenue" value="$24,500" change="+12.5%" changeType="positive" />
              <MetricCard label="Active Users" value="1,247" change="+8.3%" changeType="positive" />
              <MetricCard label="Conversion" value="3.2%" change="-0.4%" changeType="negative" />
              <MetricCard label="Avg. Session" value="4m 32s" change="+18s" changeType="positive" />
            </section>

            <section className="chart-section">
              <div className="chart-header">
                <h2 className="chart-title">Revenue Trend</h2>
              </div>
              {/* THEME: Chart colors from domain tokens */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                  <YAxis stroke="var(--color-text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-accent-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-accent-primary)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
