# Desktop Application Reference

Desktop apps are a different animal. You own the window, the process, the
system tray icon. The user *installed* your thing — they already care more
than a random website visitor ever will.

The bar is also higher. Desktop users expect keyboard shortcuts, fast startup,
native interactions, and respect for OS preferences. Ship a web-app-in-a-wrapper
and they'll feel it. يسطا, if your Electron app takes 4 seconds to show content,
you've already lost.

---

## Electron Best Practices

Electron gets a bad reputation, mostly earned by lazy implementations. A
well-built Electron app (VS Code, Linear, Obsidian) is indistinguishable from
native for 90% of use cases. A bad one is just a Chrome tab with extra steps.

### Making It Feel Native

The titlebar betrays you first. Platform-specific config:

```js
// main.js — BrowserWindow config
const win = new BrowserWindow({
  width: 1200, height: 800,
  titleBarStyle: 'hiddenInset',                    // macOS: native traffic lights
  trafficLightPosition: { x: 16, y: 18 },
  ...(process.platform !== 'darwin' && {           // Windows/Linux: custom titlebar
    frame: false,
    titleBarOverlay: { color: '#00000000', symbolColor: '#ccc', height: 36 },
  }),
  backgroundColor: '#1a1a1a',                      // no white flash
  show: false,                                     // show after ready-to-show
  webPreferences: { preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true, nodeIntegration: false },
});
win.once('ready-to-show', () => win.show());
```

**Window state memory.** Users close and reopen. If the app forgets position
and size, that's a daily papercut. Use `electron-store` to persist bounds and
`isMaximized` on every `resize`/`move` event.

**System tray** is non-negotiable for background apps. Use `nativeImage` with
platform-appropriate sizes (16x16 macOS, 32x32 Windows). Build context menus
with `Menu.buildFromTemplate()` — not a custom HTML popup.

### Performance

- **Pre-warm the renderer.** `show: false` + `ready-to-show` is the minimum.
  For secondary windows, create hidden on app start and toggle visibility.
- **Local SQLite over network calls.** `better-sqlite3` in main process,
  queried via `ipcRenderer.invoke()` from renderer.
- **NEVER `ipcRenderer.sendSync`.** Blocks the renderer. Use `.invoke()`
  which returns a Promise. If you think you need sync IPC, restructure.
- **Optimistic updates.** Click save, update UI immediately, persist to SQLite
  in background. Roll back on failure (it won't fail, it's local).
- **Code split aggressively.** Lazy-load settings, about windows, onboarding.

### Design Patterns

**Command palette (Cmd+K / Ctrl+K).** Mandatory for serious desktop apps:

```tsx
function CommandPalette({ commands, onSelect }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const filtered = useMemo(
    () => commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query]
  );
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') setSelected(i => Math.min(i + 1, filtered.length - 1));
    if (e.key === 'ArrowUp') setSelected(i => Math.max(i - 1, 0));
    if (e.key === 'Enter') onSelect(filtered[selected]);
  };
  return (
    <div className="command-palette" role="listbox">
      <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} placeholder="Type a command..." />
      <ul>{filtered.map((cmd, i) => (
        <li key={cmd.id} role="option" aria-selected={i === selected}>
          <span>{cmd.label}</span><kbd>{cmd.shortcut}</kbd>
        </li>
      ))}</ul>
    </div>
  );
}
```

**Sidebar navigation.** Collapsible, not a hamburger menu — احا, we're not on
mobile. Pinned items at top, sections with headers, a resize handle.

**Multi-pane layouts.** VS Code's editor + sidebar + panel + terminal. Users
resize, collapse, and expect layout memory across sessions. CSS Grid for the
shell, not flexbox hacks.

**Keyboard-first.** Every action reachable without a mouse. Platform-correct
modifiers (Cmd on macOS, Ctrl elsewhere). Display shortcuts in menus/tooltips.

---

## Tauri 2.0

Rust backend + system WebView (WebKit macOS, WebView2 Windows, WebKitGTK Linux)
instead of bundled Chromium. The numbers speak:

| Metric | Electron | Tauri 2.0 |
|--------|----------|-----------|
| Binary size | 100-200 MB | 3-10 MB |
| Memory baseline | 150-300 MB | 30-40 MB |
| Startup time | 1-3 seconds | < 0.5 seconds |

Tauri 2.0 added mobile targets (iOS/Android) and an ACL permission system —
commands are deny-by-default, capabilities granted per window. Genuinely better
security than Electron's "hope the dev enabled contextIsolation" model.

### Tradeoffs

هانت — not a free lunch:

- **WebView inconsistencies.** Safari WebView on macOS behaves differently from
  WebView2 on Windows. CSS features, JS APIs, DevTools quality all vary. Test
  on all platforms, not just your dev machine.
- **Smaller ecosystem.** Electron has thousands of plugins and battle-tested
  patterns. Tauri's growing fast but has gaps. More custom Rust commands.
