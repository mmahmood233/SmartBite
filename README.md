# 🍽️ Wajba (SmartBite)

An AI-powered delivery platform for food, groceries, and essentials - now with a **professional restaurant partner portal**!

**Brand**: Middle Eastern warmth meets intelligent personalization  
**Keywords**: authentic • smart • local • appetizing • trustworthy

**Version**: 1.0.0  
**Last Updated**: 2025-10-18  
**Status**: ✅ Production-Ready UI (Backend Integration Pending)

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

## 🎯 Current Features

### 👥 **USER PORTAL** (Customer App)

#### 🔐 Authentication
- **Login & Signup** screens with validation
- Social auth buttons (Apple, Google)
- Animated logo with AI gradient glow
- Form validation and error handling

#### 🏠 Restaurant Discovery
- **Home Screen** with featured restaurants
- **Browse All Restaurants** with filters
- **Restaurant Detail** with menu, ratings, reviews
- **Dish Detail Modal** with customization options
- AI-powered chat for personalized recommendations

#### 🛒 Shopping & Checkout
- **Cart Screen** with item management
- **Checkout** with address and payment selection
- Order summary and total calculation
- Promo code support

#### 📦 Order Management
- **Orders Screen** with order history
- **Order Tracking** with real-time status
- **Order Details** with item breakdown
- **Delivery Complete** confirmation
- **Review & Rating** system

#### 👤 User Profile
- **Profile Management** with edit capabilities
- **Saved Addresses** (add, edit, delete)
- **Payment Methods** management
- **Favorites** restaurants
- **Offers & Promotions**
- **Help & Support**
- **Change Password**
- **AI Chat Assistant**

### 🏪 **PARTNER PORTAL** (Restaurant Management)

#### 📊 Overview Dashboard
- **Real-time Analytics** with key metrics
- **Today's Orders** count and trends
- **Earnings Today** with weekly comparison
- **Average Rating** from customer reviews
- **Average Prep Time** tracking
- **Performance Charts** (7-day trends)
- **Top 5 Items** with sales visualization
- **Date/Time Filters** (Today, Yesterday, 7 Days, 30 Days)

#### 📋 Live Orders Management
- **New Orders** section with accept/reject system
- **Countdown Timer** for order acceptance
- **Active Orders** (Preparing, Ready for Pickup)
- **Order Status Management** (Mark Ready, Mark Completed)
- **Filter Tabs** (All, New, Preparing, Ready, Completed, Cancelled)
- **Order Details** with customer info and items
- **History Summary** (Completed & Cancelled)

#### 🎨 Professional UI Features
- **Talabat Partner Quality** design
- **Glassmorphism Cards** with subtle shadows
- **Color-Coded Status Pills** for order states
- **Bottom Tab Navigation** (Live Orders, Overview, Menu, More)
- **Consistent Top Navigation** with branding
- **Responsive Layout** for all screen sizes

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo SDK 51
- **Language**: TypeScript (100% type coverage, strict mode)
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: React Navigation 6
  - Native Stack Navigator (main navigation)
  - Bottom Tabs Navigator (user & partner portals)
  - Stack Navigator (auth flow)
