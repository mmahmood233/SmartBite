# SmartBite Refactoring Guide

## 🎯 Quick Reference for Refactoring Screens

This guide shows you how to refactor any screen to use constants, utilities, and best practices.

---

## Step 1: Add Imports

### Before:
```typescript
import { colors } from '../theme/colors';
```

### After:
```typescript
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE, ICON_SIZE, AVATAR_SIZE } from '../constants';
import { formatCurrency, formatDate, getInitials, validateEmail } from '../utils';
```

---

## Step 2: Replace Magic Numbers

### Common Replacements:

| Old Value | New Constant | Usage |
|-----------|--------------|-------|
| `4` | `SPACING.xs` | Tiny spacing |
| `8` | `SPACING.sm` | Small spacing |
| `12` | `SPACING.md` | Medium spacing |
| `16` | `SPACING.lg` | Large spacing |
| `20` | `SPACING.xl` | Extra large spacing |
| `24` | `SPACING.xxl` | 2X large spacing |
| `32` | `SPACING.xxxl` | 3X large spacing |
| `40` | `SPACING.huge` | Huge spacing |

| Old Value | New Constant | Usage |
|-----------|--------------|-------|
| `8` | `BORDER_RADIUS.sm` | Small radius |
| `12` | `BORDER_RADIUS.md` | Medium radius |
| `16` | `BORDER_RADIUS.lg` | Large radius |
| `20` | `BORDER_RADIUS.xl` | Extra large radius |
| `50` | `BORDER_RADIUS.full` | Circular |

| Old Value | New Constant | Usage |
|-----------|--------------|-------|
| `11` | `FONT_SIZE.xs` | Extra small text |
| `12` | `FONT_SIZE.sm` | Small text |
| `14` | `FONT_SIZE.md` | Medium text |
| `15` | `FONT_SIZE.base` | Base text |
| `16` | `FONT_SIZE.lg` | Large text |
| `18` | `FONT_SIZE.xl` | Extra large text |
| `20` | `FONT_SIZE.xxl` | 2X large text |
| `24` | `FONT_SIZE.xxxl` | 3X large text |
| `28` | `FONT_SIZE.huge` | Huge text |

---

## Step 3: Replace Hardcoded Colors

### Common Color Replacements:

| Old Color | New Constant | Usage |
|-----------|--------------|-------|
| `'#F7F9FB'` | `colors.background` | App background |
| `'#FFFFFF'` | `colors.surface` | Card/surface background |
| `'#0F172A'` | `colors.textPrimary` | Primary text |
| `'#475569'` | `colors.textSecondary` | Secondary text |
| `'#94A3B8'` | `colors.textDisabled` | Disabled text |
| `'#E6E9EE'` | `colors.border` | Borders/dividers |
| `'#11897F'` | `colors.primary` | Primary brand color |
| `'#E25555'` | `colors.error` | Error messages |
| `'#21B26B'` | `colors.success` | Success messages |
| `'#FFB020'` | `colors.warning` | Warning messages |

### Gradient Colors:
```typescript
// Old:
colors={['#00A58E', '#00C4A3']}

// New:
colors={[colors.gradientStart, colors.gradientEnd]}
```

---

## Step 4: Use Utility Functions

### Format Functions:

```typescript
// Currency
formatCurrency(32.50) // "BD 32.50"

// Date
formatDate(new Date()) // "Oct 7, 2025"
formatDateTime(new Date()) // "Oct 7, 2025 at 3:30 PM"
formatTime(new Date()) // "3:30 PM"

// Text
getInitials('Ahmed Faisal') // "AF"
truncateText('Long text...', 20) // "Long text..."
capitalize('hello') // "Hello"

// Phone
formatPhone('+97333560803') // "+973 3356 0803"

// Order
formatOrderNumber('WAJ1234') // "#WAJ1234"

// Pluralization
pluralize(1, 'item') // "1 item"
pluralize(3, 'item') // "3 items"
```

### Validation Functions:

```typescript
// Email
if (!validateEmail(email)) {
  Alert.alert('Error', 'Invalid email');
  return;
}

// Phone
if (!validatePhone(phone)) {
  Alert.alert('Error', 'Invalid phone number');
  return;
}

// Required
if (!validateRequired(name)) {
  Alert.alert('Error', 'Name is required');
  return;
}

// Password
const result = validatePassword(password);
if (!result.isValid) {
  Alert.alert('Error', result.message);
  return;
}
```

---

## Step 5: Example Refactoring

### Before:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9EE',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11897F',
  },
});
```

### After:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  price: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: colors.primary,
  },
});
```

---

## Quick Find & Replace

Use your IDE's find & replace feature:

### Spacing:
- Find: `paddingHorizontal: 20` → Replace: `paddingHorizontal: SPACING.xl`
- Find: `marginBottom: 16` → Replace: `marginBottom: SPACING.lg`
- Find: `padding: 12` → Replace: `padding: SPACING.md`

### Colors:
- Find: `'#FFFFFF'` → Replace: `colors.surface`
- Find: `'#0F172A'` → Replace: `colors.textPrimary`
- Find: `'#E6E9EE'` → Replace: `colors.border`

### Font Sizes:
- Find: `fontSize: 14` → Replace: `fontSize: FONT_SIZE.md`
- Find: `fontSize: 16` → Replace: `fontSize: FONT_SIZE.lg`
- Find: `fontSize: 24` → Replace: `fontSize: FONT_SIZE.xxxl`

### Border Radius:
- Find: `borderRadius: 12` → Replace: `borderRadius: BORDER_RADIUS.md`
- Find: `borderRadius: 16` → Replace: `borderRadius: BORDER_RADIUS.lg`

---

## Checklist for Each Screen

- [ ] Add constants and utils imports
- [ ] Replace all magic numbers with SPACING constants
- [ ] Replace all hardcoded colors with colors.* 
- [ ] Replace all font sizes with FONT_SIZE constants
- [ ] Replace all border radius with BORDER_RADIUS constants
- [ ] Use utility functions for formatting
- [ ] Add validation where needed
- [ ] Remove duplicate helper functions
- [ ] Test the screen

---

## Benefits

✅ **100% consistency** across all screens
✅ **Easy to maintain** - change once, update everywhere
✅ **Type-safe** - TypeScript autocomplete
✅ **Professional** - enterprise-level code quality
✅ **Scalable** - ready for growth

---

## Need Help?

Refer to:
- `src/constants/index.ts` - All design tokens
- `src/utils/format.ts` - Formatting functions
- `src/utils/validation.ts` - Validation functions
- `src/utils/helpers.ts` - Helper functions
- `src/theme/colors.ts` - Color system
- `src/screens/EditProfileScreen.tsx` - Example refactored screen
- `src/screens/ProfileScreen.tsx` - Example refactored screen
