// Anti-Slop Jetpack Compose App Template
// Domain-driven theming with OKLCH-derived colors, accessible content descriptions
// No banned fonts: uses domain-specified custom typefaces

package com.example.antislop

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.*
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// =============================================================================
// Color Tokens — OKLCH-derived, converted to sRGB for Compose Color()
// =============================================================================
/* THEME: replace colors — map your domain OKLCH tokens to sRGB values here */
object AppColorTokens {
    // Light
    val bgPrimary = Color(0xFFFAF8F5)           // oklch(0.97 0.01 80)
    val bgSecondary = Color(0xFFEDE9E5)          // oklch(0.93 0.02 80)
    val bgElevated = Color(0xFFFFFFFF)
    val accentPrimary = Color(0xFF3D5CB8)        // oklch(0.50 0.15 265)
    val accentSecondary = Color(0xFF6B8CD1)      // oklch(0.62 0.12 265)
    val textPrimary = Color(0xFF1F1F21)          // oklch(0.22 0.01 260)
    val textSecondary = Color(0xFF6B6B70)        // oklch(0.52 0.01 260)
    val textOnAccent = Color(0xFFFAFAFC)
    val border = Color(0xFFD9D4D0)               // oklch(0.87 0.01 80)
    val success = Color(0xFF38946B)              // oklch(0.58 0.12 160)
    val warning = Color(0xFFC79E2E)              // oklch(0.72 0.14 85)
    val error = Color(0xFFB8383D)                // oklch(0.48 0.16 25)

    // Dark
    val darkBgPrimary = Color(0xFF1A1A1F)        // oklch(0.18 0.01 270)
    val darkBgSecondary = Color(0xFF26262B)       // oklch(0.24 0.01 270)
    val darkBgElevated = Color(0xFF2E2E36)
    val darkTextPrimary = Color(0xFFEBE8E6)       // oklch(0.93 0.01 80)
    val darkTextSecondary = Color(0xFF9E9C99)     // oklch(0.68 0.01 80)
    val darkBorder = Color(0xFF42424A)            // oklch(0.34 0.01 270)
}

/* THEME: replace color scheme — wire your domain tokens into Material3 */
private val LightColorScheme = lightColorScheme(
    primary = AppColorTokens.accentPrimary,
    secondary = AppColorTokens.accentSecondary,
    background = AppColorTokens.bgPrimary,
    surface = AppColorTokens.bgElevated,
    onPrimary = AppColorTokens.textOnAccent,
    onBackground = AppColorTokens.textPrimary,
    onSurface = AppColorTokens.textPrimary,
    outline = AppColorTokens.border,
    error = AppColorTokens.error,
    onError = AppColorTokens.textOnAccent,
)

private val DarkColorScheme = darkColorScheme(
    primary = AppColorTokens.accentSecondary,
    secondary = AppColorTokens.accentPrimary,
    background = AppColorTokens.darkBgPrimary,
    surface = AppColorTokens.darkBgElevated,
    onPrimary = AppColorTokens.textOnAccent,
    onBackground = AppColorTokens.darkTextPrimary,
    onSurface = AppColorTokens.darkTextPrimary,
    outline = AppColorTokens.darkBorder,
    error = AppColorTokens.error,
    onError = AppColorTokens.textOnAccent,
)

// =============================================================================
// Typography — domain typefaces only, no banned fonts
// =============================================================================
/* THEME: replace fonts — specify your domain typeface resource references */
val DisplayFontFamily = FontFamily(
    Font(R.font.source_serif_4_regular, FontWeight.Normal),
    Font(R.font.source_serif_4_semibold, FontWeight.SemiBold),
)

val BodyFontFamily = FontFamily(
    Font(R.font.ibm_plex_sans_regular, FontWeight.Normal),
    Font(R.font.ibm_plex_sans_medium, FontWeight.Medium),
    Font(R.font.ibm_plex_sans_semibold, FontWeight.SemiBold),
)

