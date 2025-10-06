# Wajba Design System & Theme Reference

**Version**: 1.0.0  
**Last Updated**: 2025-10-06

Complete Wajba Design System specification and TypeScript theme configuration for React Native, compatible with React Native Paper.

---

## 🎨 Brand Identity

### **Brand Personality**
**Keywords**: authentic • smart • local • appetizing • trustworthy

**Concept**: "Middle Eastern warmth meets intelligent personalization"

**Core Feel**: Calm green foundation + modern mint/violet AI accents

---

## 🌈 Color Palette

### **Primary Colors**
| Token | Hex | Usage |
|-------|-----|-------|
| **Primary (Wajba Teal)** | `#14776F` | Brand logo, buttons, icons |
| **Primary Dark** | `#0E5A55` | Hover states, dark accents |
| **Primary Light (Mint Accent)** | `#3BC8A4` | Highlights, gradients |

### **Accent Colors**
| Token | Hex | Usage |
|-------|-----|-------|
| **Accent (AI Glow)** | `#8E7CFF` | AI chat, glows, AI features |

### **Backgrounds**
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Background** | `#F8F9FB` | `#0F1113` | App background |
| **Surface / Card** | `#FFFFFF` | `#1C1F24` | Input forms, containers |

### **Text**
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Text Primary** | `#1B1B1B` | `#EAEAEA` | Headings, main text |
| **Text Secondary** | `#666E75` | `#A0A5B1` | Subtext, helper text |

### **Status**
| Token | Hex | Usage |
|-------|-----|-------|
| **Success** | `#4ECB71` | Success, confirmations |
| **Error** | `#E74C3C` | Validation, error states |

### **UI Elements**
| Token | Hex | Usage |
|-------|-----|-------|
| **Divider** | `#E3E6EA` | Borders, separators |
| **Disabled** | `#CBD5DE` | Disabled states |

---

## 📝 Typography

### **Font Families**
- **Headings & Buttons**: Poppins SemiBold (600)
- **Body & Captions**: Inter Regular (400)

### **Type Scale**
| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| **Headline** | Poppins | 28px | 600 (SemiBold) | 36px | Page titles |
| **Subheader** | Poppins | 22px | 600 (SemiBold) | 28px | Section headers |
| **Body** | Inter | 15px | 400 (Regular) | 22px | Paragraph text |
| **Caption** | Inter | 12px | 400 (Regular) | 16px | Helper text, hints |
| **Button** | Poppins | 16px | 600 (SemiBold) | - | Button labels |

---

## 📐 Layout & Spacing

### **Spacing System** (4px base unit)
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Compact elements |
| `md` | 12px | Default gap |
| `lg` | 16px | Input spacing |
| `xl` | 24px | Screen padding |
| `xxl` | 32px | Section spacing |
| `xxxl` | 40px | Large sections |
| `huge` | 60px | Top margins |

### **Common Patterns**
- **Screen padding**: 24px
- **Section spacing**: 32px
- **Input spacing**: 16px
- **Card/button radius**: 12px
- **Logo halo glow**: 24px blur

---

## 🎯 Components

### **Input Fields**
```typescript
{
  background: '#FFFFFF',
  borderRadius: 12,
  borderColor: '#E3E6EA',      // default
  borderColorFocus: '#14776F',  // focused (Wajba Teal)
  shadow: '0 2px 4px rgba(0,0,0,0.05)',
  padding: 16,
}
```

### **Primary Buttons**
```typescript
{
  gradient: 'linear-gradient(90deg, #14776F → #3BC8A4)',
  textColor: '#FFFFFF',
  borderRadius: 12,
  shadow: '0 4px 8px rgba(0,0,0,0.1)',
  fontSize: 16,
  fontWeight: '600', // Poppins SemiBold
}
```

### **Secondary Buttons**
```typescript
{
  background: '#FFFFFF',
  borderColor: '#E3E6EA',
  borderWidth: 1,
  borderRadius: 12,
  textColor: '#14776F',
}
```

### **Links**
```typescript
{
  color: '#14776F',        // Wajba Teal
  colorHover: '#0E5A55',   // Darker teal
  fontSize: 14,
  fontWeight: '500',
}
```

---

## 💫 Shadows & Motion

### **Shadows**
| Element | Shadow Spec |
|---------|-------------|
| **Card** | `0 2px 4px rgba(0,0,0,0.05)` |
| **Button** | `0 4px 8px rgba(0,0,0,0.1)` |
| **Logo Glow** | Teal halo blur 24px |

### **Animations**
| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| **Logo glow pulse** | 2.5s | loop | Continuous pulse |
| **Button press** | instant | scale(0.97–1.0) | Press feedback |
| **Input focus** | 150ms | ease | Color fade |
| **Page fade-in** | 300ms | ease | Screen transitions |

---

## 🌙 Dark Mode

### **Color Adjustments**
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Background** | `#F8F9FB` | `#0F1113` |
| **Surface** | `#FFFFFF` | `#1C1F24` |
| **Text Primary** | `#1B1B1B` | `#EAEAEA` |
| **Text Secondary** | `#666E75` | `#A0A5B1` |
| **Primary Button** | Same gradient | Same gradient |

**Note**: Primary buttons retain the same gradient in dark mode for brand consistency.

---

## 💻 TypeScript Implementation

### **Complete Theme Configuration**

