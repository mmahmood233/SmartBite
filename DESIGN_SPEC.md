# SmartBite Design Specification Sheet
**Version**: 1.0 - App Store Ready  
**Last Updated**: 2025-10-06

---

## 🎨 Color System

### Primary Palette
| Token | Hex | Usage | Notes |
|-------|-----|-------|-------|
| `primary` | `#3BC8A4` | CTA buttons, active states, links | Mint Teal - trust & freshness |
| `primaryDark` | `#009E83` | Hover states, dark mode | Darker variant |
| `accent` | `#8E7CFF` | AI features, highlights | Soft Violet |

### Gradients
| Name | Colors | Angle | Usage |
|------|--------|-------|-------|
| **Button Gradient** | `#3BC8A4 → #5DE2D8` | 90° (horizontal) | Primary CTA buttons |
| **AI Gradient** | `#3BC8A4 → #8E7CFF` | 135° (diagonal) | AI features, logo glow |

### Backgrounds
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | `#F8F9FB` | `#121417` | App background |
| `surface` | `#FFFFFF` | `#1C1F24` | Cards, modals |

### Text
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `textPrimary` | `#1B1B1B` | `#EAEAEA` | Headlines, body |
| `textSecondary` | `#666E75` | `#666E75` | Subtitles, captions |
| `textMuted` | `#9097A2` | `#9097A2` | Disabled, placeholders |

### Status
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#4ECB71` | Delivered, online |
| `error` | `#E74C3C` | Errors, failed states |
| `divider` | `#E3E6EA` | Borders, separators |

---

## 📐 Typography

### Font Families
- **Headings**: Poppins
- **Body**: Inter
- **Monospace**: SF Mono (code/numbers)

### Type Scale
| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| **Brand Name** | Poppins | 22px | 600 | 28px | App logo text |
| **H1** | Poppins | 28px | 600 | 36px | Page titles |
| **H2** | Poppins | 24px | 500 | 32px | Section headers |
| **H3** | Poppins | 18px | 500 | 24px | Subheaders |
| **Body** | Inter | 16px | 400 | 22px | Paragraph text |
| **Caption** | Inter | 14px | 400 | 20px | Taglines, hints |
| **Small** | Inter | 12px | 400 | 16px | Fine print |
| **Button** | Poppins | 16px | 600 | - | Button labels |
| **Link** | Inter | 14px | 500 | - | Text links |

### Letter Spacing
- **Headings**: 0px (default)
- **Body**: 0px
- **Buttons**: 0.3px (slight tracking)
- **All Caps**: 1px

---

## 📏 Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Compact elements |
| `md` | 12px | Default gap |
| `lg` | 16px | Standard padding |
| `xl` | 24px | Section spacing |
| `xxl` | 32px | Large sections |
| `xxxl` | 40px | Major sections |
| `huge` | 60px | Top margins |

### Common Patterns
```typescript
// Screen padding
paddingHorizontal: 24px (xl)

// Card padding
padding: 16px (lg)

// Input margin bottom
marginBottom: 16px (lg)

// Section spacing
marginVertical: 32px (xxl)

// Header top margin
marginTop: 60px (huge)
```

---

## 🔲 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `small` | 8px | Chips, tags |
| `medium` | 12px | **Default** - buttons, inputs, cards |
| `large` | 16px | Store cards, images |
| `round` | 40px | Avatars, logo |
| `pill` | 24px | Filter chips |

---

## 💫 Shadows & Elevation

### Shadow System
| Level | Usage | Shadow Values |
|-------|-------|---------------|
| **1dp** | Input fields | `0 1px 2px rgba(0,0,0,0.05)` |
| **4dp** | Buttons, cards | `0 4px 8px rgba(0,0,0,0.1)` |
| **6dp** | Logo, FAB | `0 6px 12px rgba(59,200,164,0.25)` |
| **8dp** | Modals | `0 8px 16px rgba(0,0,0,0.15)` |

### Implementation
```typescript
// Input
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1,

// Button
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.1,
shadowRadius: 8,
elevation: 4,

// Logo
shadowColor: '#3BC8A4',
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.25,
shadowRadius: 12,
elevation: 6,
```

---

## 🎬 Animation Timing

### Duration
| Speed | Value | Usage |
|-------|-------|-------|
| `fast` | 150ms | Focus transitions, hover |
| `normal` | 300ms | Standard animations |
| `slow` | 600ms | Fade-ins, slides |
| `verySlow` | 800ms | Logo entrance |

### Easing
| Type | Curve | Usage |
|------|-------|-------|
| **Linear** | `linear` | Progress bars |
| **Ease Out** | `ease-out` | Entrances |
| **Ease In** | `ease-in` | Exits |
| **Spring** | `friction: 8, tension: 40` | Buttons, interactive |
| **Bouncy** | `friction: 3, tension: 40` | Press animations |

### Spring Configs
```typescript
// Default spring
{
  friction: 8,
  tension: 40,
  useNativeDriver: true,
}

// Bouncy spring (press)
{
  friction: 3,
  tension: 40,
  useNativeDriver: true,
}
```

---

## 🎯 Component Specs

### Primary Button (GradientButton)
```typescript
// Dimensions
height: auto (paddingVertical: 16px)
minWidth: 120px
borderRadius: 12px

// Gradient
colors: ['#3BC8A4', '#5DE2D8']
direction: horizontal (90°)

// Shadow
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 8px
elevation: 4

// Text
font: Poppins 600
size: 16px
color: #FFFFFF
letterSpacing: 0.3px

// States
- Default: gradient + shadow
- Pressed: scale(0.98)
- Disabled: #CBD5DE background, #8B93A0 text, no shadow

// Animation
- Press in: scale 0.98, 150ms spring
- Press out: scale 1.0, 150ms spring
```