- **Rust learning curve.** Frontend is still JS/TS, but anything system-level
  goes through Rust. If the team doesn't know Rust, that's a real cost.

### Decision Framework

**Tauri when:** new project, binary size matters, you want modern security
defaults, team can write Rust, or you need mobile from the same codebase.

**Electron when:** existing app (migration cost is real), need Chromium-specific
APIs, team is all JavaScript, or need guaranteed cross-platform rendering
consistency.

---

## Native Desktop Notes

Brief landscape — this skill provides aesthetic direction, not native API
deep-dives.

- **macOS:** SwiftUI for modern apps, AppKit for legacy/low-level control.
  SwiftUI is where Apple invests; default to it for new projects.
- **Windows:** WinUI 3 with Windows App SDK for modern apps. WPF for legacy
  or complex data binding. UWP is effectively deprecated.
- **Linux:** GTK 4 + libadwaita for GNOME-native. Qt 6 for cross-desktop
  (KDE + GNOME). libadwaita gives you GNOME design language free but locks
  you to that aesthetic.
- **Cross-platform:** .NET MAUI (Windows, macOS, iOS, Android from C#).
  Kotlin Multiplatform for shared business logic. Neither feels as native
  as platform-specific code, but both beat wrapping a web view.

---

## Desktop-Specific Design Principles

Desktop is not "big phone." Precise cursor, physical keyboard, large display,
multiple windows. Design for what you have.

### Information Density

Desktop users expect MORE density than mobile, not less. A dashboard showing
3 cards per row on 1440p is wasting space. Tables should show real data, not
card-ified rows with massive padding. Sidebars should show tree views, not
hamburger menus hiding the navigation. This doesn't mean "cram everything" —
it means take advantage of space to show context that mobile would hide.

### Hover States

Every interactive element needs one. Buttons change background on hover. Table
rows highlight. Tooltips appear for truncated text and icon-only buttons.
Preview panels appear on hover in file browsers. Skip hover states and the
app feels dead — users can't tell what's interactive.

### Context Menus

Right-click menus with keyboard shortcut hints. Use OS native menus when
possible (`Menu` in Electron, `tauri::menu` in Tauri). Custom HTML context
menus only when you need rich content (color pickers), and they must still
respond to keyboard nav and dismiss on Escape.

### Drag and Drop

Expected for: file imports, list reordering, panel rearrangement, cross-window
operations. Proper cursor feedback (`grabbing`, `copy`, `move`, `not-allowed`).
Drop zone highlights. Escape to cancel. Support dropping files from the OS
file manager into your app.

### Focus Management

Tab order logical and complete. Focus rings visible (not hidden behind
`outline: none` — that 2015 CSS reset needs to die). Arrow keys navigate
within composite widgets (lists, grids, trees). Escape dismisses modals and
returns focus to the trigger. This is core desktop UX, not optional a11y.

### Multi-Window

Detachable panels, inspector windows, preview panes that pop out. Dragging
a conversation into its own window, detaching a terminal panel.
`window.open()` in Electron, `WebviewWindow::new()` in Tauri. Sync state
via IPC or shared stores.

---

## Anti-Patterns

Things that make a desktop app feel like a website someone accidentally
installed.

1. **Web-style responsive wasting space.** Max-width 1200px centered on a
   2560px display. Fill the window. Use resizable panes and user-controlled
   layouts, not responsive breakpoints.

2. **Missing keyboard shortcuts.** Can't Ctrl+S, Ctrl+Z, Ctrl+F, Ctrl+W?
   The app is broken. Not incomplete — broken. Display shortcuts in menus
   and tooltips so users discover the less obvious ones.

3. **No command palette.** VS Code, Linear, Raycast, Obsidian, Figma, Arc —
   every serious desktop app has Cmd+K. Build it. Index all actions, recent
   files, navigation targets.

4. **Electron feeling like a website.** No custom titlebar, no tray icon, no
   native menus, no window state memory. X closes instead of minimizing to
   tray. Default Chrome scrollbars. This is what happens when you wrap a web
   app without doing the desktop work.

5. **Ignoring OS dark mode.** `prefers-color-scheme: dark` exists.
   `nativeTheme.shouldUseDarkColors` in Electron. Match the OS. Allow
   override. Save the override.

6. **Slow startup >2 seconds.** Pre-warm windows. Lazy-load non-critical
   views. Show the shell immediately, fill data progressively. Users opened
   your app to DO something.

7. **Missing drag-and-drop.** Can't drag a file from Finder/Explorer into
   the app? Can't reorder a list by dragging? The app feels rigid. Drag and
   drop is a fundamental desktop pattern, not a v2 nice-to-have.

8. **No multi-window support.** Forcing everything into one window when
   content would benefit from side-by-side. Desktop users have multiple
   monitors. Let them use them.
