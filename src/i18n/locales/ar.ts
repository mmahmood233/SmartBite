/**
 * Arabic Translations (Placeholder)
 * To be filled with actual Arabic translations
 * 
 * Note: All keys match the English version
 * RTL support will be handled by the app when Arabic is selected
 */

export default {
  // Common/Shared
  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    update: 'تحديث',
    add: 'إضافة',
    remove: 'إزالة',
    close: 'إغلاق',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    done: 'تم',
    apply: 'تطبيق',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    viewAll: 'عرض الكل',
    seeAll: 'مشاهدة الكل',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    required: 'مطلوب',
    optional: 'اختياري',
    default: 'افتراضي',
  },

  // Authentication
  auth: {
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    continueWithGoogle: 'المتابعة مع جوجل',
    continueWithApple: 'المتابعة مع أبل',
    continueWithFacebook: 'المتابعة مع فيسبوك',
    orContinueWith: 'أو المتابعة مع',
  },

  // Onboarding
  onboarding: {
    skip: 'تخطي',
    getStarted: 'ابدأ الآن',
    slide1Title: 'اكتشف المطاعم',
    slide1Description: 'ابحث عن أفضل المطاعم والمأكولات المحلية',
    slide2Title: 'طلب سهل',
    slide2Description: 'اطلب طعامك المفضل ببضع نقرات',
    slide3Title: 'توصيل سريع',
    slide3Description: 'احصل على طعامك ساخناً وطازجاً',
  },

  // Home Screen
  home: {
    title: 'الرئيسية',
    greeting: 'مرحباً',
    searchPlaceholder: 'ابحث عن مطاعم أو أطباق...',
    categories: 'الفئات',
    popularRestaurants: 'المطاعم الشهيرة',
    nearYou: 'بالقرب منك',
    offers: 'العروض',
    newRestaurants: 'مطاعم جديدة',
  },

  // Restaurant Detail
  restaurant: {
    menu: 'القائمة',
    info: 'معلومات',
    reviews: 'التقييمات',
    rating: 'التقييم',
    deliveryTime: 'وقت التوصيل',
    deliveryFee: 'رسوم التوصيل',
    minOrder: 'الحد الأدنى للطلب',
    openNow: 'مفتوح الآن',
    closed: 'مغلق',
    opensAt: 'يفتح في',
    closesAt: 'يغلق في',
  },

  // Cart
  cart: {
    title: 'السلة',
    emptyCart: 'سلتك فارغة',
    emptyCartMessage: 'أضف عناصر للبدء',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم التوصيل',
    serviceFee: 'رسوم الخدمة',
    total: 'الإجمالي',
    proceedToCheckout: 'المتابعة للدفع',
    clearCart: 'إفراغ السلة',
    addMore: 'إضافة المزيد',
  },

  // Checkout
  checkout: {
    title: 'الدفع',
    deliveryAddress: 'عنوان التوصيل',
    paymentMethod: 'طريقة الدفع',
    orderSummary: 'ملخص الطلب',
    deliveryInstructions: 'تعليمات التوصيل',
    placeOrder: 'تأكيد الطلب',
    estimatedDelivery: 'التوصيل المتوقع',
  },

  // Orders
  orders: {
    title: 'الطلبات',
    active: 'نشط',
    past: 'السابقة',
    orderNumber: 'طلب',
    orderPlaced: 'تم الطلب',
    preparing: 'قيد التحضير',
    onTheWay: 'في الطريق',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    trackOrder: 'تتبع الطلب',
    reorder: 'إعادة الطلب',
    viewDetails: 'عرض التفاصيل',
    emptyOrders: 'لا توجد طلبات بعد',
    emptyOrdersMessage: 'ابدأ الطلب لرؤية سجلك',
  },

  // Profile
  profile: {
    title: 'الملف الشخصي',
    myAccount: 'حسابي',
    editProfile: 'تعديل الملف الشخصي',
    favorites: 'المفضلة',
    savedAddresses: 'العناوين المحفوظة',
    paymentMethods: 'طرق الدفع',
    offers: 'العروض والترويجات',
    help: 'المساعدة والدعم',
    appPreferences: 'تفضيلات التطبيق',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    notifications: 'الإشعارات',
    about: 'حول',
    termsAndConditions: 'الشروط والأحكام',
    privacyPolicy: 'سياسة الخصوصية',
    logout: 'تسجيل الخروج',
  },

  // Favorites
  favorites: {
    title: 'المفضلة',
    emptyFavorites: 'لا توجد مفضلات بعد',
    emptyFavoritesMessage: 'ابدأ بإضافة مطاعمك المفضلة للطلب مرة أخرى في أي وقت!',
    browseRestaurants: 'تصفح المطاعم',
    removeFavorite: 'إزالة من المفضلة',
    removeFavoriteMessage: 'إزالة {{name}} من مفضلاتك؟',
  },

  // Saved Addresses
  addresses: {
    title: 'العناوين المحفوظة',
    addNewAddress: 'إضافة عنوان جديد',
    editAddress: 'تعديل العنوان',
    deleteAddress: 'حذف العنوان',
    deleteAddressMessage: 'إزالة {{title}} من عناوينك المحفوظة؟',
    setAsDefault: 'تعيين كافتراضي',
    defaultAddress: 'العنوان الافتراضي',
    home: 'المنزل',
    work: 'العمل',
    other: 'أخرى',
    addressTitle: 'عنوان العنوان',
    building: 'رقم المبنى / الشقة',
    road: 'الطريق',
    block: 'المجمع',
    area: 'المنطقة',
    contactNumber: 'رقم الاتصال',
    additionalNotes: 'ملاحظات إضافية',
    pickLocation: 'اختر الموقع على الخريطة',
    saveAddress: 'حفظ العنوان',
    updateAddress: 'تحديث العنوان',
    addressSaved: 'تم حفظ العنوان بنجاح',
    addressUpdated: 'تم تحديث العنوان بنجاح',
    addressRemoved: 'تم إزالة العنوان',
    customTitlePlaceholder: 'أدخل اسماً مخصصاً (مثل "بيت أمي")',
  },

  // Payment Methods
  payment: {
    title: 'طرق الدفع',
    addPaymentMethod: 'إضافة طريقة دفع',
    cardholderName: 'اسم حامل البطاقة',
    cardNumber: 'رقم البطاقة',
    expiryDate: 'تاريخ الانتهاء',
    cvv: 'رمز الأمان',
    saveCard: 'حفظ البطاقة',
    setAsDefault: 'تعيين كطريقة دفع افتراضية',
    cardAdded: 'تمت إضافة البطاقة بنجاح',
    removePayment: 'إزالة طريقة الدفع',
    removePaymentMessage: 'إزالة {{label}} من طرق الدفع الخاصة بك؟',
    securityNotice: 'تفاصيلك مشفرة ومحفوظة بشكل آمن',
    expires: 'تنتهي في',
  },

  // Offers
  offers: {
    title: 'العروض والترويجات',
    activeOffers: 'العروض النشطة',
    savedCodes: 'رموز الخصم المحفوظة',
    pastOffers: 'العروض السابقة',
    enterPromoCode: 'أدخل رمز الخصم',
    enterCodePlaceholder: 'أدخل الرمز هنا',
    apply: 'تطبيق',
    validUntil: 'صالح حتى',
    expired: 'منتهي',
    offerApplied: 'تم تطبيق العرض',
    offerAppliedMessage: 'سيتم تطبيق {{title}} على طلبك التالي',
    promoApplied: 'سيتم تطبيق الرمز "{{code}}" عند الدفع',
  },

  // Help & Support
  help: {
    title: 'المساعدة والدعم',
    weAreHere: 'نحن هنا للمساعدة!',
    supportMessage: 'فريق الدعم لدينا متاح على مدار الساعة لمساعدتك في أي أسئلة أو مخاوف.',
    needHelpWithOrder: 'تحتاج مساعدة في طلب؟',
    viewOrders: 'عرض طلباتك والحصول على المساعدة',
    chatWithSupport: 'الدردشة مع الدعم',
    chatMessage: 'احصل على مساعدة فورية من فريقنا',
    callUs: 'اتصل بنا',
    emailSupport: 'دعم البريد الإلكتروني',
    faqs: 'الأسئلة الشائعة',
    faqsMessage: 'ابحث عن إجابات للأسئلة الشائعة',
    termsAndConditions: 'الشروط والأحكام',
    termsMessage: 'اقرأ شروط الخدمة الخاصة بنا',
    privacyPolicy: 'سياسة الخصوصية',
    privacyMessage: 'تعرف على كيفية حماية بياناتك',
    appVersion: 'وجبة الإصدار 1.0.0',
  },

  // Validation Messages
  validation: {
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    invalidPhone: 'يرجى إدخال رقم هاتف صالح',
    invalidCard: 'يرجى إدخال رقم بطاقة صالح',
    invalidExpiry: 'يرجى إدخال تاريخ انتهاء صالح (MM/YY)',
    invalidCVV: 'يرجى إدخال رمز أمان صالح مكون من 3 أرقام',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
  },

  // Toast Messages
  toast: {
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
  },

  // Currency & Units
  units: {
    currency: 'د.ب',
    minutes: 'دقيقة',
    hours: 'ساعة',
    days: 'أيام',
    km: 'كم',
    mi: 'ميل',
  },
};