### Input Field
```typescript
// Dimensions
height: 56px
borderRadius: 12px
paddingHorizontal: 16px
paddingVertical: 16px

// Border
width: 1px
color: #E3E6EA (default)
color: #3BC8A4 (focused)
color: #E74C3C (error)

// Shadow
shadowColor: '#000'
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.05
shadowRadius: 2px

// Label
font: Inter 400
size: 16px
color: #666E75

// States
- Default: gray border
- Focused: teal border (150ms transition), scale(1.01)
- Error: red border
- Disabled: #F8F9FB background

// Animation
- Focus: border color 150ms, scale 1.01
- Blur: border color 150ms, scale 1.0
```

### Social Button
```typescript
// Dimensions
height: auto (paddingVertical: 14px)
borderRadius: 12px
borderWidth: 1px
borderColor: #E3E6EA

// Background
color: #FFFFFF
shadow: 0 1px 2px rgba(0,0,0,0.05)

// Text
font: Inter 400
size: 14px
color: #1B1B1B

// States
- Default: white background
- Pressed: scale(0.97)

// Animation
- Press in: scale 0.97, spring
- Press out: scale 1.0, spring
```

### Logo (AnimatedLogo)
```typescript
// Dimensions
size: 80px (default)
borderRadius: 40px (circular)

// Gradient Glow
size: 90px (10px larger)
colors: ['#3BC8A4', '#8E7CFF']
opacity: 0.25
blur: 12px

// Shadow
shadowColor: '#3BC8A4'
shadowOffset: { width: 0, height: 6 }
shadowOpacity: 0.25
shadowRadius: 12px

// Animation
- Entry: fade 800ms + scale spring
- Pulse: continuous loop, 1.0 → 1.06 → 1.0, 4s cycle
```

### Link
```typescript
// Text
font: Inter 500
size: 14px
color: #3BC8A4

// Touch Area
paddingVertical: 8px
hitSlop: 8px (all sides)

// States
- Default: teal color
- Pressed: opacity 0.7
```

### Divider
```typescript
// Dimensions
height: 1px
opacity: 0.3 (lighter)

// Color
background: #E3E6EA

// With Text
- Line opacity: 0.3
- Text: Inter 400, 12px, #666E75
- Spacing: 12px horizontal
```

---

## 📱 Screen Patterns

### Authentication Screens
```typescript
// Layout
paddingHorizontal: 24px
paddingTop: 60px

// Logo Section
marginBottom: 40px
alignment: center

// Form Section
gap: 16px (between inputs)
marginBottom: 24px (after last input)

// Button
marginTop: 24px

// Divider
marginVertical: 24px

// Social Buttons
gap: 12px (between buttons)
marginBottom: 24px

// Footer Links
marginBottom: 24px
alignment: center
```

---

## ♿ Accessibility

### Touch Targets
- **Minimum**: 44x44 pt (iOS), 48x48 dp (Android)
- **Links**: 32x32 pt minimum + 8px hit slop
- **Buttons**: 44x44 pt minimum

### Color Contrast
- **Text on white**: 4.5:1 minimum (WCAG AA)
- **Primary button text**: Always white (#FFFFFF)
- **Links**: #3BC8A4 with 500 weight (4.5:1 on white)

### Labels
- All buttons have `accessibilityLabel`
- All inputs have `accessibilityLabel`
- All links have `accessibilityRole="link"`

---

## 🌙 Dark Mode

### Color Mapping
| Light | Dark | Element |
|-------|------|---------|
| `#F8F9FB` | `#121417` | Background |
| `#FFFFFF` | `#1C1F24` | Surface |
| `#1B1B1B` | `#EAEAEA` | Text Primary |
| `#3BC8A4` | `#3BC8A4` | Primary (stays) |
| `#8E7CFF` | `#8E7CFF` | Accent (stays) |

### Adjustments
- Shadows: Reduce opacity by 50%
- Dividers: Increase opacity to 0.4
- Gradients: Keep luminous, no changes

---

## 📊 Grid System

### Breakpoints
| Size | Width | Columns | Gutter |
|------|-------|---------|--------|
| **Mobile** | < 375px | 4 | 16px |
| **Mobile L** | 375-414px | 4 | 24px |
| **Tablet** | 768px+ | 8 | 24px |
| **Desktop** | 1024px+ | 12 | 32px |

---

## 🎯 Design Tokens (Code)

```typescript
export const tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 60,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 40,
    pill: 24,
  },
  animation: {
    timing: {
      fast: 150,
      normal: 300,
      slow: 600,
      verySlow: 800,
    },
  },
};
```

---

## ✅ Quality Checklist

### Visual
- [ ] All colors from design system
- [ ] Typography weights correct (Poppins 600/500, Inter 400)
- [ ] Border radius consistent (12px)
- [ ] Shadows match elevation system
- [ ] Spacing uses tokens (no hardcoded values)

### Animation
- [ ] Input focus: 150ms border transition
- [ ] Button press: 0.98x scale spring
- [ ] Social buttons: 0.97x scale spring
- [ ] Logo: continuous pulse animation
- [ ] All animations use native driver

### Accessibility
- [ ] Touch targets ≥ 44x44 pt
- [ ] Color contrast ≥ 4.5:1
- [ ] All interactive elements have labels
- [ ] VoiceOver/TalkBack tested

### Polish
- [ ] Dividers at 0.3 opacity
- [ ] Gradient contrast enhanced (#5DE2D8)
- [ ] Button shadow: rgba(0,0,0,0.1)
- [ ] Typography hierarchy clear
- [ ] Dark mode ready

---

**Status**: App Store Ready ✅  
**Next**: Home screen, Store cards, AI chat interface
