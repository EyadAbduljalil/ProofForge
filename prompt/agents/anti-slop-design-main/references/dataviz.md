# Data Visualization

Charts are where AI slop goes to die — or to thrive. The default Recharts bar chart with
its blue-fills-and-gray-gridlines aesthetic is the dataviz equivalent of Inter + purple
gradient. Every AI prompt produces the same dashboard: four identical white cards, a line
chart that says "Revenue Over Time," default Recharts colors, a legend nobody reads. يسطا,
we're better than this.

---

## Library Selection

Pick the right tool before you write a single line. Wrong library = fighting the framework
for the entire project.

| Library | Best For | Bundle | Renderer | Anti-Slop Risk | Notes |
|---------|----------|--------|----------|----------------|-------|
| **Recharts** | React dashboards | ~45KB gz | SVG | **HIGH** | Everyone's default. Every AI generates it. Must override everything. |
| **Nivo** | Beautiful defaults | ~35-60KB gz | SVG/Canvas | **MEDIUM** | Gorgeous out of the box, but "gorgeous default" is still a default. |
| **visx** (Airbnb) | Max control, hero chart | ~15KB gz | SVG | **LOW** | Primitives, not opinions. You build everything. That's the point. |
| **Apache ECharts** | 1M+ points, canvas perf | ~300KB gz | Canvas/SVG | **MEDIUM** | Heavy artillery. Chinese ecosystem docs. Worth it for scale. |
| **uPlot** | Fastest rendering alive | ~35KB gz | Canvas | **LOW** | 166K points in 25ms. Not a typo. Time-series streaming king. |
| **Plotly.js 6.0** | Scientific / academic | ~1MB gz | SVG/WebGL | **MEDIUM** | Jupyter crowd loves it. 3D scatter, contour, heatmaps. |
| **shadcn/ui Charts** | Tailwind + Recharts | ~45KB gz | SVG | **HIGH** | Literally Recharts with Tailwind classes. Same slop, nicer DX. |
| **Scrollama + D3** | Scrollytelling | ~8KB + D3 | SVG | **LOW** | The Pudding stack. Story-driven data. Not dashboards. |
| **GSAP ScrollTrigger + D3** | Timeline animation | ~25KB + D3 | SVG | **LOW** | When the data needs to *move*. Award-winning longform. |

### Decision Guide

- **Dashboard with 4-8 charts** → Recharts (but override EVERYTHING, see below)
- **One impressive chart that needs to slap** → visx. Build from primitives.
- **Streaming real-time data** → uPlot. Nothing else comes close.
- **Scientific paper / Jupyter export** → Plotly.js 6.0
- **Data journalism / narrative** → Scrollama + D3
- **"I just need a chart in my artifact"** → Recharts or Chart.js. Read the next section first.

---

## Anti-Default Chart Styling

This is the section that matters. The NYT Graphics desk, The Pudding, Bloomberg Visuals —
they share one trait: **nothing is default**. Every color, label, and gridline is a
deliberate choice. AI makes average choices. We make specific ones.

### Color: Kill the Defaults

**NEVER** ship library default colors. Recharts `#8884d8` and `#82ca9d` are fine for
prototyping. Not for production.

