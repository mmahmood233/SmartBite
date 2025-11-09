# 🤖 Wajba AI-First Redesign Implementation Plan

## 🎯 Goal
Transform Wajba from "just another delivery app" to an **AI-powered food assistant** where the chat experience is central.

---

## 📋 Implementation Checklist

### ✅ Step 1: Create AI Chat Screen
**File:** `src/screens/AIChatScreen.tsx`

**Features:**
- Clean conversational UI
- User messages (right, teal gradient)
- AI messages (left, with avatar)
- Quick prompt suggestions
- Input bar with voice icon
- AI response cards with dish recommendations
- "Add to Cart" buttons on each suggestion

**Design Specs:**
- Title: "Wajba AI 🍽️ — Your Food Assistant"
- Subtitle: "Ask me anything — I'll find the perfect meal for you."
- Message bubbles with proper spacing
- Suggested prompts: "I want something spicy 🌶️", "Show vegetarian meals 🥗", "Cheap lunch near me 💸"

---

### ✅ Step 2: Update Bottom Navigation (4 Tabs)

**Current:**
```
Home | Orders | Profile
```

**New:**
```
Home | AI Chat | Orders | Profile
```

**Changes Needed:**
1. Update `src/navigation/BottomTabNavigator.tsx`
2. Add AI Chat tab in center position
3. Use brain/chatbot icon (🧠 or 💬)
4. Apply teal gradient when active
5. Make it visually distinctive (larger icon or special styling)

**Icon Options:**
- `brain` (Feather)
- `message-circle` (Feather)
- `robot` (MaterialCommunityIcons)

---

### ✅ Step 3: Revamp Home Screen

**File:** `src/screens/HomeScreen.tsx`

#### **New Top Section:**
```tsx
👋 Good evening, Ahmed
📍 Manama

💭 Hungry? Ask Wajba AI what to eat 🤖
   "Try saying: I want something spicy under 3 BD!"
```

#### **Replace Mood Picker with AI Chat CTA:**

**Before:**
```tsx
🧠 Tell us your craving | Pick My Mood
```

**After:**
```tsx
🤖 Ask Wajba AI Card
┌─────────────────────────────────┐
│ 🤖 Ask Wajba AI                 │
│ "Tell me what you're craving    │
│  today..."                      │
│                                 │
│ [ Chat Now ] (teal gradient)    │
└─────────────────────────────────┘
```

**Design:**
- Rounded card with gradient background
- Pulsing animation on chat bubble
- Prominent placement (above "For You" section)
- Taps navigate to AI Chat screen

#### **Updated Layout:**
```
1. Greeting + Location
2. Search bar + Filters
3. 🤖 AI Chat CTA Card (NEW)
4. ✨ For You Section
5. Restaurant Cards
```

---

### ✅ Step 4: AI Chat Screen Components

#### **Message Types:**

**User Message:**
```tsx
<View style={styles.userMessageContainer}>
  <View style={styles.userBubble}>
    <Text style={styles.userText}>
      I want something spicy under 3 BD
    </Text>
  </View>
</View>
```

**AI Message:**
```tsx
<View style={styles.aiMessageContainer}>
  <View style={styles.aiAvatar}>🤖</View>
  <View style={styles.aiBubble}>
    <Text style={styles.aiText}>
      Here are a few spicy options under BD 3:
    </Text>
  </View>
</View>
```

**AI Recommendation Card:**
```tsx
<View style={styles.recommendationCard}>
  <Image source={dish.image} style={styles.dishImage} />
  <View style={styles.dishInfo}>
    <Text style={styles.dishName}>🍗 Shawarma Plate</Text>
    <Text style={styles.restaurant}>Shawarma House</Text>
    <Text style={styles.price}>BD 2.8</Text>
  </View>
  <TouchableOpacity style={styles.addButton}>
    <Text>Add to Cart</Text>
  </TouchableOpacity>
</View>
```

#### **Quick Prompts:**
```tsx
<ScrollView horizontal style={styles.quickPrompts}>
  <Chip>I want something spicy 🌶️</Chip>
  <Chip>Show vegetarian meals 🥗</Chip>
  <Chip>Cheap lunch near me 💸</Chip>
  <Chip>Healthy options 🥗</Chip>
  <Chip>Fast delivery ⚡</Chip>
</ScrollView>
```

#### **Input Bar:**
```tsx
<View style={styles.inputBar}>
  <TextInput
    placeholder="Type your craving..."
    style={styles.input}
  />
  <TouchableOpacity style={styles.voiceButton}>
    <Icon name="mic" size={24} color={colors.primary} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.sendButton}>
    <Icon name="send" size={24} color="#FFFFFF" />
  </TouchableOpacity>
</View>
```

---

### ✅ Step 5: Backend Integration

