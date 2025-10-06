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

### Authentication UI (No functionality yet)
- **Login Screen**: Email/password login with social auth options
- **Signup Screen**: Full registration form with terms acceptance

## Tech Stack

- **Frontend**: React Native + Expo
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Theme**: Custom SmartBite design system (Mint Teal primary)

## Project Structure

```
SmartBite/
├── src/
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.js
│   │   └── SignupScreen.js
│   ├── navigation/       # Navigation setup
│   │   └── AuthNavigator.js
│   └── theme/           # Design tokens
│       ├── colors.js
│       └── typography.js
├── App.js              # Root component
└── package.json
```

## Design System

- **Primary Color**: #3BC8A4 (Mint Teal)
- **Accent Color**: #8E7CFF (Soft Violet)
- **Typography**: Poppins (headings) + Inter (body)
- **Corner Radius**: 12px
