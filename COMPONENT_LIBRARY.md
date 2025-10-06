# SmartBite Component Library

Complete reference for all reusable components in the SmartBite app.

---

## 🎯 Import Pattern

```javascript
import { 
  GradientButton, 
  Input, 
  Link, 
  AnimatedLogo, 
  SocialButton 
} from '../components';
```

---

## 📦 Components

### 1. GradientButton

Primary action button with gradient background and spring animation.

**Props:**
```javascript
{
  title: string,              // Button text
  onPress: function,          // Press handler
  disabled?: boolean,         // Disabled state (default: false)
  loading?: boolean,          // Loading state (default: false)
  style?: object,             // Additional container styles
  textStyle?: object,         // Additional text styles
  gradientColors?: [string],  // Custom gradient colors
  accessibilityLabel?: string // Accessibility label
}
```

**Usage:**
```javascript
<GradientButton
  title="Sign In"
  onPress={handleSignIn}
  disabled={!isFormValid}
  accessibilityLabel="Sign in to SmartBite"
/>
```

**Features:**
- ✅ Built-in 0.98x scale animation on press
- ✅ Disabled state with gray gradient (#CBD5DE)
- ✅ Loading state support
- ✅ Accessibility labels
- ✅ Custom gradient colors

---

### 2. Input

Text input with focus animation and consistent styling.

**Props:**
```javascript
{
  label: string,              // Input label
  value: string,              // Input value
  onChangeText: function,     // Change handler
  secureTextEntry?: boolean,  // Password mode (default: false)
  keyboardType?: string,      // Keyboard type (default: 'default')
  autoCapitalize?: string,    // Auto-capitalize (default: 'sentences')
  error?: boolean,            // Error state (default: false)
  errorText?: string,         // Error message
  right?: ReactNode,          // Right icon/component
  style?: object,             // Additional styles
  ...props                    // All TextInput props
}
```

**Usage:**
```javascript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={!showPassword}
  right={
    <TextInput.Icon
      icon={showPassword ? 'eye-off' : 'eye'}
      onPress={() => setShowPassword(!showPassword)}
    />
  }
/>
```

**Features:**
- ✅ 150ms border color animation on focus (gray → teal)
- ✅ Built-in shadow for depth
- ✅ Error state support
- ✅ Consistent 12px border radius
- ✅ 16px margin bottom

---

### 3. Link

Touchable text link with proper tap area and accessibility.

**Props:**
```javascript
{
  onPress: function,          // Press handler
  children: string,           // Link text
  style?: object,             // Container styles
  textStyle?: object,         // Text styles
  accessibilityLabel?: string // Accessibility label
}
```

**Usage:**
```javascript
<Link 
  onPress={handleForgotPassword}
  accessibilityLabel="Forgot Password"
>
  Forgot Password?
</Link>
```

**Features:**
- ✅ Teal color (#3BC8A4)
- ✅ Font weight 500
- ✅ 8px padding (top/bottom) for larger tap area
- ✅ 8px hit slop on all sides
- ✅ Accessibility role="link"

---

### 4. AnimatedLogo

Logo with gradient glow and pulse animation.

**Props:**
```javascript
{
  emoji?: string,  // Logo emoji (default: '🍽️')
  size?: number    // Logo size in px (default: 80)
}
```

**Usage:**
```javascript
<AnimatedLogo emoji="🍽️" size={80} />
```

**Features:**
- ✅ 800ms fade-in animation
- ✅ Spring scale entrance
- ✅ One-cycle pulse animation (2s total)
- ✅ Gradient ring (teal → violet, 25% opacity)
- ✅ Enhanced shadow (12px blur, 25% opacity)
- ✅ Responsive sizing

**Animation Sequence:**
1. Fade in from 0 → 1 opacity
2. Scale from 0.9 → 1.0 with spring
3. Pulse from 1.0 → 1.08 → 1.0 (one cycle)

---

### 5. SocialButton

Social authentication button (Apple, Google, etc.).

**Props:**
```javascript
{
  onPress: function,          // Press handler
  icon: string,               // Emoji icon
  label: string,              // Button label
  style?: object,             // Additional styles
  accessibilityLabel?: string // Accessibility label
}
```

**Usage:**
```javascript
<View style={styles.socialButtonsContainer}>
  <SocialButton
    icon="🍎"
    label="Apple"
    onPress={handleAppleSignIn}
    accessibilityLabel="Sign in with Apple"
  />
  <SocialButton
    icon="🔍"
    label="Google"
    onPress={handleGoogleSignIn}
    accessibilityLabel="Sign in with Google"
  />
</View>

// Container style
socialButtonsContainer: {
  flexDirection: 'row',
  gap: tokens.spacing.md, // 12px
  marginBottom: tokens.spacing.xl, // 24px
}
```

**Features:**
- ✅ Bordered style with subtle shadow
- ✅ Flex: 1 for equal width in row
- ✅ 12px border radius
- ✅ Accessibility labels

---

## 🎨 Design Tokens

### Spacing
```javascript
import { tokens } from '../theme/theme';

tokens.spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 60,
}
```

### Border Radius
```javascript
tokens.borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  round: 40,
  pill: 24,
}
```

### Shadows
```javascript
tokens.shadows = {
  input: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
}
```

### Animation Timing
```javascript
tokens.animation = {
  timing: {
    fast: 150,      // Focus transitions
    normal: 300,    // Standard animations
    slow: 600,      // Fade-ins
    verySlow: 800,  // Logo entrance
  },
  spring: {
    default: {
      friction: 8,
      tension: 40,
    },
    bouncy: {
      friction: 3,
      tension: 40,
    },
  },
}
```

---

## 📐 Common Patterns

### Form Layout
```javascript
<View style={styles.formSection}>
  <Text style={styles.welcomeText}>Welcome Back</Text>
  <Text style={styles.subtitleText}>Sign in to continue</Text>

  <Input
    label="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
  />

  <Input
    label="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    right={<TextInput.Icon icon="eye" />}
  />

  <Link onPress={handleForgotPassword}>
    Forgot Password?
  </Link>

  <GradientButton
    title="Sign In"
    onPress={handleSignIn}
  />
</View>
```

### Divider with Text
```javascript
<View style={styles.dividerContainer}>
  <View style={styles.divider} />
  <Text style={styles.dividerText}>or continue with</Text>
  <View style={styles.divider} />
</View>

// Styles
dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: tokens.spacing.xl,
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

### Social Buttons Row
```javascript
<View style={styles.socialButtonsContainer}>
  <SocialButton icon="🍎" label="Apple" onPress={handleApple} />
  <SocialButton icon="🔍" label="Google" onPress={handleGoogle} />
</View>

// Style
socialButtonsContainer: {
  flexDirection: 'row',
  gap: tokens.spacing.md,
  marginBottom: tokens.spacing.xl,
}
```

---

## ♿ Accessibility

All components include:
- ✅ `accessibilityLabel` support
- ✅ `accessibilityRole` (button, link, etc.)
- ✅ `accessibilityState` for disabled states
- ✅ Minimum 44x44 touch targets
- ✅ Proper hit slop for small elements

**Example:**
```javascript
<GradientButton
  title="Sign In"
  onPress={handleSignIn}
  accessibilityLabel="Sign in to SmartBite"
  accessibilityRole="button"
/>

<Link 
  onPress={handleSignUp}
  accessibilityLabel="Create a new account"
>
  Sign Up
</Link>
```

---

## 🚀 Best Practices

### 1. Always use design tokens
```javascript
// ✅ Good
marginTop: tokens.spacing.xl

// ❌ Avoid
marginTop: 24
```

### 2. Use semantic component names
```javascript
// ✅ Good
<GradientButton title="Continue" />

// ❌ Avoid
<TouchableOpacity><LinearGradient>...</LinearGradient></TouchableOpacity>
```

### 3. Provide accessibility labels
```javascript
// ✅ Good
<Link accessibilityLabel="Forgot your password">
  Forgot Password?
</Link>

// ❌ Avoid
<Link>Forgot Password?</Link>
```

### 4. Validate forms before enabling buttons
```javascript
const isValid = email && password && agreeToTerms;

<GradientButton
  title="Sign Up"
  disabled={!isValid}
  onPress={handleSignUp}
/>
```

---

## 📦 Future Components

Planned for upcoming screens:

- **Card** - Store/item cards with image, title, rating
- **Chip** - Filter chips for categories
- **Badge** - Status badges (Open, Closed, New)
- **FAB** - Floating action button for AI chat
- **SearchBar** - Search input with icon
- **Rating** - Star rating display
- **Avatar** - User profile avatar
- **BottomSheet** - Modal bottom sheet
- **Skeleton** - Loading skeleton screens

---

**Last Updated**: Authentication Screens Complete  
**Next**: Home screen components (Card, Chip, SearchBar)
