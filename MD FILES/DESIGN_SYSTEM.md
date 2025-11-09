# SmartBite Design System

## 🎨 Brand Identity
**Personality**: AI meets comfort food — fresh, intelligent, and calming  
**Positioning**: Between Grab (trusty & warm) and Spotify (techy & vibrant)

---

## 🌈 Color Palette

### Primary Colors
```javascript
primary: '#3BC8A4'        // Mint Teal - trust, freshness
primaryDark: '#009E83'    // Darker variant for hover/dark mode
```

### Accent (AI)
```javascript
accent: '#8E7CFF'         // Soft Violet - AI interactions
```

### Backgrounds
```javascript
backgroundLight: '#F8F9FB'  // Light mode background
backgroundDark: '#121417'   // Dark mode background
```

### Surface (Cards)
```javascript
surfaceLight: '#FFFFFF'     // Light mode cards
surfaceDark: '#1C1F24'      // Dark mode cards
```

### Text
```javascript
textPrimary: '#1B1B1B'      // Headlines, body text
textSecondary: '#666E75'    // Subtitles, captions
textLight: '#EAEAEA'        // Dark mode text
textMuted: '#9097A2'        // Disabled states
taglineGray: '#737373'      // Specific for taglines
```

### Status
```javascript
success: '#4ECB71'          // Delivered, online
error: '#E74C3C'            // Failed, errors
```

### Dividers
```javascript
divider: '#E3E6EA'          // Borders, separators
```

---

## 🎨 Gradients

### AI Gradient (Primary)
```javascript
colors: [colors.primary, colors.accent]  // #3BC8A4 → #8E7CFF
angle: 135°
usage: "Ask SmartBite" FAB, chat header, logo glow
```

### Button Gradient
```javascript
colors: [colors.primary, colors.gradientBannerEnd]  // #3BC8A4 → #56E2D7
angle: 90° (horizontal)
usage: Primary action buttons
```

### Logo Glow
```javascript
colors: [colors.primary, colors.accent]
angle: 135°
opacity: 0.2
usage: Background glow behind logo
```

---

## 📐 Spacing System

```javascript
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 60,
};
```

### Common Usage
- **Screen padding**: 24px (xl)
- **Card padding**: 16px (lg)
- **Input margin bottom**: 16px (lg)
- **Section spacing**: 32px (xxl)
- **Header top margin**: 60px (huge)

---

## 🔤 Typography

### Font Families
- **Headings**: Poppins SemiBold (600)
- **Body**: Inter Regular (400)
- **Buttons**: Poppins SemiBold (600)

### Type Scale
```javascript
headline: {
  fontSize: 28,
  fontWeight: '600',
  lineHeight: 36,
}

subheader: {
  fontSize: 18,
  fontWeight: '500',
  lineHeight: 24,
}

body: {
  fontSize: 16,
  fontWeight: '400',
  lineHeight: 22,
}

caption: {
  fontSize: 12,
  fontWeight: '400',
  lineHeight: 16,
}

button: {
  fontSize: 16,
  fontWeight: '600',
}
```

### Specific Overrides
```javascript
// Brand name
fontSize: 24,
fontWeight: '600'

// Tagline
fontSize: 14,
fontWeight: '400',
color: '#737373'

// Welcome text
fontSize: 24,
fontWeight: '600'

// Links (Forgot Password, Sign Up)
fontSize: 14,
fontWeight: '500',
color: colors.primary
```

---

## 🎯 Border Radius

```javascript
const borderRadius = {
  small: 8,
  medium: 12,      // Default for inputs, buttons, cards
  large: 16,       // Store cards
  round: 40,       // Logo, avatar
  pill: 24,        // Filter chips
};
```

---

## 💫 Shadows & Elevation

### Input Fields
```javascript
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1,
```

### Primary Buttons
```javascript
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
elevation: 4,
```

### Logo Container
```javascript
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.15,
shadowRadius: 12,
elevation: 6,
```

### Cards (Store listings)
```javascript
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 3,
```

---

## 🎬 Animations

### Fade In (Screen Entry)
```javascript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 600-800,
  useNativeDriver: true,
})
```

