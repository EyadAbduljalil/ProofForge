// Anti-Slop SwiftUI App Template
// Domain-driven theming with OKLCH-derived colors, accessible Dynamic Type
// No banned fonts: uses system or domain-specified custom typefaces

import SwiftUI

// MARK: - Color Tokens
/* THEME: replace colors — convert your OKLCH domain tokens to sRGB for Color(red:green:blue:) */
struct AppColors {
    // Background
    static let bgPrimary = Color(red: 0.98, green: 0.97, blue: 0.96)       // oklch(0.97 0.01 80)
    static let bgSecondary = Color(red: 0.93, green: 0.91, blue: 0.89)     // oklch(0.93 0.02 80)
    static let bgElevated = Color(red: 1.0, green: 1.0, blue: 1.0)

    // Accent
    static let accentPrimary = Color(red: 0.24, green: 0.36, blue: 0.72)   // oklch(0.50 0.15 265)
    static let accentSecondary = Color(red: 0.42, green: 0.55, blue: 0.82) // oklch(0.62 0.12 265)

    // Text
    static let textPrimary = Color(red: 0.12, green: 0.12, blue: 0.13)     // oklch(0.22 0.01 260)
    static let textSecondary = Color(red: 0.42, green: 0.42, blue: 0.44)   // oklch(0.52 0.01 260)
    static let textOnAccent = Color(red: 0.98, green: 0.98, blue: 0.99)

    // Semantic
    static let success = Color(red: 0.22, green: 0.58, blue: 0.42)         // oklch(0.58 0.12 160)
    static let warning = Color(red: 0.78, green: 0.62, blue: 0.18)         // oklch(0.72 0.14 85)
    static let error = Color(red: 0.72, green: 0.22, blue: 0.24)           // oklch(0.48 0.16 25)
    static let border = Color(red: 0.85, green: 0.83, blue: 0.81)          // oklch(0.87 0.01 80)

    // Dark mode variants
    static let darkBgPrimary = Color(red: 0.10, green: 0.10, blue: 0.12)       // oklch(0.18 0.01 270)
    static let darkBgSecondary = Color(red: 0.15, green: 0.15, blue: 0.17)     // oklch(0.24 0.01 270)
    static let darkBgElevated = Color(red: 0.18, green: 0.18, blue: 0.21)
    static let darkTextPrimary = Color(red: 0.92, green: 0.91, blue: 0.90)     // oklch(0.93 0.01 80)
    static let darkTextSecondary = Color(red: 0.62, green: 0.61, blue: 0.60)   // oklch(0.68 0.01 80)
    static let darkBorder = Color(red: 0.26, green: 0.26, blue: 0.29)          // oklch(0.34 0.01 270)
}

// MARK: - Typography
/* THEME: replace fonts — specify your domain typeface; never use Inter, Roboto, Open Sans, Lato,
   Arial, Helvetica, Montserrat, Poppins, or Raleway */
struct AppTypography {
    static let familyDisplay = "SourceSerif4-Regular"   // Replace with domain font
    static let familyBody = "IBMPlexSans-Regular"       // Replace with domain font
    static let familyMono = "JetBrainsMono-Regular"     // Replace with domain font

    @ScaledMetric(relativeTo: .largeTitle) static var titleLarge: CGFloat = 28
    @ScaledMetric(relativeTo: .title) static var titleMedium: CGFloat = 22
    @ScaledMetric(relativeTo: .headline) static var headline: CGFloat = 17
    @ScaledMetric(relativeTo: .body) static var body: CGFloat = 16
    @ScaledMetric(relativeTo: .caption) static var caption: CGFloat = 13

    static func display(_ size: CGFloat) -> Font { .custom(familyDisplay, size: size) }
    static func bodyFont(_ size: CGFloat) -> Font { .custom(familyBody, size: size) }
    static func mono(_ size: CGFloat) -> Font { .custom(familyMono, size: size) }
}

// MARK: - Adaptive Color Helper
struct ThemeColors {
    let colorScheme: ColorScheme

