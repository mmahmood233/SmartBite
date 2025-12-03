# Complete Bilingual Implementation Plan

## 📊 Total Screens: 43

---

## ✅ COMPLETED (1 screen):
1. ProfileScreen ✅

---

## 🔄 TO DO (42 screens):

### **BATCH 1: User Auth & Onboarding (3 screens)**
1. LoginScreen
2. SignupScreen  
3. OnboardingScreen
4. SplashScreen

### **BATCH 2: User Home & Restaurant (4 screens)**
5. HomeScreen (partially done - needs full text replacement)
6. AllRestaurantsScreen
7. RestaurantDetailScreen
8. DishDetailModal

### **BATCH 3: User Cart & Checkout (4 screens)**
9. CartScreen
10. CheckoutScreen
11. PaymentScreen
12. BenefitPayScreen

### **BATCH 4: User Orders (5 screens)**
13. OrdersScreen
14. OrderDetailsScreen
15. OrderTrackingScreen
16. OrderConfirmationScreen
17. DeliveryCompleteScreen

### **BATCH 5: User Profile & Settings (9 screens)**
18. EditProfileScreen
19. FavoritesScreen
20. SavedAddressesScreen
21. AddAddressScreen
22. EditAddressScreen
23. PaymentMethodsScreen
24. AddPaymentMethodScreen
25. OffersScreen
26. HelpSupportScreen
27. PickLocationScreen
28. AIChatScreen

### **BATCH 6: Partner Portal (7 screens)**
29. OverviewDashboard
30. LiveOrdersScreen
31. MenuManagementScreen
32. OrderDetailsScreen (partner)
33. EditBusinessInfoScreen
34. PartnerMoreScreen
35. PartnerAIChatScreen

### **BATCH 7: Admin Portal (6 screens)**
36. AdminDashboardScreen
37. RestaurantsManagementScreen
38. CategoriesManagementScreen
39. PromotionsManagementScreen
40. AddPromotionScreen
41. AdminSettingsScreen

### **BATCH 8: Shared (1 screen)**
42. ChangePasswordScreen

---

## 🎯 Implementation Strategy:

For each screen:
1. ✅ Add `import { useLanguage } from '../../../contexts/LanguageContext';`
2. ✅ Add `const { t } = useLanguage();` in component
3. ✅ Replace ALL hardcoded text with `t('key')` calls
4. ✅ Verify translation keys exist in both `en.ts` and `ar.ts`

---

## 📝 Progress Tracking:
- Total: 43 screens
- Completed: 1
- Remaining: 42
- Target: 100% bilingual coverage
