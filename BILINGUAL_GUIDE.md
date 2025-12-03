# Bilingual Implementation Guide

## ✅ What's Done:
1. i18n infrastructure fully set up
2. Language context working
3. Language switcher in Settings
4. AI responds in both languages
5. All translations exist in `en.ts` and `ar.ts`

## 📝 How to Make Any Screen Bilingual:

### Step 1: Import the hook
```typescript
import { useLanguage } from '../contexts/LanguageContext';
```

### Step 2: Use in component
```typescript
const MyScreen = () => {
  const { t, language, isRTL } = useLanguage();
  
  return (
    <View>
      <Text>{t('home.welcome')}</Text>
      <Button>{t('common.save')}</Button>
    </View>
  );
};
```

### Step 3: Replace hardcoded text
**Before:**
```typescript
<Text>Welcome to SmartBite</Text>
```

**After:**
```typescript
<Text>{t('home.welcome')}</Text>
```

## 🗂️ Available Translation Keys:

All keys are in `src/i18n/locales/en.ts` and `src/i18n/locales/ar.ts`

### Common:
- `common.save`, `common.cancel`, `common.delete`, `common.edit`
- `common.loading`, `common.error`, `common.success`
- `common.search`, `common.filter`, `common.viewAll`

### Auth:
- `auth.login`, `auth.signup`, `auth.logout`
- `auth.email`, `auth.password`

### Home:
- `home.welcome`, `home.popularRestaurants`
- `home.nearYou`, `home.viewAll`

### Restaurant:
- `restaurant.menu`, `restaurant.reviews`, `restaurant.info`
- `restaurant.addToCart`, `restaurant.orderNow`

### Cart:
- `cart.title`, `cart.empty`, `cart.checkout`
- `cart.subtotal`, `cart.deliveryFee`, `cart.total`

### Orders:
- `orders.active`, `orders.past`, `orders.trackOrder`
- `orders.orderDetails`, `orders.reorder`

### Profile:
- `profile.title`, `profile.editProfile`, `profile.settings`
- `profile.favorites`, `profile.addresses`

### Settings:
- `settings.language`, `settings.darkMode`
- `settings.notifications`, `settings.privacy`

## 🎯 Screens Status:

### ✅ Done:
- Settings/Profile (language switcher)
- AI Chat (responds in both languages)

### 🔄 To Do:
- [ ] HomeScreen
- [ ] RestaurantDetailScreen
- [ ] CartScreen
- [ ] CheckoutScreen
- [ ] OrdersScreen
- [ ] PartnerDashboard
- [ ] Auth screens (Login/Signup)

## 💡 Tips:

1. **Use existing keys** - Check `en.ts` first before adding new ones
2. **Keep it simple** - Use `t('key')` for static text
3. **Dynamic content** - Use interpolation: `t('welcome', { name: userName })`
4. **RTL aware** - Use `isRTL` for layout adjustments
5. **Test both** - Always test in English AND Arabic

## 🚀 Quick Start:

1. Open any screen file
2. Add `import { useLanguage } from '../contexts/LanguageContext';`
3. Add `const { t } = useLanguage();` in component
4. Replace `"text"` with `{t('key')}`
5. Done!

## 📱 Testing:

1. Go to Profile → Language
2. Switch between English/Arabic
3. Navigate through app
4. All text should change instantly!

---

**Note:** The infrastructure is 100% ready. Just need to update individual screens to use `t()` instead of hardcoded text!
