# 🌍 SmartBite Localization Guide

## Overview
SmartBite is prepared for internationalization (i18n) with support for English and Arabic. The app structure is ready for full localization implementation.

## Current Status
✅ **Prepared** - Translation structure is in place
⏳ **Not Implemented** - i18next library not yet installed
🎯 **Ready for Implementation** - Minimal changes needed to activate

---

## File Structure

```
src/
├── i18n/
│   ├── index.ts              # i18n configuration
│   └── locales/
│       ├── en.ts             # English translations
│       └── ar.ts             # Arabic translations
├── hooks/
│   └── useTranslation.ts     # Custom translation hook
```

---

## How to Use (Current Setup)

### 1. Import the Hook
```typescript
import { useTranslation } from '../hooks/useTranslation';
```

### 2. Use in Component
```typescript
const MyComponent = () => {
  const { t, changeLanguage, currentLanguage, isRTL } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.save')}</Text>
      <Text>{t('profile.title')}</Text>
      <Text>{t('favorites.removeFavoriteMessage', { name: 'Al Qariah' })}</Text>
    </View>
  );
};
```

### 3. Change Language
```typescript
changeLanguage('ar'); // Switch to Arabic
changeLanguage('en'); // Switch to English
```

### 4. Check RTL
```typescript
if (isRTL) {
  // Apply RTL-specific styling
}
```

---

## Translation Keys Structure

All translations are organized by feature:

- **common** - Shared buttons, labels, messages
- **auth** - Authentication screens
- **onboarding** - Onboarding slides
- **home** - Home screen
- **restaurant** - Restaurant details
- **cart** - Shopping cart
- **checkout** - Checkout process
- **orders** - Order history
- **profile** - User profile
- **favorites** - Favorites list
- **addresses** - Address management
- **payment** - Payment methods
- **offers** - Offers & promotions
- **help** - Help & support
- **validation** - Form validation messages
- **toast** - Toast notifications
- **units** - Currency & measurement units

---

## How to Activate Full i18n (Future)

### Step 1: Install Dependencies
```bash
npm install i18next react-i18next
npm install @react-native-async-storage/async-storage
```

### Step 2: Uncomment i18next Configuration
In `src/i18n/index.ts`, uncomment the i18next configuration block at the bottom.

### Step 3: Add RTL Support
```typescript
import { I18nManager } from 'react-native';

// Enable RTL when Arabic is selected
if (currentLanguage === 'ar') {
  I18nManager.forceRTL(true);
} else {
  I18nManager.forceRTL(false);
}
```

### Step 4: Persist Language Preference
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save language
await AsyncStorage.setItem('language', 'ar');

// Load language on app start
const savedLanguage = await AsyncStorage.getItem('language');
if (savedLanguage) {
  changeLanguage(savedLanguage as 'en' | 'ar');
}
```

### Step 5: Update ProfileScreen Language Selector
Connect the language selector in ProfileScreen to actually change the language:

```typescript
const handleLanguageSelect = (language: string) => {
  changeLanguage(language as 'en' | 'ar');
  // Optionally restart app for RTL changes
};
```

---

## Adding New Translations

### 1. Add to English File (`en.ts`)
```typescript
export default {
  myNewFeature: {
    title: 'My Feature',
    description: 'This is a new feature',
  },
};
```

### 2. Add to Arabic File (`ar.ts`)
```typescript
export default {
  myNewFeature: {
    title: 'ميزتي',
    description: 'هذه ميزة جديدة',
  },
};
```

### 3. Use in Component
```typescript
<Text>{t('myNewFeature.title')}</Text>
```

---

## RTL Considerations

When implementing Arabic (RTL):

### 1. Layout Direction
```typescript
<View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
```

### 2. Text Alignment
```typescript
<Text style={{ textAlign: isRTL ? 'right' : 'left' }}>
```

### 3. Icons
Some icons may need to be flipped for RTL:
```typescript
<Icon 
  name="arrow-left" 
  style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
/>
```

### 4. Margins & Padding
Use `marginStart`/`marginEnd` instead of `marginLeft`/`marginRight`:
```typescript
{
  marginStart: 16, // Automatically becomes marginRight in RTL
  marginEnd: 8,    // Automatically becomes marginLeft in RTL
}
```

---

## Translation Key Examples

### Common Usage
```typescript
t('common.save')              // "Save"
t('common.cancel')            // "Cancel"
t('common.delete')            // "Delete"
```

### With Parameters
```typescript
t('favorites.removeFavoriteMessage', { name: 'Al Qariah' })
// "Remove Al Qariah from your favorites?"
```

### Nested Keys
```typescript
t('profile.myAccount')        // "My Account"
t('addresses.addNewAddress')  // "Add New Address"
t('payment.cardAdded')        // "Card added successfully"
```

---

## Best Practices

### ✅ DO:
- Use translation keys for ALL user-facing text
- Keep keys organized by feature
- Use descriptive key names
- Add parameters for dynamic content
- Test both languages regularly

### ❌ DON'T:
- Hardcode strings in components
- Use generic keys like `text1`, `text2`
- Forget to add translations to both files
- Assume text length will be the same
- Ignore RTL layout requirements

---

## Testing Translations

### 1. Switch Language
```typescript
changeLanguage('ar');
// Navigate through app to test Arabic
```

### 2. Check RTL Layout
```typescript
if (isRTL) {
  console.log('RTL mode active');
}
```

### 3. Verify All Screens
- [ ] Authentication screens
- [ ] Onboarding
- [ ] Home screen
- [ ] Restaurant details
- [ ] Cart & Checkout
- [ ] Orders
- [ ] Profile & Settings
- [ ] All modals & alerts

---

## Current Translation Coverage

✅ **Complete Coverage:**
- All screens have translation keys defined
- Both English and Arabic translations provided
- Common phrases centralized
- Validation messages included
- Toast messages ready

🎯 **Ready for:**
- i18next integration
- RTL layout implementation
- Language persistence
- Dynamic language switching

---

## Support

For questions or issues with localization:
1. Check this documentation
2. Review `src/i18n/` files
3. Test with `useTranslation` hook
4. Verify translation keys exist in both language files

---

## Future Enhancements

- [ ] Add more languages (French, Hindi, etc.)
- [ ] Implement language detection based on device settings
- [ ] Add pluralization support
- [ ] Add date/time localization
- [ ] Add number formatting per locale
- [ ] Add currency formatting per region

---

**Last Updated:** 2025-10-07  
**Version:** 1.0.0  
**Status:** Ready for Implementation
