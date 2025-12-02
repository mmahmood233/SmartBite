import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// User Portal - Onboarding
import SplashScreen from '../screens/user/onboarding/SplashScreen';
import OnboardingScreen from '../screens/user/onboarding/OnboardingScreen';

// User Portal - Restaurant & Home
import RestaurantDetailScreen from '../screens/user/restaurant/RestaurantDetailScreen';
import AllRestaurantsScreen from '../screens/user/restaurant/AllRestaurantsScreen';

// User Portal - Cart & Checkout
import CartScreen from '../screens/user/cart/CartScreen';
import CheckoutScreen from '../screens/user/cart/CheckoutScreen';
import PaymentScreen from '../screens/user/checkout/PaymentScreen';
import BenefitPayScreen from '../screens/user/checkout/BenefitPayScreen';

// User Portal - Orders
import OrderConfirmationScreen from '../screens/user/orders/OrderConfirmationScreen';
import OrderTrackingScreen from '../screens/user/orders/OrderTrackingScreen';
import DeliveryCompleteScreen from '../screens/user/orders/DeliveryCompleteScreen';
import OrderDetailsScreen from '../screens/user/orders/OrderDetailsScreen';

// Partner Portal - Screens
import PartnerOrderDetailsScreen from '../screens/partner/OrderDetailsScreen';

// Admin Portal - Screens
import AddPromotionScreen from '../screens/admin/AddPromotionScreen';

// User Portal - Profile
import EditProfileScreen from '../screens/user/profile/EditProfileScreen';
import FavoritesScreen from '../screens/user/profile/FavoritesScreen';
import SavedAddressesScreen from '../screens/user/profile/SavedAddressesScreen';
import PaymentMethodsScreen from '../screens/user/profile/PaymentMethodsScreen';
import OffersScreen from '../screens/user/profile/OffersScreen';
import HelpSupportScreen from '../screens/user/profile/HelpSupportScreen';
import AddAddressScreen from '../screens/user/profile/AddAddressScreen';
import EditAddressScreen from '../screens/user/profile/EditAddressScreen';
import PickLocationScreen from '../screens/user/profile/PickLocationScreen';
import AddPaymentMethodScreen from '../screens/user/profile/AddPaymentMethodScreen';
import ChangePasswordScreen from '../screens/shared/ChangePasswordScreen';
import AIChatScreen from '../screens/user/profile/AIChatScreen';

// Navigators
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import PartnerTabNavigator from './PartnerTabNavigator';
import AdminTabNavigator from './AdminTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Wajba Root Navigator
 * Flow: Splash → Onboarding → Auth (Login/Signup) → Home → RestaurantDetail
 */
const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="AllRestaurants" component={AllRestaurantsScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BenefitPay" component={BenefitPayScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="DeliveryComplete" component={DeliveryCompleteScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
      <Stack.Screen name="PickLocation" component={PickLocationScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="PartnerPortal" component={PartnerTabNavigator} />
      <Stack.Screen name="PartnerOrderDetails" component={PartnerOrderDetailsScreen} />
      <Stack.Screen name="AdminPortal" component={AdminTabNavigator} />
      <Stack.Screen name="AddPromotion" component={AddPromotionScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