```typescript
// src/theme/colors.ts
import { ColorPalette } from '../types';

export const colors: ColorPalette = {
  // Primary Colors (Wajba Teal)
  primary: '#14776F',
  primaryDark: '#0E5A55',
  
  // Accent Colors
  accent: '#8E7CFF',
  
  // Backgrounds
  backgroundLight: '#F8F9FB',
  backgroundDark: '#0F1113',
  
  // Surface (Cards)
  surfaceLight: '#FFFFFF',
  surfaceDark: '#1C1F24',
  
  // Text
  textPrimary: '#1B1B1B',
  textSecondary: '#666E75',
  textLight: '#EAEAEA',
  textMuted: '#A0A5B1',
  
  // Status
  success: '#4ECB71',
  error: '#E74C3C',
  
  // Dividers
  divider: '#E3E6EA',
  
  // Gradients
  gradientStart: '#14776F',
  gradientEnd: '#3BC8A4',
  gradientBannerEnd: '#3BC8A4',
};
```

### **React Native Paper Theme**

```typescript
// src/theme/theme.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

export const WajbaLightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,              // #14776F
    primaryContainer: colors.primaryDark,
    secondary: colors.accent,             // #8E7CFF
    surface: colors.surfaceLight,
    background: colors.backgroundLight,
    error: colors.error,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.divider,
  },
  roundness: 12,
};

export const WajbaDarkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    surface: colors.surfaceDark,
    background: colors.backgroundDark,
    onSurface: colors.textLight,
    onSurfaceVariant: colors.textMuted,
  },
  roundness: 12,
};
```

### **Design Tokens**

```typescript
export const tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 60,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 40,
    pill: 24,
  },
  shadows: {
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    logo: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 6,
    },
  },
  animation: {
    timing: {
      fast: 150,
      normal: 300,
      slow: 600,
      verySlow: 2500,
    },
  },
};

export const ui = {
  radius: {
    card: 12,
    button: 12,
    input: 12,
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    medium: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
  },
};
```

---

## 🎨 Logo Integration

### **Wajba Logo**
- **Location**: `assets/wajba_logo.png`
- **Usage**: Automatically displayed in AnimatedLogo component
- **Size**: 80px default (customizable)
- **Animation**: Pulsing gradient glow (2.5s loop)

### **Logo Component**
```typescript
// Default: Shows Wajba logo image
<AnimatedLogo size={80} />

// Optional: Use custom emoji
<AnimatedLogo emoji="🍽️" size={80} />
```

---

## 🚀 Usage Example

### **App Setup**

```typescript
// App.tsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { WajbaLightTheme } from './src/theme/theme';

export default function App() {
  return (
    <PaperProvider theme={WajbaLightTheme}>
      {/* Navigation and screens */}
    </PaperProvider>
  );
}
```

### **Component Usage**

```typescript
import { colors } from '../theme/colors';
import { tokens } from '../theme/theme';

const MyComponent = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to Wajba</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    padding: tokens.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
```

### **Gradient Button**

```typescript
<GradientButton
  title="Order Now"
  onPress={handleOrder}
  gradientColors={[colors.primary, colors.gradientEnd]}
/>
```

---

## 📊 Design Tokens Reference

### **Quick Reference Table**
| Category | Token | Value |
|----------|-------|-------|
| **Primary** | `colors.primary` | `#14776F` |
| **Accent** | `colors.accent` | `#8E7CFF` |
| **Background** | `colors.backgroundLight` | `#F8F9FB` |
| **Surface** | `colors.surfaceLight` | `#FFFFFF` |
| **Text** | `colors.textPrimary` | `#1B1B1B` |
| **Spacing** | `tokens.spacing.xl` | `24px` |
| **Radius** | `tokens.borderRadius.medium` | `12px` |
| **Shadow** | `tokens.shadows.button` | See above |

---

## ✅ Implementation Checklist

### **Theme Setup**
- [x] Colors defined in `colors.ts`
- [x] Typography defined in `typography.ts`
- [x] Theme configured in `theme.ts`
- [x] Design tokens exported
- [x] UI tokens exported
- [x] Dark mode theme ready

### **Component Updates**
- [x] GradientButton uses Wajba gradient
- [x] Input uses Wajba colors
- [x] AnimatedLogo uses 2.5s pulse
- [x] All components use design tokens
- [x] Shadows match Wajba spec

### **App Integration**
- [x] App.tsx uses WajbaLightTheme
- [x] All screens use theme colors
- [x] All spacing uses tokens
- [x] All animations match spec

---

## 🎨 Brand Guidelines

### **Do's**
✅ Use Wajba Teal (#14776F) for primary actions  
✅ Use 12px border radius consistently  
✅ Use Poppins SemiBold for headings  
✅ Use Inter Regular for body text  
✅ Use design tokens, never hardcode  
✅ Maintain 24px screen padding  
✅ Keep logo glow at 24px blur  

### **Don'ts**
❌ Don't use colors outside the palette  
❌ Don't mix border radius values  
❌ Don't hardcode spacing values  
❌ Don't use fonts other than Poppins/Inter  
❌ Don't change gradient direction  
❌ Don't modify shadow specifications  

---

## 📚 Related Documentation

- **[DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)** - Development best practices
- **[DESIGN_SPEC.md](./DESIGN_SPEC.md)** - Complete design specification
- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - Component API reference
- **[TYPESCRIPT_GUIDE.md](./TYPESCRIPT_GUIDE.md)** - TypeScript patterns

---

**Status**: Wajba Theme Implemented ✅  
**Compatibility**: React Native Paper MD3  
**TypeScript**: Fully typed  
**Dark Mode**: Ready