/* THEME: replace typography — adjust sizes and weights for your domain */
val AppTypography = Typography(
    displayLarge = TextStyle(fontFamily = DisplayFontFamily, fontSize = 32.sp, fontWeight = FontWeight.SemiBold, lineHeight = 40.sp),
    titleLarge = TextStyle(fontFamily = DisplayFontFamily, fontSize = 24.sp, fontWeight = FontWeight.SemiBold, lineHeight = 32.sp),
    titleMedium = TextStyle(fontFamily = BodyFontFamily, fontSize = 18.sp, fontWeight = FontWeight.Medium, lineHeight = 26.sp),
    bodyLarge = TextStyle(fontFamily = BodyFontFamily, fontSize = 16.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp),
    bodyMedium = TextStyle(fontFamily = BodyFontFamily, fontSize = 14.sp, fontWeight = FontWeight.Normal, lineHeight = 20.sp),
    labelLarge = TextStyle(fontFamily = BodyFontFamily, fontSize = 14.sp, fontWeight = FontWeight.Medium, lineHeight = 20.sp),
    labelSmall = TextStyle(fontFamily = BodyFontFamily, fontSize = 11.sp, fontWeight = FontWeight.Medium, lineHeight = 16.sp),
)

/* THEME: replace shapes */
val AppShapes = Shapes(
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(16.dp),
)

// =============================================================================
// Theme Composable
// =============================================================================
@Composable
fun AntiSlopTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        shapes = AppShapes,
        content = content
    )
}

// =============================================================================
// Data
// =============================================================================
data class ListItemData(val title: String, val subtitle: String, val icon: ImageVector)

val sampleItems = listOf(
    ListItemData("Dashboard", "View your overview", Icons.Outlined.Dashboard),
    ListItemData("Messages", "3 unread conversations", Icons.Outlined.ChatBubbleOutline),
    ListItemData("Analytics", "Weekly report ready", Icons.Outlined.BarChart),
    ListItemData("Settings", "Manage preferences", Icons.Outlined.Settings),
    ListItemData("Profile", "Edit your details", Icons.Outlined.Person),
)

// =============================================================================
// Animated List Item
// =============================================================================
@Composable
fun AnimatedListItem(item: ListItemData, index: Int) {
    var visible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(index * 60L)
        visible = true
    }

    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(animationSpec = spring(dampingRatio = 0.75f, stiffness = 300f)) +
                slideInVertically(
                    initialOffsetY = { 40 },
                    animationSpec = spring(dampingRatio = 0.75f, stiffness = 300f)
                ),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(MaterialTheme.shapes.medium)
                .background(MaterialTheme.colorScheme.surface)
                .border(0.5.dp, MaterialTheme.colorScheme.outline, MaterialTheme.shapes.medium)
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = "${item.title} icon",
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.12f))
                    .padding(6.dp)
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(item.title, style = MaterialTheme.typography.titleMedium)
                Text(item.subtitle, style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
            }
            Icon(
                imageVector = Icons.Outlined.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

// =============================================================================
// Screens
// =============================================================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Home", style = MaterialTheme.typography.titleLarge) })
        }
    ) { padding ->
        LazyColumn(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            item {
                Text(
                    "Welcome back",
                    style = MaterialTheme.typography.displayLarge,
                    modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                )
            }
            itemsIndexed(sampleItems) { index, item ->
                AnimatedListItem(item = item, index = index)
            }
        }
    }
}

// =============================================================================
// Main Activity with Bottom Navigation
// =============================================================================
data class NavItem(val label: String, val icon: ImageVector, val desc: String)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AntiSlopTheme {
                val navItems = listOf(
                    NavItem("Home", Icons.Outlined.Home, "Navigate to home"),
                    NavItem("Search", Icons.Outlined.Search, "Navigate to search"),
                    NavItem("Profile", Icons.Outlined.Person, "Navigate to profile"),
                )
                var selectedTab by remember { mutableIntStateOf(0) }

                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            navItems.forEachIndexed { index, item ->
                                NavigationBarItem(
                                    selected = selectedTab == index,
                                    onClick = { selectedTab = index },
                                    icon = {
                                        Icon(item.icon, contentDescription = item.desc)
                                    },
                                    label = { Text(item.label) },
                                    modifier = Modifier.semantics {
                                        contentDescription = item.desc
                                    }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (selectedTab) {
                            0 -> HomeScreen()
                            1 -> Text("Search", modifier = Modifier.padding(24.dp))
                            2 -> Text("Profile", modifier = Modifier.padding(24.dp))
                        }
                    }
                }
            }
        }
    }
}