    var bgPrimary: Color { colorScheme == .dark ? AppColors.darkBgPrimary : AppColors.bgPrimary }
    var bgSecondary: Color { colorScheme == .dark ? AppColors.darkBgSecondary : AppColors.bgSecondary }
    var bgElevated: Color { colorScheme == .dark ? AppColors.darkBgElevated : AppColors.bgElevated }
    var textPrimary: Color { colorScheme == .dark ? AppColors.darkTextPrimary : AppColors.textPrimary }
    var textSecondary: Color { colorScheme == .dark ? AppColors.darkTextSecondary : AppColors.textSecondary }
    var border: Color { colorScheme == .dark ? AppColors.darkBorder : AppColors.border }
    var accent: Color { AppColors.accentPrimary }
}

// MARK: - Data Model
struct ListItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let icon: String
}

// MARK: - Item Row
struct ItemRow: View {
    let item: ListItem
    let index: Int
    @Environment(\.colorScheme) private var colorScheme
    @State private var appeared = false

    private var theme: ThemeColors { ThemeColors(colorScheme: colorScheme) }

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: item.icon)
                .font(.system(size: 20))
                .foregroundColor(theme.accent)
                .frame(width: 36, height: 36)
                .background(theme.accent.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .accessibilityLabel("\(item.title) icon")

            VStack(alignment: .leading, spacing: 3) {
                Text(item.title)
                    .font(AppTypography.bodyFont(AppTypography.headline))
                    .foregroundColor(theme.textPrimary)
                Text(item.subtitle)
                    .font(AppTypography.bodyFont(AppTypography.caption))
                    .foregroundColor(theme.textSecondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(theme.textSecondary.opacity(0.5))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(theme.bgElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(theme.border, lineWidth: 0.5)
        )
        .opacity(appeared ? 1 : 0)
        .offset(y: appeared ? 0 : 16)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.75).delay(Double(index) * 0.06)) {
                appeared = true
            }
        }
    }
}

// MARK: - Home Screen
struct HomeScreen: View {
    @Environment(\.colorScheme) private var colorScheme
    private var theme: ThemeColors { ThemeColors(colorScheme: colorScheme) }

    let items: [ListItem] = [
        ListItem(title: "Dashboard", subtitle: "View your overview", icon: "square.grid.2x2"),
        ListItem(title: "Messages", subtitle: "3 unread conversations", icon: "bubble.left.and.bubble.right"),
        ListItem(title: "Analytics", subtitle: "Weekly report ready", icon: "chart.bar"),
        ListItem(title: "Settings", subtitle: "Manage preferences", icon: "gearshape"),
        ListItem(title: "Profile", subtitle: "Edit your details", icon: "person.crop.circle"),
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                /* THEME: replace fonts — heading uses display typeface */
                Text("Welcome back")
                    .font(AppTypography.display(AppTypography.titleLarge))
                    .foregroundColor(theme.textPrimary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 20)
                    .padding(.top, 8)

                LazyVStack(spacing: 10) {
                    ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                        ItemRow(item: item, index: index)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
            }
            .background(theme.bgPrimary.ignoresSafeArea())
            .navigationTitle("Home")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Placeholder Tabs
struct SearchScreen: View {
    var body: some View { Text("Search").font(AppTypography.bodyFont(16)) }
}

struct ProfileScreen: View {
    var body: some View { Text("Profile").font(AppTypography.bodyFont(16)) }
}

// MARK: - App Entry
@main
struct AntiSlopApp: App {
    var body: some Scene {
        WindowGroup {
            TabView {
                HomeScreen()
                    .tabItem {
                        Label("Home", systemImage: "house")
                    }
                SearchScreen()
                    .tabItem {
                        Label("Search", systemImage: "magnifyingglass")
                    }
                ProfileScreen()
                    .tabItem {
                        Label("Profile", systemImage: "person")
                    }
            }
            .tint(AppColors.accentPrimary)
        }
    }
}
