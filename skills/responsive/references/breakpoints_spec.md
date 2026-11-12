# ProofForge Breakpoint & Viewport Rules

| Breakpoint | Minimum Width | Layout Strategy | Table Strategy |
|---|---|---|---|
| Mobile (base) | 320px | Single column, full-width drawers, stacked forms | Convert to card list |
| Tablet (`md`) | 768px | 2-column grid, compact sidebar, collapsible filters | Horizontal scroll container |
| Desktop (`lg`)| 1024px | Full layout, persistent navigation, multi-column panels| Full responsive data grid |

### Touch Target Rule
```css
/* All mobile interactive elements must achieve at least 44x44px target */
button, a, input, select {
  min-height: 44px;
}
```
