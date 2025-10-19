/**
 * Wajba Partner Portal - Localization Strings
 * Centralized text content for easy translation
 * Supports English and Arabic (future expansion)
 */

export const PartnerStrings = {
  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      done: 'Done',
    },
    
    // Navigation
    nav: {
      liveOrders: 'Orders',
      overview: 'Overview',
      menu: 'Menu',
      more: 'More',
    },
    
    // Orders Screen
    liveOrders: {
      title: 'Orders',
      filters: {
        all: 'All',
        new: 'New',
        preparing: 'Preparing',
        ready: 'Ready for Pickup',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      sections: {
        newOrders: 'New Orders',
        activeOrders: 'Active Orders',
      },
      actions: {
        accept: 'Accept',
        reject: 'Reject',
        markReady: 'Mark Ready',
        markCompleted: 'Mark Completed',
        viewAll: 'View All',
      },
      labels: {
        customer: 'Customer',
        items: 'items',
        expiresIn: 'Expires in',
        preparing: 'Preparing',
      },
    },
    
    // Menu Management Screen
    menu: {
      title: 'Menu',
      search: 'Search menu items...',
      categories: {
        all: 'All',
        starters: 'Starters',
        mains: 'Mains',
        desserts: 'Desserts',
        beverages: 'Beverages',
        addCategory: 'Category',
      },
      actions: {
        addItem: 'Add Item',
        manageCategories: 'Manage Categories',
        edit: 'Edit',
        markUnavailable: 'Mark Unavailable',
        markAvailable: 'Mark Available',
      },
      labels: {
        active: 'Active',
        inactive: 'Inactive',
        popular: 'Popular',
        price: 'BD',
      },
      modals: {
        addItem: 'Add Menu Item',
        editItem: 'Edit Menu Item',
        addCategory: 'Add Category',
        manageCategories: 'Manage Categories',
      },
      form: {
        itemName: 'Item Name',
        description: 'Description',
        price: 'Price (BD)',
        category: 'Category',
        categoryName: 'Category Name',
        status: 'Status',
      },
      empty: {
        title: 'No items found',
        searchMessage: 'Try a different search term',
        emptyMessage: 'Start by adding your first dish!',
      },
      confirmations: {
        deleteItem: 'Are you sure you want to delete this item?',
        deleteCategory: 'Are you sure you want to delete this category?',
      },
    },
    
    // Overview Screen
    overview: {
      title: 'Overview',
      greeting: 'Welcome back',
      stats: {
        todayOrders: "Today's Orders",
        revenue: 'Revenue',
        avgOrderValue: 'Avg Order Value',
        activeItems: 'Active Items',
      },
      quickActions: {
        title: 'Quick Actions',
        viewOrders: 'View Orders',
        updateMenu: 'Update Menu',
        viewReports: 'View Reports',
      },
    },
  },
  
  // Arabic translations (future)
  ar: {
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث',
      filter: 'تصفية',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      confirm: 'تأكيد',
      back: 'رجوع',
      next: 'التالي',
      done: 'تم',
    },
    nav: {
      liveOrders: 'الطلبات',
      overview: 'نظرة عامة',
      menu: 'القائمة',
      more: 'المزيد',
    },
    // ... Add more Arabic translations as needed
  },
};

/**
 * Get localized strings based on current language
 * @param lang - Language code ('en' or 'ar')
 */
export const getStrings = (lang: 'en' | 'ar' = 'en') => {
  // Always return English structure for now (Arabic translations incomplete)
  return PartnerStrings.en;
};

export default PartnerStrings;
