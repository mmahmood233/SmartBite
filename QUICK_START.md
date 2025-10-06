# SmartBite Quick Start Guide

## 🚀 Getting Started

### Installation
```bash
cd "/Users/mohammed/Desktop/Uni Courses/Sem 7/SmartBite"
npm install
npm start
```

Then press `i` for iOS or `a` for Android.

---

## 📦 Using Components

### Import Pattern
```javascript
import { 
  GradientButton, 
  Input, 
  Link, 
  AnimatedLogo, 
  SocialButton 
} from '../components';

import { colors } from '../theme/colors';
import { tokens } from '../theme/theme';
```

---

## 🎨 Common Use Cases

### 1. Create a Form Screen

```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradientButton, Input } from '../components';
import { colors, tokens } from '../theme/theme';

const MyScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      
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
        secureTextEntry
      />
      
      <GradientButton
        title="Continue"
        onPress={() => {}}
        disabled={!email || !password}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: tokens.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: tokens.spacing.lg,
  },
});
```

---

### 2. Add Logo to Header

```javascript
import { AnimatedLogo } from '../components';

<View style={styles.header}>
  <AnimatedLogo emoji="🍽️" size={80} />
  <Text style={styles.brandName}>SmartBite</Text>
  <Text style={styles.tagline}>Your AI food companion</Text>
</View>
```

---

### 3. Social Auth Buttons

```javascript
import { SocialButton } from '../components';

<View style={styles.socialRow}>
  <SocialButton
    icon="🍎"
    label="Apple"
    onPress={handleAppleSignIn}
  />
  <SocialButton
    icon="🔍"
    label="Google"
    onPress={handleGoogleSignIn}
  />
</View>

// Style
socialRow: {
  flexDirection: 'row',
  gap: tokens.spacing.md,
}
```

---

### 4. Text Links

```javascript
import { Link } from '../components';

<Link onPress={handleForgotPassword}>
  Forgot Password?
</Link>

// Or inline
<View style={styles.row}>
  <Text>Don't have an account? </Text>
  <Link onPress={handleSignUp}>Sign Up</Link>
</View>
```

---

## 🎯 Design Tokens Quick Reference

```javascript
// Spacing
tokens.spacing.xs    // 4px
tokens.spacing.sm    // 8px
tokens.spacing.md    // 12px
tokens.spacing.lg    // 16px
tokens.spacing.xl    // 24px
tokens.spacing.xxl   // 32px
tokens.spacing.xxxl  // 40px
tokens.spacing.huge  // 60px

// Border Radius
tokens.borderRadius.small   // 8px
tokens.borderRadius.medium  // 12px (default)
tokens.borderRadius.large   // 16px
tokens.borderRadius.round   // 40px
tokens.borderRadius.pill    // 24px

// Shadows
tokens.shadows.input   // Subtle 1dp shadow
tokens.shadows.button  // 4dp with primary color
tokens.shadows.logo    // 6dp with primary color
tokens.shadows.card    // 3dp black shadow

// Colors
colors.primary         // #3BC8A4
colors.accent          // #8E7CFF
colors.textPrimary     // #1B1B1B
colors.textSecondary   // #666E75
colors.success         // #4ECB71
colors.error           // #E74C3C
```

---

## ✅ Best Practices Checklist

### Before Creating a New Screen:

- [ ] Import components from `../components`
- [ ] Import tokens from `../theme/theme`
- [ ] Use `tokens.spacing` for all margins/padding
- [ ] Use `tokens.borderRadius.medium` for rounded corners
- [ ] Add accessibility labels to interactive elements
- [ ] Test with keyboard open (KeyboardAvoidingView)
- [ ] Validate forms before enabling submit buttons
- [ ] Use consistent color palette from `colors.js`

### Component Usage:

- [ ] `GradientButton` for primary actions
- [ ] `Input` for all text inputs (auto-includes focus animation)
- [ ] `Link` for text links (auto-includes tap area)
- [ ] `AnimatedLogo` for brand logo (auto-animates)
- [ ] `SocialButton` for OAuth buttons

---

## 🎨 Styling Patterns

### Screen Container
```javascript
container: {
  flex: 1,
  backgroundColor: colors.backgroundLight,
  paddingHorizontal: tokens.spacing.xl,
}
```

### Header Section
```javascript
header: {
  alignItems: 'center',
  marginTop: tokens.spacing.huge,
  marginBottom: tokens.spacing.xxxl,
}
```

### Form Section
```javascript
form: {
  flex: 1,
  paddingBottom: tokens.spacing.xl,
}
```

### Title Text
```javascript
title: {
  fontSize: 24,
  fontWeight: '600',
  color: colors.textPrimary,
  marginBottom: tokens.spacing.sm,
}
```

### Subtitle Text
```javascript
subtitle: {
  fontSize: 16,
  fontWeight: '400',
  color: colors.textSecondary,
  marginBottom: tokens.spacing.xl,
}
```

---

## 🐛 Common Issues & Fixes

### Issue: Components not found
```javascript
// ❌ Wrong
import GradientButton from '../components/GradientButton';

// ✅ Correct
import { GradientButton } from '../components';
```

### Issue: Tokens not working
```javascript
// ❌ Wrong
import { tokens } from '../theme/colors';

// ✅ Correct
import { tokens } from '../theme/theme';
```

### Issue: Input not showing focus animation
```javascript
// ✅ Make sure you're using the Input component, not TextInput
import { Input } from '../components';

<Input label="Email" value={email} onChangeText={setEmail} />
```

### Issue: Button not animating
```javascript
// ✅ GradientButton has built-in animation, no need to wrap in Animated.View
<GradientButton title="Sign In" onPress={handleSignIn} />
```

---

## 📱 Testing Checklist

- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test with keyboard open
- [ ] Test disabled button states
- [ ] Test form validation
- [ ] Test navigation between screens
- [ ] Test accessibility with VoiceOver/TalkBack
- [ ] Test on small screen (iPhone SE)
- [ ] Test on large screen (iPad)

---

## 🔗 Resources

- **Design System**: See `DESIGN_SYSTEM.md` for full color palette and guidelines
- **Components**: See `COMPONENT_LIBRARY.md` for detailed API docs
- **React Native Paper**: https://callstack.github.io/react-native-paper/
- **React Navigation**: https://reactnavigation.org/

---

## 🎯 Next Steps

1. **Run the app**: `npm start` and test Login/Signup
2. **Read docs**: Review `DESIGN_SYSTEM.md` and `COMPONENT_LIBRARY.md`
3. **Build next screen**: Use existing components for Home, Profile, etc.
4. **Stay consistent**: Always use design tokens and reusable components

---

**Need help?** Check the component examples in `LoginScreen.js` and `SignupScreen.js`
