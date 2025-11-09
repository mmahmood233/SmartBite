# Wajba Logo Integration Guide

**Last Updated**: 2025-10-06

Complete guide for the Wajba logo integration into the app.

---

## 📁 Logo Location

```
assets/
└── wajba_logo.png    # Main Wajba brand logo
```

---

## 🎨 Logo Specifications

### **File Details**
- **Format**: PNG with transparency
- **Location**: `./assets/wajba_logo.png`
- **Usage**: App icon, splash screen, login screen

### **Display Sizes**
- **Login Screen**: 80px (default)
- **App Icon**: Auto-scaled by Expo
- **Splash Screen**: Centered, auto-scaled

---

## 💻 Implementation

### **1. AnimatedLogo Component**

The logo is automatically displayed in the `AnimatedLogo` component:

```typescript
// src/components/AnimatedLogo.tsx
import { Image } from 'react-native';

// Default: Shows Wajba logo
<AnimatedLogo size={80} />

// Optional: Use emoji instead
<AnimatedLogo emoji="🍽️" size={80} />
```

**Features:**
- ✅ Automatic logo loading from assets
- ✅ Pulsing gradient glow (2.5s loop)
- ✅ Fade-in entrance animation
- ✅ Spring scale animation
- ✅ 24px blur glow (Wajba spec)

### **2. Login Screen**

```typescript
// src/screens/LoginScreen.tsx
<View style={styles.headerSection}>
  <AnimatedLogo size={80} />
  <Text style={styles.brandName}>Wajba</Text>
  <Text style={styles.tagline}>
    Middle Eastern warmth meets intelligent personalization
  </Text>
</View>
```

### **3. App Configuration**

```json
// app.json
{
  "expo": {
    "name": "Wajba",
    "slug": "wajba",
    "icon": "./assets/wajba_logo.png",
    "splash": {
      "image": "./assets/wajba_logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#14776F"
    },
    "ios": {
      "bundleIdentifier": "com.wajba.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/wajba_logo.png",
        "backgroundColor": "#14776F"
      },
      "package": "com.wajba.app"
    }
  }
}
```

---

## 🎯 Logo Styling

### **Container**
```typescript
{
  width: 80,
  height: 80,
  borderRadius: 40,              // Circular
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#14776F',        // Wajba Teal
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 24,              // 24px blur (Wajba spec)
  elevation: 6,
}
```

### **Logo Image**
```typescript
{
  width: 56,        // 70% of container (80 * 0.7)
  height: 56,
  resizeMode: 'contain',
}
```

### **Gradient Glow**
```typescript
<LinearGradient
  colors={['#14776F', '#8E7CFF']}  // Wajba Teal → AI Glow
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.25,
  }}
/>
```

---

## 🎬 Animations

### **Entry Animation**
```typescript
// 1. Fade in (800ms)
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 800,
  useNativeDriver: true,
})

// 2. Scale spring
Animated.spring(scaleAnim, {
  toValue: 1,
  friction: 8,
  tension: 40,
  useNativeDriver: true,
})
```

### **Pulse Animation** (Wajba Spec: 2.5s loop)
```typescript
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, {
      toValue: 1.06,
      duration: 1250,  // 2.5s / 2
      useNativeDriver: true,
    }),
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1250,
      useNativeDriver: true,
    }),
  ])
)
```

---

## 📱 Platform-Specific

### **iOS**
- App icon: Auto-generated from `wajba_logo.png`
- Splash screen: Centered logo on Wajba Teal background
- Bundle ID: `com.wajba.app`

### **Android**
- Adaptive icon: Logo on Wajba Teal background
- Splash screen: Centered logo on Wajba Teal background
- Package: `com.wajba.app`

---

## 🔄 Updating the Logo

### **Steps to Replace Logo**

1. **Prepare new logo**
   - Format: PNG with transparency
   - Recommended size: 1024x1024px
   - Name: `wajba_logo.png`

2. **Replace file**
   ```bash
   cp new_logo.png assets/wajba_logo.png
   ```

3. **Clear cache**
   ```bash
   npx expo start -c
   ```

4. **Rebuild app**
   - iOS: Regenerate app icon
   - Android: Regenerate adaptive icon

---

## ✅ Checklist

### **Logo Integration**
- [x] Logo placed in `assets/` folder
- [x] AnimatedLogo component updated
- [x] Login screen uses logo
- [x] App icon configured
- [x] Splash screen configured
- [x] iOS bundle ID updated
- [x] Android package updated
- [x] Gradient glow matches Wajba spec
- [x] Animations match Wajba spec (2.5s pulse)

### **Branding**
- [x] App name changed to "Wajba"
- [x] Slug changed to "wajba"
- [x] Brand colors updated (#14776F)
- [x] Tagline updated
- [x] Documentation updated

---

## 🎨 Design Guidelines

### **Do's**
✅ Keep logo centered in circular container  
✅ Use 24px blur for glow effect  
✅ Maintain 2.5s pulse animation  
✅ Use Wajba Teal (#14776F) for glow  
✅ Keep logo at 70% of container size  
✅ Use white background for logo container  

### **Don'ts**
❌ Don't stretch or distort logo  
❌ Don't change glow color  
❌ Don't modify animation timing  
❌ Don't use logo without glow effect  
❌ Don't change container shape  

---

## 📊 Logo Sizes Reference

| Usage | Container Size | Logo Size | Glow Size |
|-------|---------------|-----------|-----------|
| **Login Screen** | 80x80 | 56x56 | 90x90 |
| **Small** | 60x60 | 42x42 | 70x70 |
| **Large** | 100x100 | 70x70 | 110x110 |

---

## 🚀 Testing

### **Test Checklist**
- [ ] Logo displays correctly on login screen
- [ ] Pulse animation works (2.5s loop)
- [ ] Gradient glow visible
- [ ] App icon shows on home screen (iOS)
- [ ] App icon shows on home screen (Android)
- [ ] Splash screen displays correctly
- [ ] Logo scales properly on different devices
- [ ] Logo looks good in light mode
- [ ] Logo looks good in dark mode

---

## 🔧 Troubleshooting

### **Logo not showing**
```bash
# Clear Metro bundler cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### **App icon not updating**
```bash
# iOS: Delete app and reinstall
# Android: Clear app data and reinstall
```

### **Splash screen not showing**
- Check `app.json` configuration
- Ensure logo path is correct
- Rebuild app

---

## 📚 Related Documentation

- **[WAJBA_THEME.md](./WAJBA_THEME.md)** - Complete Wajba Design System
- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - AnimatedLogo API reference
- **[DESIGN_SPEC.md](./DESIGN_SPEC.md)** - Design specifications

---

**Status**: Logo Integrated ✅  
**Location**: `assets/wajba_logo.png`  
**Component**: `AnimatedLogo.tsx`  
**Animations**: Wajba spec compliant
