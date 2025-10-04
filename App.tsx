import React from 'react';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/AppNavigator';
import { DependenciesProvider } from './src/di/ServicesProvider';
import { useEffect } from 'react';
import { clearExpiredCache } from './src/data/cache/cache';



export default function App() {
  // Clear expired cache entries on app start
  useEffect(() => {
    clearExpiredCache().catch(console.error);
  }, []);

  return (
    <DependenciesProvider>
      <SafeAreaProvider>
        <AppNavigator />
        <Toast/>
      </SafeAreaProvider>
    </DependenciesProvider>
  );
}
