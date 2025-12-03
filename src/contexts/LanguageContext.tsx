/**
 * Language Context
 * Provides language state and switching functionality throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage as changeI18nLanguage, getCurrentLanguage, isRTL as checkIsRTL } from '../i18n';
import { Alert } from 'react-native';

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: 'en' | 'ar') => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(getCurrentLanguage());
  const [isRTL, setIsRTL] = useState(checkIsRTL());

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
      setIsRTL(lng === 'ar');
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleChangeLanguage = async (lang: 'en' | 'ar') => {
    try {
      await changeI18nLanguage(lang);
      
      // Show alert that app needs restart for full RTL effect
      if (lang === 'ar' && !isRTL) {
        Alert.alert(
          t('settings.languageChanged'),
          t('settings.restartForRTL'),
          [{ text: t('common.confirm') }]
        );
      } else if (lang === 'en' && isRTL) {
        Alert.alert(
          'Language Changed',
          'Please restart the app for full effect',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        changeLanguage: handleChangeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
