/**
 * useTranslation Hook
 * Custom hook for accessing translations
 * 
 * Usage:
 * const { t, changeLanguage, currentLanguage, isRTL } = useTranslation();
 * 
 * Example:
 * <Text>{t('common.save')}</Text>
 * <Text>{t('profile.title')}</Text>
 */
// @ts-nocheck

import { useState, useCallback } from 'react';
import { t as translate, changeLanguage as changeLang, getCurrentLanguage, isRTL as checkRTL } from '../i18n';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(getCurrentLanguage());
  const [rtl, setRtl] = useState(checkRTL());

  /**
   * Get translation for a key
   */
  const t = useCallback((key: string, params?: Record<string, string>): string => {
    let translation = translate(key);
    
    // Replace parameters if provided
    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  }, []);

  /**
   * Change app language
   */
  const changeLanguage = useCallback((lang: 'en' | 'ar') => {
    changeLang(lang);
    setCurrentLanguage(lang);
    setRtl(lang === 'ar');
    
    // TODO: When implementing i18next, also update:
    // - AsyncStorage to persist language preference
    // - I18nManager.forceRTL() for RTL support
    // - Restart app if needed for RTL changes
  }, []);

  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL: rtl,
  };
};

export default useTranslation;
