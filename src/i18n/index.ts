/**
 * i18n Configuration
 * Centralized internationalization setup for SmartBite
 * 
 * To activate localization later:
 * 1. Install: npm install i18next react-i18next
 * 2. Uncomment the i18next configuration below
 * 3. Replace translations object with proper i18n.t() calls
 */

import en from './locales/en';
import ar from './locales/ar';

// Current language state (will be replaced with i18next later)
let currentLanguage: 'en' | 'ar' = 'en';

// Translation object (temporary - will use i18next later)
const translations = {
  en,
  ar,
};

/**
 * Get translation for a key
 * @param key - Translation key (e.g., 'common.save')
 * @returns Translated string
 */
export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

/**
 * Change current language
 * @param lang - Language code ('en' or 'ar')
 */
export const changeLanguage = (lang: 'en' | 'ar') => {
  currentLanguage = lang;
};

/**
 * Get current language
 * @returns Current language code
 */
export const getCurrentLanguage = (): 'en' | 'ar' => {
  return currentLanguage;
};

/**
 * Check if current language is RTL
 * @returns true if RTL, false otherwise
 */
export const isRTL = (): boolean => {
  return currentLanguage === 'ar';
};

// Export translations for direct access if needed
export { en, ar };

/* 
 * FUTURE: i18next Configuration
 * Uncomment when ready to implement full i18n
 * 
 * import i18n from 'i18next';
 * import { initReactI18next } from 'react-i18next';
 * 
 * i18n
 *   .use(initReactI18next)
 *   .init({
 *     resources: {
 *       en: { translation: en },
 *       ar: { translation: ar },
 *     },
 *     lng: 'en',
 *     fallbackLng: 'en',
 *     interpolation: {
 *       escapeValue: false,
 *     },
 *   });
 * 
 * export default i18n;
 */
