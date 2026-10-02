# Mobile Native Reference

Native mobile is where AI slop gets exposed hardest. On the web you can hide
behind a CSS reset. On iOS and Android, users have muscle memory for how things
*feel*. Wrong spring physics, wrong sheet style, zero haptics — the app feels
like a web wrapper in a trench coat. يسطا — your users can tell.

Covers SwiftUI, Jetpack Compose, and Flutter. React Native animation is in
`animation-motion.md` (Reanimated 4.x). Assumes you've read `SKILL.md`.

---

## SwiftUI (iOS 26+)

### Custom Token Architecture

Never use `Color.blue` directly. Shipping unmodified system tints is the iOS
equivalent of default Tailwind zinc. Build a three-tier token struct:

```swift
struct AppColors {
    // Primitives — OKLCH converted to Display P3
    static let brand500 = Color(.displayP3, red: 0.26, green: 0.52, blue: 0.96)
    static let brand600 = Color(.displayP3, red: 0.18, green: 0.42, blue: 0.88)
    // Semantic — what the color means
    static let interactive = brand500
    static let surfacePrimary = Color(.displayP3, red: 0.98, green: 0.98, blue: 0.99)
    static let textPrimary = Color(.displayP3, red: 0.07, green: 0.07, blue: 0.09)
    static let destructive = Color(.displayP3, red: 0.90, green: 0.22, blue: 0.21)
    // Component — the actual thing on screen
    static let buttonPrimary = interactive
    static let cardBackground = Color.white
    static let navBarBackground = surfacePrimary.opacity(0.85)
}
```

Primitives -> Semantic -> Component, same as the CSS token system.

### Typography System

```swift
struct AppTypography {
    @ScaledMetric(relativeTo: .title) static var titleSize: CGFloat = 28
    @ScaledMetric(relativeTo: .body) static var bodySize: CGFloat = 16

    static let display = Font.custom("Instrument Serif", size: 34, relativeTo: .largeTitle)
    static let title = Font.custom("Inter", size: 22, relativeTo: .title).weight(.semibold)
    static let body = Font.custom("Inter", size: 16, relativeTo: .body)
    static let mono = Font.custom("JetBrains Mono", size: 14, relativeTo: .body)
}
```

The `relativeTo:` parameter maps your custom font to a Dynamic Type category.
Ship without it and your app breaks at accessibility text sizes. احا — test with
the largest Dynamic Type setting before you ship.

### Animation APIs

SwiftUI has the best animation system on any platform. Springs are first-class,
everything is interruptible, the API is declarative.

**Core APIs ranked by reach:**
1. `withAnimation(.spring())` — 80% of your animations
2. `PhaseAnimator` — multi-step sequences (pulse, shake, celebrate)
3. `KeyframeAnimator` — frame-by-frame choreography
4. `matchedGeometryEffect` — shared element transitions
5. `.contentTransition(.numericText())` — animated counters

```swift
// Spring list animation — staggered entry
struct ItemListView: View {
    let items: [Item]
    @State private var appeared = false

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(Array(items.enumerated()), id: \.element.id) { i, item in
                    ItemCard(item: item)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 20)
                        .animation(
                            .spring(response: 0.45, dampingFraction: 0.8)
                            .delay(Double(i) * 0.05), value: appeared
                        )
                }
            }.padding(.horizontal, 16)
        }.onAppear { appeared = true }
    }
}
```

`response: 0.45` is snappy for UI. Below 0.3 = twitchy, above 0.6 = sluggish.
`dampingFraction: 0.8` = subtle settle. Creative domains: 0.65-0.7 for bounce.
Fintech: 0.85-1.0 (critically damped, no bounce).

### Liquid Glass (iOS 26)

Translucent refractive material applied automatically to NavigationStack bars,
TabViews, and sheets. Decide: embrace or override.

**Embrace when:** Standard navigation, brand tints work over glass, consumer app.
**Override when:** Opaque brand surfaces, immersive content, dense data (fintech).

```swift
// Embrace — tint the glass
.toolbarBackground(.glassEffect.tint(AppColors.brand500.opacity(0.3)))

// Override — opaque custom bar
.toolbarBackgroundVisibility(.hidden, for: .navigationBar)
.safeAreaInset(edge: .top) { CustomNavBar().background(AppColors.surfacePrimary) }
```

### Breaking the Template

Default NavigationStack + TabView + List = the shadcn-zinc of iOS.

- **Custom NavBar:** `.safeAreaInset(edge: .top)`. Respect the safe area.
- **Custom TabBar:** `.toolbar(.hidden, for: .tabBar)` + custom bar. Animate
  selection indicator with `matchedGeometryEffect`.
