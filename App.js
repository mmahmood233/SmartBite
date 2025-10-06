import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';
import { lightTheme } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AuthNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
