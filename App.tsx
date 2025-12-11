import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { WajbaLightTheme } from './src/theme/theme';
import { CartProvider } from './src/contexts/CartContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { startOrderTimeoutMonitoring, stopOrderTimeoutMonitoring } from './src/services/order-timeout.service';
import './src/i18n'; // Initialize i18n

/**
 * Wajba App Root Component
 * Brand: Middle Eastern warmth meets intelligent personalization
 * Flow: Splash → Onboarding → Auth → Main App
 * Features: Bilingual (English/Arabic) with RTL support
 */

const App: React.FC = () => {
  // Start order timeout monitoring when app loads
  useEffect(() => {
    const intervalId = startOrderTimeoutMonitoring();
    
    return () => {
      stopOrderTimeoutMonitoring(intervalId);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <PaperProvider theme={WajbaLightTheme}>
          <CartProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </PaperProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default App;
