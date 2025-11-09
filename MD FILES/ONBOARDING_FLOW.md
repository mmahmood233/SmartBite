# Wajba Onboarding Flow Documentation

**Version**: 1.0.0  
**Last Updated**: 2025-10-06

Complete documentation for the Wajba onboarding experience - the first impression sequence that educates, excites, and converts new users.

---

## 🎯 Purpose

The onboarding flow introduces new users to Wajba's core value proposition within **10 seconds**:
- **Discover** - AI-powered recommendations
- **Personalize** - Mood and taste-based meals
- **Enjoy** - Middle Eastern warmth + fast delivery

---

## 🌊 User Flow

```
App Launch
    ↓
Splash Screen (2.5s)
    ↓
Onboarding Screen 1: Discover
    ↓ (swipe/next)
Onboarding Screen 2: Personalize
    ↓ (swipe/next)
Onboarding Screen 3: Enjoy
    ↓ (Get Started)
Sign Up Screen
```

---

## 📱 Screens

### **1. Splash Screen**

**Duration**: 2.5 seconds  
**Purpose**: Brand introduction with animated logo

**Elements:**
- Wajba logo (100px) with pulsing gradient glow
- Tagline: "Middle Eastern warmth meets intelligent personalization"
- Fade-in animation (800ms)
- Auto-transition to onboarding

**File**: `src/screens/SplashScreen.tsx`

**Implementation:**
```typescript
<View style={styles.container}>
  <AnimatedLogo size={100} />
  <Animated.View style={{ opacity: fadeAnim }}>
    <Text>Middle Eastern warmth meets{'\n'}intelligent personalization</Text>
  </Animated.View>
</View>
```

---

### **2. Onboarding Screen 1: Discover**

**Purpose**: Introduce AI-powered recommendations

**Content:**
- **Title**: "Discover local flavors with AI-powered recommendations"
- **Subtitle**: "Skip the endless scrolling — Wajba finds what fits your craving"
- **Visual**: 🔍 Search emoji in circular container
- **Button**: "Next"
- **Progress**: ● ○ ○

**UX Goal**: Make users feel understood — highlight intelligence and personalization

---

### **3. Onboarding Screen 2: Personalize**

**Purpose**: Explain mood and taste-based personalization

**Content:**
- **Title**: "Personalize your meals based on your mood and taste"
- **Subtitle**: "Our AI learns what you love — whether it's spicy, sweet, or healthy"
- **Visual**: 🤖 AI emoji in circular container
- **Button**: "Next"
- **Progress**: ○ ● ○

**UX Goal**: Emotional connection — it's not a cold app, it understands you

---

### **4. Onboarding Screen 3: Enjoy**

**Purpose**: Close with warmth, trust, and cultural connection

**Content:**
- **Title**: "Enjoy Middle Eastern warmth, delivered to your door"
- **Subtitle**: "Fast delivery, real flavor — Wajba brings your favorite dishes home"
- **Visual**: 🏡 Home emoji in circular container
- **Button**: "Get Started" (gradient)
- **Progress**: ○ ○ ●

**UX Goal**: Reinforce reliability, culture, and comfort — motivate signup

---

## 🎨 Design Specifications

### **General Guidelines**

**Background:**
- Color: `#F8F9FB` (soft white)
- Gradient: `#F8F9FB → #FFFFFF` (optional)

**Typography:**
- **Heading**: Poppins SemiBold, 24px, `#1B1B1B`
- **Body**: Inter Regular, 15px, `#666E75`
- **Line Height**: Title 32px, Subtitle 22px

**Layout:**
- Screen padding: 24px horizontal
- Illustration: Top section (flex: 1)
- Content: Bottom section
- Button: Fixed at bottom with 40px padding

**Button:**
- Gradient: `#14776F → #3BC8A4`
- Border radius: 12px
- Height: 52px (padding 16px vertical)
- Text: Poppins SemiBold 16px, white

**Progress Indicators:**
- Active dot: 24px width, 8px height, `#14776F`
- Inactive dot: 8px circle, `#E3E6EA`
- Spacing: 4px between dots

---

## 🎭 Animations

### **Splash Screen**
```typescript
// Logo pulse (continuous)
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, {
      toValue: 1.06,
      duration: 1250,
    }),
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1250,
    }),
  ])
)

// Tagline fade-in
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 800,
  delay: 400,
})
```

### **Onboarding Screens**
- **Swipe**: Horizontal FlatList with paging
- **Transition**: Native smooth scrolling
- **Button press**: Scale 0.98x spring animation
- **Dot transition**: Smooth width/color change

---

## 💻 Implementation

### **File Structure**
```
src/
├── screens/
│   ├── SplashScreen.tsx        # Logo + tagline (2.5s)
│   ├── OnboardingScreen.tsx    # 3 swipeable slides
│   ├── LoginScreen.tsx
│   └── SignupScreen.tsx
├── navigation/
│   ├── RootNavigator.tsx       # Splash → Onboarding → Auth
│   └── AuthNavigator.tsx       # Login ↔ Signup
└── types/
    └── index.ts                # Navigation types
```

### **Navigation Setup**

```typescript
// RootNavigator.tsx
<Stack.Navigator initialRouteName="Splash">
  <Stack.Screen name="Splash" component={SplashScreen} />
  <Stack.Screen name="Onboarding" component={OnboardingScreen} />
  <Stack.Screen name="Auth" component={AuthNavigator} />
</Stack.Navigator>
```

