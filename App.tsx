import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { WajbaLightTheme } from './src/theme/theme';

/**
 * Wajba App Root Component
 * Brand: Middle Eastern warmth meets intelligent personalization
 * Flow: Splash → Onboarding → Auth → Main App
 */

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={WajbaLightTheme}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
