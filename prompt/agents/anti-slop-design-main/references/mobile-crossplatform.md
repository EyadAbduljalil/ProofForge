# Mobile & Cross-Platform Reference

Building mobile apps with cross-platform frameworks is where AI slop gets
dangerous. On the web, a generic page is forgettable. On mobile, a generic app
feels *broken*. Users have muscle memory — swipe gestures, back button behavior,
pull-to-refresh physics. Get any of that wrong and the app feels like a web page
stuffed into a phone-shaped box. Because usually, that's exactly what it is.

This covers React Native, Flutter, and Kotlin Multiplatform Compose.

---

## Framework Selection

Pick based on team DNA, not hype cycles.

| Framework | Team Profile | Anti-Slop Risk | When to Pick |
|-----------|-------------|----------------|--------------|
| React Native + NativeWind | Web/JS team going mobile | **HIGH** — defaults look webby | React devs, fast iteration. Accept the polish tax. |
| Flutter | Dedicated mobile team | **LOW** — Impeller renders everything custom | Pixel-perfect control everywhere. Accept the platform-feel tax. |
| Kotlin Multiplatform + CMP | Android-first adding iOS | **LOW** — native widgets by default | Shared logic with genuinely native UI per platform. |

React Native's high risk isn't a knock on the framework — it's a knock on how
people use it. Flutter's risk is different: polished but *alien* on both
platforms if you don't adapt.

---

## React Native Design Excellence

### NativeWind v4

Compiles Tailwind classes to `StyleSheet.create()` at build time. Zero runtime.
The catch: default tokens produce web-slop. Customize with domain tokens:

```js
// tailwind.config.js — domain-aware mobile tokens
module.exports = {
  content: ['./app/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: 'var(--surface-primary)',    // NOT zinc-950
          secondary: 'var(--surface-secondary)',
          elevated: 'var(--surface-elevated)',
        },
        accent: { DEFAULT: 'var(--accent)', muted: 'var(--accent-muted)' },
      },
      borderRadius: {
        card: 'var(--radius-card)',     // iOS rounds more than Android
        sheet: 'var(--radius-sheet)',
      },
      spacing: {
        'touch-min': '44px',           // Apple HIG minimum
        'touch-comfortable': '48px',   // Material 3 recommended
      },
    },
  },
};
```

Ship NativeWind with the default zinc palette and `rounded-md` on everything?
Congratulations — you've made a web app. يسطا, at least change the colors.

### Avoiding the "Uncanny Valley"

The app *almost* looks native but something is off. Users can't articulate it,
they just feel it:

```tsx
// WRONG: JS navigation — sluggish, no native gestures
import { createStackNavigator } from '@react-navigation/stack';
// RIGHT: Native stack — actual UINavigationController / Fragment transitions
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// WRONG: Custom tab bar component
<Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} />
// RIGHT: Native bottom tabs — blur, haptics, platform animations
import { createNativeBottomTabNavigator } from 'react-native-bottom-tabs';

// Platform-specific sheets — don't fight the OS
const modalPresentation = Platform.select({
  ios: { presentation: 'formSheet', sheetGrabberVisible: true },
  android: { presentation: 'modal', animation: 'slide_from_bottom' },
});

// Haptics on meaningful actions — not every tap
import * as Haptics from 'expo-haptics';
const onBookmark = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  toggleBookmark();
};
```

Rule: if there's a native component that does the thing, use it. Custom
implementations of system behaviors are slop factories.

### React Native Reanimated 4.x

UI thread worklets. No bridge crossing, 120fps on ProMotion. Mandatory for
gesture-driven interaction:

```tsx
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring,
  interpolate, Extrapolation,
} from 'react-native-reanimated';

// Domain-appropriate spring — NOT library defaults
const SPRING_CONFIG = {
  damping: 18,       // Default 10 is too bouncy for most domains
  stiffness: 180,    // Tighter = more intentional
  mass: 0.8,
  overshootClamping: false,
};

function PullToRefresh({ children, onRefresh }) {
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const onRelease = () => {
    translateY.value = withSpring(
      translateY.value > 80 ? 60 : 0,
      SPRING_CONFIG
    );
    if (translateY.value > 80) onRefresh?.();
  };
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
```

Adjust per domain: fintech wants tighter damping (22-26), social can be
bouncier (12-16). Don't ship defaults.

### Tamagui

Compiles styles at build time for web + native, ~10% overhead vs raw
StyleSheet. Use it for universal apps (Expo Router web + iOS + Android).
Mobile-only? NativeWind is simpler with zero overhead. Don't add Tamagui
for the fun of it.

---

## Flutter Cross-Platform Strategy

Flutter draws every pixel via Impeller. Perfect visual consistency — and zero
platform behavior for free. You earn native feel through deliberate adaptation.

### Platform-Adaptive Scaffold

```dart
class AdaptiveScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final Widget? floatingAction;

  const AdaptiveScaffold({required this.title, required this.body,
    this.actions, this.floatingAction});

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoPageScaffold(
        navigationBar: CupertinoNavigationBar(
          middle: Text(title),
          trailing: actions != null
            ? Row(mainAxisSize: MainAxisSize.min, children: actions!) : null,
        ),
        child: SafeArea(child: body),
      );
    }
    return Scaffold(
      appBar: AppBar(title: Text(title), actions: actions),
      body: SafeArea(child: body),
      floatingActionButton: floatingAction,
    );
  }
}
```

