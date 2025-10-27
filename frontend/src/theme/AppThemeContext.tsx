// src/theme/AppThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { MD3Theme, useTheme } from 'react-native-paper';
import { metrics } from './metrics';

type AppThemeContextType = {
  colors: MD3Theme['colors'];
  roundness: number;
  fonts: MD3Theme['fonts'];
  metrics: typeof metrics;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const paperTheme = useTheme();

  return (
    <AppThemeContext.Provider
      value={{
        colors: paperTheme.colors,
        roundness: paperTheme.roundness,
        fonts: paperTheme.fonts,
        metrics,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return context;
};