### Scale Spring (Logo Entry)
```javascript
Animated.spring(scaleAnim, {
  toValue: 1,
  friction: 8,
  tension: 40,
  useNativeDriver: true,
})
```

### Button Press
```javascript
// Press In
Animated.spring(buttonScale, {
  toValue: 0.95,
  useNativeDriver: true,
})

// Press Out
Animated.spring(buttonScale, {
  toValue: 1,
  friction: 3,
  tension: 40,
  useNativeDriver: true,
})
```

---

## 🧩 Component Patterns

### Primary Button (Gradient)
```jsx
<GradientButton
  title="Sign In"
  onPress={handlePress}
  gradientColors={[colors.primary, colors.gradientBannerEnd]}
/>
```

### Text Input
```jsx
<TextInput
  mode="outlined"
  label="Email"
  outlineColor={colors.divider}
  activeOutlineColor={colors.primary}
  style={styles.input}
  theme={{
    colors: {
      text: colors.textPrimary,
      placeholder: colors.textSecondary,
    },
    roundness: 12,
  }}
/>
```

### Social Button
```jsx
<TouchableOpacity style={styles.socialButton}>
  <Text style={styles.socialButtonText}>🍎 Apple</Text>
</TouchableOpacity>

// Style
socialButton: {
  flex: 1,
  borderWidth: 1,
  borderColor: colors.divider,
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
  backgroundColor: colors.surfaceLight,
}
```

### Logo with Gradient Glow
```jsx
<View style={styles.logoWrapper}>
  <LinearGradient
    colors={[colors.primary, colors.accent]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.logoGradient}
  />
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>🍽️</Text>
  </View>
</View>

// Styles
logoWrapper: {
  position: 'relative',
  width: 90,
  height: 90,
  justifyContent: 'center',
  alignItems: 'center',
},
logoGradient: {
  position: 'absolute',
  width: 90,
  height: 90,
  borderRadius: 45,
  opacity: 0.2,
},
logoContainer: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.surfaceLight,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 6,
}
```

---

## 📱 Screen Patterns

### Authentication Screens
- **Top margin**: 60px
- **Logo section margin bottom**: 40px
- **Form section spacing**: 24px between groups
- **Input spacing**: 16px margin bottom
- **Button margin top**: 24px after last input

### Divider Pattern
```jsx
<View style={styles.dividerContainer}>
  <View style={styles.divider} />
  <Text style={styles.dividerText}>or continue with</Text>
  <View style={styles.divider} />
</View>

// Styles
dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 24,
},
divider: {
  flex: 1,
  height: 1,
  backgroundColor: colors.divider,
},
dividerText: {
  fontSize: 12,
  color: colors.textSecondary,
  marginHorizontal: 12,
}
```

---

## ✨ AI Touch Guidelines

### Taglines (AI-focused)
- Login: "SmartBite learns your taste. Let's get you in."
- Signup: "Join SmartBite and let AI personalize your food journey"

### AI Button (Future)
```javascript
// Circular FAB with gradient
background: linear-gradient(135deg, #3BC8A4, #8E7CFF)
shadow: soft glow with blur
elevation: 8dp
```

---

## 🎯 Accessibility

### Minimum Touch Targets
- Buttons: 44x44 pt minimum
- Links: 32x32 pt minimum

### Color Contrast
- Text on white: 4.5:1 minimum (WCAG AA)
- Primary button text: Always white (#FFFFFF)
- Links: Always teal (#3BC8A4) with 500 weight

### Dynamic Type
- Support iOS Dynamic Type scaling
- Use relative font sizes where possible

---

## 🚀 Usage Example

```jsx
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import GradientButton from '../components/GradientButton';

const MyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.headline}>Welcome</Text>
    <GradientButton title="Get Started" onPress={handlePress} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 24,
  },
  headline: {
    ...typography.headline,
    color: colors.textPrimary,
  },
});
```

---

## 📦 Component Library

### Available Components
- ✅ `GradientButton` - Primary action button with gradient
- 🔜 `Card` - Store/item card with shadow
- 🔜 `Chip` - Filter chips
- 🔜 `Badge` - Status badges
- 🔜 `FAB` - Floating action button for AI chat

---

**Last Updated**: Stage 0 - Authentication UI  
**Next**: Home screen, Store cards, AI chat interface
