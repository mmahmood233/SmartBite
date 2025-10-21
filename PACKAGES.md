# SmartBite Package Documentation

**Version**: 2.0.0  
**Last Updated**: 2025-10-22

Complete reference for all packages used in SmartBite, including purpose, version, and usage.

---

## 📦 Package Overview

**Total Packages**: 20  
**Dependencies**: 17  
**Dev Dependencies**: 3

---

## 🎯 Core Framework

### **expo** (~51.0.0)
- **Category**: Framework
- **Purpose**: Core Expo SDK - provides managed React Native development environment
- **Why We Use It**: 
  - Simplifies development with managed workflow
  - Provides access to native APIs without ejecting
  - Handles build configuration automatically
  - Includes development server and hot reloading
- **Used In**: Entire application
- **Documentation**: https://docs.expo.dev/

### **react** (18.2.0)
- **Category**: Framework
- **Purpose**: Core React library for building UI components
- **Why We Use It**: 
  - Foundation of React Native
  - Component-based architecture
  - State management with hooks
  - Virtual DOM for efficient rendering
- **Used In**: All components and screens
- **Documentation**: https://react.dev/

### **react-native** (0.74.0)
- **Category**: Framework
- **Purpose**: Framework for building native mobile apps using React
- **Why We Use It**: 
  - Cross-platform development (iOS & Android)
  - Native performance
  - Access to native APIs
  - Large ecosystem of libraries
- **Used In**: Entire application
- **Documentation**: https://reactnative.dev/

---

## 🧭 Navigation

### **@react-navigation/native** (^6.1.9)
- **Category**: Navigation
- **Purpose**: Core navigation library for React Native
- **Why We Use It**: 
  - Industry-standard navigation solution
  - Smooth transitions between screens
  - Deep linking support
  - State persistence
- **Used In**: App.tsx, navigation setup
- **Documentation**: https://reactnavigation.org/

### **@react-navigation/native-stack** (^6.9.17)
- **Category**: Navigation
- **Purpose**: Native stack navigator using native navigation primitives
- **Why We Use It**: 
  - Better performance than JS-based stack
  - Native animations and gestures
  - Platform-specific behavior (iOS/Android)
  - Type-safe navigation with TypeScript
- **Used In**: 
  - RootNavigator.tsx (Main app navigation)
  - AuthNavigator.tsx (Login/Signup flow)
  - User portal screens (all user flows)
  - Partner portal screens (restaurant management)
- **Documentation**: https://reactnavigation.org/docs/native-stack-navigator

### **@react-navigation/bottom-tabs** (^6.5.11)
- **Category**: Navigation
- **Purpose**: Bottom tab navigator for main app sections
- **Why We Use It**: 
  - Standard mobile navigation pattern
  - Easy switching between main sections
  - Customizable tab bar styling
  - Icon and label support
- **Used In**: 
  - MainTabNavigator.tsx (User portal: Home, AI Chat, Orders, Profile)
  - PartnerTabNavigator.tsx (Partner portal: Live Orders, Overview, Menu, More)
- **Documentation**: https://reactnavigation.org/docs/bottom-tab-navigator

### **@react-navigation/stack** (^6.3.20)
- **Category**: Navigation
- **Purpose**: JavaScript-based stack navigator (backup/alternative)
- **Why We Use It**: 
  - More customizable than native stack
  - Custom transition animations
  - Fallback for complex navigation needs
- **Used In**: AuthNavigator.tsx (Auth flow)
- **Documentation**: https://reactnavigation.org/docs/stack-navigator

### **react-native-screens** (~3.31.1)
- **Category**: Navigation Dependency
- **Purpose**: Native screen management for better performance
- **Why We Use It**: 
  - Required by React Navigation
  - Optimizes memory usage
  - Native screen transitions
  - Better performance on both platforms
- **Used In**: Navigation system (automatic)
- **Documentation**: https://github.com/software-mansion/react-native-screens

