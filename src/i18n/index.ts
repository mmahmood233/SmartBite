/**
 * i18n Configuration
 * Full internationalization setup for Wajba with persistence
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en';
import ar from './locales/ar';
import { I18nManager } from 'react-native';

const LANGUAGE_KEY = '@wajba_language';

// Language detector plugin
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Try to get saved language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      
      // Fall back to device language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
      callback(deviceLanguage === 'ar' ? 'ar' : 'en');
    } catch (error) {
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

// Initialize i18next
i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

/**
 * Change language and update RTL
 */
export const changeLanguage = async (lang: 'en' | 'ar') => {
  await i18n.changeLanguage(lang);
  
  // Update RTL setting
  const isRTL = lang === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // Note: App needs to restart for RTL to take full effect
  }
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * Check if current language is RTL
 */
export const isRTL = (): boolean => {
  return i18n.language === 'ar';
};

// Export translations for direct access if needed
export { en, ar };

export default i18n;
