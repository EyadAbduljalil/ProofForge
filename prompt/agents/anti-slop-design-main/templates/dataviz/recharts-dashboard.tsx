/**
 * Multi-Chart Recharts Dashboard Template
 *
 * Three chart types (line, bar, area) with custom styling from domain tokens.
 * Chart titles are declarative findings, not descriptions.
 * Stripped of chart junk: minimal gridlines, no outer borders, direct labels.
 *
 * Customization points marked with THEME comments.
 */

import React from 'react';
import {
  LineChart, BarChart, AreaChart, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Line, Bar, Area, LabelList,
} from 'recharts';

/* THEME: chart-colors — Replace with domain accent palette */
const CHART_COLORS = [
  'oklch(55% 0.18 260)', 'oklch(60% 0.15 145)', 'oklch(65% 0.16 45)',
  'oklch(50% 0.20 310)', 'oklch(55% 0.14 200)',
] as const;

/* THEME: typography — Replace with domain font stack */
const FONT = "'Plus Jakarta Sans', 'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";

const styles = `
  :root {
    /* THEME: dashboard surface tokens */
    --dash-bg: oklch(98% 0.005 260); --dash-surface: oklch(100% 0 0);
    --dash-border: oklch(92% 0.01 260); --dash-text: oklch(25% 0.02 260);
    --dash-text-2: oklch(50% 0.02 260); --dash-text-m: oklch(65% 0.01 260);
    --dash-r: 0.625rem; --dash-sh: 0 1px 3px oklch(0% 0 0 / 0.06);
    --dash-font: ${FONT}; --dash-mono: ${FONT_MONO};
  }
  [data-theme="dark"] {
    /* THEME: dark mode overrides */
    --dash-bg: oklch(16% 0.01 260); --dash-surface: oklch(20% 0.01 260);
    --dash-border: oklch(28% 0.02 260); --dash-text: oklch(92% 0.01 260);
    --dash-text-2: oklch(68% 0.02 260); --dash-text-m: oklch(50% 0.015 260);
    --dash-sh: 0 1px 3px oklch(0% 0 0 / 0.2);
  }
  .rc-dash { font-family: var(--dash-font); background: var(--dash-bg); padding: 1.5rem;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.25rem; }
  .rc-dash .panel { background: var(--dash-surface); border: 1px solid var(--dash-border);
    border-radius: var(--dash-r); padding: 1.25rem 1.5rem; box-shadow: var(--dash-sh); }
  .rc-dash .panel--wide { grid-column: 1 / -1; }
  .rc-dash .finding { font-size: 1.0625rem; font-weight: 650; color: var(--dash-text);
    margin-bottom: 0.25rem; line-height: 1.3; }
  .rc-dash .sub { font-size: 0.8125rem; color: var(--dash-text-m); margin-bottom: 1rem; }
`;

// --- Mock data ---
const trendData = [
  { month: 'Jan', revenue: 38200 }, { month: 'Feb', revenue: 41500 },
  { month: 'Mar', revenue: 39800 }, { month: 'Apr', revenue: 44100 },
  { month: 'May', revenue: 48700 }, { month: 'Jun', revenue: 52300 },
  { month: 'Jul', revenue: 56900 }, { month: 'Aug', revenue: 61400 },
];

const comparisonData = [
  { category: 'Organic', current: 4200, previous: 3100 },
  { category: 'Referral', current: 2800, previous: 2600 },
  { category: 'Direct', current: 1900, previous: 2200 },
  { category: 'Social', current: 3400, previous: 1800 },
  { category: 'Email', current: 1500, previous: 1400 },
];

const volumeData = [
  { week: 'W1', sessions: 12400, conversions: 870 },
  { week: 'W2', sessions: 14200, conversions: 1020 },
  { week: 'W3', sessions: 13800, conversions: 990 },
  { week: 'W4', sessions: 16100, conversions: 1250 },
  { week: 'W5', sessions: 18900, conversions: 1480 },
  { week: 'W6', sessions: 21200, conversions: 1710 },
];

// --- Custom components ---

interface TPayload { name: string; value: number; color: string; }

/** THEME: Tooltip styled with domain surface/border tokens */
const CustomTooltip: React.FC<{
  active?: boolean; payload?: TPayload[]; label?: string;
  formatter?: (v: number) => string;
}> = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
      borderRadius: 'var(--dash-r)', padding: '0.5rem 0.75rem', boxShadow: 'var(--dash-sh)',
      fontFamily: 'var(--dash-font)', fontSize: '0.8125rem' }}>
      <div style={{ color: 'var(--dash-text-m)', marginBottom: '0.25rem', fontWeight: 500 }}>{label}</div>
      {payload.map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--dash-text-2)' }}>{e.name}:</span>
          <span style={{ fontFamily: 'var(--dash-mono)', fontWeight: 600, color: 'var(--dash-text)' }}>
            {formatter ? formatter(e.value) : e.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

/** THEME: Axis tick styled with domain typography */
const Tick: React.FC<{ x?: number; y?: number; payload?: { value: string } }> = ({ x, y, payload }) => (
  <text x={x} y={(y ?? 0) + 14} textAnchor="middle" fill="var(--dash-text-m)"
    fontSize={12} fontFamily="var(--dash-font)" fontWeight={500}>{payload?.value}</text>
);

const fmt = (v: number) => `$${(v / 1000).toFixed(1)}k`;
const yProps = { axisLine: false, tickLine: false, width: 48,
  tick: { fill: 'var(--dash-text-m)', fontSize: 11, fontFamily: FONT_MONO } } as const;

export default function RechartsDashboard() {
  return (
    <>
      <style>{styles}</style>
      <div className="rc-dash">
        {/* Line chart: trend */}
        <div className="panel panel--wide">
          <h2 className="finding">Revenue grew 61% from January to August</h2>
          <p className="sub">Monthly revenue, 2025</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 8, right: 24, bottom: 4, left: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--dash-border)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={<Tick />} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmt} {...yProps} width={52} />
              <Tooltip content={<CustomTooltip formatter={fmt} />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS[0]}
                strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: CHART_COLORS[0] }} />
              <LabelList dataKey="revenue" position="top" formatter={fmt} offset={10}
                style={{ fontSize: 11, fontFamily: FONT_MONO, fill: 'var(--dash-text-2)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart: comparison */}
        <div className="panel">
          <h2 className="finding">Social traffic doubled year-over-year</h2>
          <p className="sub">Visits by channel, current vs. previous period</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }} barGap={3}>
              <CartesianGrid vertical={false} stroke="var(--dash-border)" strokeDasharray="4 4" />
              <XAxis dataKey="category" tick={<Tick />} axisLine={false} tickLine={false} />
              <YAxis {...yProps} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="previous" name="Previous" fill={CHART_COLORS[4]} radius={[3,3,0,0]} opacity={0.5} />
              <Bar dataKey="current" name="Current" fill={CHART_COLORS[0]} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area chart: volume */}
        <div className="panel">
          <h2 className="finding">Conversion rate held steady as traffic surged</h2>
          <p className="sub">Weekly sessions and conversions</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={volumeData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
              <defs>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--dash-border)" strokeDasharray="4 4" />
              <XAxis dataKey="week" tick={<Tick />} axisLine={false} tickLine={false} />
              <YAxis {...yProps} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sessions" name="Sessions"
                stroke={CHART_COLORS[1]} strokeWidth={2} fill="url(#gS)" />
              <Area type="monotone" dataKey="conversions" name="Conversions"
                stroke={CHART_COLORS[2]} strokeWidth={2} fill="url(#gC)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