### **react-native-safe-area-context** (4.10.1)
- **Category**: Navigation Dependency
- **Purpose**: Handles safe area insets (notches, status bars)
- **Why We Use It**: 
  - Required by React Navigation
  - Ensures content doesn't overlap with system UI
  - Works with iPhone notches, Android navigation bars
  - Provides SafeAreaView component
- **Used In**: App.tsx, screen layouts
- **Documentation**: https://github.com/th3rdwave/react-native-safe-area-context

---

## 🎨 UI & Design

### **react-native-paper** (^5.12.3)
- **Category**: UI Library
- **Purpose**: Material Design component library for React Native
- **Why We Use It**: 
  - Pre-built, customizable components (TextInput, Checkbox)
  - Material Design 3 theming system
  - Consistent UI across platforms
  - Accessibility built-in
  - Easy theme customization
- **Used In**: Input.tsx, SignupScreen.tsx (TextInput, Checkbox)
- **Documentation**: https://callstack.github.io/react-native-paper/

### **expo-linear-gradient** (~13.0.2)
- **Category**: UI Component
- **Purpose**: Creates linear gradient backgrounds
- **Why We Use It**: 
  - Smooth gradient transitions
  - Used for button backgrounds (teal → light teal)
  - Logo glow effect (teal → violet)
  - Native performance
- **Used In**: GradientButton.tsx, AnimatedLogo.tsx
- **Documentation**: https://docs.expo.dev/versions/latest/sdk/linear-gradient/

### **react-native-vector-icons** (^10.0.3)
- **Category**: Icons
- **Purpose**: Icon library with multiple icon sets
- **Why We Use It**: 
  - Thousands of icons (MaterialIcons, FontAwesome, etc.)
  - Scalable vector icons
  - Used in React Native Paper components
  - Customizable size and color
- **Used In**: TextInput icons (eye, eye-off), future UI elements
- **Documentation**: https://github.com/oblador/react-native-vector-icons

### **expo-status-bar** (~1.12.1)
- **Category**: UI Component
- **Purpose**: Controls the status bar appearance
- **Why We Use It**: 
  - Matches status bar to app theme
  - Light/dark mode support
  - Platform-specific styling
- **Used In**: App.tsx
- **Documentation**: https://docs.expo.dev/versions/latest/sdk/status-bar/

### **@expo/vector-icons** (^15.0.2)
- **Category**: Icons
- **Purpose**: Icon library with multiple icon sets (Feather, Material, FontAwesome, etc.)
- **Why We Use It**: 
  - Thousands of icons available
  - Scalable vector icons
  - Multiple icon families in one package
  - Customizable size and color
  - TypeScript support
- **Used In**: All screens (Feather icons primarily)
- **Documentation**: https://docs.expo.dev/guides/icons/

---

## 📸 Media & Assets

### **expo-image-picker** (~17.0.8)
- **Category**: Media
- **Purpose**: Access device camera and photo library
- **Why We Use It**: 
  - Upload profile photos
  - Upload restaurant logos
  - Built-in image editing (crop, rotate)
  - Permission handling
  - Works on iOS and Android
- **Used In**: 
  - EditProfileScreen.tsx (profile photo)
  - RestaurantsManagementScreen.tsx (restaurant logos)
- **Documentation**: https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

## 📊 Charts & Data Visualization

### **react-native-chart-kit** (^6.12.0)
- **Category**: Charts
- **Purpose**: Beautiful charts for React Native
- **Why We Use It**: 
  - Revenue trend charts
  - Line charts, bar charts, pie charts
  - Customizable colors and styles
  - Smooth animations
  - Works with react-native-svg
- **Used In**: AdminDashboardScreen.tsx (revenue trends)
- **Documentation**: https://github.com/indiespirit/react-native-chart-kit

### **react-native-svg** (^15.14.0)
- **Category**: Graphics
- **Purpose**: SVG rendering for React Native
- **Why We Use It**: 
  - Required by react-native-chart-kit
  - Renders SVG graphics
  - High-performance vector graphics
  - Cross-platform support
- **Used In**: Chart components (automatic)
- **Documentation**: https://github.com/software-mansion/react-native-svg

