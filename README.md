# SmartBite

An AI-powered delivery platform for food, groceries, and essentials.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Current Features

### ✨ Professional Component Library
- **5 Reusable Components**: GradientButton, Input, Link, AnimatedLogo, SocialButton
- **Design Tokens**: Spacing, shadows, border radius, animation timing
- **Accessibility**: Full WCAG AA compliance with labels and roles
- **Animations**: Spring animations, focus transitions, pulse effects

### 🔐 Authentication UI (No backend yet)
- **Login Screen**: 
  - Email/password with animated focus states
  - Gradient button with 0.98x press animation
  - Logo with pulsing AI gradient glow (2s cycle)
  - 800ms fade-in entrance
  - Social auth buttons (Apple, Google)
  - AI tagline: "SmartBite learns your taste. Let's get you in."
  
- **Signup Screen**: 
  - Full form validation (name, email, password, confirm)
  - Smart button state (disabled until valid)
  - Terms & conditions checkbox
  - Consistent animations and styling
  - AI tagline: "Join SmartBite and let AI personalize your food journey"

## Tech Stack

- **Frontend**: React Native + Expo
- **Language**: TypeScript (100% type coverage, strict mode)
- **UI Library**: React Native Paper
- **Navigation**: React Navigation (Stack Navigator)
- **Theme**: Custom SmartBite design system (Mint Teal primary)
- **Animations**: React Native Animated API + Expo Linear Gradient

## Project Structure

```
SmartBite/
├── src/
│   ├── types/
│   │   └── index.ts              # All TypeScript type definitions
│   ├── components/               # Reusable UI components
│   │   ├── GradientButton.tsx
│   │   ├── Input.tsx
│   │   ├── Link.tsx
│   │   ├── AnimatedLogo.tsx
│   │   ├── SocialButton.tsx
│   │   └── index.ts             # Centralized exports
│   ├── screens/                 # Screen components
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── navigation/              # Navigation setup
│   │   └── AuthNavigator.tsx
│   └── theme/                  # Design system
│       ├── colors.ts           # Color palette
│       ├── typography.ts       # Type scale
│       └── theme.ts            # React Native Paper theme + tokens
├── App.tsx                     # Root component
├── tsconfig.json               # TypeScript configuration
├── DESIGN_SYSTEM.md            # Complete design guide
├── COMPONENT_LIBRARY.md        # Component documentation
├── TYPESCRIPT_GUIDE.md         # TypeScript best practices
└── package.json
```

## Design System

- **Primary**: #3BC8A4 (Mint Teal) - trust & freshness
- **Accent**: #8E7CFF (Soft Violet) - AI interactions
- **Gradient**: Teal → Violet (135°) for AI features
- **Typography**: Poppins 600 (headings) + Inter 400 (body)
- **Border Radius**: 12px (consistent across all components)
- **Shadows**: Layered elevation system (input: 1dp, button: 4dp, logo: 6dp)

## Documentation

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Colors, typography, spacing, animations
- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - Component API reference with examples
- **[TYPESCRIPT_GUIDE.md](./TYPESCRIPT_GUIDE.md)** - TypeScript patterns, best practices, common errors
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for building new screens