### ThemeExtension for Domain Tokens

Don't shove everything into `ThemeData` overrides. `ThemeExtension` keeps
domain tokens separate with built-in `lerp` for smooth theme transitions:

```dart
@immutable
class DomainTokens extends ThemeExtension<DomainTokens> {
  final Color surfacePrimary, surfaceElevated, accent;
  final double radiusCard, radiusSheet;

  const DomainTokens({required this.surfacePrimary,
    required this.surfaceElevated, required this.accent,
    required this.radiusCard, required this.radiusSheet});

  @override
  DomainTokens copyWith({/* ... */}) => DomainTokens(/* ... */);
  @override
  DomainTokens lerp(DomainTokens? other, double t) {
    if (other == null) return this;
    return DomainTokens(
      surfacePrimary: Color.lerp(surfacePrimary, other.surfacePrimary, t)!,
      surfaceElevated: Color.lerp(surfaceElevated, other.surfaceElevated, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      radiusCard: lerpDouble(radiusCard, other.radiusCard, t)!,
      radiusSheet: lerpDouble(radiusSheet, other.radiusSheet, t)!,
    );
  }
}
```

Rive for interactive vector animations (onboarding, loading, empty states).
`go_router` with `ShellRoute` for tab navigation. هانت — GoRouter handles deep
links, redirects, and shell routes. Don't build your own.

---

## Cross-Platform Design Strategy

How much do you match each platform vs. maintain a consistent brand?

| Approach | Examples | When to Use | Trade-off |
|----------|----------|-------------|-----------|
| **Platform-native** | Settings, banking, utilities | Trust matters, utility-first | Max familiarity, zero brand |
| **Brand-consistent** | Spotify, Instagram, Netflix | Brand IS the experience | Strong identity, unfamiliar patterns |
| **Mixed** (recommended) | Airbnb, Uber, most apps | Almost everything else | Best balance, most engineering |

### The Mixed Approach

**Consistent across platforms** (brand layer): color palette, typography family
and scale, iconography, content layout, logo placement, empty states,
illustration style.

**Platform-specific** (interaction layer): navigation (tab bar vs. drawer, back
gestures), sheet presentation (iOS form sheets vs. Material bottom sheets),
haptics (Taptic Engine vs. Android vibration), gesture vocabulary (swipe-back
vs. system back), status bar (Dynamic Island, notification shade), typography
rendering (SF Pro vs. Roboto, or brand font with platform line-height tweaks).

The principle: **brand the surfaces, nativize the interactions**. Users see your
colors and recognize your brand. Users touch your app and it feels like their
phone. احا — if a user has to *think* about how to go back, you've already lost.

---

## Anti-Patterns

The mobile slop hall of shame. Every one of these ships daily.

### 1. JavaScript Navigation Stack
Using `createStackNavigator` instead of `createNativeStackNavigator`. The JS
stack re-implements navigation in JavaScript — slower, no native gestures (iOS
swipe-back), subtly wrong. No reason to use it in 2026.

### 2. Custom Non-Native Tab Bar
Building a tab bar with `Animated.View` and custom handlers. The native tab bar
handles accessibility, haptics, long-press, and Dynamic Type automatically.
Yours doesn't. Use `react-native-bottom-tabs`.

### 3. Web-Style Layouts on Mobile
Centering content in `max-w-lg` with margins like a web page. Mobile screens
are narrow — use full width. 16-20px horizontal padding. Cards breathe
edge-to-edge, not floating in whitespace.

### 4. Ignoring Safe Areas and Keyboard
Content behind the notch, under the home indicator, hidden by keyboard. Use
`SafeAreaView` (RN), `SafeArea` (Flutter). For keyboard:
`react-native-keyboard-controller`, not manual offsets that break on foldables.

### 5. Same Animation Timing iOS/Android
iOS: spring-based with UIKit curves. Android: `EmphasizedEasing` with different
deceleration. Identical `duration: 300, easing: 'ease-out'` feels native on
neither. Use platform-specific spring configs.

### 6. Not Handling Notch, Dynamic Island, Foldables
Hardcoding status bar height to 44px (wrong since iPhone 13). Not handling
foldable Android where dimensions change at runtime. Not accounting for Dynamic
Island's variable size. Use platform safe area APIs.

### 7. Disabling Native Scroll Physics
Replacing scroll behavior with custom JS scrolling. iOS has rubber-banding,
Android has stretch (12+). Kill them and the app feels like a web view. Layer
custom behavior *on top of* native physics, not instead.

---

## Quick Reference: Minimum Viable Native Feel

Before shipping, verify on both platforms:

- [ ] Back navigation uses native gesture (iOS swipe, Android system back)
- [ ] Tab bar is the platform's native component
- [ ] Keyboard avoidance works on every input screen
- [ ] Safe areas respected (notch, home indicator, status bar)
- [ ] Haptics on destructive actions and meaningful state changes
- [ ] Pull-to-refresh uses native or platform-appropriate indicator
- [ ] Scroll physics match platform (rubber band / stretch)
- [ ] Loading states don't block the UI thread
- [ ] Text scales with accessibility settings (Dynamic Type / font scale)
- [ ] Dark mode uses correct surface elevation, not just inverted colors

Check all ten and you're ahead of 90% of cross-platform apps. The bar is low
because most teams don't bother. يسطا, bother.