### **react-native-worklets** (^0.5.1)
- **Category**: Performance
- **Purpose**: JavaScript worklets for high-performance operations
- **Why We Use It**: 
  - Required by react-native-reanimated
  - Runs JavaScript on UI thread
  - Enables smooth 60fps animations
  - Better performance for complex calculations
- **Used In**: Animation system (automatic)
- **Documentation**: https://github.com/margelo/react-native-worklets

---

## 🎭 Animations

### **react-native-reanimated** (~3.10.1)
- **Category**: Animation
- **Purpose**: High-performance animation library
- **Why We Use It**: 
  - Runs animations on native thread (60fps)
  - More powerful than Animated API
  - Gesture-based animations
  - Required by React Navigation for smooth transitions
- **Used In**: Future complex animations, navigation transitions
- **Documentation**: https://docs.swmansion.com/react-native-reanimated/

### **react-native-gesture-handler** (~2.16.1)
- **Category**: Gestures
- **Purpose**: Native gesture recognition system
- **Why We Use It**: 
  - Required by React Navigation
  - Better touch handling than default
  - Swipe gestures, pan gestures
  - Native performance
- **Used In**: Navigation gestures, future swipe interactions
- **Documentation**: https://docs.swmansion.com/react-native-gesture-handler/

---

## 🔧 TypeScript

### **typescript** (~5.3.3)
- **Category**: Language
- **Purpose**: TypeScript compiler and language support
- **Why We Use It**: 
  - Type safety across entire codebase
  - Catch errors at compile time
  - Better IDE support (IntelliSense)
  - Self-documenting code
  - Easier refactoring
- **Used In**: All `.ts` and `.tsx` files
- **Documentation**: https://www.typescriptlang.org/

### **@types/react** (~18.2.45 / ~18.2.79)
- **Category**: Type Definitions
- **Purpose**: TypeScript type definitions for React
- **Why We Use It**: 
  - Enables TypeScript support in React components
  - Type-safe props and state
  - Auto-complete for React APIs
  - Required for TypeScript + React
- **Used In**: All React components
- **Documentation**: https://www.npmjs.com/package/@types/react

### **@types/react-native** (~0.73.0)
- **Category**: Type Definitions
- **Purpose**: TypeScript type definitions for React Native
- **Why We Use It**: 
  - Type-safe React Native components
  - Auto-complete for RN APIs
  - Type checking for StyleSheet, View, Text, etc.
  - Required for TypeScript + React Native
- **Used In**: All React Native components
- **Documentation**: https://www.npmjs.com/package/@types/react-native

---

## 🛠️ Development Tools

### **@babel/core** (^7.20.0)
- **Category**: Build Tool
- **Purpose**: JavaScript compiler/transpiler
- **Why We Use It**: 
  - Required by Expo/React Native
  - Transforms modern JS to compatible code
  - Handles JSX transformation
  - Plugin system for optimizations
- **Used In**: Build process (automatic)
- **Documentation**: https://babeljs.io/

---

## 📊 Package Summary by Category

### **Framework (3 packages)**
- expo
- react
- react-native

### **Navigation (6 packages)**
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- @react-navigation/stack
- react-native-screens
- react-native-safe-area-context

### **UI & Design (5 packages)**
- react-native-paper
- expo-linear-gradient
- @expo/vector-icons
- expo-status-bar
- react-native-vector-icons (legacy)

### **Media & Assets (1 package)**
- expo-image-picker

### **Charts & Data Visualization (3 packages)**
- react-native-chart-kit
- react-native-svg
- react-native-worklets

### **Animations (2 packages)**
- react-native-reanimated
- react-native-gesture-handler

### **TypeScript (3 packages)**
- typescript
- @types/react
- @types/react-native

### **Build Tools (2 packages)**
- @babel/core
- expo-module-scripts
- babel-preset-expo

---

## 🔮 Future Packages (Planned)