**API Endpoint:**
```typescript
POST /api/ai/recommend

Request:
{
  "message": "I want something spicy under 3 BD",
  "userId": "user123",
  "location": "Manama"
}

Response:
{
  "message": "Here are a few spicy options under BD 3:",
  "recommendations": [
    {
      "id": "dish1",
      "name": "Shawarma Plate",
      "restaurant": "Shawarma House",
      "price": 2.8,
      "image": "url",
      "spicyLevel": 3,
      "eta": "20-30 min"
    }
  ]
}
```

---

### ✅ Step 6: Branding Updates

#### **Tagline:**
```
"Wajba — Don't scroll. Just ask. 🍴🤖"
```

**Where to add:**
- Splash screen
- Login screen footer
- Profile screen footer
- About section

#### **App Description:**
```
"Your AI-powered food assistant. 
Tell us what you're craving, and we'll find it for you."
```

---

## 🎨 Design System Updates

### **Colors:**
```typescript
// Add to colors.ts
aiGradientStart: '#11897F',
aiGradientMid: '#1BC7AF',
aiGradientEnd: '#0ED9B8',
aiBubbleBg: '#F0F9F8',
userBubbleBg: '#11897F',
```

### **Animations:**
```typescript
// Pulsing chat bubble
const pulseAnimation = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
```

---

## 📱 Screen Flow

```
Home Screen
    ↓ (Tap "Ask Wajba AI" card)
AI Chat Screen
    ↓ (User types message)
AI Response with Recommendations
    ↓ (Tap "Add to Cart")
Cart Screen
    ↓
Checkout
```

---

## 🔄 User Experience Flow

1. **First Open:**
   - User sees prominent AI Chat CTA on Home
   - Animated callout: "Hungry? Ask Wajba AI..."

2. **Tap AI Chat:**
   - Navigate to clean chat interface
   - See quick prompt suggestions
   - Welcoming AI message

3. **User Interaction:**
   - Type or tap quick prompt
   - AI responds with personalized recommendations
   - Each dish has "Add to Cart" button

4. **Learning:**
   - AI remembers preferences
   - "For You" section updates based on chat history
   - Future recommendations get smarter

---

## 📊 Success Metrics

**Track:**
- % of users who tap AI Chat CTA
- Average messages per session
- Conversion rate (AI recommendation → order)
- User satisfaction with AI suggestions

---

## 🚀 Implementation Order

### **Phase 1: Core AI Chat** (Day 1)
1. Create `AIChatScreen.tsx`
2. Build message UI components
3. Add input bar and quick prompts
4. Implement mock AI responses

### **Phase 2: Navigation Update** (Day 1)
1. Update `BottomTabNavigator.tsx`
2. Add AI Chat tab (center position)
3. Style with teal gradient when active

### **Phase 3: Home Screen Revamp** (Day 2)
1. Add AI callout at top
2. Replace mood picker with AI Chat CTA card
3. Add pulsing animation
4. Wire up navigation to AI Chat

### **Phase 4: Backend Integration** (Day 3)
1. Connect to `/api/ai/recommend` endpoint
2. Handle loading states
3. Display AI recommendations as cards
4. Implement "Add to Cart" functionality

### **Phase 5: Polish & Branding** (Day 4)
1. Add tagline throughout app
2. Refine animations
3. Test user flows
4. Add voice input (optional)

---

## 💡 Pro Tips

1. **Make AI feel instant:**
   - Show typing indicator immediately
   - Use optimistic UI updates
   - Cache common responses

2. **Personality:**
   - Friendly, casual tone
   - Use emojis naturally
   - Bilingual support (English/Arabic)

3. **Visual Hierarchy:**
   - AI Chat icon should be largest in nav bar
   - Use gradient consistently for AI elements
   - Animate to draw attention

4. **Fallbacks:**
   - If AI fails, show popular dishes
   - Graceful error messages
   - "Try again" button

---

## 📝 Files to Create/Modify

### **New Files:**
- `src/screens/AIChatScreen.tsx`
- `src/components/ChatBubble.tsx`
- `src/components/DishRecommendationCard.tsx`
- `src/components/QuickPromptChip.tsx`
- `src/services/aiService.ts`

### **Modified Files:**
- `src/navigation/BottomTabNavigator.tsx`
- `src/screens/HomeScreen.tsx`
- `src/theme/colors.ts`
- `src/types/index.ts` (add AI message types)

---

## 🎯 Expected Outcome

**Before:**
- Generic food delivery app
- AI hidden in search
- Users scroll endlessly

**After:**
- AI-first experience
- Chat is central feature
- Users ask, AI delivers
- "Don't scroll. Just ask." 🤖

---

**Status:** Ready to implement ✅  
**Estimated Time:** 3-4 days  
**Impact:** Massive differentiation 🚀
