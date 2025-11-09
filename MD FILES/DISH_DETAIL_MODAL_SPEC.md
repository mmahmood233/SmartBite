# 🍽️ Wajba — Dish Detail Modal UI Specification

## Document Purpose
This document defines the structure, appearance, and interactive behavior of the **Dish Detail Modal** (Bottom Sheet) in the Wajba React Native app. This is the "moment of desire" screen where users make purchase decisions.

---

## 🎯 Purpose & Psychology

### **The "Moment of Desire"**
When a user taps a dish card, this modal creates an emotional connection through:
- **Visual Impact**: Full-width hero image (240px)
- **Clarity**: Price, description, and options immediately visible
- **Control**: Quantity and customization at user's fingertips
- **Speed**: Fast, tactile interactions with instant feedback

---

## 🧱 Structure Overview

```
┌─────────────────────────────────────┐
│         ─── (Drag Handle)           │
├─────────────────────────────────────┤
│                                     │
│        [Hero Food Image]            │  240px
│              ❤️                      │
│                                     │
├─────────────────────────────────────┤
│  Kabsa Rice with Chicken  BD 8.50  │
│  ⭐ 4.8 · 127 reviews               │
│  Traditional Saudi rice dish...     │
│  🔥 Popular  🌶️ Spicy              │
├─────────────────────────────────────┤
│  Choose your add-ons (Optional)     │
│  ☐ Extra Chicken      +BD 1.00     │
│  ☑ Salad              +BD 0.50     │
│  ☐ Garlic Sauce       +BD 0.30     │
├─────────────────────────────────────┤
│  Quantity        [-]  1  [+]        │
├─────────────────────────────────────┤
│  1 Item  BD 8.50  [Add to Order →] │
└─────────────────────────────────────┘
```

---

## 📐 Section Specifications

### **1. Drag Handle**
```typescript
Width: 36px
Height: 4px
Border Radius: 2px
Color: #CFCFCF
Position: Top center, 12px padding
```

**Purpose**: Visual affordance for dismissal

---

### **2. Hero Image Section**

| Element | Specification |
|---------|--------------|
| **Height** | 240px (fixed) |
| **Width** | 100% viewport |
| **Gradient Overlay** | Bottom 40%: transparent → rgba(255,255,255,0.9) |
| **Favorite Button** | Top-right, 40x40px circle, rgba(0,0,0,0.3) background |

**Image Requirements**:
- High-resolution food photography
- Aspect ratio: 16:9 or wider
- Focus on dish presentation

---

### **3. Info Block**

#### **Header Row**
```typescript
Dish Name:
  Font: SF Pro Display Semibold
  Size: 20px
  Color: #1A4D47 (dark teal)
  Letter Spacing: -0.3

Price:
  Font: SF Pro Display Bold
  Size: 18px
  Color: #007E73 (teal)
  Alignment: Right
```

#### **Rating Row** (Optional)
```typescript
Icon: Star (14px, #FFB800)
Text: "4.8 · 127 reviews"
Font: 14px, #6D6D6D
```

#### **Description**
```typescript
Font: SF Pro Text Regular
Size: 14px
Color: #6C6C6C
Line Height: 20px
Max Lines: 2-3
```

#### **Tags**
```typescript
Background: #F3F7F5
Border: 1px rgba(0, 126, 115, 0.15)
Padding: 6px 10px
Border Radius: 12px
Font: 12px, weight 500, color #007E73
Gap: 8px between tags
```

**Common Tags**:
- 🔥 Popular
- 🌶️ Spicy
- 🥗 Healthy
- ⭐ Chef's Pick
- 🌿 Vegetarian

---

### **4. Add-ons Section**

#### **Section Title**
```typescript
"Choose your add-ons (Optional)"
Font: 16px, weight 600
Color: #1A4D47
Margin Bottom: 12px
```

#### **Add-on Item**
```typescript
Layout: Row (checkbox + name + price)
Padding: 12px vertical
Touch Target: Full width

Checkbox:
  Size: 22x22px
  Border Radius: 6px
  Border: 2px #CFCFCF
  Active: Background #007E73, border #007E73
  Icon: Check (14px, white)

Name:
  Font: 15px, weight 500
  Color: #212121

Price:
  Font: 15px, weight 500
  Color: #6D6D6D
  Format: "+BD 0.50"
```

**UX Rules**:
- Limit visible options to 3-5
- Show "+ More Options" if > 5
- Teal checkbox for active state
- Tap anywhere on row to toggle

---

### **5. Quantity Selector**

```typescript
Container:
  Background: #F5F5F5
  Border Radius: 24px
  Padding: 6px 8px
  Layout: Row (button + text + button)

Buttons:
  Size: 36x36px
  Border Radius: 18px
  Icon: Minus/Plus (18px, #007E73)
  Active Opacity: 0.7

Quantity Text:
  Font: 18px, weight 600
  Color: #212121
  Min Width: 30px
  Text Align: Center
  Margin: 0 20px
```

**Behavior**:
- Minimum quantity: 1
- Maximum quantity: 99 (or restaurant limit)
- Subtle scale animation on tap (0.95 → 1)

---

### **6. Sticky Footer CTA**

