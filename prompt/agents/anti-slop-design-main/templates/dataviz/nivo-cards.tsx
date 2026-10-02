/**
 * Nivo Chart Card Components
 *
 * Three card-sized charts (mini bar, sparkline, donut) using Nivo.
 * Custom theme object overrides Nivo defaults with domain tokens.
 * Responsive via ResizeObserver on the card wrapper.
 *
 * Customization points marked with THEME comments.
 */

import React, { useRef, useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import type { Theme } from '@nivo/core';

// --- TypeScript interfaces ---

interface BarDataPoint { label: string; value: number; }
interface SparklinePoint { x: string; y: number; }
interface DonutSlice { id: string; label: string; value: number; }
interface ChartCardProps { title: string; subtitle?: string; children: React.ReactNode; }

/* THEME: chart-colors — Replace with domain accent palette */
const COLORS = [
  'oklch(55% 0.18 260)', 'oklch(58% 0.15 195)', 'oklch(62% 0.14 145)',
  'oklch(65% 0.16 45)', 'oklch(50% 0.19 310)',
];

/* THEME: typography */
const FONT = "'Plus Jakarta Sans', 'Source Sans 3', system-ui, sans-serif";

/** THEME: Nivo theme object — overrides all Nivo defaults */
const nivoTheme: Theme = {
  text: { fontFamily: FONT, fontSize: 12, fill: 'oklch(50% 0.02 260)' },
  axis: {
    ticks: {
      text: { fontFamily: FONT, fontSize: 11, fill: 'oklch(60% 0.015 260)' },
      line: { stroke: 'transparent' },
    },
    domain: { line: { stroke: 'transparent' } },
    legend: { text: { fontFamily: FONT, fontSize: 12, fill: 'oklch(45% 0.02 260)', fontWeight: 600 } },
  },
  grid: { line: { stroke: 'oklch(92% 0.01 260)', strokeDasharray: '4 3' } },
  tooltip: {
    container: {
      fontFamily: FONT, fontSize: 13, background: 'oklch(100% 0 0)',
      border: '1px solid oklch(90% 0.01 260)', borderRadius: '0.5rem',
      boxShadow: '0 2px 8px oklch(0% 0 0 / 0.08)', padding: '0.5rem 0.75rem',
    },
  },
};

const cardCSS = `
  .nivo-card {
    /* THEME: card surface tokens */
    --c-bg: oklch(100% 0 0); --c-border: oklch(92% 0.01 260);
    --c-text: oklch(22% 0.02 260); --c-muted: oklch(55% 0.015 260);
    --c-r: 0.625rem; --c-sh: 0 1px 3px oklch(0% 0 0 / 0.06);
    background: var(--c-bg); border: 1px solid var(--c-border);
    border-radius: var(--c-r); box-shadow: var(--c-sh); padding: 1.25rem;
    font-family: ${FONT}; container-type: inline-size;
  }
  [data-theme="dark"] .nivo-card {
    --c-bg: oklch(20% 0.01 260); --c-border: oklch(28% 0.02 260);
    --c-text: oklch(92% 0.01 260); --c-muted: oklch(60% 0.015 260);
    --c-sh: 0 1px 3px oklch(0% 0 0 / 0.2);
  }
  .nivo-card__t { font-size: 0.9375rem; font-weight: 650; color: var(--c-text);
    margin-bottom: 0.125rem; line-height: 1.3; }
  .nivo-card__s { font-size: 0.75rem; color: var(--c-muted); margin-bottom: 0.75rem; }
  @container (max-width: 260px) {
    .nivo-card__t { font-size: 0.8125rem; }
  }
`;

/** Card wrapper with ResizeObserver for responsive chart height */
const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(160);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 300;
      setH(w < 260 ? 120 : w < 360 ? 140 : 160);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="nivo-card" ref={ref}>
      <div className="nivo-card__t">{title}</div>
      {subtitle && <div className="nivo-card__s">{subtitle}</div>}
      <div style={{ width: '100%', height: h }}>{children}</div>
    </div>
  );
};

// --- Mock data ---

const barData: BarDataPoint[] = [
  { label: 'Mon', value: 42 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 35 },
  { label: 'Thu', value: 71 }, { label: 'Fri', value: 63 },
];

const sparkData: SparklinePoint[] = [
  { x: 'Jan', y: 120 }, { x: 'Feb', y: 145 }, { x: 'Mar', y: 132 },
  { x: 'Apr', y: 168 }, { x: 'May', y: 155 }, { x: 'Jun', y: 189 },
  { x: 'Jul', y: 201 }, { x: 'Aug', y: 220 },
];

const donutData: DonutSlice[] = [
  { id: 'organic', label: 'Organic', value: 42 }, { id: 'referral', label: 'Referral', value: 24 },
  { id: 'direct', label: 'Direct', value: 18 }, { id: 'social', label: 'Social', value: 16 },
];

// --- Chart cards ---

export function MiniBarCard() {
  return (
    <ChartCard title="Signups peaked on Thursday" subtitle="Daily signups this week">
      <ResponsiveBar data={barData} keys={['value']} indexBy="label" theme={nivoTheme}
        colors={[COLORS[0]]} margin={{ top: 4, right: 4, bottom: 24, left: 32 }}
        padding={0.35} borderRadius={3} enableGridY={false} enableLabel={false}
        axisBottom={{ tickSize: 0, tickPadding: 6 }}
        axisLeft={{ tickSize: 0, tickPadding: 6, tickValues: 4 }} animate={false} />
    </ChartCard>
  );
}

export function SparklineCard() {
  return (
    <ChartCard title="Revenue up 83% since January" subtitle="Monthly revenue trend">
      <ResponsiveLine data={[{ id: 'revenue', data: sparkData }]} theme={nivoTheme}
        colors={[COLORS[1]]} margin={{ top: 8, right: 8, bottom: 24, left: 36 }}
        xScale={{ type: 'point' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        curve="monotoneX" lineWidth={2} pointSize={0} enableGridX={false} enableGridY={false}
        enableArea areaOpacity={0.08} axisBottom={{ tickSize: 0, tickPadding: 6 }}
        axisLeft={{ tickSize: 0, tickPadding: 6, tickValues: 3 }} animate={false} />
    </ChartCard>
  );
}

export function DonutCard() {
  return (
    <ChartCard title="Organic drives 42% of traffic" subtitle="Traffic sources breakdown">
      <ResponsivePie data={donutData} theme={nivoTheme} colors={COLORS}
        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        innerRadius={0.6} padAngle={1.5} cornerRadius={3} borderWidth={0}
        enableArcLabels={false} arcLinkLabelsSkipAngle={12}
        arcLinkLabelsTextColor="oklch(45% 0.02 260)"
        arcLinkLabelsThickness={1} arcLinkLabelsColor="oklch(80% 0.01 260)" animate={false} />
    </ChartCard>
  );
}

/** Grid layout composing all three card charts */
export default function NivoCardGrid() {
  return (
    <>
      <style>{cardCSS}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem', padding: '1.5rem' }}>
        <MiniBarCard />
        <SparklineCard />
        <DonutCard />
      </div>
    </>
  );
}