### **Supabase Integration**
```json
"@supabase/supabase-js": "^2.38.0"
```
- **Purpose**: Supabase client for database, auth, storage
- **Why**: Backend as a Service, real-time subscriptions
- **When**: Stage 2 - Backend integration

### **State Management**
```json
"zustand": "^4.4.0"
```
- **Purpose**: Lightweight state management
- **Why**: Simpler than Redux, TypeScript-friendly
- **When**: Stage 3 - Complex state needs

### **Image Handling**
```json
"expo-image": "~1.10.0"
```
- **Purpose**: Optimized image component with caching
- **Why**: Better performance than default Image
- **When**: Stage 4 - Store images and menus
- **Status**: ⏳ Pending (currently using expo-image-picker for uploads)

### **Maps**
```json
"react-native-maps": "^1.10.0"
```
- **Purpose**: Native maps for iOS and Android
- **Why**: Store locations, delivery tracking, real map picker
- **When**: Stage 5 - Location features
- **Status**: ⏳ Pending (currently using mock coordinates)

### **Location**
```json
"expo-location": "~16.5.0"
```
- **Purpose**: Access device location
- **Why**: Find nearby stores
- **When**: Stage 5 - Location features

### **Payments**
```json
"@stripe/stripe-react-native": "^0.35.0"
```
- **Purpose**: Stripe payment integration
- **Why**: Secure payment processing
- **When**: Stage 6 - Payment flow

### **AI Integration**
```json
"openai": "^4.20.0"
```
- **Purpose**: OpenAI API client
- **Why**: AI chat-to-order feature
- **When**: Stage 7 - AI features

### **Notifications**
```json
"expo-notifications": "~0.27.0"
```
- **Purpose**: Push notifications
- **Why**: Order updates, promotions
- **When**: Stage 8 - Notifications

---

## 📝 Package Installation Commands

### **Install All Current Packages**
```bash
npm install
```

### **Install New Packages (Already Installed)**
```bash
# Image Picker (✅ Installed)
npx expo install expo-image-picker

# Charts (✅ Installed)
npm install react-native-chart-kit react-native-svg
```

### **Install Future Packages (When Needed)**
```bash
# Supabase
npm install @supabase/supabase-js

# State Management
npm install zustand

# Image Optimization
npx expo install expo-image

# Maps & Location (Real Maps)
npm install react-native-maps
npx expo install expo-location

# Payments
npm install @stripe/stripe-react-native

# AI
npm install openai

# Notifications
npx expo install expo-notifications
```

---

## 🔍 Package Audit

### **Security**
```bash
npm audit
```
**Current Status**: 3 low severity vulnerabilities (non-critical)

### **Outdated Packages**
```bash
npm outdated
```
**Current Status**: All packages up-to-date with Expo SDK 51

### **Bundle Size**
```bash
npx expo-doctor
```
**Current Status**: Optimized for mobile

---

## 📚 Version Compatibility

### **Expo SDK 51 Compatibility**
| Package | Required Version | Current Version | Status |
|---------|------------------|-----------------|--------|
| react-native | 0.74.5 | 0.74.0 | ⚠️ Update recommended |
| react-native-safe-area-context | 4.10.5 | 4.10.1 | ⚠️ Update recommended |
| typescript | ~5.3.3 | ~5.3.3 | ✅ Compatible |

### **Update Commands**
```bash
# Update to recommended versions
npx expo install --fix

# Or manually
npm install react-native@0.74.5
npm install react-native-safe-area-context@4.10.5
```

---

## 🎯 Package Usage Statistics

### **Most Used Packages**
1. **react** - Every component
2. **react-native** - Every component
3. **typescript** - Every file
4. **@react-navigation/native** - All navigation
5. **react-native-paper** - Input components

### **Least Used Packages**
1. **react-native-reanimated** - Reserved for complex animations
2. **react-native-vector-icons** - Icons throughout app
3. **expo-status-bar** - Status bar styling

---

## 🔧 Troubleshooting

### **Common Issues**

#### **Metro Bundler Errors**
```bash
# Clear cache
npx expo start -c
```

