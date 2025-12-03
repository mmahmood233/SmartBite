# Translation Completion Guide

## ✅ Translation Keys Added

All necessary translation keys have been added to both `en.ts` and `ar.ts`:

### New Keys Added:
- **Home Screen**: `quickCoffeeBreak`, `browseAllRestaurants`, `talkToWajbaAI`, `curatedByWajbaAI`, `tryAsking`, `trendingRestaurants`, `discoverTrending`, `noFeaturedRestaurants`
- **Orders**: `orderDetails`, `inProgress`, `contactSupport`, `itemsOrdered`, `deliveryInformation`, `deliveryAddress`, `getHelp`, `items`
- **Navigation**: `home`, `aiChat`, `cart`, `orders`, `profile`
- **AI Chat**: `title`, `subtitle`, `placeholder`, `greeting`, `welcomeMessage`, `quickPrompt1`, `quickPrompt2`

## 📋 Screens That Need Translation Updates

### Priority 1: Visible in Screenshots
1. **OrderDetailsScreen** (`src/screens/user/orders/OrderDetailsScreen.tsx`)
2. **HomeScreen** (`src/screens/user/restaurant/HomeScreen.tsx`)
3. **AIChatScreen** (`src/screens/user/profile/AIChatScreen.tsx`)
4. **Bottom Navigation** (Tab Navigator)

### How to Use Translation Keys:

```typescript
// Example for OrderDetailsScreen
<Text>{t('orders.orderDetails')}</Text>
<Text>{t('orders.inProgress')}</Text>
<TouchableOpacity><Text>{t('orders.trackOrder')}</Text></TouchableOpacity>
<TouchableOpacity><Text>{t('orders.contactSupport')}</Text></TouchableOpacity>
<Text>{t('orders.itemsOrdered')}</Text>
<Text>{t('orders.deliveryInformation')}</Text>
<Text>{t('orders.deliveryAddress')}</Text>
<TouchableOpacity><Text>{t('orders.reorder')}</Text></TouchableOpacity>
<TouchableOpacity><Text>{t('orders.getHelp')}</Text></TouchableOpacity>

// Example for HomeScreen
<Text>{t('home.quickCoffeeBreak')}</Text>
<TouchableOpacity><Text>{t('home.browseAllRestaurants')}</Text></TouchableOpacity>
<TouchableOpacity><Text>{t('home.talkToWajbaAI')}</Text></TouchableOpacity>
<Text>{t('home.curatedByWajbaAI')}</Text>
<Text>{t('home.tryAsking')}</Text>
<Text>{t('home.trendingRestaurants')}</Text>
<Text>{t('home.discoverTrending')}</Text>
<Text>{t('home.noFeaturedRestaurants')}</Text>

// Example for AIChatScreen
<Text>{t('ai.title')}</Text>
<Text>{t('ai.subtitle')}</Text>
<TextInput placeholder={t('ai.placeholder')} />
<Text>{t('ai.greeting')}</Text>
<Text>{t('ai.welcomeMessage')}</Text>
<Text>{t('ai.quickPrompt1')}</Text>
<Text>{t('ai.quickPrompt2')}</Text>

// Example for Bottom Navigation
<Tab.Screen name="Home" options={{ title: t('navigation.home') }} />
<Tab.Screen name="AIChat" options={{ title: t('navigation.aiChat') }} />
<Tab.Screen name="Cart" options={{ title: t('navigation.cart') }} />
<Tab.Screen name="Orders" options={{ title: t('navigation.orders') }} />
<Tab.Screen name="Profile" options={{ title: t('navigation.profile') }} />
```

## ✅ Status

- [x] Translation keys added to `en.ts`
- [x] Translation keys added to `ar.ts`
- [ ] Apply translations to OrderDetailsScreen
- [ ] Apply translations to HomeScreen  
- [ ] Apply translations to AIChatScreen
- [ ] Apply translations to Bottom Navigation

## 🎯 Next Steps

Run the app and test language switching to verify all translations work correctly!
