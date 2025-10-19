# Wajba Partner Portal Documentation

## 📱 Overview
The Partner Portal is a professional restaurant management interface for Wajba partners to manage orders, menus, and business operations.

## 🎨 Design Philosophy
- **Talabat-level Quality**: Professional, polished UI matching industry standards
- **Consistency**: Unified design language across all screens
- **Efficiency**: Optimized layouts with minimal white space
- **Accessibility**: Clear typography, proper contrast, easy-to-tap targets

## 📂 Structure

```
src/
├── screens/partner/
│   ├── LiveOrdersScreen.tsx      # Real-time order management
│   ├── OverviewScreen.tsx        # Dashboard & analytics
│   ├── MenuManagementScreen.tsx  # Menu & category management
│   └── README.md                 # This file
├── components/partner/
│   ├── PartnerTopNav.tsx         # Shared navigation component
│   └── PartnerButton.tsx         # Reusable button component
└── constants/
    ├── partnerTheme.ts           # Theme constants & colors
    └── partnerStrings.ts         # Localization strings
```

## 🎨 Theme System

### Colors
All colors are centralized in `partnerTheme.ts`:

```typescript
import { PartnerColors } from '../../constants/partnerTheme';

// Primary brand color
PartnerColors.primary // #00A896 (Teal)

// Status colors
PartnerColors.success // #3EB489
PartnerColors.warning // #FFB703
PartnerColors.error   // #E53935
```

### Spacing
Use consistent spacing values:

```typescript
import { PartnerSpacing } from '../../constants/partnerTheme';

paddingHorizontal: PartnerSpacing.xl, // 20px
paddingVertical: PartnerSpacing.sm,   // 8px
```

### Typography
Standardized font sizes and weights:

```typescript
import { PartnerTypography } from '../../constants/partnerTheme';

fontSize: PartnerTypography.fontSize.lg,        // 15px
fontWeight: PartnerTypography.fontWeight.bold,  // '700'
```

## 🌍 Localization

All text strings are in `partnerStrings.ts`:

```typescript
import { getStrings } from '../../constants/partnerStrings';

const strings = getStrings('en'); // or 'ar' for Arabic
<Text>{strings.menu.actions.addItem}</Text>
```

### Adding New Strings
1. Add to English section in `partnerStrings.ts`
2. Add corresponding Arabic translation
3. Use `getStrings()` to access

## 🎯 Components

### PartnerTopNav
Shared navigation bar across all screens.

```typescript
<PartnerTopNav
  title="Menu"
  showBranding={true}
  showDropdown={false}
  showNotification={true}
  hasNotification={true}
/>
```

**Props:**
- `title`: Screen title
- `showBranding`: Show Wajba logo + profile avatar
- `showDropdown`: Show dropdown arrow next to title
- `showNotification`: Show notification bell
- `hasNotification`: Show red dot on notification bell

### PartnerButton
Reusable button with multiple variants.

```typescript
<PartnerButton
  title="Add Item"
  onPress={handleAdd}
  variant="primary"
  size="md"
  icon="plus"
  iconPosition="left"
/>
```

**Variants:**
- `primary`: Teal gradient (default)
- `secondary`: Amber gradient
- `outline`: White with teal border
- `ghost`: Transparent with teal text
- `danger`: Red background

**Sizes:**
- `sm`: 36px height
- `md`: 42px height (default)
- `lg`: 44px height

## 🌙 Dark Mode Support

Theme system is ready for dark mode:

```typescript
import { getThemeColors } from '../../constants/partnerTheme';

const isDark = false; // Get from user settings
const colors = getThemeColors(isDark);

backgroundColor: colors.background,
color: colors.text.primary,
```

## 📐 Layout Guidelines

### Spacing Standards
- **Category chips to search bar**: 8px gap
- **Search bar to content**: 8px gap
- **Card padding**: 12px
- **Card margins**: 16px horizontal, 4px vertical
- **Button height**: 44px (optimal tap target)

### Component Heights
- **Top navigation**: Dynamic (safe area + 8px padding)
- **Category chips**: 36px
- **Search bar**: 44px
- **Menu item cards**: Auto (min 72px)
- **Action bar**: 60px

### Border Radius
- **Cards**: 12px
- **Buttons**: 12px
- **Inputs**: 10px
- **Chips**: 20px (pill shape)

## 🔄 State Management

Currently using React `useState` hooks. For future expansion:

```typescript
// Consider migrating to:
// - Redux Toolkit (complex state)
// - Zustand (lightweight alternative)
// - React Query (server state)
```

## 🚀 Future Enhancements

### Planned Features
1. **Dark Mode**: Toggle in settings
2. **Multi-language**: Full Arabic support
3. **Offline Mode**: Cache critical data
4. **Push Notifications**: Real-time order alerts
5. **Analytics**: Advanced reporting
6. **Inventory Management**: Stock tracking

### Code Improvements
1. **TypeScript Strict Mode**: Enable strict type checking
2. **Unit Tests**: Add Jest + React Native Testing Library
3. **E2E Tests**: Add Detox for integration tests
4. **Performance**: Optimize re-renders with React.memo
5. **Accessibility**: Add screen reader support

## 📝 Best Practices

### Component Creation
```typescript
// ✅ Good: Reusable, typed, documented
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

/**
 * MyComponent - Brief description
 * @param title - Component title
 * @param onPress - Callback function
 */
const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Implementation
};
```

### Styling
```typescript
// ✅ Good: Use theme constants
import { PartnerColors, PartnerSpacing } from '../../constants/partnerTheme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: PartnerColors.light.background,
    padding: PartnerSpacing.lg,
  },
});

// ❌ Bad: Hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF9',
    padding: 16,
  },
});
```

### Localization
```typescript
// ✅ Good: Use string constants
import { getStrings } from '../../constants/partnerStrings';
const strings = getStrings('en');

<Text>{strings.menu.actions.addItem}</Text>

// ❌ Bad: Hardcoded strings
<Text>Add Item</Text>
```

## 🐛 Troubleshooting

### Common Issues

**Issue: Large empty space between sections**
- Check `paddingTop/Bottom` values
- Ensure `flexGrow: 0` on horizontal ScrollViews
- Add `maxHeight` constraints where needed

**Issue: Inconsistent colors**
- Always use `PartnerColors` from theme
- Never hardcode hex values

**Issue: Text not translating**
- Verify string exists in `partnerStrings.ts`
- Check language code is correct ('en' or 'ar')

## 📞 Support

For questions or issues:
1. Check this README
2. Review theme constants
3. Examine existing components for patterns
4. Consult design specifications

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainer**: SmartBite Team
