import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/AppNavigator';
import { ServicesProvider } from './src/di/ServicesProvider';

export default function App() {
  return (
    <ServicesProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ServicesProvider>
  );
}