1. **Max 5-6 colors per chart.** More = your chart is doing too much.
2. **[Viz Palette](https://projects.susielu.com/viz-palette)** (Susie Lu) for colorblind safety. Every time. 8% of men have CVD — not edge case territory.
3. **Build from domain design tokens.** Your app has a color system. Charts use it.
4. **OKLCH for perceptual uniformity.** Same lightness = same perceived brightness.

```tsx
// Domain-aware color palette — OKLCH-derived
const CHART_COLORS = {
  primary:   'oklch(0.65 0.20 250)',  // strong blue — the "story" color
  secondary: 'oklch(0.70 0.15 160)',  // teal — supporting
  tertiary:  'oklch(0.75 0.12 45)',   // warm sand
  muted:     'oklch(0.78 0.03 250)',  // near-gray — background series
  danger:    'oklch(0.62 0.22 25)',   // red-orange — alert/negative
  success:   'oklch(0.68 0.18 145)',  // green — positive/growth
};

<Bar dataKey="revenue" fill={CHART_COLORS.primary} />
<Bar dataKey="costs"   fill={CHART_COLORS.muted} />
<Line dataKey="growth" stroke={CHART_COLORS.success} strokeWidth={2.5} />
```

احا — if you ship `fill="#8884d8"` to production, you're telling the world an AI made this.

### Typography: Three Fonts, Three Jobs

- **Chart title**: Domain heading font (Instrument Serif, Fraunces). Big. Bold-ish.
- **Axis labels**: Body font (Geist, Satoshi). Regular weight. Smaller.
- **Data values / ticks**: Monospace (JetBrains Mono, Geist Mono). Numbers align.

```tsx
// Custom tick components — monospace numbers, domain fonts
const CustomYTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="end" dy={4}
    fontFamily="'Geist Mono', monospace" fontSize={12}
    fill="oklch(0.55 0.02 250)">
    {payload.value.toLocaleString()}
  </text>
);

const CustomXTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="middle" dy={16}
    fontFamily="'Geist', sans-serif" fontSize={11}
    fill="oklch(0.50 0.02 250)">
    {payload.value}
  </text>
);

<YAxis tick={<CustomYTick />} axisLine={false} tickLine={false} width={60} />
<XAxis tick={<CustomXTick />} axisLine={false} tickLine={false} />
```

### Declarative Titles: Say Something

The title should tell the reader what to conclude, not what they're looking at. The NYT
doesn't write "GDP By Country." They write "China's Economy Grew 3x Faster Than Europe's."

| BAD (Descriptive) | GOOD (Declarative) |
|--------------------|--------------------|
| Sales Over Time | Q3 Sales Surged 15% After Campaign Launch |
| Monthly Users | User Growth Plateaued in September |
| Revenue by Region | APAC Now Accounts for 40% of Total Revenue |
| Error Rate | Deploy v2.3 Cut Error Rate in Half |

A good title is a finding, not a label. If you can guess it from the axis labels, it adds
zero information.

### Annotation Over Legend

Legends force: decode color → scan chart → match line → forget → repeat. Direct labels
eliminate all steps. Use legends only when >4 series or interactive toggle is needed.

```tsx
import { ReferenceLine, Label, LabelList } from 'recharts';

<ReferenceLine y={targetValue} stroke="oklch(0.62 0.22 25)"
  strokeDasharray="6 4" strokeWidth={1.5}>
  <Label value="Target: 10K MRR" position="insideTopRight"
    fontFamily="'Geist', sans-serif" fontSize={12}
    fill="oklch(0.62 0.22 25)" offset={8} />
</ReferenceLine>

{/* Direct label on last data point — no legend needed */}
<Line dataKey="revenue" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={false}>
  <LabelList dataKey="revenue" position="right"
    content={({ x, y, value, index }) =>
      index === data.length - 1 ? (
        <text x={x + 8} y={y} fontSize={12} fill={CHART_COLORS.primary}
          fontFamily="'Geist Mono', monospace" dominantBaseline="middle">
          {value.toLocaleString()}
        </text>
      ) : null
    } />
</Line>
```

### Remove Chart Junk (Tufte)

Maximize data-ink ratio. AI charts love gridlines, borders, background fills, tick marks.
Remove all of them. Add back only what the reader genuinely needs.

```tsx
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={<CustomXTick />} />
    <YAxis axisLine={false} tickLine={false} tick={<CustomYTick />} width={50} />
    <CartesianGrid horizontal={true} vertical={false}
      stroke="oklch(0.90 0.01 250)" strokeDasharray="3 3" />
    <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary}
      strokeWidth={2.5} dot={false}
      activeDot={{ r: 4, fill: CHART_COLORS.primary }} />
  </LineChart>
</ResponsiveContainer>
```

No legend. No border. No heavy gridlines. No background color. The data speaks.

### Highlight + Mute

One color for the story, everything else gray. If everything is colorful, nothing matters.

```tsx
const HIGHLIGHT_REGION = 'APAC';

<Bar dataKey="revenue">
  {regionData.map((entry, i) => (
    <Cell key={i}
      fill={entry.region === HIGHLIGHT_REGION
        ? 'oklch(0.65 0.20 250)'   // bold — THIS is the story
        : 'oklch(0.82 0.02 250)'   // muted — context only
      }
      radius={[4, 4, 0, 0]} />
  ))}
</Bar>
```

One bar pops. The reader knows where to look. هانت — that's it.

---

## Dashboard Composition

A dashboard is an information hierarchy, not "a page with charts on it."

### Card Hierarchy

- **Hero metric**: Large. Top-left or top-center. One number, one sparkline, one trend arrow. This is what the reader came for.
- **Supporting metrics**: 3-4 smaller cards. Same row. Secondary KPIs.
- **Detail charts**: Below the cards. Line/bar/area explaining the metrics above.
- **Data tables**: Bottom. For people who want raw numbers. Always last.

The AI default: four equal-sized cards, same visual weight. That's a spreadsheet with
borders, not a hierarchy.

### Chart Type Selection

| Data Story | Chart Type | Why |
|------------|-----------|-----|
| Trend over time | Line | Continuous flow. Remove dots unless <10 points. |
| Compare categories | Horizontal bar | Easier to read labels. Vertical only if time is x-axis. |
| Part of whole | Donut (≤5 slices) | Never pie. Donut has center for total. |
| Volume / accumulation | Stacked area | Shows total and composition. |
| Distribution | Histogram or violin | Box plots are for stats papers, not dashboards. |
| Correlation | Scatter | Add trend line. Label outliers. |

### Sparklines in Metric Cards

Every metric card should have a sparkline. "Revenue: $42K" is a fact. "Revenue: $42K ↑12%"
with a sparkline showing trajectory is context. No axes, no labels, no dots — just the line.

### Real-Time Patterns

1. **Skeleton loading**: Chart frame with pulsing placeholders. Never empty boxes or spinners.
2. **Optimistic rendering**: Update immediately on new data. Don't wait for confirmation.
3. **Rolling window**: Keep last N minutes. Don't accumulate forever.
4. **Transition**: 200ms ease-out. No bounce. No elastic. Smooth slide.

### Responsive Charts

- `<ResponsiveContainer>` always — never hardcoded dimensions
- Hide secondary y-axes below 640px
- Reduce ticks on mobile (`interval="preserveStartEnd"`)
- Replace complex charts with simplified metric cards on small screens

---

## Scrollytelling Patterns

When data has a narrative — not a dashboard, a *story* — scrollytelling is the format.
The Pudding, NYT Upshot, Bloomberg Visual Stories: bread and butter.

### Scrollama + D3 Stack

Scrollama handles scroll detection (IntersectionObserver). D3 handles visualization.
Never raw scroll events — that path leads to jank, debounce hacks, 30fps shame.

1. **Steps**: Each beat is a `<div class="step">` with `data-step` attributes.
2. **step-enter**: When a step enters viewport, update the chart — transition data, change annotation, highlight series.
3. **Sticky graphic**: Chart container is `position: sticky`. Text scrolls past. Chart morphs.

### Progressive Reveal

Build the story incrementally:

- **Step 1**: Empty axes. "Let's look at climate data since 1950."
- **Step 2**: One line appears. "Temperatures rose steadily..."
- **Step 3**: Regional lines. "But the Arctic warmed 3x faster."
- **Step 4**: Annotation on spike. "2016 was the hottest year on record."
- **Step 5**: Projections extend. "By 2050, models predict..."

Each step adds information the reader absorbs before the next arrives. Impossible in a
dashboard. This is why scrollytelling exists.

### Annotation Layers

Scrollytelling lives on annotations: reference lines appearing per step, text callouts
anchored to data points, highlighted regions between values, animated transitions (D3,
400-600ms). The Pudding's best pieces have more annotation code than chart code.

---

## Anti-Patterns

The checklist of shame. Fix these before shipping.

### 1. Library Default Colors
`#8884d8` and `#82ca9d` are the dataviz `bg-indigo-500`. Build a palette from design
tokens. Check in Viz Palette.

### 2. Descriptive Titles ("Sales Over Time")
If you can guess the title from reading axis labels, it adds nothing. احا — your title
should be a finding, not a description of the axes.

### 3. Legends Instead of Direct Labels
Color decode → scan → match → forget → repeat. If ≤4 series, label directly on the data.

### 4. 3D Effects
3D bars distort perception — back bars look smaller. Only valid for actual XYZ spatial data.
Everything else is PowerPoint 2003 energy.

### 5. Pie Charts with >5 Categories
Human eyes can't compare arc lengths past 4-5 slices. Use horizontal bars — position along
a common axis is the most accurate visual encoding we have.

### 6. Y-Axis Not Starting at Zero (Bar Charts)
Line charts can start anywhere (the slope tells the story). Bars MUST start at zero. A bar's
meaning is its area. Y-axis starting at 90 with values 92-98 makes 6% look like 10x.

### 7. Rainbow Color Schemes
Hue has no inherent order. Red isn't "more" than blue. Sequential single-hue ramps for
magnitude, diverging two-hue for positive/negative. Never jet. Never rainbow.

### 8. Rotated 90-Degree Axis Labels
If labels need 90° rotation to fit, your chart is wrong. Use horizontal bars (labels on
y-axis, plenty of room), abbreviate, reduce ticks, or increase width. هانت.

### 9. Dual Y-Axes
Two unrelated scales, crossing points that mean nothing, constant visual scanning. Use two
charts stacked vertically sharing the same x-axis. Same info, zero confusion.