```typescript
Container:
  Height: Auto (padding-based)
  Background: #FFFFFF
  Border Top: 1px rgba(0,0,0,0.08)
  Shadow: 0 -4px 10px rgba(0,0,0,0.1)
  Padding: 16px 20px

Left Side:
  Quantity: "1 Item" (14px, weight 500, #6D6D6D)
  Total: "BD 8.50" (20px, weight 700, #212121)

Button:
  Flex: 1.5
  Gradient: #00897B → #26A69A
  Border Radius: 12px
  Padding: 16px vertical
  Text: "Add to Order" (16px, weight 700, white)
  Icon: Arrow-right (18px, white)
  Gap: 8px
```

**Animation**:
- Tap: Scale 0.96 → 1
- Ripple effect from tap point
- Success: Flash + dismiss modal

---

## 🎨 Design Principles

### **1. Clarity**
- ✅ Price always visible (header + footer)
- ✅ Total updates in real-time
- ✅ Maximum 1.5× viewport height (scrollable)

### **2. Speed**
- ✅ All animations: 200-300ms
- ✅ Spring animation on modal entry
- ✅ Instant feedback on all interactions

### **3. Emotion**
- ✅ Hero image dominates (selling point)
- ✅ Warm, inviting colors
- ✅ Tactile micro-interactions

### **4. Hierarchy**
```
Level 1: Food Image (emotion)
Level 2: Name + Price (decision)
Level 3: Description + Tags (context)
Level 4: Customization (control)
Level 5: Add to Cart (action)
```

---

## 🪄 Micro-Interactions

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| **Modal Entry** | Slide up + spring | 300ms |
| **Modal Exit** | Slide down | 250ms |
| **Favorite Toggle** | Heart fill + pulse | 200ms |
| **Checkbox Toggle** | Scale + color fill | 150ms |
| **Quantity Change** | Number fade + scale | 200ms |
| **Add to Cart** | Button flash + ripple | 300ms |
| **Success Toast** | Slide up + fade | 250ms |

---

## 🔄 Interaction Flow

```mermaid
graph TD
    A[User taps dish card] --> B[Modal slides up]
    B --> C[User views image + info]
    C --> D{Customization?}
    D -->|Yes| E[Select add-ons]
    D -->|No| F[Adjust quantity]
    E --> F
    F --> G[Tap 'Add to Order']
    G --> H[Button flash]
    H --> I[Modal dismisses]
    I --> J[Cart count updates]
    J --> K[Success toast appears]
```

---

## 📱 Responsive Behavior

### **Small Screens** (iPhone SE, 320-375px)
- Image height: 200px (reduced)
- Font sizes: -1px across board
- Footer: Stack if needed

### **Standard Screens** (iPhone 12-14, 390-428px)
- Standard specifications apply
- Optimal viewing experience

### **Large Screens** (iPad, 768px+)
- Max width: 600px (centered)
- Image height: 280px
- Larger touch targets

---

## ✅ Accessibility

| Feature | Implementation |
|---------|----------------|
| **Touch Targets** | Minimum 44x44px |
| **Color Contrast** | WCAG AA compliant (4.5:1) |
| **Font Scaling** | Supports dynamic type |
| **Screen Readers** | Proper labels on all controls |
| **Keyboard Navigation** | Tab order logical |

---

## 🚀 Future Enhancements

### **Phase 2 Features**:
1. **Photo Carousel** - Multiple dish images
2. **Nutritional Info** - Calories, allergens toggle
3. **Chef's Tip** - Special preparation notes
4. **Similar Dishes** - Recommendations at bottom
5. **Voice Ordering** - Siri integration
6. **AR Preview** - View dish in 3D

---

## 🎯 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to Add** | < 10 seconds | User testing |
| **Customization Rate** | > 30% | Analytics |
| **Modal Completion** | > 80% | Conversion tracking |
| **Error Rate** | < 2% | Bug reports |

---

## 📊 A/B Testing Opportunities

1. **Image Height**: 200px vs 240px vs 280px
2. **CTA Text**: "Add to Order" vs "Add to Cart" vs "Add"
3. **Add-on Display**: Checkboxes vs Toggle switches
4. **Price Position**: Header only vs Header + Footer

---

## 🏆 Production Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| **Modal Animation** | ✅ | Spring entry, smooth exit |
| **Hero Image** | ✅ | 240px, gradient overlay |
| **Drag Handle** | ✅ | 36x4px, #CFCFCF |
| **Info Block** | ✅ | Name, price, rating, description |
| **Tags** | ✅ | Pill style, teal accent |
| **Add-ons** | ✅ | Checkbox selection, price display |
| **Quantity Selector** | ✅ | Pill background, +/- controls |
| **Sticky Footer** | ✅ | Gradient button, real-time total |
| **Favorite Toggle** | ✅ | Heart icon, state persistence |
| **Responsive** | ✅ | Works on all screen sizes |

---

## 🌟 Final Status

**Status**: 🟢 **PRODUCTION READY — INVESTOR-PITCH QUALITY**

**This Dish Detail Modal achieves**:
- ✅ **Uber Eats-level polish** (visual hierarchy, animations)
- ✅ **Talabat-style clarity** (price visibility, customization)
- ✅ **Wajba brand personality** (teal accents, warm feel)
- ✅ **iOS 18 compliance** (SF Pro, native patterns, smooth animations)
- ✅ **Emotional intelligence** (hero image, tactile feedback, delight)

**Ready for**: User testing, App Store submission, investor demos 🏆✨