### **Onboarding Data**

```typescript
const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Discover local flavors with AI-powered recommendations',
    subtitle: 'Skip the endless scrolling — Wajba finds what fits your craving',
    emoji: '🔍',
  },
  {
    id: '2',
    title: 'Personalize your meals based on your mood and taste',
    subtitle: 'Our AI learns what you love — whether it\'s spicy, sweet, or healthy',
    emoji: '🤖',
  },
  {
    id: '3',
    title: 'Enjoy Middle Eastern warmth, delivered to your door',
    subtitle: 'Fast delivery, real flavor — Wajba brings your favorite dishes home',
    emoji: '🏡',
  },
];
```

---

## 🔄 User Interactions

### **Swipe Gestures**
- **Left/Right**: Navigate between slides
- **Smooth**: Native FlatList paging
- **Bounce**: Disabled at edges

### **Button Actions**
- **Slides 1-2**: "Next" → Navigate to next slide
- **Slide 3**: "Get Started" → Navigate to Auth (Signup)

### **Progress Indicators**
- **Visual feedback**: Current slide highlighted
- **Non-interactive**: Display only (no tap to navigate)

---

## 🎯 Key Messaging

### **Screen 1: Discover**
**Message**: "We're smart — we find what you want"  
**Emotion**: Confidence, efficiency  
**Value**: Save time, AI-powered

### **Screen 2: Personalize**
**Message**: "We understand you — your mood matters"  
**Emotion**: Connection, understanding  
**Value**: Personalized experience

### **Screen 3: Enjoy**
**Message**: "We're warm and reliable — cultural authenticity"  
**Emotion**: Trust, comfort, belonging  
**Value**: Fast delivery, real flavor

---

## ✅ Implementation Checklist

### **Splash Screen**
- [x] Logo animation (pulse)
- [x] Tagline fade-in
- [x] 2.5s auto-transition
- [x] Wajba branding

### **Onboarding Screens**
- [x] 3 swipeable slides
- [x] Progress indicators
- [x] Emoji illustrations
- [x] Typography (Poppins/Inter)
- [x] Gradient button
- [x] "Next" / "Get Started" logic
- [x] Navigation to Auth

### **Navigation**
- [x] RootNavigator created
- [x] Splash → Onboarding flow
- [x] Onboarding → Auth flow
- [x] Type-safe navigation

---

## 🚀 Future Enhancements

### **Phase 2: Illustrations**
Replace emoji placeholders with custom illustrations:
- **Screen 1**: AI scanning food menus
- **Screen 2**: Chat bubbles with food emojis
- **Screen 3**: Delivery scene with Middle Eastern elements

### **Phase 3: Skip Option**
Add "Skip" button in top-right corner for returning users

### **Phase 4**: AsyncStorage**
Track if user has seen onboarding:
```typescript
await AsyncStorage.setItem('hasSeenOnboarding', 'true');
```

### **Phase 5: Video Background**
Add subtle animated background (food particles, gradient waves)

---

## 📊 Success Metrics

### **Target KPIs**
- **Completion Rate**: >80% reach "Get Started"
- **Time to Complete**: <30 seconds average
- **Skip Rate**: <20% (when skip added)
- **Signup Conversion**: >60% after onboarding

### **A/B Testing Ideas**
- Emoji vs. custom illustrations
- 3 slides vs. 4 slides
- Different messaging
- Video backgrounds

---

## 🎨 Brand Consistency

### **Wajba Identity Throughout**
✅ Colors: Wajba Teal (#14776F) + Mint (#3BC8A4)  
✅ Typography: Poppins SemiBold + Inter Regular  
✅ Messaging: Middle Eastern warmth + AI intelligence  
✅ Tone: Warm, smart, trustworthy  
✅ Visual: Clean, modern, culturally authentic  

---

## 🔧 Troubleshooting

### **Splash screen too fast/slow**
Adjust timeout in `SplashScreen.tsx`:
```typescript
setTimeout(() => {
  navigation.replace('Onboarding');
}, 2500); // Change duration here
```

### **Onboarding not showing**
Check `RootNavigator.tsx` initial route:
```typescript
initialRouteName="Splash"  // Must be Splash
```

### **Button not navigating**
Verify navigation types in `src/types/index.ts`:
```typescript
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
};
```

---

## 📚 Related Documentation

- **[WAJBA_THEME.md](./WAJBA_THEME.md)** - Complete design system
- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - Component API
- **[LOGO_INTEGRATION.md](./LOGO_INTEGRATION.md)** - Logo usage guide
- **[DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)** - Best practices

---

## 🎓 Best Practices

### **Content**
✅ Keep titles under 60 characters  
✅ Keep subtitles under 100 characters  
✅ Use active voice ("Discover", "Personalize", "Enjoy")  
✅ Focus on benefits, not features  
✅ Maintain consistent tone  

### **Design**
✅ Use Wajba brand colors  
✅ Follow typography hierarchy  
✅ Keep illustrations simple  
✅ Ensure high contrast  
✅ Test on multiple devices  

### **UX**
✅ Allow swipe navigation  
✅ Show clear progress  
✅ Make "Get Started" prominent  
✅ Keep flow under 30 seconds  
✅ Test with real users  

---

**Status**: Onboarding Flow Complete ✅  
**Screens**: 4 (Splash + 3 Onboarding)  
**Duration**: ~15-30 seconds  
**Conversion Goal**: >60% signup rate