- **Full-bleed:** `.ignoresSafeArea(.container, edges: .top)` for hero images.
- **Custom transitions:** `NavigationTransition` protocol (iOS 18+).
- **Haptics:** The separator between native and web wrappers.

```swift
UIImpactFeedbackGenerator(style: .light).impactOccurred()   // toggles
UIImpactFeedbackGenerator(style: .medium).impactOccurred()  // actions
UINotificationFeedbackGenerator().notificationOccurred(.success) // completion
UIImpactFeedbackGenerator(style: .rigid).impactOccurred()   // snap/dock
```

Haptics cost nothing. No excuse for zero haptic feedback.

---

## Jetpack Compose (Material3 1.4.0+)

### Custom MaterialTheme Override

The purple (#6750A4) primary screams "I didn't customize anything."

```kotlin
/* THEME — Primitives from OKLCH-derived values */
object AppPrimitives {
    val brand500 = Color(0xFF4466EE); val brand600 = Color(0xFF2244CC)
    val brand50 = Color(0xFFEEF2FF);  val brand900 = Color(0xFF112266)
    val neutral50 = Color(0xFFFAFAFB); val neutral900 = Color(0xFF111116)
    val error500 = Color(0xFFDC3545)
}

/* THEME — Color scheme */
private val LightColorScheme = lightColorScheme(
    primary = AppPrimitives.brand500, onPrimary = Color.White,
    primaryContainer = AppPrimitives.brand50,
    surface = AppPrimitives.neutral50, onSurface = AppPrimitives.neutral900,
    error = AppPrimitives.error500, onError = Color.White,
)

/* THEME — Typography */
val AppTypography = Typography(
    displayLarge = TextStyle(fontFamily = FontFamily(Font(R.font.instrument_serif)),
        fontSize = 34.sp, lineHeight = 40.sp, letterSpacing = (-0.5).sp),
    titleLarge = TextStyle(fontFamily = FontFamily(Font(R.font.inter_semibold)),
        fontSize = 22.sp, lineHeight = 28.sp),
    bodyLarge = TextStyle(fontFamily = FontFamily(Font(R.font.inter_regular)),
        fontSize = 16.sp, lineHeight = 24.sp),
)

/* THEME — Shapes */
val AppShapes = Shapes(
    small = RoundedCornerShape(6.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(20.dp),
)

/* THEME — Apply */
@Composable
fun AppTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme,
        typography = AppTypography, shapes = AppShapes, content = content,
    )
}
```

Every `/* THEME */` marker is a decision point. Change all of them.

### Compose Animation

M3 1.4.0 introduced `MotionScheme` — structured spatial/effects motion tokens:

```kotlin
val springSpec = MaterialTheme.motionScheme.fastSpatialSpec<Float>()
```

**SharedTransitionLayout** (Compose 1.7+) for shared element transitions:

```kotlin
SharedTransitionLayout {
    NavHost(navController, startDestination = "list") {
        composable("list") {
            LazyColumn {
                items(cards) { card ->
                    Card(Modifier
                        .sharedElement(rememberSharedContentState("card-${card.id}"),
                            animatedVisibilityScope = this@composable)
                        .clickable { navController.navigate("detail/${card.id}") }
                    ) {
                        AsyncImage(card.imageUrl, Modifier
                            .sharedElement(rememberSharedContentState("img-${card.id}"),
                                animatedVisibilityScope = this@composable)
                            .fillMaxWidth().height(200.dp))
                    }
                }
            }
        }
    }
}
```

Also: `AnimatedVisibility` for enter/exit, `updateTransition` for multi-property
state animations, `animateContentSize()` for smooth layout changes.

### Compose Multiplatform 1.8.0+

iOS target is stable — not experimental. Netflix, Cash App, and Duolingo ship it.
One set of domain tokens, one set of animations, both platforms. But: iOS-specific
behaviors (haptics, Liquid Glass, navigation gestures) still need `expect`/`actual`.
هانت — share the logic, not the platform feel.

---

## Flutter (3.41.2+)

### Impeller Rendering

Default backend since Flutter 3.16. 30-50% jank reduction, 120fps on modern
devices, pre-compiled shaders. If your Flutter app stutters, it's your code.

### Custom ThemeExtension for Brand Tokens

`ThemeData` doesn't have fields for brand-specific needs. `ThemeExtension` fixes that:

```dart
class BrandTokens extends ThemeExtension<BrandTokens> {
  final Color brandPrimary, brandAccent, surfaceTinted;
  final double cardRadius;
  const BrandTokens({required this.brandPrimary, required this.brandAccent,
    required this.surfaceTinted, this.cardRadius = 12.0});

  @override BrandTokens copyWith({Color? brandPrimary, Color? brandAccent,
    Color? surfaceTinted, double? cardRadius}) => BrandTokens(
    brandPrimary: brandPrimary ?? this.brandPrimary,
    brandAccent: brandAccent ?? this.brandAccent,
    surfaceTinted: surfaceTinted ?? this.surfaceTinted,
    cardRadius: cardRadius ?? this.cardRadius);

  @override BrandTokens lerp(BrandTokens? other, double t) => BrandTokens(
    brandPrimary: Color.lerp(brandPrimary, other?.brandPrimary, t)!,
    brandAccent: Color.lerp(brandAccent, other?.brandAccent, t)!,
    surfaceTinted: Color.lerp(surfaceTinted, other?.surfaceTinted, t)!,
    cardRadius: lerpDouble(cardRadius, other?.cardRadius ?? cardRadius, t)!);
}

// Apply in ThemeData
final appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4466EE)),
  textTheme: GoogleFonts.interTextTheme().copyWith(
    displayLarge: GoogleFonts.instrumentSerif(fontSize: 34, height: 1.18),
    bodyLarge: GoogleFonts.inter(fontSize: 16, height: 1.5)),
  extensions: const [BrandTokens(brandPrimary: Color(0xFF4466EE),
    brandAccent: Color(0xFFEE8844), surfaceTinted: Color(0xFFF0F2FF))],
);

// Access: Theme.of(context).extension<BrandTokens>()!.cardRadius
```

The `lerp` method enables animated theme switching. Don't skip it.

### Rive vs Lottie vs CustomPainter

**Lottie**: AE export, one-directional playback. Good for illustrations, empty
states, loading. **Rive**: Interactive state machines, responds to input, ~60KB
runtime. Use for stateful animations. **CustomPainter**: Math-driven — charts,
generative art, custom progress. Pair with `AnimationController` for 60fps.

---

## Platform-Appropriate Behavior

| Behavior | iOS Convention | Android Convention | Recommendation |
|---|---|---|---|
| **Back nav** | Swipe from left edge | System back gesture | Respect default. Never disable swipe-back on iOS. |
| **Pull-to-refresh** | UIRefreshControl, subtle | Material circular indicator | Use platform-native. Don't custom-build. |
| **Bottom sheet** | `.presentationDetents()` | `ModalBottomSheet` (M3) | Native APIs. Half-height detent. Never centered modal for selection. |
| **Haptics** | UIImpactFeedbackGenerator | HapticFeedbackConstants | Always include. toggle=light, action=medium, success/error=notification. |
| **Tab bar** | Bottom, 2-5 items | Bottom (M3) or top | Bottom for primary nav. Top tabs for filtering only. |
| **Typography** | SF Pro + Dynamic Type | Roboto + sp units | Custom fonts fine, MUST support scaling. Test largest size. |
| **Scroll** | Rubber-band overscroll | Glow/stretch (M3) | Don't override. Users feel it subconsciously. |
| **Status bar** | Light/dark content | Edge-to-edge tint | iOS: `.preferredStatusBarStyle`. Android: `WindowCompat`. |

---

## Anti-Patterns

### 1. Default Theme Unchanged
Material purple. Cupertino blue. The `npx shadcn@latest init` of mobile.
Override every token tier or start over.

### 2. Ignoring Safe Areas
Content behind notches, under home indicators. On Android: not going edge-to-edge
properly. On iOS: `.ignoresSafeArea()` without understanding which edges and why.

### 3. Tap Targets Below Minimum
Apple HIG: 44x44 pt. Material: 48x48 dp. Not suggestions. A 32px icon button
with no padding is an accessibility violation.

### 4. Zero Haptic Feedback
The phone has a precision haptic motor and you're not using it. احا — three
lines of code per interaction, no performance cost, no bundle cost.

### 5. Desktop Hover States on Touch
`:hover` effects, hover-dependent UI reveals. Touch has no hover. Design for
tap, long-press, swipe. If info is only accessible via hover, mobile can't reach it.

### 6. Not Testing on Real Devices
Simulator has perfect perf, perfect network, a mouse pretending to be a finger.
Test on a 3-year-old physical device before every release.

### 7. Ignoring Dynamic Type / Font Scaling
Hardcoded sizes, fixed-height containers that clip at large sizes. iOS: every
`Font.custom()` needs `relativeTo:`. Android: `sp`, not `dp`. Flutter: respect
`MediaQuery.textScaleFactorOf`. Fix the layout, don't cap the scale factor.

### 8. Fake Platform Patterns
FABs on iOS. iOS swipe-to-delete without Material's dismissible. Cupertino
controls in a Material app. Pick a platform language and commit. Compose
Multiplatform makes it tempting to share everything — resist sharing the parts
that should be platform-specific.