#### **TypeScript Errors**
```bash
# Regenerate types
npx expo customize tsconfig.json
```

#### **Native Module Issues**
```bash
# iOS
cd ios && pod install && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

#### **Package Conflicts**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Learning Resources

### **Official Documentation**
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Community**
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

---

## ✅ Package Checklist

### **Before Adding New Package**
- [ ] Check Expo compatibility
- [ ] Review bundle size impact
- [ ] Check TypeScript support
- [ ] Review security advisories
- [ ] Check maintenance status
- [ ] Review alternatives
- [ ] Test on both iOS and Android

### **After Adding New Package**
- [ ] Update this documentation
- [ ] Add to appropriate category
- [ ] Document usage examples
- [ ] Update TypeScript types if needed
- [ ] Test build process
- [ ] Commit changes

---

## 🎓 Best Practices

### **Package Management**
1. ✅ Always use exact or tilde versions (~)
2. ✅ Keep packages up-to-date with Expo SDK
3. ✅ Audit packages regularly for security
4. ✅ Remove unused packages
5. ✅ Document why each package is used

### **Installation**
1. ✅ Use `npx expo install` for Expo-managed packages
2. ✅ Use `npm install` for other packages
3. ✅ Always commit `package-lock.json`
4. ✅ Test after installing new packages

### **Updates**
1. ✅ Update one package at a time
2. ✅ Test thoroughly after updates
3. ✅ Check breaking changes in changelogs
4. ✅ Update documentation after changes

---

**Last Audit**: 2025-10-22  
**Total Package Size**: ~190 MB (node_modules)  
**Production Bundle**: ~16 MB (estimated)  
**Status**: All packages documented ✅

### **New Additions (v2.0.0)**
- ✅ expo-image-picker - Profile photos & restaurant logos
- ✅ react-native-chart-kit - Revenue trend charts
- ✅ react-native-svg - Chart rendering
- ✅ react-native-worklets - Animation performance

---

## 📂 Project Structure Updates

### **Screen Organization (As of 2025-10-22)**

The project now follows a clean, organized folder structure with 3 complete portals:

```
src/screens/
├── user/                    # USER PORTAL
│   ├── auth/               # Authentication (Login, Signup)
│   ├── onboarding/         # Splash, Onboarding
│   ├── restaurant/         # Home, Browse, Restaurant Details
│   ├── cart/               # Cart, Checkout
│   ├── orders/             # Order tracking & history
│   └── profile/            # User settings & account
│
├── partner/                # RESTAURANT PORTAL
│   ├── OverviewDashboard   # Analytics & stats
│   └── LiveOrdersScreen    # Order management
│
└── admin/                  # ADMIN PORTAL (NEW!)
    ├── AdminDashboardScreen          # Platform stats & charts
    ├── RestaurantsManagementScreen   # CRUD operations
    ├── CategoriesManagementScreen    # Category management
    ├── PromotionsManagementScreen    # Promotions list
    ├── AddPromotionScreen            # Create/Edit promotions
    └── AdminSettingsScreen           # Admin settings
```

### **Navigation Structure**
- **RootNavigator**: Main app navigation (Stack)
- **AuthNavigator**: Login/Signup flow (Stack)
- **MainTabNavigator**: User portal tabs (Bottom Tabs)
- **PartnerTabNavigator**: Partner portal tabs (Bottom Tabs)
- **AdminTabNavigator**: Admin portal tabs (Bottom Tabs) ✨ NEW

### **Import Path Convention**
- User screens: `../../../` (3 levels up to src/)
- Partner screens: `../../` (2 levels up to src/)
- Admin screens: `../../` (2 levels up to src/)
- Components: Always from `src/components/`
- Theme: Always from `src/theme/`

### **New Features (v2.0.0)**
- 📸 Image upload with expo-image-picker
- 📍 Location picker (mock coordinates, ready for real maps)
- 📊 Revenue charts with date filters
- 🏪 Full restaurant CRUD
- 🏷️ Promotions management
- ⚙️ Admin settings
