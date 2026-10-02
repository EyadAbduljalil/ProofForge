// Anti-Slop React Native App Template
// NativeWind v4 approach with domain-driven theming
// OKLCH-derived colors, accessible roles and labels
// No banned fonts: uses domain-specified custom typefaces

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
// NativeWind v4: import your tailwind setup
// import '../global.css';

/* THEME: customize tailwind.config.js — map these tokens into your
   tailwind.config.js extend.colors / extend.fontFamily sections.
   Example tailwind.config.js:
   module.exports = {
     content: ['./App.tsx', './src/**\/*.{ts,tsx}'],
     theme: {
       extend: {
         colors: tokens.colors,
         fontFamily: {
           display: [tokens.fonts.display],
           body: [tokens.fonts.body],
           mono: [tokens.fonts.mono],
         },
       },
     },
   };
*/

// =============================================================================
// Domain Tokens — OKLCH-derived, converted to hex/RGB
// =============================================================================
/* THEME: replace colors — convert your OKLCH domain profile tokens to hex */
const tokens = {
  colors: {
    bgPrimary: '#FAF8F5',        // oklch(0.97 0.01 80)
    bgSecondary: '#EDE9E5',      // oklch(0.93 0.02 80)
    bgElevated: '#FFFFFF',
    accentPrimary: '#3D5CB8',    // oklch(0.50 0.15 265)
    accentSecondary: '#6B8CD1',  // oklch(0.62 0.12 265)
    textPrimary: '#1F1F21',      // oklch(0.22 0.01 260)
    textSecondary: '#6B6B70',    // oklch(0.52 0.01 260)
    textOnAccent: '#FAFAFC',
    border: '#D9D4D0',           // oklch(0.87 0.01 80)
    success: '#38946B',          // oklch(0.58 0.12 160)
    warning: '#C79E2E',          // oklch(0.72 0.14 85)
    error: '#B8383D',            // oklch(0.48 0.16 25)
    // Dark mode
    darkBgPrimary: '#1A1A1F',
    darkBgSecondary: '#26262B',
    darkBgElevated: '#2E2E36',
    darkTextPrimary: '#EBE8E6',
    darkTextSecondary: '#9E9C99',
    darkBorder: '#42424A',
  },
  /* THEME: replace fonts — no banned fonts allowed (Inter, Roboto, Open Sans,
     Lato, Arial, Helvetica, Montserrat, Poppins, Raleway) */
  fonts: {
    display: 'SourceSerif4-Regular',
    body: 'IBMPlexSans-Regular',
    bodyMedium: 'IBMPlexSans-Medium',
    mono: 'JetBrainsMono-Regular',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 8, md: 12, lg: 16 },
  fontSize: {
    displayLg: 28,
    titleLg: 22,
    titleMd: 17,
    body: 15,
    caption: 13,
    label: 12,
  },
} as const;

// =============================================================================
// Types & Data
// =============================================================================
interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

const sampleData: CardItem[] = [
  { id: '1', title: 'Dashboard', subtitle: 'View your overview', icon: '📊' },
  { id: '2', title: 'Messages', subtitle: '3 unread conversations', icon: '💬' },
  { id: '3', title: 'Analytics', subtitle: 'Weekly report ready', icon: '📈' },
  { id: '4', title: 'Settings', subtitle: 'Manage preferences', icon: '⚙️' },
  { id: '5', title: 'Profile', subtitle: 'Edit your details', icon: '👤' },
];

// =============================================================================
// Animated Card Component
// =============================================================================
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ItemCard({ item, index }: { item: CardItem; index: number }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 350 });
  }, [scale]);

  return (
    <Animated.View
      entering={FadeIn.delay(index * 60)
        .springify()
        .damping(15)
        .stiffness(300)}
    >
      <AnimatedPressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}: ${item.subtitle}`}
        style={[
          animatedStyle,
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: tokens.colors.bgElevated,
            borderRadius: tokens.radius.md,
            borderWidth: 0.5,
            borderColor: tokens.colors.border,
            paddingHorizontal: tokens.spacing.lg,
            paddingVertical: tokens.spacing.md,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              },
              android: { elevation: 1 },
            }),
          },
        ]}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: tokens.radius.sm,
            backgroundColor: tokens.colors.accentPrimary + '1A',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: tokens.fonts.bodyMedium,
              fontSize: tokens.fontSize.titleMd,
              color: tokens.colors.textPrimary,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontFamily: tokens.fonts.body,
              fontSize: tokens.fontSize.caption,
              color: tokens.colors.textSecondary,
              marginTop: 2,
            }}
          >
            {item.subtitle}
          </Text>
        </View>
        <Text
          style={{ fontSize: 14, color: tokens.colors.textSecondary, opacity: 0.5 }}
          accessibilityLabel=""
        >
          ›
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

// =============================================================================
// Home Screen
// =============================================================================
function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(sampleData);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    // Simulate data reload
    setTimeout(() => {
      setData([...sampleData]);
      setRefreshing(false);
    }, 800);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bgPrimary }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={tokens.colors.bgPrimary}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.md,
          paddingBottom: tokens.spacing.xl,
          gap: 10,
        }}
        ListHeaderComponent={
          /* THEME: replace fonts */
          <Text
            style={{
              fontFamily: tokens.fonts.display,
              fontSize: tokens.fontSize.displayLg,
              color: tokens.colors.textPrimary,
              marginBottom: tokens.spacing.sm,
              paddingLeft: 4,
            }}
            accessibilityRole="header"
          >
            Welcome back
          </Text>
        }
        renderItem={({ item, index }) => (
          <ItemCard item={item} index={index} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tokens.colors.accentPrimary}
            colors={[tokens.colors.accentPrimary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// =============================================================================
// Placeholder Screens
// =============================================================================
function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.bgPrimary }}>
      <Text style={{ fontFamily: tokens.fonts.body, fontSize: tokens.fontSize.body, color: tokens.colors.textSecondary }}>
        Search
      </Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.bgPrimary }}>
      <Text style={{ fontFamily: tokens.fonts.body, fontSize: tokens.fontSize.body, color: tokens.colors.textSecondary }}>
        Profile
      </Text>
    </View>
  );
}

// =============================================================================
// Tab Navigator
// =============================================================================
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tokens.colors.accentPrimary,
          tabBarInactiveTintColor: tokens.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: tokens.colors.bgElevated,
            borderTopColor: tokens.colors.border,
            borderTopWidth: 0.5,
            ...Platform.select({
              ios: { paddingBottom: 4, height: 84 },
              android: { height: 60 },
            }),
          },
          tabBarLabelStyle: {
            fontFamily: tokens.fonts.bodyMedium,
            fontSize: tokens.fontSize.label,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarAccessibilityLabel: 'Home tab',
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarAccessibilityLabel: 'Search tab',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarAccessibilityLabel: 'Profile tab',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
