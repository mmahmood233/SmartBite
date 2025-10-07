/**
 * English Translations
 * Complete translation keys for SmartBite app
 */

export default {
  // Common/Shared
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    add: 'Add',
    remove: 'Remove',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    apply: 'Apply',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    viewAll: 'View All',
    seeAll: 'See All',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    required: 'Required',
    optional: 'Optional',
    default: 'Default',
  },

  // Authentication
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    continueWithFacebook: 'Continue with Facebook',
    orContinueWith: 'Or continue with',
  },

  // Onboarding
  onboarding: {
    skip: 'Skip',
    getStarted: 'Get Started',
    slide1Title: 'Discover Restaurants',
    slide1Description: 'Find the best local restaurants and cuisines',
    slide2Title: 'Easy Ordering',
    slide2Description: 'Order your favorite food in just a few taps',
    slide3Title: 'Fast Delivery',
    slide3Description: 'Get your food delivered hot and fresh',
  },

  // Home Screen
  home: {
    title: 'Home',
    greeting: 'Hello',
    searchPlaceholder: 'Search for restaurants or dishes...',
    categories: 'Categories',
    popularRestaurants: 'Popular Restaurants',
    nearYou: 'Near You',
    offers: 'Offers',
    newRestaurants: 'New Restaurants',
  },

  // Restaurant Detail
  restaurant: {
    menu: 'Menu',
    info: 'Info',
    reviews: 'Reviews',
    rating: 'Rating',
    deliveryTime: 'Delivery Time',
    deliveryFee: 'Delivery Fee',
    minOrder: 'Minimum Order',
    openNow: 'Open Now',
    closed: 'Closed',
    opensAt: 'Opens at',
    closesAt: 'Closes at',
  },

  // Cart
  cart: {
    title: 'Cart',
    emptyCart: 'Your cart is empty',
    emptyCartMessage: 'Add items to get started',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    serviceFee: 'Service Fee',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    clearCart: 'Clear Cart',
    addMore: 'Add More Items',
  },

  // Checkout
  checkout: {
    title: 'Checkout',
    deliveryAddress: 'Delivery Address',
    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    deliveryInstructions: 'Delivery Instructions',
    placeOrder: 'Place Order',
    estimatedDelivery: 'Estimated Delivery',
  },

  // Orders
  orders: {
    title: 'Orders',
    active: 'Active',
    past: 'Past',
    orderNumber: 'Order',
    orderPlaced: 'Order Placed',
    preparing: 'Preparing',
    onTheWay: 'On the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    trackOrder: 'Track Order',
    reorder: 'Reorder',
    viewDetails: 'View Details',
    emptyOrders: 'No orders yet',
    emptyOrdersMessage: 'Start ordering to see your history',
  },

  // Profile
  profile: {
    title: 'Profile',
    myAccount: 'My Account',
    editProfile: 'Edit Profile',
    favorites: 'Favorites',
    savedAddresses: 'Saved Addresses',
    paymentMethods: 'Payment Methods',
    offers: 'Offers & Promotions',
    help: 'Help & Support',
    appPreferences: 'App Preferences',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    about: 'About',
    termsAndConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    logout: 'Logout',
  },

  // Favorites
  favorites: {
    title: 'Favorites',
    emptyFavorites: 'No favorites yet',
    emptyFavoritesMessage: 'Start adding your favorite restaurants to order again anytime!',
    browseRestaurants: 'Browse Restaurants',
    removeFavorite: 'Remove Favorite',
    removeFavoriteMessage: 'Remove {{name}} from your favorites?',
  },

  // Saved Addresses
  addresses: {
    title: 'Saved Addresses',
    addNewAddress: 'Add New Address',
    editAddress: 'Edit Address',
    deleteAddress: 'Delete Address',
    deleteAddressMessage: 'Remove {{title}} from your saved addresses?',
    setAsDefault: 'Set as Default',
    defaultAddress: 'Default Address',
    home: 'Home',
    work: 'Work',
    other: 'Other',
    addressTitle: 'Address Title',
    building: 'Building / Flat No.',
    road: 'Road',
    block: 'Block',
    area: 'Area',
    contactNumber: 'Contact Number',
    additionalNotes: 'Additional Notes',
    pickLocation: 'Pick Location on Map',
    saveAddress: 'Save Address',
    updateAddress: 'Update Address',
    addressSaved: 'Address saved successfully',
    addressUpdated: 'Address updated successfully',
    addressRemoved: 'Address removed',
    customTitlePlaceholder: 'Enter custom name (e.g., "Mom\'s House")',
  },

  // Payment Methods
  payment: {
    title: 'Payment Methods',
    addPaymentMethod: 'Add Payment Method',
    cardholderName: 'Cardholder Name',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    saveCard: 'Save Card',
    setAsDefault: 'Set as Default Payment Method',
    cardAdded: 'Card added successfully',
    removePayment: 'Remove Payment Method',
    removePaymentMessage: 'Remove {{label}} from your payment methods?',
    securityNotice: 'Your details are encrypted and stored securely',
    expires: 'Expires',
  },

  // Offers
  offers: {
    title: 'Offers & Promotions',
    activeOffers: 'Active Offers',
    savedCodes: 'Saved Promo Codes',
    pastOffers: 'Past Offers',
    enterPromoCode: 'Enter Promo Code',
    enterCodePlaceholder: 'Enter code here',
    apply: 'Apply',
    validUntil: 'Valid until',
    expired: 'Expired',
    offerApplied: 'Offer Applied',
    offerAppliedMessage: '{{title}} will be applied to your next order',
    promoApplied: 'Code "{{code}}" will be applied at checkout',
  },

  // Help & Support
  help: {
    title: 'Help & Support',
    weAreHere: 'We\'re here to help!',
    supportMessage: 'Our support team is available 24/7 to assist you with any questions or concerns.',
    needHelpWithOrder: 'Need help with an order?',
    viewOrders: 'View your orders and get help',
    chatWithSupport: 'Chat with Support',
    chatMessage: 'Get instant help from our team',
    callUs: 'Call Us',
    emailSupport: 'Email Support',
    faqs: 'FAQs',
    faqsMessage: 'Find answers to common questions',
    termsAndConditions: 'Terms & Conditions',
    termsMessage: 'Read our terms of service',
    privacyPolicy: 'Privacy Policy',
    privacyMessage: 'Learn how we protect your data',
    appVersion: 'Wajba v1.0.0',
  },

  // Validation Messages
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    invalidCard: 'Please enter a valid card number',
    invalidExpiry: 'Please enter a valid expiry date (MM/YY)',
    invalidCVV: 'Please enter a valid 3-digit CVV',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
  },

  // Toast Messages
  toast: {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },

  // Currency & Units
  units: {
    currency: 'BD',
    minutes: 'min',
    hours: 'hr',
    days: 'days',
    km: 'km',
    mi: 'mi',
  },
};