- **Icons**: Feather Icons + Material Community Icons
- **Gradients**: Expo Linear Gradient
- **Animations**: React Native Reanimated + Gesture Handler
- **Theme**: Custom Wajba design system (Teal #00A896 primary)
- **Total Packages**: 17 dependencies (see PACKAGES.md)

## 📁 Project Structure

```
Wajba/
├── assets/                      # Images, logos, icons
│   └── wajba_logo.png
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── GradientButton.tsx
│   │   ├── Input.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Snackbar.tsx
│   │   ├── partner/             # Partner-specific components
│   │   │   └── PartnerTopNav.tsx
│   │   └── index.ts
│   ├── screens/
│   │   ├── user/                # USER PORTAL
│   │   │   ├── auth/            # Login, Signup
│   │   │   ├── onboarding/      # Splash, Onboarding
│   │   │   ├── restaurant/      # Home, Browse, Details
│   │   │   ├── cart/            # Cart, Checkout
│   │   │   ├── orders/          # Order tracking & history
│   │   │   └── profile/         # User settings & account
│   │   └── partner/             # PARTNER PORTAL
│   │       ├── OverviewDashboard.tsx
│   │       └── LiveOrdersScreen.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx    # Main app navigation
│   │   ├── AuthNavigator.tsx    # Auth flow
│   │   ├── MainTabNavigator.tsx # User portal tabs
│   │   └── PartnerTabNavigator.tsx # Partner portal tabs
│   ├── theme/                   # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts
│   ├── constants/               # App constants
│   │   └── index.ts
│   └── utils/                   # Utility functions
│       └── index.ts
├── App.tsx
├── app.json
├── tsconfig.json
├── package.json
└── [20+ documentation files].md
```

## 🎨 Design System (Wajba)

### Colors
- **Primary**: #00A896 (Wajba Teal) - buttons, active states
- **Primary Light**: #4ECDC4 (Mint) - gradients, highlights
- **Accent Amber**: #FFB703 - warnings, preparing status
- **Success**: #3EB489 - completed orders
- **Error**: #E53935 - cancelled, reject
- **Background**: #FAFAF9 (warm neutral)

### Typography
- **Headings**: SF Pro Rounded / Inter (600-700 weight)
- **Body**: Inter Regular (400 weight)
- **Sizes**: 11-24pt scale

### Spacing
- **Vertical Rhythm**: 24px between major sections
- **Card Padding**: 16-20px
- **Border Radius**: 12-20px (cards, buttons)

### Shadows
- **Cards**: rgba(0,0,0,0.03-0.06) with 12px blur
- **Buttons**: rgba(0,0,0,0.05) with 8px blur
- **Elevation**: 2-5 levels

## 📚 Documentation

### 🚀 Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - Quick setup and development guide
- **[DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)** - Core workflow & best practices

### 🎨 Design & UI
- **[WAJBA_THEME.md](./WAJBA_THEME.md)** - Wajba Design System & Theme
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Colors, typography, spacing
- **[DESIGN_SPEC.md](./DESIGN_SPEC.md)** - Complete Figma-style specification
- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - Component API reference
- **[LOGO_INTEGRATION.md](./LOGO_INTEGRATION.md)** - Logo usage guide

### 📦 Technical
- **[PACKAGES.md](./PACKAGES.md)** - Complete package documentation (17 packages)
- **[TYPESCRIPT_GUIDE.md](./TYPESCRIPT_GUIDE.md)** - TypeScript patterns & best practices
- **[TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md)** - Migration summary
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure (Supabase)

### 🎯 Features
- **[ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md)** - Splash + Onboarding screens
- **[AI_FIRST_REDESIGN.md](./AI_FIRST_REDESIGN.md)** - AI chat integration
- **[RESTAURANT_DETAIL_SPEC.md](./RESTAURANT_DETAIL_SPEC.md)** - Restaurant page spec
- **[DISH_DETAIL_MODAL_SPEC.md](./DISH_DETAIL_MODAL_SPEC.md)** - Dish modal spec

### 🔧 Patterns
- **[LOADING_PATTERN.md](./LOADING_PATTERN.md)** - Loading states
- **[SNACKBAR_PATTERN.md](./SNACKBAR_PATTERN.md)** - Toast notifications
- **[UX_ENHANCEMENTS.md](./UX_ENHANCEMENTS.md)** - UX improvements

## 🎯 Next Steps

### Phase 1: Backend Integration (In Progress)
- [ ] Supabase setup and configuration
- [ ] Authentication API integration
- [ ] Restaurant data API
- [ ] Order management API
- [ ] Real-time order updates

### Phase 2: Advanced Features
- [ ] AI chat-to-order implementation
- [ ] Push notifications
- [ ] Payment gateway (Stripe/BenefitPay)
- [ ] Maps & location services
- [ ] Image optimization

### Phase 3: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] iOS App Store submission
- [ ] Android Play Store submission

## 🤝 Contributing

This is a university project (Semester 7). For questions or collaboration:
- Review the documentation files
- Follow the TypeScript patterns in TYPESCRIPT_GUIDE.md
- Maintain the folder structure (user/ and partner/ separation)
- Keep import paths consistent

## 📄 License

University Project - All Rights Reserved

---

**Built with ❤️ for the Middle Eastern market**  
**Wajba** - Where tradition meets innovation 🍽️✨
