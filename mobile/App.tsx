import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './ThemeContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </PaperProvider>
  );
}
